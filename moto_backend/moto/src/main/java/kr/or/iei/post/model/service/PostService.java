package kr.or.iei.post.model.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import kr.or.iei.common.model.dto.PageInfo;
import kr.or.iei.common.util.PageUtil;
import kr.or.iei.post.model.dao.PostDao;
import kr.or.iei.post.model.dto.Post;
import kr.or.iei.post.model.dto.PostFile;
import kr.or.iei.post.model.dto.PostInfo;

@Service
public class PostService {

	@Autowired
	private PostDao dao;
	
	@Autowired
	private PageUtil pageUtil;

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

	public HashMap<String, Object> selectPostList(int reqPage) {
		
		int viewCnt = 5;
		int pageNaviSize = 5;
		int totalCount = dao.selectPostListCnt();
		
		PageInfo pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);
		
		PostFile file = new PostFile();
	
		//postList 조회
		ArrayList<Post> postList = dao.selectPostList(pageInfo);
		
		ArrayList<PostFile> postFileList = new ArrayList<>();
		
		PostInfo postInfo = new PostInfo();
		
		// postFile 가져오기
		if(postList != null) {
			
			
			
			for(int i=0; i<postList.size(); i++) {
				Post post = postList.get(i);
				
				ArrayList<Integer> postNoArr = new ArrayList<>();
				postNoArr.add(post.getPostNo());
				System.out.println(postNoArr);
				ArrayList<PostFile> postFiles = dao.selectPostFileList(postNoArr);
				System.out.println(postFiles);
				if(postFiles != null && !postFiles.isEmpty()) {
				postFileList.addAll(postFiles);
				postInfo.setFileList(postFileList);
				postInfo.setPostList(postList);
				}
			}
		
			HashMap<String, Object> postMap = new HashMap<String,Object>();
			postMap.put("pageInfo", pageInfo);
			postMap.put("postInfo", postInfo);
			
			return postMap;
		}
		
		return null;
		
		
		
	}
}
