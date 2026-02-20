import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import Logo from './image/Logo.png';

function Signup() {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !userId || !password || !confirmPassword) {
      setError('모든 항목을 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    sessionStorage.setItem('signupData', JSON.stringify({ name, userId, password }));
    navigate('/terms');
  };

  return (
      <div className="signup-container">
        <div className="signup-form-card">
          <h1 className="signup-title">회원가입</h1>

          <div className="signup-input-group">
            <label className="signup-label">이름</label>
            <div className="signup-input-wrapper">
              <input type="text" className="signup-input-field"
                     value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>

          <div className="signup-input-group">
            <label className="signup-label">아이디</label>
            <div className="signup-input-wrapper">
              <input type="text" className="signup-input-field"
                     value={userId} onChange={(e) => setUserId(e.target.value)} />
            </div>
          </div>

          <div className="signup-input-group">
            <label className="signup-label">비밀번호</label>
            <div className="signup-input-wrapper">
              <input type="password" className="signup-input-field"
                     value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          <div className="signup-input-group">
            <label className="signup-label">비밀번호 확인</label>
            <div className="signup-input-wrapper">
              <input type="password" className="signup-input-field"
                     value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          </div>

          {error && <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>}

          <button className="signup-submit-button" onClick={handleSignup}>
            다음
          </button>
        </div>

        <div className="signup-logo-container">
          <div className="signup-logo">
            <img src={Logo} className="signup-logo-img" />
          </div>
        </div>
      </div>
  );
}

export default Signup;