package kr.or.iei.user.model.dto;

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
	public String getUserId() {
		// TODO Auto-generated method stub
		return null;
	}
	public String getUserRole() {
		// TODO Auto-generated method stub
		return null;
	}
}
