import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Terms from './components/Terms';
import UserInfo from './components/UserInfo';
import Main from './components/Main';
import Chat from './components/Chat';
import Chatroom from './components/Chatroom.jsx';
import History from './components/History';




import './App.css';
import MyPage from "./components/MyPage.jsx";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/userinfo" element={<UserInfo />} />
                    <Route path="/main" element={<Main />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/chatroom" element={<Chatroom />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/mypage" element={<MyPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;