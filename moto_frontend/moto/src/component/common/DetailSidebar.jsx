import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";

export default function DetailSidebar(props) {
    const navigate = useNavigate();
    const { loginMember, setLoginMember, setIsLogined, setAccessToken, setRefreshToken, kakaoMember } = useUserStore();
    const setShowDetail = props.setShowDetail;

    
    function logout(e) {
        e.preventDefault();
        setIsLogined(false);
        setAccessToken(null);
        setRefreshToken(null);
        setLoginMember(null);
        navigate('/');
    }

    function close(){
        setShowDetail(false);
    }

    

    return (
        <div className="side-menu">

            <div className="logo" style={{ margin: "50px", marginTop: "0px"}}>
                <Link to="/">MOTU</Link>
            </div>

            

            <div className="menu-item" style={{ paddingBottom: "40px" }}>
            <Link to={"/asset"} style={{fontSize:"25px", color:"white"}}>
                거래소
            </Link>
            </div>

            <div className="menu-item" style={{ paddingBottom: "40px" }}>
                <Link to={"/watchlist"} style={{fontSize:"25px", color:"white"}}>
                    관심종목
                </Link>
            </div>

            <div className="menu-item" style={{ paddingBottom: "40px" }}>
                <Link to={"/portfolio"} style={{fontSize:"25px", color:"white"}}>
                   포트폴리오
                </Link>
            </div>

            

            <div className="menu-item" style={{ paddingBottom: "40px" }}>
                <Link to={"/wallet"} style={{fontSize:"25px", color:"white"}}>
                   지갑
                </Link>
            </div>

            


            

            <div className="menu-item" style={{ paddingBottom: "100px", display:"flex", justifyContent:"center"}}>
                {
                    loginMember || kakaoMember
                    ? <Link to={"/users/me"}><p style={{ fontSize:"25px", color: "white" }}>마이페이지</p></Link> 
                    : ""
                }
            </div>


             <div className="menu-item" style={{ paddingBottom: "40px", margin:"0 auto" }}>
            {
                loginMember
                ? <button onClick={logout} style={btnStyle}>로그아웃</button>
                : <button onClick={() => navigate("/login")} style={btnStyle}>로그인</button>
            }
            </div>

        </div>
    );
}

const btnStyle = {
  border: "none",
  backgroundColor: "transparent",
  color: "white",
  fontSize: "20px",
  width: "200px"
};