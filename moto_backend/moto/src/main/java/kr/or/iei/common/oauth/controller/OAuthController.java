package kr.or.iei.common.oauth.controller;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
import kr.or.iei.common.util.JwtUtils;  // 추가
import kr.or.iei.user.model.dto.User;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/auth/oauth2")
public class OAuthController {

    private final KakaoOAuthService kakao;
    private final JwtUtils jwtUtils;  // JwtUtils 주입

    // 생성자에 JwtUtils 추가
    public OAuthController(KakaoOAuthService kakao, JwtUtils jwtUtils) {
        this.kakao = kakao;
        this.jwtUtils = jwtUtils;
    }

    @NoTokenCheck
    @GetMapping("/{provider}/authorize")
    public void redirectToProvider(
            @PathVariable String provider,
            HttpServletResponse res) throws IOException {
        String uri;
        switch (ProviderType.valueOf(provider.toUpperCase())) {
            case KAKAO:  uri = kakao.getAuthorizationUri();  break;
            default: throw new IllegalArgumentException("Unknown provider: " + provider);
        }
        res.sendRedirect(uri);
    }

    @NoTokenCheck
    @GetMapping("/{provider}/callback")
    public ResponseEntity<ResponseDTO> callback(
            @PathVariable String provider,
            @RequestParam String code) {

        System.out.println("인가 코드 정상 발급 : " + code);
        ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "로그인 중, 오류가 발생하였습니다.", null, "error");
        if(code == null) {
            return new ResponseEntity<>(res, res.getHttpStatus());
        }

        OAuthTokenResponse tokens;
        OAuthLoginUser loginUser = new OAuthLoginUser();
        try {
            switch (ProviderType.valueOf(provider.toUpperCase())) {
                case KAKAO:  tokens = kakao.getAccessToken(code);  break;
                default:
                    throw new IllegalArgumentException("Unknown provider: " + provider);
            }

        } catch(Exception e) {
            return new ResponseEntity<>(res, res.getHttpStatus());
        }

        if(tokens == null) {
            return new ResponseEntity<>(res, res.getHttpStatus());
        }

        loginUser.setTokens(tokens);
        System.out.println(tokens);

        // 사용자 정보 조회
        User user = kakao.processLoginWithToken(tokens.getAccessToken());
        System.out.println("회원조회 : "+user.getUserJoinDate());

        if(user == null) {
            return new ResponseEntity<>(res, res.getHttpStatus());
        }

        System.out.println(user.getUserEmail());
        loginUser.setUser(user);

        // 여기서 JWT 토큰 생성 추가
        String accessToken = jwtUtils.createAccessToken(user.getUserId(), Integer.parseInt(user.getUserRole()));
        String refreshToken = jwtUtils.createRefreshToken(user.getUserId(), Integer.parseInt(user.getUserRole()));

        // JWT 토큰을 loginUser에 포함하거나 별도 필드로 ResponseDTO에 추가
        java.util.Map<String, String> jwtTokens = new java.util.HashMap<>();
        jwtTokens.put("accessToken", accessToken);
        jwtTokens.put("refreshToken", refreshToken);

        // 예) loginUser 객체에 토큰 필드 없으면, ResponseDTO의 data를 Map으로 재구성
        java.util.Map<String, Object> responseData = new java.util.HashMap<>();
        responseData.put("loginUser", loginUser);
        responseData.put("jwtTokens", jwtTokens);

        res = new ResponseDTO(HttpStatus.OK, "로그인 성공", responseData, "");

        return new ResponseEntity<>(res, res.getHttpStatus());
    }

    @NoTokenCheck
    @GetMapping("/{provider}/userinfo")
    public ResponseEntity<User> userInfo(
             @RequestHeader("Authorization") String authorizationHeader) {
        String accessToken = authorizationHeader.startsWith("Bearer ")
            ? authorizationHeader.substring(7)
            : authorizationHeader;

        User user = kakao.processLoginWithToken(accessToken);
        return ResponseEntity.ok(user);
    }
}
