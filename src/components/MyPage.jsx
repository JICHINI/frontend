import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyPage.css';
import Logo from '../image/Logo.png';

function MyPage() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [userInfo, setUserInfo] = useState({
        name: '',
        profileImage: '',
        tags: [],
        job: '',
        province: '',
        city: '',
        age: '',
        concern: '',
        concernDetail: '',
        emotion: ''
    });

    const [editMode, setEditMode] = useState({
        name: false,
        job: false,
        province: false,
        city: false,
        age: false,
        concern: false,
        concernDetail: false,
        emotion: false
    });

    const [tempValues, setTempValues] = useState({ ...userInfo });
    const [showTagModal, setShowTagModal] = useState(false);
    const [tempTags, setTempTags] = useState([]);
    const [newTag, setNewTag] = useState('');

    // ✅ 내 정보 불러오기
    useEffect(() => {
        fetch('http://localhost:8080/member/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                const loaded = {
                    name: data.name || '',
                    profileImage: data.profileImage || '',
                    tags: data.tags ? data.tags.split(',').filter(t => t) : [],
                    job: data.job || '',
                    province: data.province || '',
                    city: data.city || '',
                    age: data.age ? String(data.age) : '',
                    concern: data.concern || '',
                    concernDetail: data.concernDetail || '',
                    emotion: data.emotion || ''
                };
                setUserInfo(loaded);
                setTempValues(loaded);
            })
            .catch(err => console.error('내 정보 로드 오류:', err));
    }, []);

    // ✅ 전체 저장
    const handleSaveAll = async () => {
        const updatedInfo = { ...userInfo };
        Object.keys(editMode).forEach(field => {
            if (editMode[field]) updatedInfo[field] = tempValues[field];
        });

        try {
            await fetch('http://localhost:8080/member/me', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: updatedInfo.name,
                    job: updatedInfo.job,
                    location: updatedInfo.location,
                    age: parseInt(updatedInfo.age),
                    concern: updatedInfo.concern,
                    concernDetail: updatedInfo.concernDetail,
                    emotion: updatedInfo.emotion,
                    profileImage: updatedInfo.profileImage,
                    tags: updatedInfo.tags.join(',')
                })
            });

            setUserInfo(updatedInfo);
            setEditMode({ name: false, job: false, location: false, age: false, concern: false, concernDetail: false, emotion: false });
            alert('정보가 저장되었습니다.');
        } catch (err) {
            console.error('저장 오류:', err);
            alert('저장에 실패했습니다.');
        }
    };

    const handleProfileChange = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target.result;
                setUserInfo({ ...userInfo, profileImage: base64 });
                setTempValues({ ...tempValues, profileImage: base64 });
            };
            reader.readAsDataURL(file);
        };
        input.click();
    };

    // 태그 변경 모달
    const handleTagChange = () => {
        setTempTags([...userInfo.tags]);
        setShowTagModal(true);
    };

    const handleAddTag = () => {
        if (newTag.trim() && tempTags.length < 5) {
            const formattedTag = newTag.startsWith('#') ? newTag : `#${newTag}`;
            setTempTags([...tempTags, formattedTag]);
            setNewTag('');
        }
    };

    const handleRemoveTag = (index) => {
        setTempTags(tempTags.filter((_, idx) => idx !== index));
    };

    // ✅ 태그 저장
    const handleSaveTag = async () => {
        try {
            await fetch('http://localhost:8080/member/me', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ tags: tempTags.join(',') })
            });
            setUserInfo({ ...userInfo, tags: tempTags });
            setShowTagModal(false);
        } catch (err) {
            console.error('태그 저장 오류:', err);
            alert('태그 저장에 실패했습니다.');
        }
    };

    const handleCloseTagModal = () => {
        setShowTagModal(false);
        setNewTag('');
    };

    const toggleEdit = (field) => {
        if (editMode[field]) {
            setUserInfo({ ...userInfo, [field]: tempValues[field] });
        } else {
            setTempValues({ ...tempValues, [field]: userInfo[field] });
        }
        setEditMode({ ...editMode, [field]: !editMode[field] });
    };

    const handleTempChange = (field, value) => {
        setTempValues({ ...tempValues, [field]: value });
    };

    //로그아웃
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // ✅ 회원 탈퇴
    const handleDeleteAccount = async () => {
        if (window.confirm('정말로 회원 탈퇴하시겠습니까?')) {
            try {
                await fetch('http://localhost:8080/member/me', {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                localStorage.removeItem('token');
                navigate('/login');
            } catch (err) {
                console.error('탈퇴 오류:', err);
                alert('탈퇴에 실패했습니다.');
            }
        }
    };

    return (
        <div className="mypage-container">
            {/* 사이드바 */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <img src={Logo} alt="JICHINI" className="sidebar-logo" onClick={() => navigate('/main')} />
                </div>
                <nav className="sidebar-nav">
                    <div className="nav-item" onClick={() => navigate('/main')}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M3 10L10 3L17 10V17C17 17.5304 16.7893 18.0391 16.4142 18.4142C16.0391 18.7893 15.5304 19 15 19H5C4.46957 19 3.96086 18.7893 3.58579 18.4142C3.21071 18.0391 3 17.5304 3 17V10Z"
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>홈</span>
                    </div>
                    <div className="nav-item" onClick={() => navigate('/chat')}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M17 9C17 13.4183 13.4183 17 9 17C7.73835 17 6.55719 16.6916 5.52349 16.1462L2 17L2.85382 13.4765C2.30838 12.4428 2 11.2617 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z"
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>채팅</span>
                    </div>
                    <div className="nav-item" onClick={() => navigate('/history')}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M4 4H16C17.1 4 18 4.9 18 6V14C18 15.1 17.1 16 16 16H4C2.9 16 2 15.1 2 14V6C2 4.9 2.9 4 4 4Z"
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M18 6L10 11L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>조언 내역</span>
                    </div>
                </nav>
            </aside>

            {/* 메인 영역 */}
            <main className="mypage-main">
                <header className="mypage-header">
                    <h1 className="mypage-title">내 정보</h1>
                </header>

                {/* 프로필 카드 */}
                <div className="mypage-profile-card">
                    <div className="profile-image-section">
                        <div className="profile-image">
                            {userInfo.profileImage
                                ? <img src={userInfo.profileImage} alt="프로필" style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} />
                                : ''
                            }
                        </div>
                        <div className="profile-name-section">
                            <div className="profile-name-wrapper">
                                {editMode.name ? (
                                    <input
                                        type="text"
                                        className="profile-name-input"
                                        value={tempValues.name}
                                        onChange={(e) => handleTempChange('name', e.target.value)}
                                        autoFocus
                                        maxLength={20}
                                    />
                                ) : (
                                    <span className="profile-name">{userInfo.name}</span>
                                )}
                                <button className="edit-icon-button" onClick={() => toggleEdit('name')}>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M13 2L16 5L6 15H3V12L13 2Z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                            <div className="profile-tags">
                                {userInfo.tags.map((tag, idx) => (
                                    <span key={idx} className="profile-tag-item">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="profile-buttons">
                        <button className="profile-button-secondary" onClick={handleTagChange}>태그 변경</button>
                        <button className="profile-button-primary" onClick={handleProfileChange}>프로필 변경</button>
                    </div>
                </div>

                {/* 정보 필드 */}
                <div className="mypage-fields">
                    {/* 직업 */}
                    <div className="mypage-field">
                        {editMode.job ? (
                            <input type="text" className="mypage-input editing" value={tempValues.job}
                                   onChange={(e) => handleTempChange('job', e.target.value)} autoFocus />
                        ) : (
                            <div className="mypage-input">{userInfo.job}</div>
                        )}
                        <button className="field-edit-button" onClick={() => toggleEdit('job')}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M14 2L18 6L7 17H3V13L14 2Z" stroke="#50B6FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>

                    {/* 거주지 */}
                    <div className="mypage-field">
                        {editMode.location ? (
                            <input type="text" className="mypage-input editing" value={tempValues.location}
                                   onChange={(e) => handleTempChange('location', e.target.value)} autoFocus />
                        ) : (
                            <div className="mypage-input">{userInfo.location}</div>
                        )}
                        <button className="field-edit-button" onClick={() => toggleEdit('location')}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M14 2L18 6L7 17H3V13L14 2Z" stroke="#50B6FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>

                    {/* 나이 */}
                    <div className="mypage-field">
                        {editMode.age ? (
                            <input type="text" className="mypage-input editing" value={tempValues.age}
                                   onChange={(e) => handleTempChange('age', e.target.value)} autoFocus />
                        ) : (
                            <div className="mypage-input">{userInfo.age}</div>
                        )}
                        <button className="field-edit-button" onClick={() => toggleEdit('age')}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M14 2L18 6L7 17H3V13L14 2Z" stroke="#50B6FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>

                    {/* 고민 */}
                    <div className="mypage-field">
                        {editMode.concern ? (
                            <input type="text" className="mypage-input editing" value={tempValues.concern}
                                   onChange={(e) => handleTempChange('concern', e.target.value)} autoFocus />
                        ) : (
                            <div className="mypage-input">{userInfo.concern}</div>
                        )}
                        <button className="field-edit-button" onClick={() => toggleEdit('concern')}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M14 2L18 6L7 17H3V13L14 2Z" stroke="#50B6FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>

                    {/* 고민 상세 */}
                    <div className="mypage-field wide">
                        {editMode.concernDetail ? (
                            <textarea className="mypage-input editing" value={tempValues.concernDetail}
                                      onChange={(e) => handleTempChange('concernDetail', e.target.value)} autoFocus rows={3} />
                        ) : (
                            <div className="mypage-input">{userInfo.concernDetail}</div>
                        )}
                        <button className="field-edit-button" onClick={() => toggleEdit('concernDetail')}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M14 2L18 6L7 17H3V13L14 2Z" stroke="#50B6FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>

                    {/* 감정 */}
                    <div className="mypage-field">
                        {editMode.emotion ? (
                            <input type="text" className="mypage-input editing" value={tempValues.emotion}
                                   onChange={(e) => handleTempChange('emotion', e.target.value)} autoFocus />
                        ) : (
                            <div className="mypage-input">{userInfo.emotion}</div>
                        )}
                        <button className="field-edit-button" onClick={() => toggleEdit('emotion')}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M14 2L18 6L7 17H3V13L14 2Z" stroke="#50B6FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>

                    <div className="mypage-field">
                        <button className="mypage-save-button" onClick={handleSaveAll}>저장</button>
                    </div>
                </div>

                {/* 하단 버튼 */}
                <div className="mypage-bottom-buttons">
                    <button className="mypage-logout-button" onClick={handleLogout}>로그아웃</button>
                    <button className="mypage-delete-button" onClick={handleDeleteAccount}>회원 탈퇴</button>
                </div>
            </main>

            {/* 태그 변경 모달 */}
            {showTagModal && (
                <div className="tag-modal-overlay" onClick={handleCloseTagModal}>
                    <div className="tag-modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="tag-modal-title">태그 변경</h2>
                        <div className="tag-list">
                            {tempTags.map((tag, index) => (
                                <div key={index} className="tag-item">
                                    <span>{tag}</span>
                                    <button className="tag-remove-button" onClick={() => handleRemoveTag(index)}>×</button>
                                </div>
                            ))}
                        </div>
                        <div className="tag-input-section">
                            <input
                                type="text"
                                className="tag-input"
                                placeholder="태그 입력 (예: 학생)"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                                maxLength={20}
                            />
                            <button className="tag-add-button" onClick={handleAddTag}
                                    disabled={!newTag.trim() || tempTags.length >= 5}>추가</button>
                        </div>
                        <p className="tag-hint">최대 5개까지 추가 가능합니다.</p>
                        <div className="tag-modal-buttons">
                            <button className="tag-modal-cancel" onClick={handleCloseTagModal}>취소</button>
                            <button className="tag-modal-save" onClick={handleSaveTag}>저장</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyPage;