import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Terms.css';
import Logo from './image/Logo.png';

function Terms() {
  const [agreeAll, setAgreeAll] = useState(false);
  const navigate = useNavigate();

  const handleAgreeAll = () => {
    setAgreeAll(!agreeAll);
  };

  const handleComplete = () => {
    console.log('약관 동의 완료');
    navigate('/');
  };

  return (
      <div className="terms-container">
        <div className="terms-header">
          <img src={Logo} className="terms-logo-img" />
        </div>

        <div className="terms-content">
          <h1 className="terms-title">전체 동의</h1>
          <div className="checkbox-wrapper">
            <input
                type="checkbox"
                id="agree-all"
                checked={agreeAll}
                onChange={handleAgreeAll}
                className="checkbox"
            />
            <label htmlFor="agree-all" className="checkbox-label">
              이용약관 및 개인정보수집 및 이용에 모두 동의합니다.
            </label>
          </div>

          <div className="terms-boxes">
            <div className="terms-box">
              <div className="terms-box-header">이용약관 동의 (필수)</div>
              <div className="terms-box-content">
                <p>이용약관</p>
                <b>제1조(서비스 목적)</b>
                <p>지치니는 사회초년생이 일상 속 고민을 AI에게 털어놓고, 비슷한 고민을 가진 사용자와 공감 기반으로 소통할 수 있도록 돕는 프로젝트입니다.</p>
                <b>제2조 (서비스 이용)</b>
                <p>회원은 본 서비스를 자유롭게 이용할 수 있으며, 서비스 내 AI 응답은 참고용 정보 제공을 목적으로 합니다.</p>
                <b>제3조(책임의 한계)</b>
                <p>본 서비스의 AI는 전문 상담, 의료 또는 심리 치료를 대체하지 않습니다. AI가 제공하는 조언이나 추천에 대한 최종 판단과 책임은 사용자에게 있습니다.</p>
              </div>
            </div>

            <div className="terms-box">
              <div className="terms-box-header">개인정보수집 동의 (필수)</div>
              <div className="terms-box-content">
                <p>개인정보 수집 및 이용 안내</p>
                <p>지치니(JICHINI)는 프로젝트 운영을 위해 최소한의 정보만 수집합니다.</p>
                <b>1. 수집 항목</b>
                <p>- 필수: 이메일(또는 아이디), 비밀번호, 닉네임<br />- 선택: 연령대, 직군, 거주 지역(시·구 단위)<br />- 서비스 이용 정보: 사용자가 동의한 경우에 한해 고민 요약 데이터</p>
                <b>2. 수집 목적</b>
                <p>- 회원 식별 및 기본 서비스 제공<br />- AI 기반 고민 분석 및 매칭 기능 구현<br />- 프로젝트 시연 및 기능 개선</p>
                <b>3. 개인정보 보관</b>
                <p>- 본 프로젝트는 상업 서비스가 아니며, 데이터는 시연 목적에 한해 사용됩니다.<br />- 회원 탈퇴 또는 프로젝트 종료 시 데이터는 삭제됩니다.</p>
                <p>본인은 위 내용을 이해하였으며, 개인정보 수집·이용에 동의합니다.</p>
              </div>
            </div>
          </div>

          <div className="button-group">
            <button className="cancel-button" onClick={() => navigate('/login')}>
              취소
            </button>
            <button
                className="complete-button"
                onClick={handleComplete}
                disabled={!agreeAll}
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
  );
}

export default Terms;