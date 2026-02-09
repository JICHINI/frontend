import React, { useState } from 'react';
import './Signup.css';
import Logo from './image/Logo.png'

function Signup({ onNavigate }) {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {

    if (!id || !password) {
      alert('아이디와 비밀번호를 입력하세요');
      return;
    }
    console.log('회원가입:', { name, id, password, confirmPassword });
    if (password === confirmPassword) {
      onNavigate('terms');
    } else {
      alert('비밀번호가 일치하지 않습니다');
    }
  };

  return (
      <div className="signup-container">
        <div className="signup-form-card">
          <h1 className="signup-title">회원가입</h1>

          <div className="signup-input-group">
            <label className="signup-label">이름</label>
            <div className="signup-input-wrapper">

              <input
                  type="text"
                  className="signup-input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="signup-input-group">
            <label className="signup-label">아이디</label>
            <div className="signup-input-wrapper">

              <input
                  type="text"
                  className="signup-input-field"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
              />
            </div>
          </div>

          <div className="signup-input-group">
            <label className="signup-label">비밀번호</label>
            <div className="signup-input-wrapper">

              <input
                  type="password"
                  className="signup-input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="signup-input-group">
            <label className="signup-label">비밀번호 확인</label>
            <div className="signup-input-wrapper">

              <input
                  type="password"
                  className="signup-input-field"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button className="signup-submit-button" onClick={handleSignup}>
            다음
          </button>
        </div>

        <div className="signup-logo-container">
          <div className="signup-logo">
            <img src={Logo} className="signup-logo-img"/>
          </div>
        </div>
      </div>
  );
}

export default Signup;