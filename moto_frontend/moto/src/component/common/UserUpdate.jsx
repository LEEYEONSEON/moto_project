import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext'; 
import { useNavigate } from 'react-router-dom';
import createInstance from '../../axios/Interceptor'; 

const UserProfile = () => {
  const { user } = useContext(UserContext); 
  const navigate = useNavigate();

  // axios 인스턴스 생성 (토큰 자동 첨부 등 설정됨)
  const api = createInstance();

  // 폼 상태 관리 (초기값은 빈 값)
  const [form, setForm] = useState({
    userId: '',
    userNickname: '',
    userEmail: '',
    userGrade: '',
    userProfileImg: '',
    loginType: '', // 'basic' 또는 'social' 로그인 구분용
  });

  // 컴포넌트 마운트 시 유저 정보 API 호출
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get('/user/me'); // 로그인한 사용자 정보 조회
        if (res.data && res.data.resData) {
          setForm(res.data.resData); // 받아온 데이터를 form 상태에 세팅
        }
      } catch (err) {
        console.error('유저 정보 불러오기 실패', err);
      }
    };
    fetchUserData();
  }, []);

  // input 값 변경 시 form 상태 업데이트
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 폼 제출 시 정보 수정 API 호출
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/user/update/info', form);
      alert(res.data.message); // 성공 메시지 출력
    } catch (err) {
      alert('정보 수정 실패'); // 실패 시 알림
    }
  };

  // 비밀번호 변경 페이지로 이동
  const goToPasswordUpdate = () => {
    navigate('/user/update/password');
  };

  // 소셜 로그인 여부 판단
  const isSocial = form.loginType === 'social';

  return (
    <div style={{ padding: '20px' }}>
      <h2>마이페이지</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>아이디: </label>
          <input type="text" value={form.userId} disabled />
        </div>
        <div>
          <label>닉네임: </label>
          <input
            name="userNickname"
            value={form.userNickname}
            onChange={onChange}
            disabled={isSocial} // 소셜 로그인 시 수정 불가
          />
        </div>
        <div>
          <label>이메일: </label>
          <input
            name="userEmail"
            value={form.userEmail}
            onChange={onChange}
            disabled={isSocial} // 소셜 로그인 시 수정 불가
          />
        </div>
        <div>
          <label>등급: </label>
          <input type="text" value={form.userGrade || '일반'} disabled />
        </div>
        <div>
          <label>프로필 이미지 URL: </label>
          <input type="text" value={form.userProfileImg || ''} disabled />
        </div>

        {!isSocial && (
          <>
            <button type="submit">정보 수정</button>
            <button type="button" onClick={goToPasswordUpdate}>
              비밀번호 변경
            </button>
          </>
        )}

        {isSocial && <p>※ 소셜 로그인 사용자는 정보 수정이 불가능합니다.</p>}
      </form>
    </div>
  );
};

export default UserProfile;
