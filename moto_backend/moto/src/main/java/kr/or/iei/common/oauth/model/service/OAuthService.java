package kr.or.iei.common.oauth.model.service;

import kr.or.iei.common.oauth.dto.OAuthTokenResponse;
import kr.or.iei.user.model.dto.User;

/**
 * OAuth 인증 흐름을 위한 공통 서비스 인터페이스.
 */
public interface OAuthService {
    /**
     * 인가 코드(authorization code)를 요청할 때 사용할 URI 생성.
     * @return 인가 요청용 URL 문자열
     */
    String getAuthorizationUri();

    /**
     * 인가 코드를 사용해 액세스 토큰(access token) 및 리프레시 토큰(refresh token) 발급
     * @param code OAuth 공급자로부터 받은 인가 코드
     * @return 발급된 토큰 정보를 담은 DTO
     */
    OAuthTokenResponse getAccessToken(String code);

    /**
     * 발급된 액세스 토큰으로 사용자 정보 조회
     * 정보 조회후, 존재하지 않으면 회원가입, 존재하면 수정된 정보 저장 후, 
     * 조회된 정보 클라이언트에 전달하기 위해 반환
     * @param accessToken 발급받은 액세스 토큰
     * @return 사용자 프로필 정보를 담은 DTO
     */
    User processLoginWithToken(String accessToken);
}
