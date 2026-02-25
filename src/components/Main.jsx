import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Main.css';
import Logo from '../image/Logo.png';

function Main() {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const [userName, setUserName] = useState('');

    const handleSendMessage = () => {
        if (message.trim()) {
            // 메시지가 있으면 채팅 페이지로 이동하면서 메시지 전달
            navigate('/chat', { state: { firstMessage: message } });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:8080/member/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => setUserName(data.name))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="main-container">
            {/* 왼쪽 사이드바 */}
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
                    <div className="nav-item active" onClick={() => navigate('/main')}>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M3 10L10 3L17 10V17C17 17.5304 16.7893 18.0391 16.4142 18.4142C16.0391 18.7893 15.5304 19 15 19H5C4.46957 19 3.96086 18.7893 3.58579 18.4142C3.21071 18.0391 3 17.5304 3 17V10Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span>홈</span>
                    </div>

                    <div className="nav-item" onClick={() => navigate('/chat')}>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M17 9C17 13.4183 13.4183 17 9 17C7.73835 17 6.55719 16.6916 5.52349 16.1462L2 17L2.85382 13.4765C2.30838 12.4428 2 11.2617 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
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

            {/* 메인 콘텐츠 영역 */}
            <main className="main-content">
                {/* 헤더 */}
                <header className="main-header">
                    <div className="header-spacer"></div>
                    <button
                        className="profile-button"
                        onClick={() => navigate('/mypage')}
                        aria-label="프로필"
                    >
                        <svg
                            width="50"
                            height="50"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="16" cy="16" r="15" stroke="#333" strokeWidth="2"/>
                            <circle cx="16" cy="12" r="4" fill="#333"/>
                            <path
                                d="M8 26C8 22 11 19 16 19C21 19 24 22 24 26"
                                stroke="#333"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </header>

                {/* 중앙 인사말 */}
                <div className="welcome-section">
                    <h1 className="welcome-title">{userName}님 안녕하세요</h1>
                    <p className="welcome-subtitle">오늘 하루는 어떠셨나요?</p>
                </div>

                {/* 하단 입력창 */}
                <div className="input-section">
                    <div className="input-wrapper">
                        <input
                            type="text"
                            className="message-input"
                            placeholder="어떤 고민이든 털어놓으세요"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button
                            className="send-button"
                            onClick={handleSendMessage}
                            disabled={!message.trim()}
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M22 2L11 13M22 2L15 22L11 13M22 2L2 8L11 13"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Main;