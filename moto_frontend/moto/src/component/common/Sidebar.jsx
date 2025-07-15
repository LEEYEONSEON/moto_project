import { Link, Route, Routes, useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import { useState } from "react";
import DetailSidebar from "./DetailSidebar";
import createInstance from "../../axios/Interceptor";
import Swal from "sweetalert2";
import "./sidebar.css";
export default function Sidebar({ onToggleSidebar }) {
    const navigate = useNavigate();
     const {
    loginMember,
    kakaoMember,
    setAccessToken,
    setRefreshToken,
    setIsLogined,
    setLoginMember,
    setKakaoMember,
    setTokenExpiresIn,
    setRefreshTokenExpiresIn,
    } = useUserStore();

    const axiosInstance = createInstance();
    const serverUrl = import.meta.env.VITE_BACK_SERVER;

    const handleLogout = async () => {
    try {
      if (kakaoMember) {
        // 카카오 소셜 로그인 사용자 로그아웃 처리
        
        console.log("requestKakaoLogout");
        window.location.href = `${serverUrl}/auth/oauth2/kakao/logout`;

      } else {
        // 일반 로그인 사용자 로그아웃 처리
        setAccessToken(null);
        setRefreshToken(null);
        setLoginMember(null);
        setIsLogined(false);
        navigate("/login");
      }
    } catch (error) {
      console.error("로그아웃 실패:", error);
      Swal.fire("오류", "로그아웃 중 오류가 발생했습니다.", "error");
    }
  };
    const [showDetail, setShowDetail] = useState(false); // 슬라이드 상태



    function toggleDetailSidebar() {
        setShowDetail(!showDetail);
    }

    return (
        <div
            className="side-menu"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "60px",              // 고정 너비
                height: "100vh",            // 전체 높이
                backgroundColor: "#2c2c2c",
                zIndex: 200,                // 헤더보다 높게
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "120px",
                gap: "10px"
            }}
            >
            
             <div className="menu-item" style={{ paddingBottom: "30px", paddingTop: "20px" }}>
                    <button
                    type="button"
                    onClick={function() {
                    toggleDetailSidebar();
                    onToggleSidebar();
                    }}
                    
                    style={{
                        position: "absolute",
                        top: "30px",
                        right: "10px",
                        backgroundColor: "#444",
                        border: "none",
                        borderRadius: "50%",
                        width: "36px",
                        height: "36px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 0 6px rgba(0,0,0,0.4)",
                        zIndex: 999,     
                    }}
                    >
                    <span style={{color: "white"}}>{showDetail ? "◀" : "▶"}</span>
                    </button>

                </div>

            <div className="menu-item" style={{ paddingBottom: "40px" }}>
                <Link to={"/"}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3" style={{ width: "36px", height: "36px" }}>
                        <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>
                    </svg>
                </Link>
            </div>

            


            <div className="menu-item" style={{ paddingBottom: "40px" }}>
                <Link to={"/portfolio"}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3" style={{ width: "36px", height: "36px" }}>
                        <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q64 0 123-24t104-69L480-480v-320q-134 0-227 93t-93 227q0 134 93 227t227 93Z"/>
                    </svg>
                </Link>
            </div>

            <div className="menu-item" style={{ paddingBottom: "40px" }}>
                <Link to={"/asset"}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3" style={{ width: "36px", height: "36px" }}>
                        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                    </svg>
                </Link>
            </div>
            <div className="menu-item" style={{ paddingBottom: "40px" }}>
                <Link to={"/wallet"}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3" style={{ width: "36px", height: "36px" }}>
                        <path d="M240-160q-66 0-113-47T80-320v-320q0-66 47-113t113-47h480q66 0 113 47t47 113v320q0 66-47 113t-113 47H240Zm0-480h480q22 0 42 5t38 16v-21q0-33-23.5-56.5T720-720H240q-33 0-56.5 23.5T160-640v21q18-11 38-16t42-5Zm-74 130 445 108q9 2 18 0t17-8l139-116q-11-15-28-24.5t-37-9.5H240q-26 0-45.5 13.5T166-510Z"/>
                    </svg>
                </Link>
            </div>

            <div className="menu-item" style={{ paddingBottom: "40px" }}>
                <Link to={"/users/me"}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3" style={{ width: "36px", height: "36px" }}>
                        <path d="M200-200v-560 179-19 400Zm80-240h221q2-22 10-42t20-38H280v80Zm0 160h157q17-20 39-32.5t46-20.5q-4-6-7-13t-5-14H280v80Zm0-320h400v-80H280v80Zm-80 480q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v258q-14-26-34-46t-46-33v-179H200v560h202q-1 6-1.5 12t-.5 12v56H200Zm480-200q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM480-120v-56q0-24 12.5-44.5T528-250q36-15 74.5-22.5T680-280q39 0 77.5 7.5T832-250q23 9 35.5 29.5T880-176v56H480Z"/>
                    </svg>
                </Link>
            </div>


            <div
            style={{
                position: "fixed",
                top: 0,
                left: showDetail ? "0px" : "-290px", // ← 눌렀을 때만 보임
                width: "240px",
                height: "100vh",
                backgroundColor: "#2c2c2c",
                color: "#fff",
                padding: "20px",
                transition: "left 0.3s ease-in-out",
                zIndex: 150,
                boxShadow: "2px 0 5px rgba(0,0,0,0.2)"
            }}
            >
            <DetailSidebar setShowDetail={setShowDetail} />
            </div>

        </div>
    );
}
