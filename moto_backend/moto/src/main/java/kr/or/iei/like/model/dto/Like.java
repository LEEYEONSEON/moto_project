package kr.or.iei.like.model.dto;

import kr.or.iei.comment.model.dto.Comment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Like {
	private int likeNo;
	private int userNo;
	private String likeTargetType;
	private String likeTargetId;

}
