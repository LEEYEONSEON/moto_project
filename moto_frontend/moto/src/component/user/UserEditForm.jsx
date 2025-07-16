import { useState, useEffect } from "react";
import createInstance from "../../axios/Interceptor"; // axios 인스턴스 생성 함수
import useUserStore from "../../store/useUserStore"; // 로그인 상태 관리 zustand store
import Swal from "sweetalert2"; // 알림 UI 라이브러리
import { useNavigate } from "react-router-dom"; // 라우팅 네비게이션 훅

export default function UserEditForm() {
  const axiosInstance = createInstance();
  const serverUrl = import.meta.env.VITE_BACK_SERVER; // 백엔드 서버 주소

  // zustand store에서 로그인 상태, 토큰, 유저정보 등 가져오기
  const {
    setIsLogined,
    setLoginMember,
    setAccessToken,
    setRefreshToken,
    loginMember,
    kakaoMember
  } = useUserStore();

  let member;

  if(loginMember){
    member = loginMember;
  }else if(kakaoMember){
    member = kakaoMember;
  }else{
    member = null;
  }

  // 유저 정보 (userId, userNo, userPassword)
  // userPassword는 입력된 비밀번호를 담는 용도
  const [user, setUser] = useState(null);

  // 기존 비밀번호 확인 후 true면 새 비밀번호 입력 폼 표시
  const [isAuth, setIsAuth] = useState(false);

  // 새 비밀번호 확인용 입력값
  const [userPwRe, setUserPwRe] = useState("");

  // 비밀번호 상태 코드 관리
  // 0: 초기, 1: 유효, 2: 형식 오류 또는 기존 비밀번호 불일치, 
  // 3: 새 비밀번호와 확인값 불일치, 4: 새 비밀번호가 기존 비밀번호와 동일
  const [pwChk, setPwChk] = useState(0);

  // 기존 비밀번호 저장 (서버 인증 후 저장)
  const [originalPw, setOriginalPw] = useState("");

  // 페이지 이동용 navigate
  const navigate = useNavigate();

  // 로그인 멤버가 변경될 때마다 user 상태 초기화
  useEffect(function () {
    if (member) {
      setUser({
        userId: member.userId,
        userNo: member.userNo,
        userPassword: "" // 비밀번호는 빈 문자열로 초기화
      });
    }
  }, [member]);

  // user가 준비되지 않았으면 렌더링하지 않음
  if (!user) return null;

  // 비밀번호 입력값 변경 핸들러
  function chgUserPw(e) {
    const newUser = { ...user, [e.target.id] : e.target.value };
    setUser(newUser);
  }

  // 새 비밀번호 확인 입력값 변경 핸들러
  function chgUserPwRe(e) {
    setUserPwRe(e.target.value);
  }

  // 기존 비밀번호 서버 인증 요청 함수
  function checkPw() {
    const options = {
      url: serverUrl + "/user/checkPw",
      method: "post",
      data: user
    };

    axiosInstance(options)
      .then(function (res) {
        if (res.data.resData) {
          // 인증 성공 시 기존 비밀번호 저장 및 새 비밀번호 입력폼 표시
          setOriginalPw(user.userPassword);
          setIsAuth(true);
          setUser(function (prev) {
            return { ...prev, userPassword: "" }; // 입력값 초기화
          });
          setPwChk(0); // 비밀번호 상태 초기화
        } else {
          Swal.fire("실패", "비밀번호가 일치하지 않습니다.", "error");
          setPwChk(2); // 비밀번호 불일치 상태 설정
        }
      })
      .catch(console.error);
  }

  // 새 비밀번호 서버 업데이트 요청 함수
  function updatePw() {
    // 비밀번호 정규표현식: 영문, 숫자, 특수문자 포함 6~30자
    const regExp = /^[a-zA-Z0-9!@#$]{6,30}$/;

    // 새 비밀번호가 기존 비밀번호와 같으면 오류 처리
    if (user.userPassword === originalPw) {
      setPwChk(4);
      Swal.fire("알림", "기존 비밀번호와 다른 비밀번호를 입력해주세요.", "warning");
      return;
    }

    // 비밀번호 정규식 검사 실패 시 오류 처리
    if (!regExp.test(user.userPassword)) {
      setPwChk(2);
      Swal.fire("알림", "비밀번호는 영어, 숫자, 특수문자(!,@,#,$)로 이루어진 6~30글자를 입력하세요.", "warning");
      return;
    }

    // 새 비밀번호 확인값이 없거나 일치하지 않으면 오류 처리
    if (userPwRe === "" || userPwRe !== user.userPassword) {
      setPwChk(3);
      Swal.fire("알림", "비밀번호가 일치하지 않습니다.", "warning");
      return;
    }

    setPwChk(0); // 문제 없으면 상태 초기화

    const options = {
      url: serverUrl + "/user/updatePassword",
      method: "patch",
      data: user
    };

    axiosInstance(options)
      .then(function (res) {
        if (res.data.resData) {
          Swal.fire("성공", "비밀번호가 변경되었습니다. 다시 로그인 해주세요.", "success");
          // 로그아웃 처리 및 토큰 삭제
          setIsLogined(false);
          setLoginMember(null);
          setAccessToken(null);
          setRefreshToken(null);
          // 로그인 페이지로 이동
          navigate("/login");
        }
      })
      .catch(function (err) {
        Swal.fire("에러", "비밀번호 변경 중 오류가 발생했습니다.", "error");
        console.error(err);
      });
  }

  return (
    <section className="section pwChg-section">
      <div className="page-title" id="pwChg-title">비밀번호 변경</div>
      <form
        onSubmit={function (e) {
          e.preventDefault();
          // 기존 비밀번호 인증 후 새 비밀번호 폼으로 넘어가면 updatePw 실행
          // 아니면 checkPw 실행
          if (isAuth) {
            updatePw();
          } else {
            checkPw();
          }
        }}
      >
        {isAuth ? (
          <>
            <div className="input-wrap">
              <div className="input-title">
                <label htmlFor="userPassword">새 비밀번호 입력</label>
              </div>
              <div className="input-item pwChg-wrap">
                <input
                  type="password"
                  id="userPassword"
                  value={user.userPassword}
                  onChange={chgUserPw}
                  onBlur={function () {
                    const regExp = /^[a-zA-Z0-9!@#$]{6,30}$/;
                    if (!regExp.test(user.userPassword)) {
                      setPwChk(2); // 형식 오류
                    } else if (user.userPassword === originalPw) {
                      setPwChk(4); // 기존 비밀번호와 동일 오류
                    } else {
                      setPwChk(1); // 유효한 비밀번호
                    }
                  }}
                />
              </div>
              <p
                className={
                  "input-msg" +
                  (pwChk === 2 || pwChk === 4
                    ? " invalid"
                    : pwChk === 1
                    ? " valid"
                    : "")
                }
              >
                {pwChk === 2 &&
                  "비밀번호는 영어, 숫자, 특수문자(!,@,#,$)를 포함한 6~30자여야 합니다."}
                {pwChk === 4 && "기존 비밀번호와 다른 비밀번호를 입력해주세요."}
              </p>
            </div>

            <div className="input-wrap pwChg-wrap">
              <div className="input-title">
                <label htmlFor="userPwRe">새 비밀번호 확인</label>
              </div>
              <div className="input-item">
                <input
                  type="password"
                  id="userPwRe"
                  value={userPwRe}
                  onChange={chgUserPwRe}
                  onBlur={function () {
                    // 새 비밀번호 확인 불일치 체크
                    if (userPwRe !== user.userPassword) {
                      setPwChk(3); // 불일치 오류
                    } else {
                      if (pwChk !== 4) {
                        setPwChk(0); // 오류 없을 시 상태 초기화 (단 기존 비밀번호 동일 오류는 유지)
                      }
                    }
                  }}
                />
              </div>
              <p className={"input-msg" + (pwChk === 3 ? " invalid" : "")}>
                {pwChk === 3 && "비밀번호와 비밀번호 확인값이 일치하지 않습니다."}
              </p>
            </div>
          </>
        ) : (
          // 기존 비밀번호 입력 폼 (인증 전)
          <div className="input-wrap pwChg-wrap">
            <div className="input-title">
              <label htmlFor="userPassword">기존 비밀번호 입력</label>
            </div>
            <div className="input-item pwChg">
              <input
                type="password"
                id="userPassword"
                value={user.userPassword}
                onChange={chgUserPw}
                onBlur={function () {
                  const regExp = /^[a-zA-Z0-9!@#$]{6,30}$/;
                  if (!regExp.test(user.userPassword)) {
                    setPwChk(2); // 형식 오류
                  } else {
                    // 서버에 기존 비밀번호 일치 여부 확인 요청
                    let options = {
                      url: serverUrl + "/user/checkPw",
                      method: "post",
                      data: user
                    };
                    axiosInstance(options)
                      .then(function (res) {
                        if (!res.data.resData) {
                          setPwChk(2); // 기존 비밀번호 불일치 오류
                        } else {
                          setPwChk(0); // 정상 상태
                        }
                      })
                      .catch(console.error);
                  }
                }}
              />
            </div>
            <p className={"input-msg" + ((pwChk === 4 || pwChk === 2) ? " invalid" : "")}>
              {pwChk === 4
                ? "기존 비밀번호와 다른 비밀번호를 입력해주세요."
                : pwChk === 2
                ? "기존 비밀번호가 일치하지 않습니다."
                : ""}
            </p>
          </div>
        )}
        <div className="join-button-box">
          <button type="submit" className="btn-primary lg">
            {isAuth ? "변경하기" : "확인"}
          </button>
        </div>
      </form>
    </section>
  );
}
