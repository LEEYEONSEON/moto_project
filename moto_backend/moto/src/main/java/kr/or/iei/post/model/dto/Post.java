package kr.or.iei.post.model.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Post {

	private int postNo;
	private String postContent;
	private String postDate;
	private int postCommentCnt;
	private int postLikeCnt;
	private String userNo;
	private String userNickname;
	
	private List<PostFile> postFiles;
	
}
