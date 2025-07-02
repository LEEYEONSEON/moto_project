package kr.or.iei.common.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

// JWT 토큰 검증용 필터
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // JWT 토큰에서 사용자 정보 꺼내는 메서드 (임의 구현)
    private String getUserIdFromToken(String token) {
        // 실제론 JWT 파싱 라이브러리로 토큰 검증 및 클레임 파싱
        // 여기선 예시로 간단히 토큰을 userId로 가정
        return token; // 실제로는 JWT 클레임에서 userId 꺼내기
    }

    // 토큰 검증 메서드 (실제론 JWT 검증 라이브러리 사용)
    private boolean validateToken(String token) {
        // 여기선 무조건 true로 처리 (실제로는 토큰 유효기간, 서명검증 등)
        return token != null && !token.isEmpty();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        String token = null;

        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            token = header.substring(7);
        }

        if (token != null && validateToken(token)) {
            String userId = getUserIdFromToken(token);

            // 권한 부여 - 여기선 예시로 ROLE_USER 고정
            var authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));

            UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userId, null, authorities);

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // SecurityContext에 인증정보 등록
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }
}
