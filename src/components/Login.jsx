import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Logo from '../image/Logo.png';

function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/member/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password }),
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem('token', token);  // 토큰 저장
        navigate('/home');  // 로그인 후 이동할 페이지
      } else {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (e) {
      setError('서버 연결에 실패했습니다.',e);
    }
  };

  return (
      <div className="login-container">
        <div className="login-form-card">
          <h1 className="login-title">로그인</h1>
          <p className="login-subtitle">서비스를 시작하려면 로그인 하세요</p>

          <div className="login-input-group">
            <label className="login-label">아이디</label>
            <div className="login-input-wrapper">
              <input type="text" className="login-input-field"
                     value={userId} onChange={(e) => setUserId(e.target.value)} />
            </div>
          </div>

          <div className="login-input-group">
            <label className="login-label">비밀번호</label>
            <div className="login-input-wrapper">
              <input type="password" className="login-input-field"
                     value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          {error && <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>}

          <button className="login-submit-button" onClick={handleLogin}>
            로그인
          </button>

          <p className="login-link-text" onClick={() => navigate('/signup')}>
            계정이 없으신가요?
          </p>
        </div>

        <div className="login-logo-container">
          <div className="login-logo">
            <img src={Logo} className="login-logo-img" />
          </div>
        </div>
      </div>
  );
}

export default Login;