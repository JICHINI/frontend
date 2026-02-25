import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import './History.css';
import Logo from '../image/Logo.png';

const COLORS = ["#FFB347", "#FF7F7F", "#B39DDB", "#50B6FF", "#7FCC7F"];
const avatarColor = (id) => id ? COLORS[id.charCodeAt(0) % COLORS.length] : COLORS[0];

function History() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const stompClient = useRef(null);

    const token = localStorage.getItem('token');

    // 내 userId JWT에서 파싱
    const getMyId = () => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.sub || payload.userId || payload.id || '';
        } catch {
            return '';
        }
    };
    const myId = getMyId();

    // 채팅방 목록 로드
    const loadRooms = () => {
        fetch('http://localhost:8080/rooms', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                setRooms(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('채팅방 목록 오류:', err);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadRooms();

        // ✅ WebSocket 연결하여 실시간 알림 수신
        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('WebSocket 연결됨');
                // 내 개인 알림 채널 구독
                client.subscribe(`/sub/user/${myId}`, (frame) => {
                    const notification = JSON.parse(frame.body);
                    if (notification.type === 'NEW_CHAT_REQUEST') {
                        console.log('새 채팅 요청:', notification);
                        // 채팅방 목록 새로고침
                        loadRooms();
                        // 선택사항: 알림 표시
                        alert(`${notification.from}님이 대화를 신청했습니다!`);
                    }
                });
            },
            onStompError: (frame) => console.error('STOMP 오류:', frame)
        });

        client.activate();
        stompClient.current = client;

        return () => {
            client.deactivate();
        };
    }, []);

    const handleChatClick = (room) => {
        // 상대방은 나(myId)가 아닌 쪽
        const partnerId = room.userA === myId ? room.userB : room.userA;
        navigate('/chatroom', {
            state: {
                roomId: room.id,
                partnerId,
            }
        });
    };

    return (
        <div className="history-container">
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

                    <div className="nav-item" onClick={() => navigate('/chat')}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M17 9C17 13.4183 13.4183 17 9 17C7.73835 17 6.55719 16.6916 5.52349 16.1462L2 17L2.85382 13.4765C2.30838 12.4428 2 11.2617 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z"
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>채팅</span>
                    </div>

                    <div className="nav-item active">
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

            {/* 메인 영역 */}
            <main className="history-main">
                {/* 헤더 */}
                <header className="history-header">
                    <div className="header-spacer"></div>
                    <button
                        className="history-profile-button"
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

                {/* 채팅 목록 */}
                <div className="history-list">
                    {loading && <p style={{ padding: '2rem', color: '#999' }}>불러오는 중...</p>}
                    {!loading && rooms.length === 0 && (
                        <p style={{ padding: '2rem', color: '#999' }}>아직 대화 내역이 없어요</p>
                    )}
                    {rooms.map((room) => {
                        const partnerId = room.userA === myId ? room.userB : room.userA;
                        return (
                            <div key={room.id} className="history-item">
                                <div className="history-item-content">
                                    {/* 아바타 */}
                                    <div className="history-profile" style={{
                                        background: avatarColor(partnerId),
                                        width: 44, height: 44, borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#fff', fontWeight: 700, fontSize: 18
                                    }}>
                                        {partnerId?.slice(0, 1).toUpperCase()}
                                    </div>
                                    <div className="history-info">
                                        <h3 className="history-name">{partnerId}</h3>
                                    </div>
                                </div>
                                <button
                                    className="history-chat-button"
                                    onClick={() => handleChatClick(room)}
                                >
                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                        <path d="M26 2L13 15M26 2L18 26L13 15M26 2L2 10L13 15"
                                              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}

export default History;