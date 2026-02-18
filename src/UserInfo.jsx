import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserInfo.css';
import Logo from './image/Logo.png';

function UserInfo() {
    const [직업, set직업] = useState('학생');
    const [거주지, set거주지] = useState('서울');
    const [연령, set연령] = useState('');
    const [고민, set고민] = useState('가정 및 고민은?');
    const [고민내용, set고민내용] = useState('');
    const [오늘요일, set오늘요일] = useState('우울함');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleComplete = async () => {
        // 빈칸 체크
        if (!연령) {
            setError('모든 항목을 입력해주세요.');
            return;
        }

        try {

            alert('회원가입이 완료되었습니다!');
            navigate('/');
        } catch (e) {
            setError('서버 연결에 실패했습니다.');
            console.log(e);
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
                            <label className="input-label">거주지</label>
                            <select
                                className="input-select"
                                value={거주지}
                                onChange={(e) => set거주지(e.target.value)}
                            >
                                <option value="서울">서울</option>
                                <option value="경기">경기</option>
                                <option value="인천">인천</option>
                                <option value="부산">부산</option>
                                <option value="대구">대구</option>
                                <option value="광주">광주</option>
                                <option value="대전">대전</option>
                                <option value="울산">울산</option>
                                <option value="세종">세종</option>
                                <option value="강원">강원</option>
                                <option value="충북">충북</option>
                                <option value="충남">충남</option>
                                <option value="전북">전북</option>
                                <option value="전남">전남</option>
                                <option value="경북">경북</option>
                                <option value="경남">경남</option>
                                <option value="제주">제주</option>
                            </select>
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
                            <label className="input-label">고민을 더 자세히 알려주세요</label>
                            <textarea
                                className="input-textarea"
                                placeholder="(선택사항)"
                                value={고민내용}
                                onChange={(e) => set고민내용(e.target.value)}
                            />
                        </div>

                        {/* 나의 오늘 감정은? */}
                        <div className="input-group">
                            <label className="input-label">나의 오늘 감정은?</label>
                            <select
                                className="input-select"
                                value={오늘요일}
                                onChange={(e) => set오늘요일(e.target.value)}
                            >
                                <option value="우울함">우울함</option>
                                <option value="행복함">행복함</option>
                                <option value="불안함">불안함</option>
                                <option value="화남">화남</option>
                                <option value="피곤함">피곤함</option>
                                <option value="평온함">평온함</option>
                            </select>
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