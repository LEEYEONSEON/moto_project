import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";

export default function DetailSidebar({ setShowDetail }) {
    const navigate = useNavigate();
    const { loginMember, kakaoMember, setIsLogined, setAccessToken, setRefreshToken } = useUserStore();

    function logout(e) {
        e.preventDefault();
        setIsLogined(false);
        setAccessToken(null);
        setRefreshToken(null);
        navigate('/');
    }

    return (
        <div style={{ paddingTop: "50px", color: "white" }}>
            <h2 style={{ paddingBottom: "40px" }}>로고 넣을거임!!</h2>

            <div className="menu-item" style={{ paddingBottom: "100px", display: "flex", justifyContent: "center" }}>
                {loginMember || kakaoMember ? (
                    <Link to="/users/me">
                        <p style={{ color: "white" }}>마이페이지</p>
                    </Link>
                ) : (
                    <Link to="/auth/login">
                        <p style={{ color: "white" }}>로그인을<br />진행해주세요.</p>
                    </Link>
                )}
            </div>

            <div className="menu-item" style={{ paddingBottom: "40px" }}>
                <Link to="/" style={{ fontSize: "25px", color: "white" }}>홈</Link>
            </div>
            <div className="menu-item" style={{ paddingBottom: "40px" }}>
                <Link to="/portfolio?filter=TYPE" style={{ fontSize: "25px", color: "white" }}>포트폴리오</Link>
            </div>
            <div className="menu-item" style={{ paddingBottom: "40px" }}>
                <Link to="/watchlist" style={{ fontSize: "25px", color: "white" }}>관심종목</Link>
            </div>
            <div className="menu-item" style={{ paddingBottom: "40px" }}>
                <Link to="/wallet" style={{ fontSize: "25px", color: "white" }}>지갑</Link>
            </div>
            <div className="menu-item" style={{ paddingBottom: "40px" }}>
                <Link to="/asset" style={{ fontSize: "25px", color: "white" }}>거래소</Link>
            </div>
            <div className="menu-item" style={{ paddingBottom: "40px" }}>
                <button onClick={logout} style={{ background: "none", border: "none", color: "white", fontSize: "20px" }}>
                    로그아웃
                </button>
            </div>
            <div className="menu-item" style={{ paddingBottom: "40px" }}>
                <button onClick={() => setShowDetail(false)} style={{ background: "none", border: "none" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3" style={{ width: "36px", height: "36px" }}>
                        <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56Z"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}
