import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import createInstance from '../../axios/Interceptor';
import useUserStore from '../../store/useUserStore';

// axios 인스턴스 한 번만 생성
const api = createInstance();

export default function MypageInfo() {
  const navigate = useNavigate();

  // Zustand store에서 로그인 여부와 accessToken을 가져옴
  const isLogined = useUserStore(state => state.isLogined);
  const accessToken = useUserStore(state => state.accessToken);

  // 사용자 정보 상태 관리
  const [form, setForm] = useState({
    userId: '',
    userNickname: '',
    userEmail: '',
    userGrade: '',
    userProfileImg: '',
    loginType: '',
  });

  // 메시지 상태: 에러 또는 성공 메시지 출력용
  const [message, setMessage] = useState({ type: '', text: '' });

  // 로딩 상태: 유저 정보 불러오는 동안 true
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 토큰 값 확인용 로그
    console.log('accessToken:', accessToken);

    // 유저 정보 API 호출 함수
    const fetchUserData = async () => {
      try {
        if (!accessToken) {
          setMessage({ type: 'error', text: '로그인 토큰이 없습니다.' });
          setLoading(false);
          return;
        }

        // 인증 헤더에 토큰 포함, withCredentials는 주석 처리 (필요시 활성화)
        const res = await api.get('/user/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          // withCredentials: true,  // 잠시 주석 처리
        });

        // 서버 응답 로그 확인
        console.log('유저 정보 응답:', res);

        if (res.data && res.data.resData) {
          const data = res.data.resData;
          setForm({
            userId: data.userId || '',
            userNickname: data.userNickname || '',
            userEmail: data.userEmail || '',
            userGrade: data.userGrade || '',
            userProfileImg: data.userProfileImg || '',
            loginType: data.loginType || '',
          });
          setMessage({ type: '', text: '' });
        } else {
          setMessage({ type: 'error', text: '유저 정보를 불러오는 데 실패했습니다.' });
        }
      } catch (err) {
        console.error('유저 정보 불러오기 실패', err);
        setMessage({ type: 'error', text: '유저 정보를 불러오는 데 실패했습니다.' });
      } finally {
        setLoading(false);
      }
    };

    if (isLogined) {
      fetchUserData();
    } else {
      setMessage({ type: 'error', text: '로그인이 필요합니다.' });
      setLoading(false);
    }
  }, [isLogined, accessToken]);

  // 입력값 변경 시 상태 업데이트
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 정보 수정 제출 함수
  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const res = await api.put('/user/update/info', form, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        // withCredentials: true, // 필요시 활성화
      });
      setMessage({ type: 'success', text: res.data.clientMsg || '정보가 수정되었습니다.' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: '정보 수정에 실패했습니다.' });
    }
  };

  // 비밀번호 변경 페이지로 이동
  const goToPasswordUpdate = () => {
    navigate('/user/update/password');
  };

  // 소셜 로그인 여부 체크 (수정 불가 필터링용)
  const isSocial = form.loginType === 'social';

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>마이페이지</h2>

      {/* 메시지 영역 (에러는 빨간색, 성공은 초록색) */}
      {message.text && (
        <div
          style={{
            marginBottom: '15px',
            color: message.type === 'error' ? 'red' : 'green',
            fontWeight: 'bold',
          }}
        >
          {message.text}
        </div>
      )}

      {/* 로딩 중 표시 */}
      {loading ? (
        <p>정보를 불러오는 중입니다...</p>
      ) : (
        <>
          {/* 프로필 이미지가 있으면 출력 */}
          {form.userProfileImg && (
            <div style={{ marginBottom: '20px' }}>
              <img
                src={form.userProfileImg}
                alt="프로필 이미지"
                style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
          )}

          {/* 정보 수정 폼 */}
          <form onSubmit={onSubmit}>
            {[
              { label: '아이디', name: 'userId', disabled: true, value: form.userId },
              { label: '닉네임', name: 'userNickname', disabled: isSocial, value: form.userNickname },
              { label: '이메일', name: 'userEmail', disabled: isSocial, value: form.userEmail },
              { label: '등급', name: 'userGrade', disabled: true, value: form.userGrade || '일반' },
              { label: '프로필 이미지 URL', name: 'userProfileImg', disabled: true, value: form.userProfileImg || '' },
            ].map(({ label, name, disabled, value }) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ width: '100px', fontWeight: '600' }}>{label}:</label>
                <input
                  name={name}
                  type="text"
                  disabled={disabled}
                  value={value}
                  onChange={onChange}
                  style={{ flex: 1, padding: '6px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>
            ))}

            {/* 소셜 로그인 아닌 경우에만 정보 수정, 비밀번호 변경 버튼 출력 */}
            {!isSocial && (
              <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  정보 수정
                </button>
                <button
                  type="button"
                  onClick={goToPasswordUpdate}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  비밀번호 변경
                </button>
              </div>
            )}

            {/* 소셜 로그인 시 안내 문구 */}
            {isSocial && (
              <p style={{ marginTop: '15px', color: '#555' }}>
                ※ 소셜 로그인 사용자는 정보 수정이 불가능합니다.
              </p>
            )}
          </form>
        </>
      )}
    </div>
  );
}
