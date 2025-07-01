import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../common/UserContext';
import { useNavigate } from 'react-router-dom';
import createInstance from '../../axios/Interceptor';

const Mypage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const api = createInstance();

  const [form, setForm] = useState({
    userId: '',
    userNickname: '',
    userEmail: '',
    userGrade: '',
    userProfileImg: '',
    loginType: '',
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get('/user/me');
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
        } else {
          setMessage({ type: 'error', text: '유저  불러오는 데 실패했습니다.' });
        }
      } catch (err) {
        console.error('유저 정보 불러오기 실패', err);
        setMessage({ type: 'error', text: '유저  불러오는 데 실패했습니다.' });
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // form 상태가 바뀔 때마다 상태 확인용 로그
  useEffect(() => {
    console.log('폼 상태 변경:', form);
  }, [form]);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const res = await api.put('/user/update/info', form);
      setMessage({ type: 'success', text: res.data.clientMsg || '정보가 수정되었습니다.' });
    } catch (err) {
      setMessage({ type: 'error', text: '정보 수정에 실패했습니다.' });
    }
  };

  const goToPasswordUpdate = () => {
    navigate('/user/update/password');
  };

  const isSocial = form.loginType === 'social';

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>마이페이지</h2>

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

      {loading ? (
        <p>정보를 불러오는 중입니다...</p>
      ) : (
        <>
          {form.userProfileImg && (
            <div style={{ marginBottom: '20px' }}>
              <img
                src={form.userProfileImg}
                alt="프로필 이미지"
                style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
          )}

          <form onSubmit={onSubmit}>
            {[
              { label: '아이디', name: 'userId', disabled: true, value: form.userId },
              { label: '닉네임', name: 'userNickname', disabled: isSocial, value: form.userNickname },
              { label: '이메일', name: 'userEmail', disabled: isSocial, value: form.userEmail },
              { label: '등급', name: 'userGrade', disabled: true, value: form.userGrade || '일반' },
              { label: '프로필 이미지 URL', name: 'userProfileImg', disabled: true, value: form.userProfileImg || '' },
            ].map(({ label, name, disabled, value }) => (
              <div
                key={name}
                style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}
              >
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
};

export default Mypage;
