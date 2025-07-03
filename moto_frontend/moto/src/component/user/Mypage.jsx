import { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import LeftMenu from "../components/LeftMenu";
import UserInfo from "../components/UserInfo";
import UserEditForm from "../components/UserEditForm";
import PasswordChange from "../components/PasswordChange";
import PortfolioList from "../components/PortfolioList";
import { useUserStore } from "../stores/userStore";

export default function MyPage() {
  const { loginMember, kakaoMember } = useUserStore();
  const navigate = useNavigate();

  // 로그인 타입: kakaoMember가 있으면 social, 아니면 normal
  const loginType = kakaoMember?.member ? "social" : "normal";

  useEffect(() => {
    if (!loginMember && !kakaoMember?.member) {
      navigate("/login");
    }
  }, [loginMember, kakaoMember, navigate]);

  const menuList = [
    { url: '/user/info', text: "내 정보" },
    { url: '/user/EditForm', text: "정보 변경" },
    { url: '/user/pwChg', text: "비밀번호 변경" },
  ];

  return (
    <div className="mypage-wrap">
      <div className="mypage-side">
        <section className="section account-box">
          <div className="account-info">
            <span className="material-icons">settings</span>
            <span>MYPAGE</span>
          </div>
        </section>
        <section className="section">
          <LeftMenu menuList={menuList} />
        </section>
      </div>
      <div className="mypage-content">
        <Routes>
          <Route path="info" element={<UserInfo loginType={loginType} user={loginMember || kakaoMember?.member} />} />
          <Route path="EditForm" element={<UserEditForm loginType={loginType} user={loginMember || kakaoMember?.member} />} />
          <Route path="pwChg" element={<PasswordChange />} />
          <Route path="List" element={<PortfolioList />} />
        </Routes>
      </div>
    </div>
  );
}
