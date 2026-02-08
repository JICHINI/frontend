import React, { useState } from 'react';
import './Login.css';
import Logo from './image/Logo.png'

function Login({ onNavigate }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // 로그인 로직
    console.log('로그인:', { id, password });
  };

  return (
      <div className="login-container">
        <div className="login-form-card">
          <h1 className="login-title">로그인</h1>
          <p className="login-subtitle">서비스를 시작하려면 로그인 하세요</p>

          <div className="login-input-group">
            <label className="login-label">아이디</label>
            <div className="login-input-wrapper">

              <input
                  type="text"
                  className="login-input-field"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
              />
            </div>
          </div>

          <div className="login-input-group">
            <label className="login-label">비밀번호</label>
            <div className="login-input-wrapper">
              <input
                  type="password"
                  className="login-input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button className="login-submit-button" onClick={handleLogin}>
            로그인
          </button>

          <p className="login-link-text" onClick={() => onNavigate('signup')}>
            계정이 없으신가요?
          </p>
        </div>

        <div className="login-logo-container">
          <div className="login-logo">
            <img src={Logo} className="login-logo-img"/>
          </div>
        </div>
      </div>
  );
}

export default Login;