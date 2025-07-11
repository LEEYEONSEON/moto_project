import { useEffect, useRef, useState } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function UserInfo() {
  const [user, setUser] = useState({
    userNo: 0,
    userId: "",
    userNickname: "",
    userEmail: "",
    userRole: 2,
    userProfileImg: ""
  });

  const serverUrl = import.meta.env.VITE_BACK_SERVER;
  const axiosInstance = createInstance();
  const {
    loginMember,
    setLoginMember,
    setIsLogined,
    setAccessToken,
    setRefreshToken
  } = useUserStore();
  
  const navigate = useNavigate();
  const [prevUserImage, setPreveUserImg] = useState();
  const profileImgEl = useRef(null);

  useEffect(function () {
    if (!loginMember || !loginMember.userNo) {
      console.log("로그인 정보가 없거나 user_no가 없습니다.");
      return;
    }

    let options = {};
    options.url = serverUrl + "/user/" + loginMember.userNo;
    options.method = "get";

    axiosInstance(options)
      .then(function (res) {
        if (res.data.resData != null) {
          setUser(res.data.resData);
        }
      })
      .catch(function (err) {
        console.error("회원 정보 요청 오류:", err);
      });
  }, []);

  function chgUserInfo(e) {
    setUser(function (prevUser) {
      return {
        ...prevUser,
        [e.target.id]: e.target.value
      };
    });
  }

  function chgProfileImg(e) {
    const file = e.target.files;
    if (file.length != 0 && file[0] != null) {
      const reader = new FileReader();
      reader.readAsDataURL(file[0]);
      reader.onloadend = function () {
        setPreveUserImg(reader.result); // 🔧 수정됨
        setUser(function (prevUser) {
          return {
            ...prevUser,
            userProfileImg: file[0] // ✅ 변경된 로직: File 객체 저장
          };
        });
      };
    } else {
      setPreveUserImg(null);
      setUser(function (prevUser) {
        return {
          ...prevUser,
          userProfileImg: null
        };
      });
    }
  }

  function fetchUserData() {
    let options = {};
    options.url = serverUrl + "/user/" + loginMember.userNo;
    options.method = "get";

    axiosInstance(options)
      .then(function (res) {
        if (res.data.resData != null) {
          setUser(res.data.resData);
          setLoginMember(res.data.resData); 
        }
      })
      .catch(function (err) {
        console.error("회원 정보 요청 오류:", err);
      });
  }

  function updateUserInfo() {
    Swal.fire({
      title: "알림",
      text: "회원 정보를 수정하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "수정하기",
      cancelButtonText: "취소"
    }).then(function (res) {
      if (res.isConfirmed) {
        axiosInstance
          .patch(serverUrl + "/user/" + user.userNo, {
            userNo: user.userNo,
            userNickname: user.userNickname,
            userEmail: user.userEmail,
            userRole: user.userRole
          })
          .then(function () {
            console.log("기본 정보 수정 완료");

          
            if (user.userProfileImg && user.userProfileImg instanceof File) {
              const formData = new FormData();
              formData.append("userProfileImg", user.userProfileImg);

              axiosInstance
                .patch(serverUrl + "/user/updateProfileImage/" + user.userNo, formData)
                .then(function () {
                  console.log("프로필 이미지 수정 완료");
                  Swal.fire("성공", "회원 정보가 수정되었습니다.", "success");
                  fetchUserData(); 
                  setPreveUserImg(null);
                })
                .catch(function (imgErr) {
                  console.error("이미지 수정 오류:", imgErr);
                  Swal.fire("오류", "프로필 이미지 수정 중 오류가 발생했습니다.", "error");
                });
            } else {
              Swal.fire("성공", "회원 정보가 수정되었습니다.", "success");
              fetchUserData(); 
            }
          })
          .catch(function (err1) {
            console.error("기본 정보 수정 오류:", err1);
            Swal.fire("오류", "회원 정보 수정 중 오류가 발생했습니다.", "error");
          });
      }
    });
  }


function getImageSrc() {
  if (prevUserImage) {
    return prevUserImage;
  }

  // loginMember가 null이면 기본 이미지 반환
  if (!loginMember || !loginMember.userProfileImg) {
    return "/images/default.png";
  }

  if (loginMember.userProfileImg.startsWith("http")) {
    return loginMember.userProfileImg;
  }

  const imgPath = loginMember.userProfileImg.startsWith("/userProfile/")
    ? loginMember.userProfileImg
    : "/userProfile/" + loginMember.userProfileImg;

  return serverUrl + imgPath;
}

 function deleteUser() {
  if (!loginMember || !loginMember.userNo) return;

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
        options.url = serverUrl + "/user/" + loginMember.userNo;
        options.method = "delete";

        axiosInstance(options)
          .then(function (res) {
            if (res.data.resData) {
              setIsLogined(false);
              setLoginMember(null);
              setAccessToken(null);
              setRefreshToken(null);

           
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
          updateUserInfo();
        }}
      >
        <table className="tbl my-info" style={{ width: "80%", margin: "0 auto" }}>
          <tbody>
            <tr>
              <th><label htmlFor="userId">아이디</label></th>
              <td className="left">
                <div className="input-item">
                  <input type="text" id="userId" value={user.userId || ""} readOnly />
                </div>
              </td>
            </tr>
            <tr>
              <th><label htmlFor="userNickname">닉네임</label></th>
              <td className="left">
                <div className="input-item">
                  <input type="text" id="userNickname" value={user.userNickname || ""} onChange={chgUserInfo} />
                </div>
              </td>
            </tr>
            <tr>
              <th><label htmlFor="userEmail">이메일</label></th>
              <td className="left">
                <div className="input-item">
                  <input type="text" id="userEmail" value={user.userEmail || ""} onChange={chgUserInfo} />
                </div>
              </td>
            </tr>
            <tr>
              <th><label htmlFor="userRole">등급</label></th>
              <td className="left">
                <div className="input-item">
                  <input type="text" id="userRole" value={user.userRole ?? ""} readOnly />
                </div>
              </td>
            </tr>
            <tr>
              <th><label htmlFor="userProfileImg">프로필 이미지</label></th>
              <td className="left">
                <img
                src={getImageSrc()}
                alt="프로필 이미지"
                onClick={function () {
                  profileImgEl.current.click();
                }}
                onError={function (e) {
                  e.target.src = "/images/default.png";
                }}
              />
                <div className="input-item">
                  <input type="file" id="userProfileImg" accept="image/*" style={{ display: "none" }} ref={profileImgEl} onChange={chgProfileImg} />
                </div>
              </td>
            </tr>
            <tr>
              <th>회원등급</th>
              <td className="left"></td>
            </tr>
          </tbody>
        </table>

        <div className="button-zone" style={{ marginTop: "20px" }}>
          <button type="submit" className="btn-primary lg">정보수정</button>
          <button
            type="button"
            className="btn-secondary lg"
            style={{ marginLeft: "10px" }}
            onClick={deleteUser}>회원탈퇴</button>
        </div>
      </form>
    </section>
  );
}
