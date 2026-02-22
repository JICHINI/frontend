import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Terms from './components/Terms';
import UserInfo from './components/UserInfo';
import Main from './components/Main';

import './App.css';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/userinfo" element={<UserInfo />} />
                    <Route path="/main" element={<Main />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;