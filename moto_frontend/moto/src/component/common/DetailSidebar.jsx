import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";

export default function DetailSidebar(props) {
    const navigate = useNavigate();
    const { loginMember, setIsLogined, setAccessToken, setRefreshToken, kakaoMember } = useUserStore();
    const setShowDetail = props.setShowDetail;
    
    let user;
    if(loginMember){
        user = loginMember;
    }else if(kakaoMember){
        user = kakaoMember;
    }
    
    function logout(e) {
        e.preventDefault();
        setIsLogined(false);
        setAccessToken(null);
        setRefreshToken(null);
        navigate('/');
    }

    function close(){
        setShowDetail(false);
    }

    return (
        <div className="side-menu">

            <h2 style={{color:"white", paddingTop:"50px", paddingBottom:"40px"}}>로고 넣을거임!!</h2>

            <div className="menu-item" style={{ paddingBottom: "100px", display:"flex", justifyContent:"center"}}>
                {
                    loginMember || kakaoMember
                    ? <Link to={"/users/me"}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3" style={{ width: "36px", height: "36px" }}><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg></Link> 
                    : <Link to={"/auth/login"}><p style={{ color: "white" }}>로그인을 <br />진행해주세요.</p></Link>
                }
            </div>


            <div className="menu-item" style={{ paddingBottom: "40px" }}>
                <Link to={"/"} style={{fontSize:"25px", color:"white"}}>
                    홈
                </Link>
            </div>

            <div className="menu-item" style={{ paddingBottom: "40px" }}>
                <Link to={"/portfolio"} style={{fontSize:"25px", color:"white"}}>
                   포트폴리오
                </Link>
            </div>

            <div className="menu-item" style={{ paddingBottom: "40px" }}>
                <Link to={"/watchlist"} style={{fontSize:"25px", color:"white"}}>
                    관심종목
                </Link>
            </div>

            <div className="menu-item" style={{ paddingBottom: "40px" }}>
                <Link to={"/wallet"} style={{fontSize:"25px", color:"white"}}>
                   지갑
                </Link>
            </div>

            <div className="menu-item" style={{ paddingBottom: "40px" }}>
                <Link to={"/asset"} style={{fontSize:"25px", color:"white"}}>
                    거래소
                </Link>
            </div>


             <div className="menu-item" style={{ paddingBottom: "40px", margin:"0 auto" }}>
                 {
                    loginMember
                    ?
                    <button onClick={logout} style={{border:"none", backgroundColor: "transparent", color:"white", fontSize:"20px", width:"200px" }} >로그아웃</button>
                    : <button onClick={logout} style={{border:"none", backgroundColor: "transparent", color:"white", fontSize:"20px", width:"200px"}}>로그아웃</button>
                }
            </div>

            <div className="menu-item" style={{ paddingBottom: "40px" }}>
                <button onClick={close} style={{border:"none", backgroundColor: "transparent" }}>
                    <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960"  fill="#e3e3e3" style={{ width: "36px", height: "36px" }}><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                </button>
            </div>

        </div>
    );
}
