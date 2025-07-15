
import { useEffect } from "react";                       // ← 추가
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";


export default function KakaoLogout(){
    const {setIsLogined,  kakaoMember, setLoginMember, setAccessToken, setRefreshToken, setKakaoMember, setTokenExpiresIn, setRefreshTokenExpiresIn} = useUserStore();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const state = params.get("state");



        setIsLogined(false);
        setAccessToken(null);
        setRefreshToken(null);
        setKakaoMember(null);
        setTokenExpiresIn(null);
        setRefreshTokenExpiresIn(null);


         // 2) 알림창 띄우기
        Swal.fire({
            icon: "success",
            title: "로그아웃",
            text: "정상적으로 로그아웃되었습니다.",
            confirmButtonText: "확인",
        }).then(() => {
            // 3) 확인 버튼 누르면 로그인 페이지로 이동
            navigate("/login");
        });

    }, []); // 마운트될 때 한 번만 실행

    // 아무것도 렌더링하지 않음
    return null;
}