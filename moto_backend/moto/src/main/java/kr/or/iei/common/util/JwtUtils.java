package kr.or.iei.common.util;

import java.nio.charset.StandardCharsets;
import java.util.Calendar;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import kr.or.iei.user.model.dto.User;

@Component
public class JwtUtils {

    @Value("${jwt.secret-key}")
    private String jwtSecretKey;

    @Value("${jwt.expire-minute}")
    private int jwtExpireMinute;

    @Value("${jwt.expire-hour-refresh}")
    private int jwtExpireHourRefresh;

    // SecretKey 생성 및 길이 검사
    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecretKey.getBytes(StandardCharsets.UTF_8);
        System.out.println("🔐 Secret Key Byte Length: " + keyBytes.length);
        if (keyBytes.length < 32) {
            throw new IllegalArgumentException("❌ Secret key must be at least 32 bytes (256 bits) for HMAC-SHA algorithms.");
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // AccessToken 생성
    public String createAccessToken(String userId, int userRole) {
        SecretKey key = getSigningKey();

        Calendar calendar = Calendar.getInstance();
        Date startTime = calendar.getTime();
        calendar.add(Calendar.MINUTE, jwtExpireMinute);
        Date expireTime = calendar.getTime();

        return Jwts.builder()
                .setIssuedAt(startTime)
                .setExpiration(expireTime)
                .signWith(key)
                .claim("userId", userId)
                .claim("userRole", userRole)
                .compact();
    }

    // RefreshToken 생성
    public String createRefreshToken(String userId, int userRole) {
        SecretKey key = getSigningKey();

        Calendar calendar = Calendar.getInstance();
        Date startTime = calendar.getTime();
        calendar.add(Calendar.HOUR, jwtExpireHourRefresh);
        Date expireTime = calendar.getTime();

        return Jwts.builder()
                .setIssuedAt(startTime)
                .setExpiration(expireTime)
                .signWith(key)
                .claim("userId", userId)
                .claim("userRole", userRole)
                .compact();
    }

    // 토큰 검증
    public Object validateToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            return HttpStatus.UNAUTHORIZED;
        }

        User m = new User();

        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            token = token.trim();

            SecretKey key = getSigningKey();

            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String userId = claims.get("userId", String.class);
            Integer userRole = claims.get("userRole", Integer.class);

            m.setUserId(userId);
            m.setUserRole(String.valueOf(userRole));

        } catch (ExpiredJwtException e) {
            System.out.println("❌ Token expired: " + e.getMessage());
            return HttpStatus.UNAUTHORIZED;
        } catch (MalformedJwtException e) {
            System.out.println("❌ Malformed token: " + e.getMessage());
            return HttpStatus.BAD_REQUEST;
        } catch (SignatureException e) {
            System.out.println("❌ Invalid signature: " + e.getMessage());
            return HttpStatus.UNAUTHORIZED;
        } catch (Exception e) {
            System.out.println("❌ Unknown JWT exception: " + e.getMessage());
            return HttpStatus.FORBIDDEN;
        }

        return m;
    }
}
