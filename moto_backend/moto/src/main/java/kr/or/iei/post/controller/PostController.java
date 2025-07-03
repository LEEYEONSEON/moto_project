package kr.or.iei.post.controller;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.or.iei.common.annotation.NoTokenCheck;
import kr.or.iei.common.model.dto.ResponseDTO;
import kr.or.iei.common.util.FileUtil;
import kr.or.iei.post.model.dto.Post;
import kr.or.iei.post.model.dto.PostFile;
import kr.or.iei.post.model.service.PostService;
import kr.or.iei.user.model.dto.User;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/post")
public class PostController {

	@Autowired
	private PostService service;
	
	@Autowired
	private FileUtil fileUtil;
	
	
	@PostMapping("/insert")
	public ResponseEntity<ResponseDTO> insertPost(@ModelAttribute MultipartFile [] postFile,
												  @ModelAttribute Post post,
												  @ModelAttribute User loginMember
												  ){
		
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "게시글 작성 중, 오류가 발생하였습니다.", false, "error");
		
		try {
			ArrayList<PostFile> fileList = new ArrayList<>();	//postFile 배열
			
			if(fileList != null) {
				for(int i=0; i<postFile.length; i++) {
					MultipartFile mFile = postFile[i];	// file 1개
					
					String filePath = fileUtil.uploadFile(mFile, "/board/");	//파일 업로드
					
					PostFile file = new PostFile();	
					file.setPostImgName(mFile.getOriginalFilename());	// 사용자가 업로드한 기존 img명
					file.setPostImgPath(filePath);						// 서버 저장 이미지명
					
					fileList.add(file);

				}
			}
			
			int result = service.insertPost(post, fileList);
			
			if(result > 0) {
				res = new ResponseDTO(HttpStatus.OK, "게시글이 작성되었습니다.", true, "success");
			}else {
				res = new ResponseDTO(HttpStatus.OK, "게시글 작성 중, 오류가 발생하였습니다.", false, "warning");
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res,res.getHttpStatus());
		
	}
	
	@NoTokenCheck
	@GetMapping("/getList/{reqPage}")
	public ResponseEntity<ResponseDTO> selectPostList(@PathVariable int reqPage){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "게시글 조회 중, 오류가 발생하였습니다.", false, "error");
		
		try {
			
			HashMap<String, Object> postMap = service.selectPostList(reqPage);
			res = new ResponseDTO(HttpStatus.OK, "", postMap , "");
			System.out.println(postMap.get("postInfo"));
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
}
