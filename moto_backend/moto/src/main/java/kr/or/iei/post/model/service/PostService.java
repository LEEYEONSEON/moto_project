package kr.or.iei.post.model.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import kr.or.iei.post.model.dao.PostDao;
import kr.or.iei.post.model.dto.Post;
import kr.or.iei.post.model.dto.PostFile;

@Service
public class PostService {

	@Autowired
	private PostDao dao;

	public int insertPost(Post post, ArrayList<PostFile> fileList) {
		int postNo = dao.selectPostNo();	// 게시글 번호 조회
		
		post.setPostNo(postNo);
		
		int result = dao.insertPost(post);
		
		if(result > 0) {
			for(int i=0; i<fileList.size(); i++) {
				PostFile file = fileList.get(i);
				file.setPostNo(postNo);
				dao.insertPostFile(file);

			}
		}
		return result;
	}
}
