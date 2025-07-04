package kr.or.iei.post.model.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import kr.or.iei.common.model.dto.PageInfo;
import kr.or.iei.common.util.FileUtil;
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
	
	@Autowired
	private FileUtil fileUtil;

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
		
		int viewCnt = 3;
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
				
				ArrayList<PostFile> postFiles = dao.selectPostFileList(postNoArr);
				
				if(postFiles != null && !postFiles.isEmpty()) {
				postFileList.addAll(postFiles);
				postInfo.setFileList(postFileList);
				}
				postInfo.setPostList(postList);
			}
		
			HashMap<String, Object> postMap = new HashMap<String,Object>();
			postMap.put("pageInfo", pageInfo);
			postMap.put("postInfo", postInfo);
			
			return postMap;
		}
		
		return null;
		
		
		
	}

	@Transactional
	public int deletePost(int postNo) {
		
		return dao.deletePost(postNo);
	}

	
	public ArrayList<PostFile> updatePost(Post post, List<Integer> delFiles, List<MultipartFile> newFiles) throws IOException {
	    ArrayList<PostFile> deletedFiles = new ArrayList<>();

	    // 1. 게시글 수정
	    int result = dao.updatePostContent(post);

	    if (result > 0) {
	        // 2. 삭제 파일이 있으면
	        if (delFiles != null && !delFiles.isEmpty()) {

	            // 2-1. 삭제할 파일 정보를 먼저 조회
	            deletedFiles = new ArrayList<>(dao.selectPostFilesByIds(delFiles));

	            // 2-2. 실제 DB 삭제
	            dao.deletePostFiles(delFiles);
	        }

	        // 3. 새 파일 추가
	        if (newFiles != null && !newFiles.isEmpty()) {
	            int order = 0;
	            for (MultipartFile mfile : newFiles) {
	                // 서버에 파일 업로드
	                String savedFilePath = fileUtil.uploadFile(mfile, "/board/");

	                // DTO 생성
	                PostFile newFile = new PostFile();
	                newFile.setPostImgName(mfile.getOriginalFilename());
	                newFile.setPostImgPath(savedFilePath);
	                newFile.setPostNo(post.getPostNo());
	                newFile.setPostImgFileOrder(order++);

	                // DB 삽입
	                dao.insertPostFile(newFile);
	            }
	        }
	    }

	    return deletedFiles;
	}
}
