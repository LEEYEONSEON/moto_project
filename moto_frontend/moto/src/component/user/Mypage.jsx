import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import UserInfo from "./UserInfo";
import UserEditForm from "./UserEditForm";
import PortfolioList from "./PortfolioList";

export default function Mypage() {
  const { loginMember } = useUserStore();
  const navigate = useNavigate();

  function goToInfo() {
    navigate('/users/me/info');
  }

  function goToChangePassword() {
    navigate('/users/me/change-password');
  }

  function goToAdmin() {
    navigate('/admin');
  }

  useEffect(function () {
    navigate('/users/me/info');
  }, [loginMember, navigate]);

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
          <ul className="left-menu">
            <li onClick={goToInfo}>내 정보</li>
            <li onClick={goToChangePassword}>비밀번호 변경</li>
            {loginMember && loginMember.memberLevel === 1 && (
              <li onClick={goToAdmin}>관리자 페이지</li>
            )}
          </ul>
        </section>
      </div>
      <div className="mypage-content">
        <Routes>
          <Route path="info" element={<UserInfo />} />
          <Route path="change-password" element={<UserEditForm />} />
          <Route path="portfolio" element={<PortfolioList />} />
        </Routes>
      </div>
    </div>
  );
}
