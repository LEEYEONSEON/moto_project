import React, { useContext, useState } from 'react';
import { UserContext } from './UserContext';
import createInstance from '../../axios/Interceptor';

export default function UserPasswordUpdate() {
  // 현재 로그인된 유저 정보
  const { user } = useContext(UserContext);

  // axios 인스턴스 생성
  const api = createInstance();

  // 폼 상태: userId도 직접 입력 가능하도록 추가
  const [form, setForm] = useState({
    userId: '',             // 유저가 직접 입력할 userId
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 입력값 변경 핸들러
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 비밀번호 유효성 정규식
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

  // 폼 제출 시 처리
  const onSubmit = async (e) => {
    e.preventDefault();

    // 로그인된 userId가 없으면 경고
    if (!user?.userId) {
      alert('로그인된 사용자가 없습니다.');
      return;
    }

    // 입력한 userId와 로그인된 userId가 일치하는지 확인
    if (form.userId !== user.userId) {
      alert('입력한 아이디가 로그인된 사용자와 일치하지 않습니다.');
      return;
    }

    // 현재 비밀번호 길이 검사
    if (!form.currentPassword || form.currentPassword.length < 6) {
      alert('현재 비밀번호를 올바르게 입력해주세요 (최소 6자리).');
      return;
    }

    // 새 비밀번호와 확인 비밀번호 일치 확인
    if (form.newPassword !== form.confirmPassword) {
      alert('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 새 비밀번호 유효성 검사
    if (!passwordRegex.test(form.newPassword)) {
      alert('새 비밀번호는 최소 6자리 이상이며, 영문자, 숫자, 특수문자를 모두 포함해야 합니다.');
      return;
    }

    // 새 비밀번호가 현재 비밀번호와 다른지 확인
    if (form.newPassword === form.currentPassword) {
      alert('새 비밀번호는 현재 비밀번호와 달라야 합니다.');
      return;
    }

    try {
      // 비밀번호 변경 API 호출
      const res = await api.put('/user/update/password', {
        userId: form.userId,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      alert(res.data.message);

      // 폼 초기화
      setForm({
        userId: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error(error);
      alert('비밀번호 변경 실패');
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      {/* userId 입력 필드 (수정 가능) */}
      <div>
        <label>아이디:</label>
        <input
          name="userId"
          value={form.userId}
          onChange={onChange}
          placeholder="아이디를 입력하세요"
          required
          style={{ width: '100%', marginBottom: '8px' }}
        />
      </div>

      {/* 현재 비밀번호 입력 */}
      <div>
        <label>현재 비밀번호:</label>
        <input
          name="currentPassword"
          type="password"
          placeholder="현재 비밀번호 입력"
          value={form.currentPassword}
          onChange={onChange}
          required
          style={{ width: '100%', marginBottom: '8px' }}
        />
      </div>

      {/* 새 비밀번호 입력 */}
      <div>
        <label>새 비밀번호:</label>
        <input
          name="newPassword"
          type="password"
          placeholder="새 비밀번호 입력"
          value={form.newPassword}
          onChange={onChange}
          required
          style={{ width: '100%', marginBottom: '8px' }}
        />
      </div>

      {/* 새 비밀번호 확인 입력 */}
      <div>
        <label>새 비밀번호 확인:</label>
        <input
          name="confirmPassword"
          type="password"
          placeholder="새 비밀번호 확인"
          value={form.confirmPassword}
          onChange={onChange}
          required
          style={{ width: '100%', marginBottom: '12px' }}
        />
      </div>

      {/* 제출 버튼 */}
      <button type="submit" style={{ width: '100%', padding: '10px' }}>
        비밀번호 변경
      </button>
    </form>
  );
}
