import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import createInstance from "../../axios/Interceptor";

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
    const axiosInstance = createInstance();
    //환경변수 파일에 저장된 변수 읽어오기
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    /*
    //Header 컴포넌트에게 전달 받은 데이터 추출
    const isLogin = props.isLogin; //isLogin ? 로그인 된 상태 : 로그인이 안된 상태
    const loginMember = props.loginMember;

    //로그아웃을 위해 전달받은 데이터 추출
    const setIsLogin = props.setIsLogin;
    const setLoginMember = props.setLoginMember;
    */

    const {isLogined, setIsLogined, loginMember, kakaoMember, setLoginMember, setAccessToken, setRefreshToken, setKakaoMember, setTokenExpiresIn, setRefreshTokenExpiresIn} = useUserStore();
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
        setLoginMember(null);
        navigate('/login');
    }
    function requestKakaoLogout(e){
        e.preventDefault();

        window.location.href = `${serverUrl}/auth/oauth2/kakao/logout`;
    }

    function kakaoTest(e){
        e.preventDefault();
        let options = {};
        options.url = serverUrl + '/user/kakao/test';
        options.method = 'post'; //로그인(일치하는 회원을 조회) == 조회 == GET == 로그인과 같은 민감한 정보일때에는 기존과 같이 POST로
        options.data = kakaoMember;

        axiosInstance(options)
        .then(function(res){
            /*
            res.data                        == ResponseDTO
            res.data.resData                == LoginUser
            res.data.resData.user         == User
            res.data.resData.accessToken    == 요청시마다 헤더에 포함시킬 토큰
            res.data.resData.refreshToken   == accessToken 만료 시, 재발급 요청할 때 필요한 토큰

            */

            if(res.data.resData == null){}});
    }
    function localTest(e){
        e.preventDefault();
        let options = {};
        options.url = serverUrl + '/user/local/test';
        options.method = 'post'; //로그인(일치하는 회원을 조회) == 조회 == GET == 로그인과 같은 민감한 정보일때에는 기존과 같이 POST로
        options.data = loginMember;

        axiosInstance(options)
        .then(function(res){
            /*
            res.data                        == ResponseDTO
            res.data.resData                == LoginUser
            res.data.resData.user         == User
            res.data.resData.accessToken    == 요청시마다 헤더에 포함시킬 토큰
            res.data.resData.refreshToken   == accessToken 만료 시, 재발급 요청할 때 필요한 토큰

            */

            if(res.data.resData == null){}});
    }




    return (
        <ul className="user-menu" >
            {isLogined ? (
            <>
                {loginMember ? (
                    <>
                        <li>
                        <Link to="/users/me">{loginMember.userId}</Link>
                        </li>
                        <li>
                        <a href="#" onClick={logout}>로그아웃</a>
                        
                        </li>
                        <li>
                        <a href="#" onClick={localTest}>localJwtTest</a>
                        </li>
                        {loginMember.userRole == 1
                        ? <li><Link to="/admin">관리자페이지</Link></li>
                        :""}
                    </>
                    ) : (
                    <>
                        <li>
                        <Link to="/member">{kakaoMember.userId}</Link>
                        </li>
                        <li>
                        <a href="#" onClick={requestKakaoLogout}>로그아웃</a>
                        
                        </li>
                        <li>
                        <a href="#" onClick={kakaoTest}>kakaoJwtTest</a>
                        </li>
                    </>
                    )}
                
            </>
            ) : (
            <>
                
                <li><Link to="/login">로그인</Link></li>
                <li><Link to="/join">회원가입</Link></li>
            </>
            )}
        </ul>
    );
}