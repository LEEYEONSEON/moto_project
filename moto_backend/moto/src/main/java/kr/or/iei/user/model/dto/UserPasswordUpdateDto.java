package kr.or.iei.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// ▶ 비밀번호 변경용 DTO
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserPasswordUpdateDto {
    private String userId;           // 사용자 ID
    private String currentPassword;  // 현재 비밀번호
    private String newPassword;      // 새 비밀번호
}
