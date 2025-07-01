package kr.or.iei.common.oauth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * OAuth2 토큰 발급 응답(Response) 데이터를 담는 DTO
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class OAuthTokenResponse {
    /** 토큰 타입 (예: \"bearer\") */
    private String tokenType;
    /** 발급된 액세스 토큰 */
    private String accessToken;
    /** 액세스 토큰 만료 시간(초) */
    private long expiresIn;
    /** 발급된 리프레시 토큰 */
    private String refreshToken;
    /** 리프레시 토큰 만료 시간(초) */
    private long refreshTokenExpiresIn;
    /** 허가된 스코프 (예: \"account_email profile\") */
    private String scope;
}
