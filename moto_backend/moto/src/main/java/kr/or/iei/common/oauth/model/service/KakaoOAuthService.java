package kr.or.iei.common.oauth.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import kr.or.iei.common.oauth.dto.OAuthTokenResponse;
import kr.or.iei.common.oauth.model.dao.OAuthUserDao;
import kr.or.iei.user.model.dto.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Kakao OAuth2 인증 흐름을 구현한 서비스 클래스
 */
@Service
public class KakaoOAuthService implements OAuthService {
    @Value("${spring.oauth2.kakao.client-id}")
    private String clientId;
    @Value("${spring.oauth2.kakao.client-secret:}")
    private String clientSecret;
    @Value("${spring.oauth2.kakao.redirect-uri}")
    private String redirectUri;
    
    @Autowired
    private OAuthUserDao userDao;
    
    private final RestTemplate rest = new RestTemplate();

    /**
     * Kakao 인가 코드 요청용 URL 생성
     */
    @Override
    public String getAuthorizationUri() {
        return "https://kauth.kakao.com/oauth/authorize" +
               "?response_type=code" +
               "&client_id=" + clientId +
               "&redirect_uri=" + redirectUri;
    }

    /**
     * 인가 코드를 이용해 액세스/리프레시 토큰 발급
     */
    @Override
    public OAuthTokenResponse getAccessToken(String code) {
        String url = "https://kauth.kakao.com/oauth/token";
        MultiValueMap<String,String> params = new LinkedMultiValueMap<>();
        params.add("grant_type","authorization_code");
        params.add("client_id",clientId);
        params.add("redirect_uri",redirectUri);
        params.add("code",code);
        // clientSecret이 있을 경우에만 추가
        if(!clientSecret.isEmpty()) params.add("client_secret", clientSecret);

        // 2) POST 요청 후 내부 매핑용 응답 클래스에 바인딩
        KakaoTokenResponse resp = rest.postForObject(url, params, KakaoTokenResponse.class);

        // 3) 공통 DTO로 변환
        OAuthTokenResponse result = new OAuthTokenResponse();
        result.setTokenType(resp.getToken_type());                       // token_type
        result.setAccessToken(resp.getAccess_token());                   // access_token
        result.setExpiresIn(resp.getExpires_in());                       // expires_in
        result.setRefreshToken(resp.getRefresh_token());                 // refresh_token
        result.setRefreshTokenExpiresIn(resp.getRefresh_token_expires_in()); // refresh_token_expires_in
        result.setScope(resp.getScope());                                // scope
        return result;
    }



    /**
     * 3) Bearer 토큰 기반 프로필 조회 & DB upsert & User 반환
     *    - 카카오 공식 API: POST /v2/user/me
     */
    @Transactional
    public User processLoginWithToken(String accessToken) {
    	int result = 0;
        // (a) Header & Content-Type 설정
        String url = "https://kapi.kakao.com/v2/user/me";
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        // 사양: application/x-www-form-urlencoded;charset=utf-8
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<MultiValueMap<String, String>> entity =
            new HttpEntity<>(null, headers);

        // (b) POST 요청 후, 카카오에서 사용자 정보 받기
        KakaoProfile profile =
            rest.exchange(url, HttpMethod.POST, entity, KakaoProfile.class)
                .getBody();
        
        // (c) User 객체로 변환 : 받아서 id, 닉네임, 이메일 객체에 저장
        User kakaoUser = new User();
        kakaoUser.setUserId(profile.getId().toString());
        // properties.profile_nickname 이 아닌, spec 대로 properties.nickname
        kakaoUser.setUserNickname(profile.getProperties().getNickname());
        kakaoUser.setUserEmail(profile.getKakao_account().getEmail());
        
        //카카오로부터 사용자 정보 조회 테스트코드
        System.out.println(kakaoUser.getUserId());
        System.out.println(kakaoUser.getUserNickname());
        System.out.println(kakaoUser.getUserEmail());
        
        
        // (d) DB upsert
        //이메일로 모든 정보를 조회해 온다. 
        User existing = userDao.findByEmail(kakaoUser.getUserEmail());
        if (existing != null) {
        	System.out.println(existing.getUserJoinDate());
            //이메일로 조회시, 기존정보가 존재한다면, id와 소셜회원을 식별하는 email을 제외한 닉네임을 변경해준다.  
            existing.setUserNickname(kakaoUser.getUserNickname());
            result = userDao.updateUser(existing);
            System.out.println("수정 결과"+result);
            if(result == 0) {return null;
            }else {
            	return existing;
            }
        } else {
        	//기존 정보가 없다면 회원가입(id, 닉네임, 이메일 저장 
        	//이메일로 회원정보를 다시 가져와 반환한다. 
            result = userDao.insertUser(kakaoUser);
            if(result == 0) return null;
           
            return userDao.findByEmail(kakaoUser.getUserEmail());
        }
    }
    
 // KakaoOAuthService 내부 매핑용 클래스 (private static)
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    private static class KakaoTokenResponse {
        private String token_type;
        private String access_token;
        private long expires_in;
        private String refresh_token;
        private long refresh_token_expires_in;
        private String scope;
        // getters & setters
    }
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    private static class KakaoProfile {
        private Long id;                   // 사용자 고유 ID
        private Properties properties;     // JSON 필드 "properties"
        private KakaoAccount kakao_account;//JSON 필드 "kakao_account"
        @Data
        @AllArgsConstructor
        @NoArgsConstructor
        static class Properties {
            private String nickname;       // 사용자 닉네임
            // getters & setters
        }
        @Data
        @AllArgsConstructor
        @NoArgsConstructor
        static class KakaoAccount {
            private String email;          // 사용자 이메일
            // getters & setters
        }
        // getters & setters
    }
    
}