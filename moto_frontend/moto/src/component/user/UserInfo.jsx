import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function UserInfo() {
  const [member, setMember] = useState({
    userNo: "",
    userId: "",
    userNickname: "",
    userEmail: "",
    userRole: "2",  
    userProfileImg: ""
  });

  const serverUrl = import.meta.env.VITE_BACK_SERVER;
  const axiosInstance = createInstance();
  const {loginMember, setLoginMember, setIsLogined, setAccessToken, setRefreshToken} = useUserStore();

  const userNo = loginMember.userNo;

  const navigate = useNavigate();

  
  useEffect(function () {
    if (!loginMember || !loginMember.userNo) {
      console.log("로그인 정보가 없거나 user_no가 없습니다.");
      return;
    }
    console.log(userNo);
    let options = {};
    options.url = serverUrl + "/user/" + loginMember.userNo; 
    options.method = "get"; 

    axiosInstance(options)
      .then(function (res) {
        if (res.data.resData != null) {
          setMember(res.data.resData); 
        }
      })
      .catch(function (err) {
        console.error("회원 정보 요청 오류:", err);
      });
  }, []);

  function updateMember() {
    Swal.fire({
      title: "알림",
      text: "회원 정보를 수정하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "수정하기",
      cancelButtonText: "취소"
    }).then(function (res) {
      if (res.isConfirmed) {
        let options = {};
        options.url = serverUrl + "/member"; 
        options.method = "patch"; 
        options.data = member; 

        axiosInstance(options)
          .then(function (res) {
            if (res.data.resData) {
              Swal.fire("성공", "회원 정보가 수정되었습니다.", "success");
              setLoginMember(res.data.resData);  
            }
          })
          .catch(function (err) {
            console.error(err);
            Swal.fire("오류", "회원 정보 수정 중 오류가 발생했습니다.", "error");
          });
      }
    });
  }

  function deleteMember() {
    Swal.fire({
      title: "알림",
      text: "회원을 탈퇴 하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "탈퇴하기",
      cancelButtonText: "취소"
    }).then(function (res) {
      if (res.isConfirmed) {
        let options = {};
        options.url = serverUrl + "/member/" + loginMember.user_no;
        options.method = "delete"; 

        axiosInstance(options)
          .then(function (res) {
            if (res.data.resData) {
              setIsLogined(false);
              setLoginMember(null);
              setAccessToken(null);
              setRefreshToken(null);

              if (axiosInstance.defaults.headers.common["Authorization"]) {
                delete axiosInstance.defaults.headers.common["Authorization"];
              }

              Swal.fire("완료", "회원 탈퇴가 완료되었습니다.", "success");
              navigate("/login");
            }
          })
          .catch(function (err) {
            console.error(err);
            Swal.fire("오류", "회원 탈퇴 중 오류가 발생했습니다.", "error");
          });
      }
    });
  }

  return (
    <section className="section member-info-section">
      <div className="page-title">내 정보</div>
      <form
        onSubmit={function (e) {
          e.preventDefault();
          updateMember();
        }}
      >
        <table className="tbl my-info" style={{ width: "80%", margin: "0 auto" }}>
          <tbody>
            <tr>
              <th>
                <label htmlFor="user_id">아이디</label>
              </th>
              <td className="left">
                <div className="input-item">
                  <input
                    type="text"
                    id="user_id"
                    value={member.user_id || ""}
                    readOnly
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor="user_nickname">닉네임</label>
              </th>
              <td className="left">
                <div className="input-item">
                  <input
                    type="text"
                    id="user_nickname"
                    value={member.user_nickname || ""}
                    onChange={function (e) {
                      const updatedMember = { ...member };
                      updatedMember.user_nickname = e.target.value;
                      setMember(updatedMember);
                    }}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor="user_email">이메일</label>
              </th>
              <td className="left">
                <div className="input-item">
                  <input
                    type="email"
                    id="user_email"
                    value={member.user_email || ""}
                    onChange={function (e) {
                      const updatedMember = { ...member };
                      updatedMember.user_email = e.target.value;
                      setMember(updatedMember);
                    }}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor="user_profile_img">프로필 이미지</label>
              </th>
              <td className="left">
                <div className="input-item">
                  <input
                    type="file"
                    id="user_profile_img"
                    accept="image/*"
                    onChange={function (e) {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = function () {
                          const updatedMember = { ...member };
                          updatedMember.user_profile_img = reader.result;
                          setMember(updatedMember);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
                {member.user_profile_img && (
                  <div className="profile-img-preview">
                    <img
                      src={member.user_profile_img}
                      alt="Profile Preview"
                      style={{ maxWidth: "150px", maxHeight: "150px" }}
                    />
                  </div>
                )}
              </td>
            </tr>
            <tr>
              <th>회원등급</th>
              <td className="left">
                {member.user_role === "1" ? "관리자" : member.user_role === "3" ? "정지" : "일반회원"}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="button-zone" style={{ marginTop: "20px" }}>
          <button type="submit" className="btn-primary lg">
            정보수정
          </button>
          <button
            type="button"
            className="btn-secondary lg"
            style={{ marginLeft: "10px" }}
            onClick={deleteMember}>회원탈퇴</button>
        </div>
      </form>
    </section>
  );
}
