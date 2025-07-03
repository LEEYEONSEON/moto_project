package kr.or.iei.post.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PostInfo {

	private List<Post> postList;
	private List<PostFile> fileList;
}
