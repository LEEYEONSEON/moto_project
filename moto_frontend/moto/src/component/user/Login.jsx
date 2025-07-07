import { useEffect, useState } from "react";
import "./user.css";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import createInstance from "../../axios/Interceptor";
//로그인
export default function Login() {
    //부모 컴포넌트에게 전달받은 데이터 추출
    /*
    const setIsLogin = props.setIsLogin;
    const setLoginMember = props.setLoginMember;
    */

    //스토리지에 저장한 데이터 추출하기. 
    const {isLogined, setIsLogined, setLoginMember, setAccessToken, setRefreshToken, setKakaoMember, setTokenExpiresIn, setRefreshTokenExpiresIn} = useUserStore();


    useEffect(function(){
        if(!isLogined){ //외부에서 강제 로그아웃 시킨 경우
            setLoginMember(null);
        }
    },[]);


    //환경변수 파일에 저장된 변수 읽어오기
    const serverUrl = import.meta.env.VITE_BACK_SERVER;

    //인터셉터에서 커스터마이징한 axios Instance 사용하기
    const axiosInstance = createInstance();

    //로그인 입력 정보 저장 변수(서버 전송용)
    const [user, setUser] = useState({
        userId : "",
        userPassword : ""
    });

    //아이디, 비밀번호 입력 시, 동작 함수 (onChange)
    function chgUser(e){
        user[e.target.id] = e.target.value;
        setUser({...user});
    }

    //정상 로그인 시, 저장 변수
    /*
    아래 2개의 State 변수를 이용하여, HeaderLink 컴포넌트에서 메뉴를 다르게 그려주어야 함.
    하지만, Login(자식) => App (부모) 전달이 불가능. 컴포넌트간의 데이터 전달은 항상 단방향(부모 => 자식)만 가능.
    State 변수 선언을 App(부모)에서 선언하고, 자식 컴포넌트들에게 전달하는 방식으로 변경 (상태 끌어올리기)


    const [isLogin, setIsLogin] = useState(false);
    const [loginMember, setLoginMember] = useState({});
    */

    //정상 로그인 시, 컴포넌트 전환을 위함.
    const navigate = useNavigate();


   /**
   * 카카오 인가 코드 요청
   */
  function requestKakaoAuth() {
    window.location.href = `${serverUrl}/auth/oauth2/kakao/authorize`;
  }


      // ======================================
  // 1) 콜백 URL 에 코드가 있으면 자동 처리
  // ======================================
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  if (!code) return;

  axiosInstance
    .get(`${serverUrl}/auth/oauth2/kakao/callback`, { params: { code } })
    .then((response) => {
      const { resData: loginUser } = response.data;

      // 토큰 부분
      const { accessToken, refreshToken, expiresIn, refreshTokenExpiresIn } = loginUser.tokens;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setTokenExpiresIn(expiresIn);
      setRefreshTokenExpiresIn(refreshTokenExpiresIn);

      // 유저 정보
      setKakaoMember(loginUser.user);

      setIsLogined(true);
      navigate("/");
    })
    .catch((err) => {
      console.error("카카오 로그인 처리 중 오류:", err);
      Swal.fire("오류", "카카오 로그인에 실패했습니다.", "error");
    })
     .finally(() => {
        // 쿼리스트링만 제거하려면 현재 경로 기준 replace
        const cleanPath = window.location.pathname;
        window.history.replaceState(null, "", cleanPath);
    });
}, []);
    //로그인 요청
    function login(){
        if(user.userId == '' || user.userPassword == ''){
            Swal.fire({
                title : '알림',
                text : '아이디 또는 비밀번호를 입력하세요.',
                icon : 'warning',
                confirmButtonText : '확인'
            });

        }else{
            let options = {};
            options.url = serverUrl + '/user/login';
            options.method = 'post'; //로그인(일치하는 회원을 조회) == 조회 == GET == 로그인과 같은 민감한 정보일때에는 기존과 같이 POST로
            options.data = user;

            axiosInstance(options)
            .then(function(res){
                /*
                res.data                        == ResponseDTO
                res.data.resData                == LoginUser
                res.data.resData.user         == User
                res.data.resData.accessToken    == 요청시마다 헤더에 포함시킬 토큰
                res.data.resData.refreshToken   == accessToken 만료 시, 재발급 요청할 때 필요한 토큰

                */
                if(res.data.resData == null){
                    Swal.fire({
                        title : '알림',
                        text : res.data.clientMsg,
                        icon : res.data.alertIcon,
                        confirmButtonText : '확인'
                    });
                }else{
                    //정상 로그인 (State 변수 변경)
                    /*
                    setIsLogin(true);
                    setLoginMember(res.data.resData);
                    */

                    const loginMember = res.data.resData; //LoginUser 객체


                    //정상 로그인 (스토리지 데이터 변경)
                    setIsLogined(true);
                    setLoginMember(loginMember.user);
                
                    //스토리지에 토큰 저장
                    setAccessToken(loginMember.accessToken);
                    setRefreshToken(loginMember.refreshToken);


                    //Main 컴포넌트로 전환
                    navigate('/');
                }
                
            })
            .catch(function(err){
                console.log(err);
                Swal.fire({
                    title: '오류',
                    text: '로그인 요청 중 오류가 발생했습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
            });
        }
    }

    function kakaoLogin(){
        let options = {};
            // 백엔드 OAuth 컨트롤러의 인가 코드 엔드포인트
            const kakaoAuthUrl = `${serverUrl}/auth/oauth2/kakao/authorize`;
            options.method = 'post'; //로그인(일치하는 회원을 조회) == 조회 == GET == 로그인과 같은 민감한 정보일때에는 기존과 같이 POST로
            options.data = user;

            axiosInstance(options)
            .then(function(res){
                /*
                res.data                        == ResponseDTO
                res.data.resData                == LoginUser
                res.data.resData.user         == User
                res.data.resData.accessToken    == 요청시마다 헤더에 포함시킬 토큰
                res.data.resData.refreshToken   == accessToken 만료 시, 재발급 요청할 때 필요한 토큰

                */
                if(res.data.resData == null){
                    Swal.fire({
                        title : '알림',
                        text : res.data.clientMsg,
                        icon : res.data.alertIcon,
                        confirmButtonText : '확인'
                    });
                }else{
                    //정상 로그인 (State 변수 변경)
                    /*
                    setIsLogin(true);
                    setLoginMember(res.data.resData);
                    */

                    const loginMember = res.data.resData; //LoginMember 객체


                    //정상 로그인 (스토리지 데이터 변경)
                    setIsLogined(true);
                    setKakaoMember(loginMember.user);
                    //스토리지에 토큰 저장
                    setAccessToken(loginMember.accessToken);
                    setRefreshToken(loginMember.refreshToken);


                    //Main 컴포넌트로 전환
                    navigate('/');
                }
                
            })
            .catch(function(err){
                console.log(err);
                Swal.fire({
                    title: '오류',
                    text: '로그인 요청 중 오류가 발생했습니다.',
                    icon: 'error',
                    confirmButtonText: '확인'
                });
            });
    }
    /**
     * 카카오 인가 코드 요청 함수
     * 클릭 시 백엔드로 리디렉트하여 인가 코드(authorization code)를 요청합니다.
     */
    function requestKakaoAuth() {
        // 백엔드 OAuth 컨트롤러의 인가 코드 엔드포인트
        const kakaoAuthUrl = `${serverUrl}/auth/oauth2/kakao/authorize`;
        // 실제 리디렉트 수행
        window.location.href = kakaoAuthUrl; // 주석: 클라이언트를 해당 URL로 이동시켜 인가 코드를 요청
    }

    return (
        <section className="section login-wrap">
            <div className="page-title">로그인</div>
            <form autoComplete="off" onSubmit={function(e){
                e.preventDefault(); //form태그 기본 이벤트 제어
                login();            //로그인 요청 함수 호출
            }}>
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="userId">아이디</label>
                    </div>
                    <div className="input-item">
                        <input type="text"    id="userId" value={user.userId} onChange={chgUser}/>
                    </div>
                </div>
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="userPassword">비밀번호</label>
                    </div>
                    <div className="input-item">
                        <input type="password" id="userPassword" value={user.userPassword} onChange={chgUser}/>
                    </div>
                </div>
                <div className="login-button-box">
                    <button type="submit" className="btn-primary lg">
                        로그인
                    </button>
                </div>
            </form>
            {/* 카카오 소셜 로그인 버튼 추가 */}
            <div className="social-login">
                <img
                src="/images/kakao_login_medium_wide.png" // public 폴더에서 제공되는 이미지 경로
                alt="카카오 로그인 버튼"
                className="kakao-login-btn"
                onClick={requestKakaoAuth} // 주석: 버튼 클릭 시 카카오 OAuth 인가 코드 요청
                style={{ cursor: 'pointer' }}
                />
            </div>
        </section>
    );
}