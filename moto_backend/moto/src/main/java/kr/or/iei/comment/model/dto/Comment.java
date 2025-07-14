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

}
