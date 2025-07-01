import {create} from 'zustand';
import {persist} from 'zustand/middleware';


/*
isLogined : 로그인 여부 (true == 로그인 된 상태, false == 로그아웃 상태)
setIsLogined : 로그인 상태 변경 시, 호출 함수
loginMember : 로그인 회원 정보
setLoginMember : 로그인 회원 정보 변경 시, 호출 함수
accessToken : 로그인 이후, 요청시마다 헤더에 포함될 토큰
setAccessToken : acceeToken 변경 시, 호출 함수
refreshToken : accessToken 만료 시, 재발급 할 때 필요한 토큰
setRefreshToken : refreshToken 변경 시, 호출 함수
*/
const useUserStore = create(
    persist (
        (set) => ({
            isLogined : false,
            setIsLogined : function(loginChk){
                set({
                    isLogined : loginChk
                })
            },
            //일반 로그인 멤버 정보
            loginMember : null,
            setLoginMember : function(memberObj){
                set({
                    loginMember : memberObj
                })
            },
            accessToken : null,
            setAccessToken : function(accessToken){
                set({
                    accessToken : accessToken
                })
            },
            refreshToken : null,
            setRefreshToken : function(refreshToken){
                set({
                    refreshToken : refreshToken
                })
            },
             // 카카오 로그인 관련 정보 저장 객체
            kakaoMember: null,
            // kakaoMember 전체 덮어쓰기
            setKakaoMember: function(memberObj){
                set({
                    kakaoMember : memberObj
                })
            },
            tokenExpiresIn: null,
            setTokenExpiresIn: (seconds) => set({ tokenExpiresIn: seconds }),

            refreshTokenExpiresIn: null,
            setRefreshTokenExpiresIn: (seconds) => set({ refreshTokenExpiresIn: seconds })

        })  
    )
);

export default useUserStore;