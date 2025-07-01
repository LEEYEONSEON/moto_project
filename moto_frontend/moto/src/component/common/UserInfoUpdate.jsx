import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";  // 로그인 사용자 정보 Context
import api from "../api/axios";

export default function UserInfoUpdate() {
  const { user } = useContext(UserContext);

  // form 상태 초기화, userId는 Context에서 받아서 세팅, 수정 불가(readonly)
  const [form, setForm] = useState({
    userId: user?.userId || "",        // 로그인된 사용자 ID
    userNickname: "",
    userEmail: "",
    userProfileImg: ""
  });

  // 입력 필드 변경 시 호출되는 함수
  const onChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 폼 제출 시 호출되는 함수
  const onSubmit = async e => {
    e.preventDefault();

    if (!form.userId) {
      alert("로그인된 사용자가 없습니다.");
      return;
    }

    try {
      // PUT 요청: /user/update/info 에 회원정보 수정 요청
      const res = await api.put("/user/update/info", form);
      alert(res.data.message);
    } catch (error) {
      console.error(error);
      alert("회원정보 수정 실패");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {/* userId는 로그인 정보에서 받아서 보여주고 수정 불가 */}
      <input
        name="userId"
        placeholder="User ID"
        value={form.userId}
        readOnly
        required
      />
      <input
        name="userNickname"
        placeholder="Nickname"
        value={form.userNickname}
        onChange={onChange}
      />
      <input
        name="userEmail"
        placeholder="Email"
        value={form.userEmail}
        onChange={onChange}
      />
      <input
        name="userProfileImg"
        placeholder="Profile Image URL"
        value={form.userProfileImg}
        onChange={onChange}
      />
      <button type="submit">회원정보 수정</button>
    </form>
  );
}
