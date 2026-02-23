import React from 'react';
import { useNavigate } from 'react-router-dom';
import './History.css';
import Logo from '../image/Logo.png';

function History() {
    const navigate = useNavigate();

    // 채팅 내역 더미 데이터 (나중에 백엔드에서 가져올 데이터)
    const chatHistory = [
        {
            id: 1,
            name: '박진욱',
            profile: '👨‍🦰',
            tags: ['#학생', '#성주 토박이'],
            lastMessage: '감사합니다',
            timestamp: new Date('2024-02-23T14:30:00')
        },
        {
            id: 2,
            name: '김성현',
            profile: '👨',
            tags: ['#학생', '#성주 토박이'],
            lastMessage: '네 알겠습니다',
            timestamp: new Date('2024-02-23T12:15:00')
        },
        {
            id: 3,
            name: '허재원',
            profile: '👨',
            tags: ['#학생', '#성주 토박이'],
            lastMessage: '좋은 하루 되세요',
            timestamp: new Date('2024-02-22T18:20:00')
        },
        {
            id: 4,
            name: '박건욱',
            profile: '👨',
            tags: ['#학생', '#성주 토박이'],
            lastMessage: '도움이 되었어요',
            timestamp: new Date('2024-02-22T10:05:00')
        }
    ];

    // 채팅방으로 이동
    const handleChatClick = (user) => {
        navigate('/chatroom', {
            state: {
                id: user.id,
                name: user.name,
                profile: user.profile,
                tags: user.tags
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
                    {chatHistory.map((user) => (
                        <div key={user.id} className="history-item">
                            <div className="history-item-content">
                                <div className="history-profile">{user.profile}</div>
                                <div className="history-info">
                                    <h3 className="history-name">{user.name}</h3>
                                    <div className="history-tags">
                                        {user.tags.map((tag, idx) => (
                                            <span key={idx} className="history-tag">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button
                                className="history-chat-button"
                                onClick={() => handleChatClick(user)}
                            >
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                    <path d="M26 2L13 15M26 2L18 26L13 15M26 2L2 10L13 15"
                                          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default History;