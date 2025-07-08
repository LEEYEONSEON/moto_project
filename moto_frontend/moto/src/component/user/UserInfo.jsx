import { useEffect, useRef, useState } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function UserInfo() {
  const [user, setUser] = useState({
    userNo : 0, userId : "", userNickname : "", userEmail : "", userRole : 2, userProfileImg : ""
  })

  const serverUrl = import.meta.env.VITE_BACK_SERVER;
  const axiosInstance = createInstance();
  const {loginMember, setLoginMember, setIsLogined, setAccessToken, setRefreshToken} = useUserStore();
  const userNo = loginMember.userNo;
  const navigate = useNavigate();  
  const [prevUserImage, setPreveUserImg] = useState();

  
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
        //res.data.resData => user 객체 (모든 정보가 있는)
        if (res.data.resData != null) {
          setUser(res.data.resData);
        }
      })
      .catch(function (err) {
        console.error("회원 정보 요청 오류:", err);
      });
  }, []);

  
function chgUserInfo(e) {
  setUser(function(prevUser) {
    return {
      ...prevUser,
      [e.target.id]: e.target.value, 
    };
  });
}
  const profileImgEl = useRef(null);

  function chgProfileImg(e){
     const file = e.target.files;

    if(file.length != 0 && file[0] != null) {
      user[user.userProfileImg] = file[0];
      
      const reader = new FileReader();    //브라우저에서 파일을 비동기적으로 읽을 수 있게 해주는 객체
            reader.readAsDataURL(file[0]);     //파일 데이터 읽어오기
            reader.onloadend = function(){       //모두 읽어오면, 실행할 함수 작성
                setPreveUserImg(reader.result);     //미리보기용 State 변수에 세팅
            }
            console.log(user);
    }else{
      user[user.userProfileImg]= null;
      setPreveUserImg(null);
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
        let options = {};
        options.url = serverUrl + "/user/" + loginMember.userNo; 
        options.method = "patch"; 
        options.data = user; 

        axiosInstance(options)
          .then(function (res) {
            if (res.data.resData) {
              Swal.fire("성공", "회원 정보가 수정되었습니다.", "success");
              setLoginMember(res.data.resData);  
               fetchUserData();
            }
          })
          .catch(function (err) {
            console.error(err);
            Swal.fire("오류", "회원 정보 수정 중 오류가 발생했습니다.", "error");
          });
      }
    });
  }

  function deleteUser() {
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
          updateUserInfo();
        }}
      >
        <table className="tbl my-info" style={{ width: "80%", margin: "0 auto" }}>
          <tbody>
            <tr>
              <th>
                <label htmlFor="userId">아이디</label>
              </th>
              <td className="left">
                <div className="input-item">
                  <input type="text" name="userId" id="userId" value={user.userId} readOnly/>
                </div>
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor="userNickname">닉네임</label>
              </th>
              <td className="left">
                <div className="input-item">
                  <input type="text" name="userNickname" id="userNickname" value={user.userNickname} onChange={chgUserInfo}/>
                </div>
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor="userEmail">이메일</label>
              </th>
              <td className="left">
                <div className="input-item">
                    <input type="text" name="userEmail" id="userEmail" value={user.userEmail} onChange={chgUserInfo}/>
                </div>
              </td>
            </tr>
            <tr>

              <th>
                <label htmlFor="userRole">등급</label>
              </th>
              <td className="left">
                <div className="input-item">
                    <input type="text" name="userRole" id="userRole" value={user.userRole} readOnly/>
                </div>
              </td>
            </tr>
            <tr>
              <th>
                <label htmlFor="userProfileImg">프로필 이미지</label>
              </th>
              <td className="left">
                {
                  <img src={
                    loginMember.userProfileImg 
                    ? serverUrl + "/user/profile" + loginMember.userProfileImg.substring(0,8) + "/" + loginMember.userProfileImg
                    : '/images/default.png'
                  } 
                  onClick={function(){
                    profileImgEl.current.click()
                  }}/>
                }
                <div className="input-item">
                  <input type="file" id="userProfileImg" accept="image/*" style={{display : 'none'}} ref={profileImgEl} onChange={chgProfileImg} />
                </div>
               
              </td>
            </tr>
            <tr>
              <th>회원등급</th>
              <td className="left">
                
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
            onClick={deleteUser}>회원탈퇴</button>
        </div>
      </form>
    </section>
  );
}
