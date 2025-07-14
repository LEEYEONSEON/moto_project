import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";  // 로그인 사용자 정보 Context
import api from "../api/axios";

export default function UserInfoUpdate() {
  const { user, setUser, setIsLogined } = useContext(UserContext);

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


  const onDelete = async () => {
    if (!window.confirm("정말 회원 탈퇴를 하시겠습니까?")) {
      return;
    }

    try {
      const res = await api.delete("/user/delete/" + form.userId);
      if (res.data.success) {
        alert("회원 탈퇴가 완료되었습니다.");
        setUser(null);
        setIsLogined(false);
      } else {
        alert("회원 탈퇴에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("회원 탈퇴 중 오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={onSubmit}>
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
      <button type="button" onClick={onDelete} style={{ marginLeft: "10px" }}>회원탈퇴</button>
    </form>
  );
}
