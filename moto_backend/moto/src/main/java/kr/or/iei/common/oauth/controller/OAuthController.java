package kr.or.iei.common.oauth.controller;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import kr.or.iei.common.annotation.NoTokenCheck;
import kr.or.iei.common.model.dto.ResponseDTO;
import kr.or.iei.common.oauth.ProviderType;
import kr.or.iei.common.oauth.dto.OAuthLoginUser;
import kr.or.iei.common.oauth.dto.OAuthTokenResponse;
import kr.or.iei.common.oauth.model.service.KakaoOAuthService;
import kr.or.iei.user.model.dto.User;

/**
 * OAuth2 인증 엔드포인트를 제공하는 컨트롤러
 */
@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/auth/oauth2")
public class OAuthController {
	
	
	
	private final KakaoOAuthService kakao;
	// 생성자에 @Autowired는 생략 가능 (Spring 4.3+)
    public OAuthController(KakaoOAuthService kakao) {
        this.kakao = kakao;
    }
    @NoTokenCheck
    @PostMapping("/{provider}/refresh")
    public ResponseEntity<ResponseDTO> refreshKakaoToken(
            @RequestHeader("refreshToken") String refreshToken
    ) {
        Object result = kakao.refreshAccessToken(refreshToken);
        if (result instanceof HttpStatus status) {
        	 ResponseDTO res =
        	            new ResponseDTO(status, "토큰 재발급에 실패했습니다.", null, "error");
        	 return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus()); 
        }
        // 성공: OAuthTokenResponse 반환
        ResponseDTO res =
	            new ResponseDTO(HttpStatus.OK, null, result, null);
        return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
    }
    

    /**
     * 인가 코드 요청 엔드포인트
     * ex) GET /auth/oauth2/google/authorize
     */
    @NoTokenCheck
    @GetMapping("/{provider}/authorize")
    public void redirectToProvider(
            @PathVariable String provider,
            HttpServletResponse res) throws IOException {
        String uri;
        // 입력된 provider에 따라 적절한 인가 URI 생성
        switch (ProviderType.valueOf(provider.toUpperCase())) {
            case KAKAO:  uri = kakao.getAuthorizationUri();  break;
            default: throw new IllegalArgumentException("Unknown provider: " + provider);
        }
        res.sendRedirect(uri); // 클라이언트를 공급자 로그인 페이지로 리다이렉트
    }

    /**
     * 인가 코드 콜백 처리 및 토큰 교환 엔드포인트
     * ex) GET /auth/oauth2/google/callback?code=...
     */
    @NoTokenCheck
    @GetMapping("/{provider}/callback")
    public ResponseEntity<ResponseDTO> callback(
            @PathVariable String provider,
            @RequestParam String code) {
    	//인가코드 정상발급 테스트 코드
        System.out.println("인가 코드 정상 발급 : " + code);
    	ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "로그인 중, 오류가 발생하였습니다.", null, "error");
    	if(code == null) {
    		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
    	}
    	OAuthTokenResponse tokens;
        //로그인 처리 모두 마쳤을시, 포함할 
        OAuthLoginUser loginUser = new OAuthLoginUser(); 
        // 공급자별로 코드 → 토큰 요청 처리
        try {
        	switch (ProviderType.valueOf(provider.toUpperCase())) {
        	case KAKAO:  tokens = kakao.getAccessToken(code);  
        		System.out.println(tokens.toString());
        		break;
        	default: 
        		throw new IllegalArgumentException("Unknown provider: " + provider);
        		
        	}
        	
        }catch(Exception e) {
        	return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
        }
        if(tokens == null) {
        	return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
        }
        //받은 토큰 보낼 객체에 저장
        loginUser.setTokens(tokens);
        System.out.println(tokens);
        //db에 사용자 정보 등록 후, 클라이언트에게 넘길 사용자 정보 
        User user = kakao.processLoginWithToken(tokens.getAccessToken());
        System.out.println("회원조회 : "+user.getUserJoinDate());
        if(user == null) {
        	return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
        }
        //test 코드
        System.out.println(user.getUserEmail());
        loginUser.setUser(user);
        res = new ResponseDTO(HttpStatus.OK, "", loginUser, "");
        
        return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
    }
    

    /**  
     * 3) 프론트엔드로부터 'Bearer <accessToken>' 헤더를 받아  
     *    프로필 조회 → DB insert/update → User 반환  
     *    POST /auth/oauth2/kakao/userinfo  
     */
    @NoTokenCheck
    @GetMapping("/{provider}/userinfo")
    public ResponseEntity<User> userInfo(
    		 @RequestHeader("Authorization") String authorizationHeader) {
    	// "Bearer <token>" 형식에서 실제 토큰만 추출
        String accessToken = authorizationHeader.startsWith("Bearer ")
            ? authorizationHeader.substring(7)
            : authorizationHeader;

        // 서비스 호출
        User user = kakao.processLoginWithToken(accessToken);
        return ResponseEntity.ok(user);
    }
    
    @NoTokenCheck
    @GetMapping("/{provider}/logout")
    public void redirectToKakaoLogout(HttpServletResponse res) throws IOException{
    	System.out.println("kakaoLogout백엔드 들어옴");
    	String uri = kakao.getLogoutUri();
    	
    	res.sendRedirect(uri);
    }
}
