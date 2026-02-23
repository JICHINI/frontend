import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Chat.css';
import Logo from '../image/Logo.png';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [showMatching, setShowMatching] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentUserIndex, setCurrentUserIndex] = useState(0);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // 매칭된 사용자 더미 데이터
    const matchedUsers = [
        {
            id: 1,
            name: '박진욱',
            profile: '👨‍🦰',
            tags: ['#학생', '#성주 토박이'],
            description: '개발자를 장래희망으로 꿈꿔 좋아하던 AI에게 힘자리를 빼앗 전망이라는 상황이 놓여 희의감을 느끼는 중입니다'
        },
        {
            id: 2,
            name: '김민지',
            profile: '👩',
            tags: ['#직장인', '#취업 고민'],
            description: '이직을 고민하고 있는데 새로운 환경이 두렵습니다'
        },
        {
            id: 3,
            name: '이준호',
            profile: '👨',
            tags: ['#프리랜서', '#경력 고민'],
            description: '프리랜서로 전환할지 고민 중입니다'
        }
    ];

    // 메인에서 전달받은 첫 메시지 처리
    useEffect(() => {
        const firstMessage = location.state?.firstMessage;
        if (firstMessage) {
            setMessages([
                { sender: 'user', text: firstMessage, timestamp: new Date() }
            ]);

            // 챗봇 응답 시뮬레이션
            setTimeout(() => {
                const botReply = {
                    sender: 'bot',
                    text: '힘드셨군요. 더 자세히 말씀해주시겠어요?',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botReply]);
            }, 1000);
        }
    }, [location]);

    // 스크롤 자동 이동
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 메시지 전송
    const handleSend = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            sender: 'user',
            text: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');

        // 챗봇 API 호출 (나중에 연결)
        try {
            // const response = await fetch('http://localhost:5000/chat', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ message: inputMessage })
            // });
            // const data = await response.json();

            // 더미 응답 (실제로는 위 API 응답 사용)
            setTimeout(() => {
                const botReply = {
                    sender: 'bot',
                    text: getDummyBotReply(messages.length),
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botReply]);

                // 5번째 메시지 이후 매칭 카드 표시
                if (messages.length >= 5) {
                    setTimeout(() => {
                        setShowMatching(true);
                    }, 1000);
                }
            }, 1000);
        } catch (error) {
            console.error('챗봇 연결 오류:', error);
        }
    };

    // 더미 봇 응답 (나중에 삭제)
    const getDummyBotReply = (messageCount) => {
        const replies = [
            '그렇군요. 더 말씀해주세요.',
            '힘드셨겠어요. 언제부터 그런 감정을 느끼셨나요?',
            '충분히 이해됩니다. 지금 가장 힘든 점은 무엇인가요?',
            '이야기를 들어주셔서 감사합니다.',
            '비슷한 고민을 가진 분들을 찾아드릴게요.'
        ];
        return replies[messageCount % replies.length];
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // 모달 열기
    const handleOpenModal = () => {
        setShowModal(true);
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // 다음 사용자
    const handleNextUser = () => {
        setCurrentUserIndex((prev) => (prev + 1) % matchedUsers.length);
    };

    // 이전 사용자
    const handlePrevUser = () => {
        setCurrentUserIndex((prev) =>
            prev === 0 ? matchedUsers.length - 1 : prev - 1
        );
    };

    const currentUser = matchedUsers[currentUserIndex];

    return (
        <div className="chat-container">
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
                </nav>
            </aside>

            {/* 메인 채팅 영역 */}
            <main className="chat-main">
                {/* 헤더 */}
                <header className="chat-header">
                    <div className="header-spacer"></div>
                    <button
                        className="chat-profile-button"
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
                <div className="messages-container">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
                        >
                            <div className="message-bubble">
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    {/* 매칭 카드 */}
                    {showMatching && (
                        <div className="matching-card">
                            <div className="matching-profiles">
                                {matchedUsers.slice(0, 3).map((user, idx) => (
                                    <div key={user.id} className="profile-icon">
                                        {user.profile}
                                    </div>
                                ))}
                                <span className="profile-more">+</span>
                            </div>
                            <p className="matching-text">
                                비슷한 고민을 가진<br />
                                사용자 {matchedUsers.length}명 발견!
                            </p>
                            <button className="matching-button" onClick={handleOpenModal}>
                                조언 구하기
                            </button>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* 입력창 */}
                <div className="chat-input-section">
                    <div className="chat-input-wrapper">
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="메시지를 입력하세요"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button
                            className="chat-send-button"
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

            {/* 모달 */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-profile">
                            <div className="modal-profile-img">{currentUser.profile}</div>
                            <h2 className="modal-name">{currentUser.name}</h2>
                            <div className="modal-tags">
                                {currentUser.tags.map((tag, idx) => (
                                    <span key={idx} className="modal-tag">{tag}</span>
                                ))}
                            </div>
                            <p className="modal-description">{currentUser.description}</p>
                        </div>

                        <div className="modal-buttons">
                            <button className="modal-button-cancel" onClick={handleCloseModal}>
                                닫기
                            </button>
                            <button className="modal-button-chat">
                                대화 신청
                            </button>
                        </div>

                        {/* 화살표 버튼 */}
                        <button className="modal-arrow modal-arrow-left" onClick={handlePrevUser}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M15 18L9 12L15 6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <button className="modal-arrow modal-arrow-right" onClick={handleNextUser}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9 18L15 12L9 6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Chat;