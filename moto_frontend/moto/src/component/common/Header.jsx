import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";

//화면 상단 헤더
export default function Header () {
    /*
    //부모 컴포넌트에게 전달받은 데이터 추출
    const isLogin = props.isLogin;
    const loginMember = props.loginMember;

    //로그아웃 처리를 위해, 전달받은 데이터 추출
    const setIsLogin = props.setIsLogin;
    const setLoginMember = props.setLoginMember;
    */

    return (
        <header className="header">
            <div>
                <div className="logo">
                    <Link to="/">MoTo</Link>
                </div>
                <MainNavi />
                <HeaderLink />
            </div>
        </header>
    );
}

//헤더 중앙 메뉴
function MainNavi () {
    return (
        <nav className="searchWindow">
            <div>
                <input type="text" placeholder="종목을 검색하세요"></input>
            </div>
        </nav>
    );
}

//헤더 우측 메뉴
function HeaderLink () {
    /*
    //Header 컴포넌트에게 전달 받은 데이터 추출
    const isLogin = props.isLogin; //isLogin ? 로그인 된 상태 : 로그인이 안된 상태
    const loginMember = props.loginMember;

    //로그아웃을 위해 전달받은 데이터 추출
    const setIsLogin = props.setIsLogin;
    const setLoginMember = props.setLoginMember;
    */

    const {isLogined, setIsLogined, loginMember, setLoginMember, setAccessToken, setRefreshToken} = useUserStore();

    const navigate = useNavigate();

    //로그아웃 Link 클릭 시, 동작 함수
    function logout(e){
        //기본 이벤트 제어
        e.preventDefault();
        /*
        setIsLogin(false);
        setLoginMember(null);
        */

        setIsLogined(false);
        setAccessToken(null);
        setRefreshToken(null);

        navigate('/login');
    }


    return (
        <ul className="user-menu">
             {
                isLogined ?
                <>
                    <li>
                        <Link to="/member">{loginMember.memberId}</Link>
                    </li>
                    <li>
                        <Link to="/logout" onClick={logout}>로그아웃</Link>
                    </li>                
                </>
                :
                <>
                    <li>
                        <Link to="/login">로그인</Link>
                    </li>
                    <li>
                        <Link to="/join">회원가입</Link>
                    </li>
                </>
             }
        </ul>
    );
}