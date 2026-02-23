import { useNavigate, useLocation } from 'react-router-dom';
import './Chat.css';
import Logo from '../image/Logo.png';
import { useEffect, useRef, useState } from "react";

function Chat() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const sendToAI = async (message) => {
        try {
            const token = localStorage.getItem('token');
            setMessages(prev => [...prev, { sender: 'bot', text: '...', timestamp: new Date() }]);

            const response = await fetch('http://localhost:8080/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();

            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    sender: 'bot',
                    text: data.answer,
                    timestamp: new Date()
                };
                return updated;
            });
        } catch (error) {
            console.error('오류:', error);
        }
    };

    // useEffect 하나만!
    useEffect(() => {
        const init = async () => {
            const firstMessage = location.state?.firstMessage;
            const token = localStorage.getItem('token');

            const res = await fetch('http://localhost:8080/chat/history', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const history = await res.json();

            if (history.length > 0) {
                setMessages(history.map(h => ({
                    sender: h.sender,
                    text: h.content,
                    timestamp: new Date(h.createdAt)
                })));
            } else if (firstMessage) {
                setMessages([{ sender: 'user', text: firstMessage, timestamp: new Date() }]);
                await sendToAI(firstMessage);
            }
        };
        init();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!inputMessage.trim()) return;
        setMessages(prev => [...prev, { sender: 'user', text: inputMessage, timestamp: new Date() }]);
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

    return (
        <div className="chat-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <img src={Logo} alt="JICHINI" className="sidebar-logo" onClick={() => navigate('/main')} />
                </div>
                <nav className="sidebar-nav">
                    <div className="nav-item" onClick={() => navigate('/main')}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M3 10L10 3L17 10V17C17 17.5304 16.7893 18.0391 16.4142 18.4142C16.0391 18.7893 15.5304 19 15 19H5C4.46957 19 3.96086 18.7893 3.58579 18.4142C3.21071 18.0391 3 17.5304 3 17V10Z"
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>홈</span>
                    </div>
                    <div className="nav-item active">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M17 9C17 13.4183 13.4183 17 9 17C7.73835 17 6.55719 16.6916 5.52349 16.1462L2 17L2.85382 13.4765C2.30838 12.4428 2 11.2617 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z"
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>채팅</span>
                    </div>
                </nav>
            </aside>

            <main className="chat-main">
                <header className="chat-header">
                    <div className="header-spacer"></div>
                    <button className="chat-profile-button" onClick={() => navigate('/mypage')}>
                        <svg width="50" height="50" viewBox="0 0 32 32" fill="none">
                            <circle cx="16" cy="16" r="15" stroke="#333" strokeWidth="2" />
                            <circle cx="16" cy="12" r="4" fill="#333" />
                            <path d="M8 26C8 22 11 19 16 19C21 19 24 22 24 26" stroke="#333" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </header>

                <div className="messages-container">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                            <div className="message-bubble" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

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
                        <button className="chat-send-button" onClick={handleSend} disabled={!inputMessage.trim()}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 8L11 13"
                                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Chat;