package kr.or.iei.common.util;


import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import kr.or.iei.user.model.dto.User;

@Component
@RestController
public class KakaoTokenUtils {
	/**
     * 카카오 액세스 토큰 유효성 검증
     * 성공 시 User 객체 반환, 실패 시 HttpStatus 반환
     */
    public Object validateKakaoToken(String accessToken) {
        String url = "https://kapi.kakao.com/v1/user/access_token_info";

        RestTemplate rest = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        // Authorization: Bearer {accessToken}
        headers.setBearerAuth(accessToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            // 카카오 API 호출
            ResponseEntity<KakaoTokenInfo> resp =
                rest.exchange(url, HttpMethod.GET, entity, KakaoTokenInfo.class);

            // 200 OK 이면 body 에 id, expires_in 등 들어있음
            KakaoTokenInfo info = resp.getBody();
            if (info == null) {
                // 비정상 응답
                return HttpStatus.INTERNAL_SERVER_ERROR;
            }

            // User DTO 에 id 값만 담아주거나, 필요 시 expires_in 정보도 담습니다
            User m = new User();
            m.setUserId(info.getId().toString());
            // (선택) m.setSomeExpireField(info.getExpiresIn());

            return m;
        }
        catch (HttpClientErrorException e) {
            // 400, 401 등의 카카오 에러를 그대로 반환
        	HttpStatusCode statusCode = e.getStatusCode();
            if (statusCode == HttpStatus.BAD_REQUEST) {
                // -1, -2 오류 → 400 Bad Request
                return HttpStatus.BAD_REQUEST;
            }
            else if (statusCode== HttpStatus.UNAUTHORIZED) {
                // -401 오류 → 401 Unauthorized
                return HttpStatus.UNAUTHORIZED;
            }
            else {
                // 기타 4xx → 403 Forbidden 으로 처리
                return HttpStatus.FORBIDDEN;
            }
        }
        catch (Exception e) {
            // 네트워크 오류 등 기타 예외
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
    
    /**
     * 카카오 API 응답 매핑용 내부 클래스
     */
    private static class KakaoTokenInfo {
        private Long   id;
        private Integer expires_in;
        private Integer app_id;

        public Long   getId()         { return id; }
        public Integer getExpiresIn() { return expires_in; }
        public Integer getAppId()     { return app_id; }
        // setter 생략
    }
}
