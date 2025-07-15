package kr.or.iei.comment.model.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Comment {
	private int commentNo;
	private int postNo;
	private int userNo;
	private String userNickname;
	private String commentContent;
	private String commentDate;
	private Integer parentCommentNo; //null 가능해야 일반 댓글일 때 오류 안남 == null 이든 숫자든 그대로 전달
	private int commentLikeCnt;
	private String loginUserNo;
	private boolean commentLikeYn;;//현재 로그인한 사용자가좋아요 눌럿는지에 대한 값 1: 좋아요 누름 (true), 0: 좋아요 안누름 (false). mybatis 가 숫자에 따라 자동으로 true/false 변환해줌.

}
