package kr.or.iei.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//  회원 기본 정보 수정용 DTO
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserUpdateDto {
    private String userId;           // 수정할 사용자 ID
    private String userNickname;     // 변경할 닉네임
    private String userEmail;        // 변경할 이메일
    private String userProfileImg;   // 변경할 프로필 이미지 URL
}
