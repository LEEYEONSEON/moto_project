<<<<<<< HEAD:moto_backend/moto/src/main/java/kr/or/iei/member/model/dto/LoginUser.java
package kr.or.iei.member.model.dto;
=======
package kr.or.iei.user.model.dto;
>>>>>>> master:moto_backend/moto/src/main/java/kr/or/iei/user/model/dto/LoginUser.java

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LoginUser {
	private User user;
	private String accessToken;
	private String refreshToken;
}
