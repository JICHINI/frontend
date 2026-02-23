import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ChatRoom.css';
import Logo from '../image/Logo.png';

function ChatRoom() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);
    const ws = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // 상대방 정보 (모달에서 전달받음)
    const partnerInfo = location.state || {
        id: 1,
        name: '박진욱',
        profile: '👨‍🦰',
        tags: ['#학생', '#성주 토박이']
    };

    // 컴포넌트 로딩 시 (웹소켓 연결은 나중에)
    useEffect(() => {
        // TODO: 웹소켓 연결
        // ws.current = new WebSocket('ws://localhost:8080/chat/room');

        // 더미 메시지
        setMessages([
            { sender: 'partner', text: '안녕하세요!', timestamp: new Date() },
            { sender: 'me', text: '반갑습니다', timestamp: new Date() }
        ]);

        // 컴포넌트 사라질 때 웹소켓 끊기
        return () => {
            // ws.current?.close();
        };
    }, []);

    // 스크롤 자동 이동
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 메시지 전송
    const handleSend = () => {
        if (!inputMessage.trim()) return;

        const newMessage = {
            sender: 'me',
            text: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setInputMessage('');

        // TODO: 웹소켓으로 전송
        // ws.current?.send(JSON.stringify({
        //   type: 'message',
        //   text: inputMessage,
        //   roomId: partnerInfo.id
        // }));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

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
                        <div className="partner-profile">{partnerInfo.profile}</div>
                        <div className="partner-details">
                            <h2 className="partner-name">{partnerInfo.name}</h2>
                            <div className="partner-tags">
                                {partnerInfo.tags.map((tag, idx) => (
                                    <span key={idx} className="partner-tag">{tag}</span>
                                ))}
                            </div>
                        </div>
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
                            placeholder="메시지를 입력하세요"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button
                            className="chatroom-send-button"
                            onClick={handleSend}
                            disabled={!inputMessage.trim()}
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