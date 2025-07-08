import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import UserList from "./UserList";


export default function AdminMainPage() {
  const [userList, setUserList] = useState([]);
  const serverUrl = import.meta.env.VITE_BACK_SERVER;
  const axiosInstance = createInstance();

  // 사용자 목록 불러오기
  useEffect(function () {
    const options = {
      url: serverUrl + "/admin/allList", // Spring에서 전체 유저 반환
      method: "get",
    };

    axiosInstance(options)
      .then(function (res) {
        setUserList([...res.data.resData]); // 사용자 목록 저장
      })
      .catch(function (err) {
        console.error("회원 목록 불러오기 실패:", err);
      });
  }, []);

  

  return (
    
      <div style={{display:"block"}}>
        <h2 style={{color:"white"}}>회원 리스트</h2>
         <div style={{width:"1137px", paddingLeft:"20px"}}>
         <UserList userList={userList}/>
         </div>
      </div>
    
  );
}
