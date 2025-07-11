import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useUserStore from "../../store/useUserStore";
import DetailSidebar from "./DetailSidebar";
import createInstance from "../../axios/Interceptor";
import Swal from "sweetalert2";

export default function Sidebar() {
    const navigate = useNavigate();
    const {
        loginMember,
        kakaoMember,
        setAccessToken,
        setRefreshToken,
        setIsLogined,
        setLoginMember,
        setKakaoMember,
    } = useUserStore();

    const [showDetail, setShowDetail] = useState(false);

    const handleLogout = async () => {
        try {
            if (kakaoMember) {
                window.location.href = `${import.meta.env.VITE_BACK_SERVER}/auth/oauth2/kakao/logout`;
            } else {
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

    const sidebarWidth = showDetail ? "250px" : "13%";

    return (
        <div
            className="side-menu"
            style={{
                width: sidebarWidth,
                transition: "width 0.3s ease-in-out",
                backgroundColor: "rgb(44, 44, 44)",
                height: "100vh",
                textAlign: "center",
                overflow: "hidden",
                position: "relative",
            }}
        >
            {
                showDetail
                    ? <DetailSidebar setShowDetail={setShowDetail} />
                    : <>
                        <div style={{ padding: "30px 0" }}>
                            <button
                                onClick={() => setShowDetail(true)}
                                style={{ background: "none", border: "none", cursor: "pointer" }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3" style={{ width: "30px", height: "30px" }}>
                                    <path d="M480-320 640-480 480-640l-56 56 64 64H320v80h168l-64 64 56 56Z" />
                                </svg>
                            </button>
                        </div>

                        <SidebarItem to="/main/1" svgPath="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />

                        <SidebarItem to="/users/me" svgPath="M200-200v-560 179-19 400Zm80-240h221q2-22 10-42t20-38H280v80Zm0 160h157q17-20 39-32.5t46-20.5q-4-6-7-13t-5-14H280v80Zm0-320h400v-80H280v80Zm-80 480q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v258q-14-26-34-46t-46-33v-179H200v560h202q-1 6-1.5 12t-.5 12v56H200Zm480-200q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM480-120v-56q0-24 12.5-44.5T528-250q36-15 74.5-22.5T680-280q39 0 77.5 7.5T832-250q23 9 35.5 29.5T880-176v56H480Z" />

                        <SidebarItem to="/portfolio?filter=TYPE" svgPath="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q64 0 123-24t104-69L480-480v-320q-134 0-227 93t-93 227q0 134 93 227t227 93Z" />

                        <SidebarItem to="/asset" svgPath="M280-160 120-320l160-160 57 56-64 64h167v80H273l63 64-56 56Zm280-120q-17 0-28.5-11.5T520-320q0-17 11.5-28.5T560-360q17 0 28.5 11.5T600-320q0 17-11.5 28.5T560-280Zm160 0q-17 0-28.5-11.5T680-320q0-17 11.5-28.5T720-360q17 0 28.5 11.5T760-320q0 17-11.5 28.5T720-280Zm-40-200-57-56 64-64H520v-80h167l-63-64 56-56 160 160-160 160Z" />

                        <SidebarItem to="/watchlist" svgPath="m612-550 141-142-28-28-113 113-57-57-28 29 85 85ZM120-160v-80h480v80H120Zm520-280q-83 0-141.5-58.5T440-640q0-83 58.5-141.5T640-840q83 0 141.5 58.5T840-640q0 83-58.5 141.5T640-440Zm-520-40v-80h252q7 22 16 42t22 38H120Zm0 160v-80h376q23 14 49 23.5t55 13.5v43H120Z" />

                        <SidebarItem to="/wallet" svgPath="M240-160q-66 0-113-47T80-320v-320q0-66 47-113t113-47h480q66 0 113 47t47 113v320q0 66-47 113t-113 47H240Zm0-480h480q22 0 42 5t38 16v-21q0-33-23.5-56.5T720-720H240q-33 0-56.5 23.5T160-640v21q18-11 38-16t42-5Z" />

                        <div className="menu-item" style={{ paddingBottom: "40px" }}>
                            <button onClick={handleLogout} style={{ background: "none", border: "none", cursor: "pointer" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3" style={{ width: "18px", height: "18px" }}>
                                    <path d="M538-538ZM424-424Zm56 264q51 0 98-15.5t88-44.5q-41-29-88-44.5T480-280q-51 0-98 15.5T294-220q41 29 88 44.5t98 15.5Zm106-328-57-57q5-8 8-17t3-18q0-25-17.5-42.5T480-640q-9 0-18 3t-17 8l-57-57q19-17 42.5-25.5T480-720q58 0 99 41t41 99q0 26-8.5 49.5T586-488Zm228 228-58-58q22-37 33-78t11-84q0-134-93-227t-227-93q-43 0-84 11t-78 33l-58-58q49-32 105-49t115-17q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 59-17 115t-49 105ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-59 16.5-115T145-701L27-820l57-57L876-85l-57 57-615-614q-22 37-33 78t-11 84q0 57 19 109t55 95q54-41 116.5-62.5T480-360q38 0 76 8t74 22l133 133q-57 57-130 87T480-80Z"/>
                                </svg>
                            </button>
                        </div>
                    </>
            }
        </div>
    );
}

function SidebarItem({ to, svgPath }) {
    return (
        <div className="menu-item" style={{ paddingBottom: "40px" }}>
            <Link to={to}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3" style={{ width: "36px", height: "36px" }}>
                    <path d={svgPath} />
                </svg>
            </Link>
        </div>
    );
}
