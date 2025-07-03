package kr.or.iei.common.util;

import java.util.Calendar;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import kr.or.iei.user.model.dto.User;

@Component
public class JwtUtils {
	
	//application.properties에 작성된 값 읽어오기
	@Value("${jwt.secret-key}")
	private String jwtSecretKey;
	@Value("${jwt.expire-minute}")
	private int jwtExpireMinute;
	@Value("${jwt.expire-hour-refresh}")
	private int jwtExpireHourRefresh;
	
	
	//AccessToken 발급 메소드
	public String createAccessToken(String userNo, String userRole) {
		//1. 내부에서 사용할 방식으로, 정의한 key 변환
		SecretKey key = Keys.hmacShaKeyFor(jwtSecretKey.getBytes());
		
		//2. 토큰 생성시간 및 만료시간 설정
		
		Calendar calendar = Calendar.getInstance(); 					//현재시간
		Date startTime = calendar.getTime();							//현재시간 == 유효 시작시간
		calendar.add(Calendar.MINUTE, jwtExpireMinute);					//현재시간 + 10분 == 유효 만료시간
		Date expireTime = calendar.getTime();							//만료시간
		
		//3. 토큰 생성
		String accessToken = Jwts.builder()								//builder를 이용해 토큰 생성
								 .issuedAt(startTime)					//시작시간
								 .expiration(expireTime)				//만료시간
								 .signWith(key)							//암호화 서명
								 .claim("userNo", userNo)			//토큰 포함 정보(key ~ value 형태)
								 .claim("userRole", userRole)		//토큰 포함 정보(key ~ value 형태)
								 .compact();							//생성
		
		return accessToken;
	}
	
	//RefreshToken 발급 메소드
	public String createRefreshToken(String userNo, String userRole) {
		//1. 내부에서 사용할 방식으로, 정의한 key 변환
		SecretKey key = Keys.hmacShaKeyFor(jwtSecretKey.getBytes());
		
		//2. 토큰 생성시간 및 만료시간 설정
		
		Calendar calendar = Calendar.getInstance(); 					//현재시간
		Date startTime = calendar.getTime();							//현재시간 == 유효 시작시간
		calendar.add(Calendar.HOUR, jwtExpireHourRefresh);				//현재시간 + 10분 == 유효 만료시간
		Date expireTime = calendar.getTime();							//만료시간
		
		//3. 토큰 생성
		String refreshToken = Jwts.builder()								//builder를 이용해 토큰 생성
								 .issuedAt(startTime)					//시작시간
								 .expiration(expireTime)				//만료시간
								 .signWith(key)							//암호화 서명
								 .claim("userNo", userNo)			//토큰 포함 정보(key ~ value 형태)
								 .claim("userRole", userRole)		//토큰 포함 정보(key ~ value 형태)
								 .compact();							//생성
		
		return refreshToken;
	}
	
	//토큰 검증
	public Object validateToken(String token) {
		
		User m = new User();
		
		try {
			//1. 토큰 해석을 위한 암호화 키 세팅
			SecretKey key = Keys.hmacShaKeyFor(jwtSecretKey.getBytes());
			
			//2. 토큰 해석
			Claims claims = (Claims) Jwts.parser()
										 .verifyWith(key)	//해석에 필요한 Key
										 .build()
										 .parse(token)		//해석 대상 토큰
										 .getPayload();
			
			//3. 토큰에서 데이터 추출
			String userNo   = claims.get("userNo", String.class);
			String userRole = claims.get("userRole", String.class);
			
			m.setUserNo(userNo);
			m.setUserRole(userRole);
			
		}catch(SignatureException e) { // 발급 토큰과 요청 토큰 불일치
			return HttpStatus.UNAUTHORIZED; //401 코드 
		}catch(Exception e) { //토큰 유효 시간 경과
			return HttpStatus.FORBIDDEN; //403 코드
		}
		
		return m;
	}
}
