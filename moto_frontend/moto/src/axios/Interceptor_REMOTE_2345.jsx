import axios from "axios";
import useUserStore from "../store/useUserStore";
import Swal from "sweetalert2";
import { customHistory } from "../common/history";

// 외부 컴포넌트에서 서버 요청 시 사용할 axios 인스턴스 생성 함수
export default function createInstance() {
	const instance = axios.create();
	return setInterceptors(instance);
}

// axios 인스턴스에 인터셉터 설정 (요청/응답 가로채기)
function setInterceptors(instance) {
	const {loginMember, accessToken, setAccessToken, refreshToken, setRefreshToken,  kakaoMember, tokenExpiresIn, refreshTokenExpiresIn} = useUserStore();
    // 요청 인터셉터: 클라이언트 → 서버 요청 시 요청 객체를 가로채어 처리
    
	if(loginMember != null){
		instance.interceptors.request.use(
			function(config) { // 요청이 정상적으로 구성된 경우
			//스토리지에 저장된 accessToken 추출.
			const accessToken = useUserStore.getState().accessToken; //인터셉터는 컴포넌트가 아니므로, 추출하는 코드 상이.
			
			//스토리지에 저장된 accessToken 요청 헤더에 포함시키기.
			if(accessToken != null){
					config.headers['Authorization'] = accessToken;

			}


			return config;
			},
			function(error) { // 요청 구성 중 오류가 발생한 경우
				return Promise.reject(error);
			},
		);
	}else if(kakaoMember != null){
		instance.interceptors.request.use(
			function(config) { // 요청이 정상적으로 구성된 경우
			//스토리지에 저장된 accessToken 추출.
			
			//스토리지에 저장된 accessToken,  tokenExpiresIn 요청 헤더에 포함시키기.
			if(accessToken != null && tokenExpiresIn != null){
					config.headers['Authorization'] = `Social ${accessToken}`;

			}


			return config;
			},
			function(error) { // 요청 구성 중 오류가 발생한 경우
				return Promise.reject(error);
			},
		);
	}
    // 응답 인터셉터: 서버 → 클라이언트 응답 시 응답 객체를 가로채어 처리
	instance.interceptors.response.use(
        
		function(response) { // 서버 응답이 정상적으로 도착한 경우       
			
			//서버에서 HttpStatus.OK로 응답된 경우 && 알림창에 띄워줄 메시지 응답한 경우
			if(response.data.clientMsg != undefined && response.data.clientMsg != ''){
				Swal.fire({
					title : '알림',
					text : response.data.clientMsg,
					icon : response.data.alertIcon
				});
			}




			return response;
		},
		//아래 부터 jwt 토큰 관련 로직
		function(error) {   // 응답 처리 중 오류가 발생한 경우 (ResponseDTO.HttpStatus: 4xx, 5xx)
			if (!error.response) {
			Swal.fire("오류", "서버가 응답하지 않습니다.", "error");
			return Promise.reject(error);
			}

			const status = error.response.status;
			const originalRequest = error.config; // 기존 요청 정보를 담고 있는 객체
			
			if(status == 403){ //토큰 유효시간 만료
				//status가 403인 경우는 accessToken이 만료되었을 때에도 응답되고, refreshToken이 만료되었을 때에도 응답됨.

				if(error.config.headers.refreshToken === undefined
					 && !originalRequest._retry //재요청이 아닌 경우
				){ // 응답 코드가 403이면서, 헤더에 refreshToken이 포함되지 않은 경우
					//accessToken이 만료된 경우

					//스토리지에 저장되어 있는 회원 정보, refreshToken 데이터 추출
					const loginMember = useUserStore.getState().loginMember;
					const refreshToken = useUserStore.getState().refreshToken;

					let options = {};
					options.url = import.meta.env.VITE_BACK_SERVER + '/user/refresh';
					options.method = 'post';
					options.data = loginMember;
					options.headers = {};
					options.headers.refreshToken = refreshToken; //헤더에 refreshToken 포함시켜 재발급 요청

					return instance(options)
						   .then(function(res){
								if(res.data.resData != null){
									const reAccessToken = res.data.resData; //재발급된 accessToken

									//스토리지에 재발급된 accessToken 재할당
									useUserStore.getState().setAccessToken(reAccessToken);

									//기존 요청 헤더에 재발급된 accessToken 할당 후, 재요청
									originalRequest.headers['Authorization'] = reAccessToken;
									originalRequest._retry = true; //무한루프 방지 차원에서 재요청임을 저장

									//토큰 재발급 이후, 기존 요청 다시 서버에 요청 처리
									return instance(originalRequest);
								}
						   })
						   .catch(function(error){
								return Promise.reject(error);
						   })

				}else{ //서버 응답 코드 403 (토큰 만료) && 헤더에 refreshToken이 포함된 경우 => refreshToken이 만료된 경우.
					Swal.fire({
						title : '알림',
						text : '로그인 기간이 만료되었습니다. 다시 로그인 하세요.',
						icon : 'warning',
						confirmButtonText : '확인'
					}).then(function(result){

						if(result.isConfirmed){
							//로그인 만료 => 스토리지 정보 초기화 => 로그인 컴포넌트로 전환
							useUserStore.getState().setIsLogined(false);
							useUserStore.getState().setAccessToken(null);
							useUserStore.getState().setRefreshToken(null);

							//인터셉터 == 컴포넌트 외부에 존재 == React Hook 사용 불가.
							//외부에서, 브라우저 주소창을 자바스크립트로 바꿀 수 있게 해주는 도구인 history를 사용해야 함.
							//history 도구를 이용해서, 브라우저 주소창을 변경하면, 이를 라우터가 감지하고 등록된 컴포넌트 중, path가 일치하는 컴포넌트로 전환(랜더링) 해줌.
							customHistory.push('/login');
						}
					})
				}

			}else if(status == 401){ //발급 토큰과, 헤더에 포함된 토큰이 다른 경우 (비인가 접근)
				//+카카오 accessToken이 만료되었을 시 발생
				if(kakaoMember != null){
					const refreshToken = refreshToken;
					let options = {};
					options.url = import.meta.env.VITE_BACK_SERVER + '/auth/oauth2/kakao/refresh';
					options.method = 'post';
					options.data = kakaoMember;
					options.headers = {};
					options.headers.refreshToken = refreshToken; //헤더에 refreshToken 포함시켜 재발급 요청

					return instance(options)
						   .then(function(res){
								if(res.data.resData != null){

									const dto    = res.data;       // ResponseDTO<OAuthTokenResponse>
									const tokens = dto.resData;    // OAuthTokenResponse
									if (tokens) {
										// 2) 스토어에 재발급된 토큰+만료시간 저장
										useUserStore.getState().setAccessToken(tokens.accessToken);
										useUserStore.getState().setRefreshToken(tokens.refreshToken);
										useUserStore.getState().setTokenExpiresIn(tokens.expiresIn);
										useUserStore.getState().setRefreshTokenExpiresIn(tokens.refreshTokenExpiresIn);

										//기존 요청 헤더에 재발급된 accessToken 할당 후, 재요청
										originalRequest.headers['Authorization'] = tokens.accessToken;
										originalRequest._retry = true; //무한루프 방지 차원에서 재요청임을 저장

										//토큰 재발급 이후, 기존 요청 다시 서버에 요청 처리
										return instance(originalRequest);
									}}
						   })
						   .catch(function(error){
							//refresh 토큰 만료시에 오는 httpstatus로 판단.
							//  로그인 창으로 이동
							       // 4) 리프레시도 실패 → 로그인 만료 처리
								Swal.fire({
									title: "알림",
									text: "로그인 기간이 만료되었습니다. 다시 로그인해주세요.",
									icon: "warning",
									confirmButtonText: "확인"
								}).then(() => {
									// 상태 초기화 + 로그인 페이지 이동
									const store = useUserStore.getState();
									store.setIsLogined(false);
									store.setAccessToken(null);
									store.setRefreshToken(null);
									store.setKakaoMember(null);
									store.setTokenExpiresIn(null);
									store.setRefreshTokenExpiresIn(null);
									customHistory.push("/login");
								});
								return Promise.reject(error);
						   })
				}
			}else { // HttpStatus.INTERNAL_SERVER_ERROR == 500 (서버 오류)
				const res = error.response.data; //백엔드에서 응답해준 ResponseDTO 객체
				Swal.fire({
					title : "알림",
					text : res.clientMsg,
					icon : res.alertIcon
				});
			}

			return Promise.reject(error);
		},
	);

	return instance;
}