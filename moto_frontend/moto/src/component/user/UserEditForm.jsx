import { useState } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function UserEditForm() {
  const axiosInstance = createInstance();
  const serverUrl = import.meta.env.VITE_BACK_SERVER;

  const { setIsLogined,setLoginMember, setAccessToken, setRefreshToken, loginMember} = useUserStore();

  const [member, setMember] = useState({
    memberId: loginMember.memberId,
    memberPw: ""
  });

  const [isAuth, setIsAuth] = useState(false);
  const [memberPwRe, setMemberPwRe] = useState("");
  const navigate = useNavigate();

  function chgMemberPw(e) {
    member[e.target.name] = e.target.value;
    setMember({ ...member });
  }

  function chgMemberPwRe(e) {
    setMemberPwRe(e.target.value);
  }

  function checkPw() {
    let options = {};
    options.url = serverUrl + "/member/checkPw";
    options.method = "post";
    options.data = member;

    axiosInstance(options)
      .then(function(res) {
        if (res.data.resData) {
          setIsAuth(true);
          member.memberPw = "";
          setMember({ ...member });
        } else {
          Swal.fire("실패", "비밀번호가 일치하지 않습니다.", "error");
        }
      })
      .catch(function(err) {
        console.error(err);
      });
  }

  function updatePw() {
    let regExp = /^[a-zA-Z0-9!@#$]{6,30}$/;

    if (!regExp.test(member.memberPw)) {
      Swal.fire({
        title: "알림",
        text: "비밀번호는 영어, 숫자, 특수문자(!,@,#,$)로 이루어진 6~30글자를 입력하세요.",
        icon: "warning",
        confirmButtonText: "확인"
      });
      return;
    }

    if (memberPwRe === "" || memberPwRe !== member.memberPw) {
      Swal.fire({
        title: "알림",
        text: "비밀번호가 일치하지 않습니다.",
        icon: "warning",
        confirmButtonText: "확인"
      });
      return;
    }

    let options = {};
    options.url = serverUrl + "/member/memberPw";
    options.method = "patch";
    options.data = member;

    axiosInstance(options)
      .then(function(res) {
        if (res.data.resData) {
          setIsLogined(false);
          setLoginMember(null);
          setAccessToken(null);
          setRefreshToken(null);

          navigate("/login");
        }
      })
      .catch(function(err) {
        console.error(err);
      });
  }

  return (
    <section className="section pwChg-section">
      <div className="page-title">비밀번호 변경</div>
      <div style={{ width: "60%", margin: "0 auto" }}>
        {isAuth ? (
          <>
            <div className="input-wrap" style={{ marginBottom: "50px" }}>
              <div className="input-title">
                <label htmlFor="newPw">새 비밀번호 입력</label>
              </div>
              <div className="input-item">
                <input
                  type="password"
                  id="newPw"
                  name="memberPw"
                  value={member.memberPw}
                  onChange={chgMemberPw}
                />
              </div>
            </div>
            <div className="input-wrap">
              <div className="input-title">
                <label htmlFor="newPwRe">새 비밀번호 확인</label>
              </div>
              <div className="input-item">
                <input
                  type="password"
                  id="newPwRe"
                  value={memberPwRe}
                  onChange={chgMemberPwRe}
                />
              </div>
            </div>
            <div className="button-zone">
              <button type="button" className="btn-primary lg" onClick={updatePw}>
                변경하기
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="input-wrap">
              <div className="input-title">
                <label htmlFor="oldPw">기존 비밀번호 입력</label>
              </div>
              <div className="input-item">
                <input
                  type="password"
                  id="oldPw"
                  name="memberPw"
                  value={member.memberPw}
                  onChange={chgMemberPw}
                />
              </div>
            </div>
            <div className="button-zone">
              <button type="button" className="btn-primary lg" onClick={checkPw}>
                확인
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
