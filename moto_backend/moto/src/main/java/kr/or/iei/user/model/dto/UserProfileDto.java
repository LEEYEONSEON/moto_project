package kr.or.iei.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// ▶ 마이페이지 조회용 DTO
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserProfileDto {
    private String userId;           // 사용자 ID
    private String userNickname;     // 닉네임
    private String userEmail;        // 이메일
    private String userProfileImg;   // 프로필 이미지
    private String userType;         // 로그인 방식 (일반, 소셜)
    private String userGrade;        // 사용자 등급
}
