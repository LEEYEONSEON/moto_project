import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function UserInfo({ loginType }) {
  const [user, setUser] = useState({
    userId: "",
    nickname: "",
    email: "",
    userLevel: "",
    profileImage: ""
  });

  const serverUrl = import.meta.env.VITE_BACK_SERVER;
  const axiosInstance = createInstance();
  const { loginUser, setLoginUser } = useUserStore(); // 로그인 정보도 user 관련 변수명으로 변경해주세요

  const navigate = useNavigate();

  useEffect(() => {
    if (!loginUser) return;

    const options = {
      url: `${serverUrl}/user/${loginUser.userId}`,
      method: "get",
    };

    axiosInstance(options)
      .then((res) => {
        if (res.data.resData != null) {
          setUser(res.data.resData);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [loginUser]);

  function onChangeUser(e) {
    if (loginType === "social") return; // 소셜 로그인은 수정 불가

    const { id, value } = e.target;
    setUser((prev) => ({ ...prev, [id]: value }));
  }

  function updateUser() {
    if (loginType === "social") {
      Swal.fire("알림", "소셜 로그인 사용자는 정보를 수정할 수 없습니다.", "info");
      return;
    }

    Swal.fire({
      title: "알림",
      text: "회원 정보를 수정하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "수정하기",
      cancelButtonText: "취소",
    }).then((res) => {
      if (res.isConfirmed) {
        const options = {
          url: `${serverUrl}/user`,
          method: "patch",
          data: user,
        };

        axiosInstance(options)
          .then((res) => {
            if (res.data.resData) {
              setLoginUser(res.data.resData);
              Swal.fire("완료", "회원 정보가 수정되었습니다.", "success");
            }
          })
          .catch((err) => {
            console.error(err);
            Swal.fire("오류", "정보 수정에 실패했습니다.", "error");
          });
      }
    });
  }

  return (
    <section className="section user-info-section">
      <div className="page-title">내 정보</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateUser();
        }}
      >
        <table className="tbl my-info" style={{ width: "80%", margin: "0 auto" }}>
          <tbody>
            {loginType === "normal" && (
              <tr>
                <th style={{ width: "20%" }}>아이디</th>
                <td className="left">{user.userId}</td>
              </tr>
            )}

            <tr>
              <th>
                <label htmlFor="nickname">닉네임</label>
              </th>
              <td className="left">
                <div className="input-item">
                  <input
                    type="text"
                    id="nickname"
                    value={user.nickname || ""}
                    onChange={onChangeUser}
                    disabled={loginType === "social"}
                  />
                </div>
              </td>
            </tr>

            <tr>
              <th>
                <label htmlFor="email">이메일</label>
              </th>
              <td className="left">
                <div className="input-item">
                  <input
                    type="email"
                    id="email"
                    value={user.email || ""}
                    onChange={onChangeUser}
                    disabled={loginType === "social"}
                  />
                </div>
              </td>
            </tr>

            <tr>
              <th>회원등급</th>
              <td className="left">{user.userLevel == 1 ? "관리자" : "일반회원"}</td>
            </tr>

            {loginType === "social" && user.profileImage && (
              <tr>
                <th>프로필 이미지</th>
                <td className="left">
                  <img
                    src={user.profileImage}
                    alt="프로필 이미지"
                    style={{ width: 80, height: 80, borderRadius: "50%" }}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="button-zone" style={{ marginTop: 20 }}>
          {loginType === "normal" && (
            <>
              <button type="submit" className="btn-primary lg">
                정보수정
              </button>
              <button
                type="button"
                className="btn-secondary lg"
                onClick={() => navigate("/user/pwChg")}
              >
                비밀번호 변경
              </button>
            </>
          )}
        </div>
      </form>
    </section>
  );
}
