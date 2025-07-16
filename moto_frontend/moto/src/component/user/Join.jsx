import { useState } from "react";
import "./user.css";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";

//회원가입
//아이디, 닉네임, 이메일, 비번 입력받아 회원가입하기 
export default function Join() {
    //.env에 저장된 환경변수 값 읽어오기
    const serverUrl = import.meta.env.VITE_BACK_SERVER; //http://localhost:9999

    //인터셉터에서 커스터마이징한 axios Instance 사용하기
    const axiosInstance = createInstance();

    //각 입력 값 변경 시, 저장 변수(서버 전송용)
    const [user, setUser] = useState({
        userId : "",
        userNickname : "",
        userEmail : "",
        userPassword : "",
    });

    //아이디, 닉네임, 이메일, 비번 호출 함수
    function chgUser(e){
        user[e.target.id] = e.target.value;  //사용자 입력값 State 변수에 할당.
        setUser({...user});                //State 변수 복사 및 전달하여 리랜더링 유도
    }

    //비밀번호 확인 값 변경 시, 저장 변수 (서버 전송 X. 화면에서 처리를 위함)
    const [userPwRe, setUserPwRe] = useState('');
    //비밀번호 확인 값 onChange 호출 함수
    function chgUserPwRe(e){
        setUserPwRe(e.target.value);
    }


    /* 아이디 유효성 체크 결과, 중복체크 결과를 저장할 변수
    0 : 검증 이전 상태
    1 : 회원가입 가능한 상태(유효성 검증 통과 && 중복체크 통과)
    2 : 유효성 체크 실패
    3 : 중복된 아이디가 존재하는 경우
    */
    const [idChk, setIdChk] = useState(0);
    //아이디 입력 후, 포커스를 잃었을 때 호출함수 (onBlur)
    function checkUserId(e){
        //아이디 정규 표현식
        const regExp = /^[a-zA-Z0-9]{8,20}$/;

        if(!regExp.test(user.userId)){
            //유효성 검증 실패인 경우
            setIdChk(2);
        }else{
            //유효성 검증 성공인 경우 => DB에 중복된 아이디 존재하는지 체크하기 위해, 서버에 아이디 전달하며 중복체크 요청
            let options = {};
            options.url = serverUrl + '/user/' + user.userId + '/chkId';
            options.method = 'get'; //조회 == GET

            axiosInstance(options)
            .then(function(res){
                //res.data == ResponseDTO
                //res.data.resData == count == 중복체크 결과
                if(res.data.resData == 1){
                    //중복된 아이디가 존재하는 경우
                    setIdChk(3);
                }else if(res.data.resData == 0){
                    //중복된 아이디가 존재하지 않는 경우
                    setIdChk(1);
                }
            })
            .catch(function(err){

            });

        }
    }

    //이메일 유효성 검사
    // 이메일 유효성 결과 상태 (0: 미검사, 1: 유효, 2: 유효하지 않음)
    const [emailChk, setEmailChk] = useState(0);

    //이메일 유효성 + 중복 체크 함수
    function checkUserEmail() {
        const regExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regExp.test(user.userEmail)) {
            // 형식 오류
            setEmailChk(2);
            return;
        }

        // 형식이 유효할 경우 → 서버 중복체크 요청
        let options = {};
        options.url = serverUrl + '/user/' + encodeURIComponent(user.userEmail) + '/chkEmail';
        options.method = 'get';

        axiosInstance(options)
            .then(function (res) {
                // res.data.resData: 0 (사용 가능), 1 (중복됨)
                if (res.data.resData === 0) {
                    setEmailChk(1); // 사용 가능
                } else {
                    setEmailChk(3); // 중복된 이메일
                }
            })
            .catch(function (err) {

            });
    }

    /* 비밀번호 검증 결과 저장 변수
       0 : 검사 이전 상태
       1 : 유효성 체크 통과 && 비밀번호 확인값 일치
       2 : 유효성 체크 실패
       3 : 비밀번호 확인값 불일치
    */
    const [pwChk, setPwChk] = useState(0);

    //비밀번호, 비밀번호 확인 값 onBlur 함수
    function chkUserPw(e){
        //비밀번호 정규 표현식
        const regExp = /^[a-zA-Z0-9!@#$]{6,30}$/; //영어 대/소문자, 특수문자, 숫자 6~30글자

        if(e.target.id == 'userPassword'){ //비밀번호 입력

            if(!regExp.test(e.target.value)){
                //비밀번호 유효성 체크 실패
                setPwChk(2);
            }else if(userPwRe != ''){ //비밀번호 확인 입력된 경우

                if(e.target.value == userPwRe){ //비밀번호 == 비밀번호 확인
                    setPwChk(1);
                }else{
                    setPwChk(3);
                }
            }else{ //비밀번호는 유효성 검증 통과 && 비밀번호 확인이 입력되지 않은 경우
                setPwChk(3);
            }


        }else { //비밀번호 확인 입력 
            if(user.userPassword == e.target.value) { //비밀번호 == 비밀번호 확인

                if(regExp.test(user.userPassword)){ //비밀번호 유효성 검증 통과
                    setPwChk(1);
                }
            }else { //비밀번호와 확인값 불일치
                setPwChk(3);
            }
        }
    }

    
    //회원가입 정상 처리 후, 컴포넌트 전환을 위함.
    const navigate = useNavigate();

    //회원가입 처리 함수
    function join() {
    const errors = [];

    if (idChk !== 1) {
        if (idChk === 0) {
            errors.push("아이디 유효성 검사를 완료해주세요.");
        } else if (idChk === 2) {
            errors.push("아이디는 영문 대소문자 및 숫자로 8~20자여야 합니다.");
        } else if (idChk === 3) {
            errors.push("이미 사용 중인 아이디입니다.");
        }
    }

    else if (pwChk !== 1) {
        if (pwChk === 0) {
            errors.push("비밀번호와 확인값을 입력하고 검증을 완료해주세요.");
        } else if (pwChk === 2) {
            errors.push("비밀번호는 영어, 숫자, 특수문자로 6~30자여야 합니다.");
        } else if (pwChk === 3) {
            errors.push("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        }
    }

    else if (emailChk !== 1) {
        if (emailChk === 0) {
            errors.push("이메일 유효성 검사를 완료해주세요.");
        } else if (emailChk === 2) {
            errors.push("이메일 형식이 올바르지 않습니다.");
        } else if (emailChk === 3) {
            errors.push("이미 사용 중인 이메일입니다.");
        }
    }

    else if (user.userNickname.trim() === "") {
        errors.push("닉네임을 입력해주세요.");
    }

    // 에러 메시지 출력
    if (errors.length > 0) {
        Swal.fire({
            title: "입력 오류",
            html: errors.map(e => `<div style="text-align:left;">• ${e}</div>`).join(""),
            icon: "warning",
            confirmButtonText: "확인"
        });
        return;
    }

    // 모든 입력이 유효할 때 회원가입 요청
    const options = {
        url: serverUrl + '/user',
        method: 'post',
        data: user
    };

    axiosInstance(options)
        .then(function(res) {
            Swal.fire({
                title: '알림',
                text: res.data.clientMsg,
                icon: res.data.alertIcon,
                confirmButtonText: '확인'
            })
            .then(function(result) {
                if (res.data.resData) {
                    navigate('/login');
                }
            });
        })
        .catch(function(err) {

        });
}

    return (
        <section className="section join-wrap">
            <div>
            <div className="page-title">회원가입</div>
            <form onSubmit={function(e){
                e.preventDefault();    //기본 submit 이벤트 제어
                join();                //회원가입 처리 함수 호출
            }}>
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="userId">아이디</label>
                    </div>
                    <div className="input-item">
                        <input type="text" id="userId" value={user.userId} onChange={chgUser} onBlur={checkUserId}/>
                    </div>
                    <p className={"input-msg" + (idChk == 0 ? '' : idChk == 1 ? ' valid' : ' invalid')}>
                        {
                        idChk == 0
                        ? ''
                            : idChk == 1
                                ? '사용 가능한 아이디입니다.'
                                    : idChk == 2
                                        ? '아이디는 영어 대/소문자 8~20글자 입니다.'
                                            : '이미 사용중인 아이디입니다.'
                        }
                    </p>
                </div>
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="userPassword">비밀번호</label>
                    </div>
                    <div className="input-item">
                        <input type="password" id="userPassword" value={user.userPassword} onChange={chgUser} onBlur={chkUserPw}/>
                    </div>
                </div>
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="userPwRe">비밀번호 확인</label>
                    </div>
                    <div className="input-item">
                        <input type="password" id="userPwRe" value={userPwRe} onChange={chgUserPwRe} onBlur={chkUserPw}/>
                    </div>
                    <p className={"input-msg" + (pwChk == 0 ? '' : pwChk == 1 ? ' valid' : ' invalid')}>
                        {
                        pwChk == 0 
                        ? ''
                            : pwChk == 1
                                ? '비밀번호가 정상 입력되었습니다.'
                                    : pwChk == 2
                                        ? '비밀번호는 영어, 숫자, 특수문자로 6~30글자를 입력하세요.'
                                            : '비밀번호와 비밀번호 확인값이 일치하지 않습니다.'
                        }
                    </p>
                </div>
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="userNickname">닉네임</label>
                    </div>
                    <div className="input-item">
                        <input type="text" id="userNickname" value={user.userNickname} onChange={chgUser}/>
                    </div>
                </div>
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="userEmail">이메일</label>
                    </div>
                    <div className="input-item">
                        <input type="email" id="userEmail" value={user.userEmail} onChange={chgUser} onBlur={checkUserEmail}/>
                    </div>
                    <p className={"input-msg" + (emailChk === 0 ? '' : emailChk === 1 ? ' valid' : ' invalid')}>
                    {
                        emailChk === 0
                        ? ''
                        : emailChk === 1
                            ? '사용 가능한 이메일입니다.'
                            : emailChk === 2
                                ? '이메일 형식이 올바르지 않습니다.'
                                : '이미 사용 중인 이메일입니다.'
                    }
                    </p>
                </div>
                <div className="join-button-box">
                    <button type="submit" className="btn-primary lg join-button">
                        회원가입
                    </button>
                </div>
            </form>
            </div>
        </section>
    );
}