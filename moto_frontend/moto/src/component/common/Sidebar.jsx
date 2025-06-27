import { Link, Route, Routes, useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import { useState } from "react";
import DetailSidebar from "./DetailSidebar";

export default function Sidebar() {
const navigate = useNavigate();
    const { loginMember, setAccessToken, setRefreshToken, setIsLogined } = useUserStore();
    const [showDetail, setShowDetail] = useState(false); // 슬라이드 상태

    function logout(e) {
        e.preventDefault();
        setIsLogined(false);
        setAccessToken(null);
        setRefreshToken(null);
        navigate('/login');
    }

    function toggleDetailSidebar() {
        setShowDetail(!showDetail);
    }

    return (
        <div className="side-menu" style={{ textAlign: "center", backgroundColor: "rgb(44, 44, 44)", width: "13%", Height:"692px" }}>
            
             <div className="menu-item" style={{ paddingBottom: "40px", paddingTop: "20px" }}>
                    <button
                        type="button"
                        onClick={toggleDetailSidebar}
                        style={{ background: "none", border: "none", cursor: "pointer" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3" style={{ width: "30px", height: "30px" }}>
                            <path d="M480-320 640-480 480-640l-56 56 64 64H320v80h168l-64 64 56 56Z" />
                        </svg>
                    </button>
                </div>
            <div className="menu-item" style={{ paddingBottom: "40px" }}>
                {
                    loginMember 
                    ? <Link to={"/users/me"}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3" style={{ width: "36px", height: "36px" }}><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg></Link> 
                    : <Link to={"/auth/login"}><p style={{ color: "white" }}>로그인을 <br />진행해주세요.</p></Link>
                }
            </div>

            <div className="menu-item" style={{ paddingBottom: "40px" }}>
                <Link to={"/"}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3" style={{ width: "36px", height: "36px" }}>
                        <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>
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

            <div className="menu-item" style={{ paddingBottom: "40px" }}>
                <Link to={"/users/me/portfolio/:filter"}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3" style={{ width: "36px", height: "36px" }}>
                        <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q64 0 123-24t104-69L480-480v-320q-134 0-227 93t-93 227q0 134 93 227t227 93Z"/>
                    </svg>
                </Link>
            </div>

            <div className="menu-item" style={{ paddingBottom: "40px" }}>
                <Link to={""}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3" style={{ width: "36px", height: "36px" }}>
                        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                    </svg>
                </Link>
            </div>

            <div className="menu-item" style={{ paddingBottom: "60px" }}>
                <Link to={"/watchlists/:memberId"}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3" style={{ width: "36px", height: "36px" }}>
                        <path d="M240-160q-66 0-113-47T80-320v-320q0-66 47-113t113-47h480q66 0 113 47t47 113v320q0 66-47 113t-113 47H240Zm0-480h480q22 0 42 5t38 16v-21q0-33-23.5-56.5T720-720H240q-33 0-56.5 23.5T160-640v21q18-11 38-16t42-5Zm-74 130 445 108q9 2 18 0t17-8l139-116q-11-15-28-24.5t-37-9.5H240q-26 0-45.5 13.5T166-510Z"/>
                    </svg>
                </Link>
            </div>

            <div>
                <Link to={"/auth/login"} onClick={logout}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3" style={{ width: "18px", height: "18px" }}>
                        <path d="M538-538ZM424-424Zm56 264q51 0 98-15.5t88-44.5q-41-29-88-44.5T480-280q-51 0-98 15.5T294-220q41 29 88 44.5t98 15.5Zm106-328-57-57q5-8 8-17t3-18q0-25-17.5-42.5T480-640q-9 0-18 3t-17 8l-57-57q19-17 42.5-25.5T480-720q58 0 99 41t41 99q0 26-8.5 49.5T586-488Zm228 228-58-58q22-37 33-78t11-84q0-134-93-227t-227-93q-43 0-84 11t-78 33l-58-58q49-32 105-49t115-17q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 59-17 115t-49 105ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-59 16.5-115T145-701L27-820l57-57L876-85l-57 57-615-614q-22 37-33 78t-11 84q0 57 19 109t55 95q54-41 116.5-62.5T480-360q38 0 76 8t74 22l133 133q-57 57-130 87T480-80Z"/>
                    </svg>
                </Link>
            </div>
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: showDetail ? "13%" : "-250px", 
                    width: "250px",
                    height: "100vh",
                    backgroundColor: "#2c2c2c",
                    color: "#fff",
                    padding: "20px",
                    transition: "left 0.3s ease-in-out", 
                    zIndex: 20}}>
                    <DetailSidebar setShowDetail={setShowDetail}/>
            </div>
        </div>
    );
}
