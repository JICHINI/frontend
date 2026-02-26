import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserInfo.css';
import Logo from '../image/Logo.png';

function UserInfo() {
    const [직업, set직업] = useState('학생');
    const [거주지, set거주지] = useState('');
    const [시군, set시군] = useState('');
    const [연령, set연령] = useState('');
    const [고민, set고민] = useState('학업/진로');
    const [고민내용, set고민내용] = useState('');
    const [감정, set감정] = useState('우울함');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleComplete = async () => {

        const signupData = JSON.parse(sessionStorage.getItem('signupData'));
        console.log('signupData 확인:', signupData);  // F12 콘솔에서 확인

        if (!연령) {
            setError('모든 항목을 입력해주세요.');
            return;
        }

        try {
            const signupData = JSON.parse(sessionStorage.getItem('signupData')); // 1단계에서 저장한 데이터

            const response = await fetch('http://localhost:8080/member/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...signupData,
                    job: 직업,
                    province: 거주지,
                    city: 시군,
                    age: Number(연령),
                    concern: 고민,
                    concernDetail: 고민내용,
                    emotion: 감정,
                }),
            });

            if (response.ok) {
                sessionStorage.removeItem('signupData');
                alert('회원가입이 완료되었습니다!');
                navigate('/login');
            } else {
                setError('회원가입에 실패했습니다.');
            }
        } catch (e) {
            setError('서버 연결에 실패했습니다.');
            console.log(e)
        }
    };

    return (
        <div className="userinfo-container">
            <div className="userinfo-header">
                <img src={Logo} alt="JICHINI" className="userinfo-logo" />
            </div>

            <div className="userinfo-content">
                <h1 className="userinfo-title">내 정보 입력</h1>

                <div className="userinfo-sections">
                    {/* 왼쪽: 기본 정보 입력 */}
                    <div className="userinfo-section">
                        <h2 className="section-title">기본 정보 입력(필수)</h2>

                        {/* 직업 */}
                        <div className="input-group">
                            <label className="input-label">직업</label>
                            <select
                                className="input-select"
                                value={직업}
                                onChange={(e) => set직업(e.target.value)}
                            >
                                <option value="학생">학생</option>
                                <option value="직장인">직장인</option>
                                <option value="프리랜서">프리랜서</option>
                                <option value="무직">무직</option>
                                <option value="기타">기타</option>
                            </select>
                        </div>

                        {/* 거주지 */}
                        <div className="input-group">
                            <div className="input-group">
                                <label className="input-label">거주지</label>
                                <select
                                    className="input-select"
                                    value={거주지}
                                    onChange={(e) => set거주지(e.target.value)}
                                >
                                    <option value="">모든 지역</option>
                                    <option value="서울특별시">서울특별시</option>
                                    <option value="부산광역시">부산광역시</option>
                                    <option value="대구광역시">대구광역시</option>
                                    <option value="인천광역시">인천광역시</option>
                                    <option value="광주광역시">광주광역시</option>
                                    <option value="대전광역시">대전광역시</option>
                                    <option value="울산광역시">울산광역시</option>
                                    <option value="세종특별자치시">세종특별자치시</option>
                                    <option value="경기도">경기도</option>
                                    <option value="강원특별자치도">강원특별자치도</option>
                                    <option value="충청북도">충청북도</option>
                                    <option value="충청남도">충청남도</option>
                                    <option value="전라북도">전라북도</option>
                                    <option value="전라남도">전라남도</option>
                                    <option value="경상북도">경상북도</option>
                                    <option value="경상남도">경상남도</option>
                                    <option value="제주특별자치도">제주특별자치도</option>
                                </select>
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="input-label">시/군</label>
                            <input
                                type="input"
                                className="input-input"
                                placeholder="예시) 구미시"
                                value={시군}
                                onChange={(e) => set시군(e.target.value)}
                            >
                            </input>
                        </div>
                        {/* 연령 */}
                        <div className="input-group">
                            <label className="input-label">연령</label>
                            <input
                                type="number"
                                className="input-field"
                                placeholder="연령이 어떻게 되시나요?"
                                value={연령}
                                onChange={(e) => set연령(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* 오른쪽: 고민/심리 상태 입력 */}
                    <div className="userinfo-section">
                        <h2 className="section-title">고민/심리 상태 입력(선택)</h2>


                        {/* 나의 오늘 감정은? */}
                        <div className="input-group">
                            <label className="input-label">나의 기분은?</label>
                            <select
                                className="input-select"
                                value={감정}
                                onChange={(e) => set감정(e.target.value)}
                            >
                                <option value="우울함">우울함</option>
                                <option value="행복함">행복함</option>
                                <option value="불안함">불안함</option>
                                <option value="화남">화남</option>
                                <option value="피곤함">피곤함</option>
                                <option value="평온함">평온함</option>
                            </select>
                        </div>
                        {/* 고민 */}
                        <div className="input-group">
                            <label className="input-label">고민</label>
                            <select
                                className="input-select"
                                value={고민}
                                onChange={(e) => set고민(e.target.value)}
                            >
                                <option value="학업/진로">학업/진로</option>
                                <option value="대인관계">대인관계</option>
                                <option value="연애/결혼">연애/결혼</option>
                                <option value="경제/취업">경제/취업</option>
                                <option value="건강">건강</option>
                                <option value="기타">기타</option>
                            </select>
                        </div>

                        {/* 고민을 더 자세히 알려주세요 */}
                        <div className="input-group">
                            <label className="input-label">고민을 더 자세히 알려주세요!</label>
                            <textarea
                                className="input-textarea"
                                placeholder="(선택사항)"
                                value={고민내용}
                                onChange={(e) => set고민내용(e.target.value)}
                            />
                        </div>


                    </div>
                </div>

                {/* 에러 메시지 */}
                {error && <p className="error-message">{error}</p>}

                {/* 버튼 */}
                <div className="button-group">
                    <button className="cancel-button" onClick={() => navigate('/terms')}>
                        취소
                    </button>
                    <button className="submit-button" onClick={handleComplete}>
                        회원가입
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserInfo;