import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import UserInfo from "./UserInfo";  
import UserEditForm from "./UserEditForm";  

export default function Mypage() {
  const { loginMember, kakaoMember } = useUserStore();
  const navigate = useNavigate();

  const [menuList, setMenuList] = useState([
    { url: '/pwChg', text: '비밀번호 변경' }, 
  ]);

  let member;
  if(kakaoMember){
    member = kakaoMember
  }else if(loginMember){
    member = loginMember
  }else{
    member = null;
  }
  
  // 로그인 상태에 따라 메인 페이지 이동
  useEffect(function () {
    if (member) {
      navigate('/users/me/info');  // 로그인 후 기본 경로로 이동
    }
  }, [member, navigate]);

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
            {menuList.map(function(menu, idx) {
              return (
                <li
                  key={idx}
                  onClick={function() {
                    navigate(menu.url); 
                  }}
                >
                  {menu.text}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
      <div className="mypage-content">
        <Routes>
          <Route path="info" element={<UserInfo />} />
          <Route path="pwChg" element={<UserEditForm />} /> {/* 비밀번호 변경 페이지 처리 */}
        </Routes>
      </div>
    </div>
  );
}
