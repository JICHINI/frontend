import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import './ChatRoom.css';
import Logo from '../image/Logo.png';

function ChatRoom() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [connected, setConnected] = useState(false);
    const messagesEndRef = useRef(null);
    const stompClient = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const { roomId, partnerId, province, city } = location.state || {};
    const token = localStorage.getItem('token');

    // 내 userId는 JWT에서 파싱 (payload의 sub 필드)
    const getMyId = () => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.sub || payload.userId || payload.id || '';
        } catch {
            return '';
        }
    };
    const myId = getMyId();

    useEffect(() => {
        if (!roomId) return;

        // 1) 기존 메시지 기록 불러오기
        fetch(`http://localhost:8080/rooms/${roomId}/messages`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                setMessages(data.map(m => ({
                    sender: m.senderId === myId ? 'me' : 'partner',
                    text: m.content,
                    timestamp: new Date(m.createdAt)
                })));
            })
            .catch(err => console.error('메시지 기록 오류:', err));

        // 2) STOMP 연결
        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            reconnectDelay: 5000,
            onConnect: () => {
                setConnected(true);
                // 채팅방 구독
                client.subscribe(`/sub/chat/${roomId}`, (frame) => {
                    const msg = JSON.parse(frame.body);
                    setMessages(prev => [...prev, {
                        sender: msg.senderId === myId ? 'me' : 'partner',
                        text: msg.content,
                        timestamp: new Date(msg.createdAt)
                    }]);
                });
            },
            onDisconnect: () => setConnected(false),
            onStompError: (frame) => console.error('STOMP 오류:', frame)
        });

        client.activate();
        stompClient.current = client;

        return () => {
            client.deactivate();
        };
    }, [roomId]);

    // 스크롤 자동 이동
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 메시지 전송
    const handleSend = () => {
        if (!inputMessage.trim() || !connected) return;

        stompClient.current.publish({
            destination: `/pub/chat/${roomId}`,
            body: JSON.stringify({
                senderId: myId,
                content: inputMessage.trim()
            })
        });

        setInputMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const tags = [
        province && `#${province}`,
        city && `#${city}`
    ].filter(Boolean);

    return (
        <div className="chatroom-container">
            {/* 사이드바 */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <img
                        src={Logo}
                        alt="JICHINI"
                        className="sidebar-logo"
                        onClick={() => navigate('/main')}
                    />
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-item" onClick={() => navigate('/main')}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M3 10L10 3L17 10V17C17 17.5304 16.7893 18.0391 16.4142 18.4142C16.0391 18.7893 15.5304 19 15 19H5C4.46957 19 3.96086 18.7893 3.58579 18.4142C3.21071 18.0391 3 17.5304 3 17V10Z"
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>홈</span>
                    </div>

                    <div className="nav-item active">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M17 9C17 13.4183 13.4183 17 9 17C7.73835 17 6.55719 16.6916 5.52349 16.1462L2 17L2.85382 13.4765C2.30838 12.4428 2 11.2617 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z"
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>채팅</span>
                    </div>

                    <div className="nav-item" onClick={() => navigate('/history')}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M4 4H16C17.1 4 18 4.9 18 6V14C18 15.1 17.1 16 16 16H4C2.9 16 2 15.1 2 14V6C2 4.9 2.9 4 4 4Z"
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M18 6L10 11L2 6"
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>조언 내역</span>
                    </div>
                </nav>
            </aside>

            {/* 메인 채팅 영역 */}
            <main className="chatroom-main">
                {/* 상단 상대방 정보 */}
                <header className="chatroom-header">
                    <div className="partner-info">
                        <div className="partner-details">
                            <h2 className="partner-name">{partnerId || '상대방'}</h2>
                            <div className="partner-tags">
                                {tags.map((tag, idx) => (
                                    <span key={idx} className="partner-tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                        {/* 연결 상태 표시 */}
                        <div className="connection-status" style={{
                            width: 8, height: 8, borderRadius: '50%',
                            background: connected ? '#4CAF50' : '#ccc',
                            marginLeft: 8, alignSelf: 'center'
                        }} title={connected ? '연결됨' : '연결 중...'} />
                    </div>

                    <button
                        className="chatroom-profile-button"
                        onClick={() => navigate('/mypage')}
                    >
                        <svg width="50" height="50" viewBox="0 0 32 32" fill="none">
                            <circle cx="16" cy="16" r="15" stroke="#333" strokeWidth="2"/>
                            <circle cx="16" cy="12" r="4" fill="#333"/>
                            <path d="M8 26C8 22 11 19 16 19C21 19 24 22 24 26"
                                  stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </header>

                {/* 메시지 영역 */}
                <div className="chatroom-messages">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`chatroom-message ${msg.sender === 'me' ? 'my-message' : 'partner-message'}`}
                        >
                            <div className="chatroom-message-bubble">
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* 입력창 */}
                <div className="chatroom-input-section">
                    <div className="chatroom-input-wrapper">
                        <input
                            type="text"
                            className="chatroom-input"
                            placeholder={connected ? "메시지를 입력하세요" : "연결 중..."}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={!connected}
                        />
                        <button
                            className="chatroom-send-button"
                            onClick={handleSend}
                            disabled={!inputMessage.trim() || !connected}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 8L11 13"
                                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ChatRoom;