package kr.or.iei.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class User {
	private String userNo;			//시퀀스 기반 내부 고유 식별자
	private String userId;			//사용자 고유 ID (중복 불가, 로그인용)
	private String userNickname;	//사용자 닉네임
	private String userEmail;		//로그인 이메일
	private String userPassword;	//암호화된 비밀번호
	private String userRole;		//1: 관리자 2: 회원, 3: 정지
	private String userJoinDate;		//가입일
	private String userPostLikeCount;	//활동 인기 지표
	private String userCommentLikeCount;//활동 인기 지표
	private String userSanctionCount;	//신고 제재 누적용
	private String userSocialType;	//로그인 방식 구분
	private String userProfileImg;	//프로필 이미지 경로
}
