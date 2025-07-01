package kr.or.iei.common.oauth.dto;

import kr.or.iei.user.model.dto.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OAuthLoginUser {
	private OAuthTokenResponse tokens;
	private User user;
}
