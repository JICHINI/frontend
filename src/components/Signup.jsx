import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import Logo from '../image/Logo.png';

function Signup() {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    // 1. 정규표현식: 영문 대소문자와 숫자만 허용하는 규칙
    const regex = /^[a-zA-Z0-9]*$/;
    // 비번 영문, 숫자
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).+$/;

    // 모든 항목 입력 여부 확인
    if (!name || !userId || !password || !confirmPassword) {
      setError('모든 항목을 입력해주세요.');
      return;
    }

    // 2. 아이디 형식 검사 (정규식)
    if (!regex.test(userId)) {
      setError("아이디는 영문과 숫자만 입력 가능합니다.");
      return;
    }

    // 3. 아이디 길이 검사
    if (userId.length < 3 || userId.length > 15) {
      setError("아이디는 영문 포함 3자에서 15자 사이여야 합니다.");
      return;
    }
    //   3. 비번 길이 제한
    if(password.length < 8) {
      setError("비밀번호는 영문과 숫자를 포함한 8글자이상이어야 합니다.")
      return;
    }
    if (!pwRegex.test(password)) {
      setError("비밀번호는 영문과 숫자를 모두 포함해야 합니다");
      return;
    }

    // 4. 비밀번호 일치 확인
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 모든 검증 통과 시 저장 및 이동
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
              <input type="text" className="signup-input-field" minLength={3}
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