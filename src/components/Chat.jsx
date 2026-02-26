import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Chat.css';
import Logo from '../image/Logo.png';

// AI 응답에서 매칭 카드 파싱하는 함수 추가
function parseMatchCards(text) {
    if (!text) return null;

    // 한국어 형식: "- 사용자 ID: ..."
    const koBlocks = text.split(/\n(?=- 사용자 ID:)/g).filter(b => b.trim().startsWith("- 사용자 ID:"));
    if (koBlocks.length > 0) {
        return koBlocks.map((block) => {
            const get = (key) => {
                const m = block.match(new RegExp(`- ${key}:\\s*(.+)`));
                return m ? m[1].trim() : "";
            };
            const concernMatch = block.match(/- 고민 내용:\s*([\s\S]*?)(?=\n\n|- 사용자 ID:|$)/);
            let concern = concernMatch ? concernMatch[1].trim() : "";
            concern = concern.replace(/^[#\-\s]*고민 내용:\s*/g, "").trim();
            return {
                userId: get("사용자 ID"),
                province: get("시/도"),
                city: get("시/군"),
                concern
            };
        }).filter(c => c.userId);
    }

    // 영어 형식(기존): "- user_id: ..."
    const enBlocks = text.split(/\n(?=- user_id:)/g).filter(b => b.trim().startsWith("- user_id:"));
    if (enBlocks.length === 0) return null;
    return enBlocks.map((block) => {
        const get = (key) => {
            const m = block.match(new RegExp(`- ${key}:\\s*(.+)`));
            return m ? m[1].trim() : "";
        };
        const concernMatch = block.match(/- 고민 내용:\s*([\s\S]*?)(?=\n\n|$)/);
        let concern = concernMatch ? concernMatch[1].trim() : "";
        concern = concern.replace(/^[#\-\s]*고민 내용:\s*/g, "").trim();
        return {
            userId: get("user_id"),
            province: get("province"),
            city: get("city"),
            concern
        };
    }).filter(c => c.userId);
}

// 아바타 색상
const COLORS = ["#FFB347", "#FF7F7F", "#B39DDB", "#50B6FF", "#7FCC7F"];
const avatarColor = (id) => id ? COLORS[id.charCodeAt(0) % COLORS.length] : COLORS[0];

// 내 userId JWT에서 파싱
const getMyId = () => {
    try {
        const token = localStorage.getItem('token');
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || payload.userId || payload.id || '';
    } catch { return ''; }
};

function Chat() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentUserIndex, setCurrentUserIndex] = useState(0);
    const [matchedUsers, setMatchedUsers] = useState([]);
    const [requesting, setRequesting] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [metUserIds, setMetUserIds] = useState([]);

    const token = localStorage.getItem('token');
    const myId = getMyId();

    useEffect(() => {
        fetch('http://localhost:8080/rooms', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                const ids = data.map(room =>
                    room.userA === myId ? room.userB : room.userA
                );
                setMetUserIds(ids);
            });
    }, []);

    // 카드에서 내 ID 필터링 및 이미 매칭되서 채팅방있는 사람들 필터
    const filterCards = (cards) => {
        if (!cards) return null;
        const filtered = cards.filter(c =>
            c.userId !== myId && !metUserIds.includes(c.userId)  // ← includes 이미 있는 사람들
        );
        return filtered.length > 0 ? filtered : null;
    };

    // AI에게 메시지 보내기
    const sendToAI = async (message) => {
        try {
            setMessages(prev => [...prev, { sender: 'bot', text: '...', hasMatching: false, timestamp: new Date() }]);

            const response = await fetch('http://localhost:8080/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            const answer = data.answer;
            const cards = filterCards(parseMatchCards(answer));

            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    sender: 'bot',
                    text: answer,
                    hasMatching: cards && cards.length > 0,
                    cards: cards,
                    timestamp: new Date()
                };
                return updated;
            });
        } catch (error) {
            console.error('AI 연결 오류:', error);
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    sender: 'bot',
                    text: '죄송합니다. 일시적인 오류가 발생했습니다.',
                    hasMatching: false,
                    timestamp: new Date()
                };
                return updated;
            });
        }
    };

    // 초기 로드: 히스토리 불러오기
    useEffect(() => {
        const init = async () => {
            const firstMessage = location.state?.firstMessage;

            try {
                const res = await fetch('http://localhost:8080/chat/history', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const history = await res.json();

                if (history.length > 0) {
                    setMessages(history.map(h => {
                        const cards = h.sender === 'bot' ? filterCards(parseMatchCards(h.content)) : null;
                        return {
                            sender: h.sender,
                            text: h.content,
                            hasMatching: cards && cards.length > 0,
                            cards: cards,
                            timestamp: new Date(h.createdAt)
                        };
                    }));
                } else if (firstMessage) {
                    setMessages([{ sender: 'user', text: firstMessage, hasMatching: false, timestamp: new Date() }]);
                    await sendToAI(firstMessage);
                }
            } catch (err) {
                console.error('히스토리 로드 오류:', err);
            }
        };
        init();
    }, []);

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
            hasMatching: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        const msg = inputMessage;
        setInputMessage('');
        await sendToAI(msg);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // 모달 열기
    const handleOpenModal = (cards) => {
        setMatchedUsers(cards);
        setCurrentUserIndex(0);
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

    // 대화 신청 → 채팅방 생성
    const handleChatRequest = async () => {
        if (!currentUser || requesting) return;
        setRequesting(true);

        try {
            const res = await fetch('http://localhost:8080/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ targetUserId: currentUser.userId })
            });

            const data = await res.json();
            const roomId = data.roomId;

            setShowModal(false);
            navigate('/chatroom', {
                state: {
                    roomId,
                    partnerId: currentUser.userId,
                    province: currentUser.province,
                    city: currentUser.city,
                }
            });
        } catch (err) {
            console.error('채팅방 생성 실패:', err);
            alert('채팅방 생성에 실패했습니다.');
        } finally {
            setRequesting(false);
        }
    };

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
                        <div key={index}>
                            {msg.sender === 'user' ? (
                                <div className="message user-message">
                                    <div className="message-bubble">{msg.text}</div>
                                </div>
                            ) : msg.hasMatching && msg.cards ? (
                                <div className="message bot-message matching-message">
                                    <div className="matching-card">
                                        <div className="matching-profiles">
                                            {msg.cards.slice(0, 3).map((card, i) => (
                                                <div
                                                    key={i}
                                                    className="profile-icon"
                                                    style={{ background: avatarColor(card.userId) }}
                                                >
                                                    {card.userId?.slice(0, 1).toUpperCase()}
                                                </div>
                                            ))}
                                            {msg.cards.length > 3 && (
                                                <span className="profile-more">+{msg.cards.length - 3}</span>
                                            )}
                                        </div>
                                        <p className="matching-text">
                                            비슷한 고민을 가진<br />
                                            사용자 {msg.cards.length}명 발견!
                                        </p>
                                        <button
                                            className="matching-button"
                                            onClick={() => handleOpenModal(msg.cards)}
                                        >
                                            대화 해보기
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="message bot-message">
                                    <div className="message-bubble" style={{ whiteSpace: 'pre-wrap' }}>
                                        {msg.text}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

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
            {showModal && currentUser && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-profile">
                            <div
                                className="modal-profile-img"
                                style={{ background: avatarColor(currentUser.userId) }}
                            >
                                {currentUser.userId?.slice(0, 1).toUpperCase()}
                            </div>
                            <h2 className="modal-name">{currentUser.userId}</h2>
                            <div className="modal-tags">
                                {currentUser.province && (
                                    <span className="modal-tag">#{currentUser.province}</span>
                                )}
                                {currentUser.city && (
                                    <span className="modal-tag">#{currentUser.city}</span>
                                )}
                            </div>
                            <p className="modal-description">{currentUser.concern}</p>
                        </div>

                        <div className="modal-buttons">
                            <button className="modal-button-cancel" onClick={handleCloseModal}>
                                닫기
                            </button>
                            <button
                                className="modal-button-chat"
                                onClick={handleChatRequest}
                                disabled={requesting}
                            >
                                {requesting ? '연결 중...' : '대화 신청'}
                            </button>
                        </div>

                        {/* 화살표 버튼 */}
                        <button
                            className="modal-arrow modal-arrow-left"
                            onClick={handlePrevUser}
                            disabled={matchedUsers.length <= 1}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M15 18L9 12L15 6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <button
                            className="modal-arrow modal-arrow-right"
                            onClick={handleNextUser}
                            disabled={matchedUsers.length <= 1}
                        >
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