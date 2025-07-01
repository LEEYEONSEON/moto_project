package kr.or.iei.common.oauth;

/**
 * OAuth 공급자 유형을 정의하는 열거형(enum).
 * GOOGLE:  구글 인증
 * NAVER:   네이버 인증
 * KAKAO:   카카오 인증
 */
public enum ProviderType {
    /** Google OAuth2 공급자 */
    GOOGLE,
    /** Naver OAuth2 공급자 */
    NAVER,
    /** Kakao OAuth2 공급자 */
    KAKAO;
}
