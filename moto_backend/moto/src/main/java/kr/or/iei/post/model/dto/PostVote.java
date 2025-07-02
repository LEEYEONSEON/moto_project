package kr.or.iei.post.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PostVote {

	private int voteNo;
	private String voteQuestion;
}
