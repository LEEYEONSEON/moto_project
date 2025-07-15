package kr.or.iei.comment.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.comment.model.dto.Comment;
import kr.or.iei.comment.model.service.CommentService;
import kr.or.iei.common.annotation.NoTokenCheck;
import kr.or.iei.common.model.dto.ResponseDTO;
import kr.or.iei.like.model.dto.Like;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/comment")
public class CommentController {
	@Autowired private CommentService service;
	
	@NoTokenCheck
	@GetMapping("/list")
	public ResponseEntity<ResponseDTO> selectCommentList(@RequestParam int postNo, @RequestParam String loginUserNo) {

		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "댓글 조회 중, 오류가 발생하였습니다.", false, "error");
			
		try {
				Comment comment = new Comment();
			 	comment.setPostNo(postNo);
			 	comment.setLoginUserNo(loginUserNo);
				
				List<Comment> commentList = service.selectCommentList(comment);
			

				res = new ResponseDTO(HttpStatus.OK, "", commentList , "");

		} catch (Exception e) {
			e.printStackTrace();
			res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "댓글 조회 중, 오류가 발생하였습니다.", false, "error");
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	
	@PostMapping("/insert")
	public ResponseEntity<ResponseDTO> insertComment(@RequestBody Comment comment){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "댓글 조회 중, 오류가 발생하였습니다.", false, "error");
				
		try {
			
			int result = service.insertComment(comment);
			
			
			
			res = new ResponseDTO(HttpStatus.OK, "댓글 등록 완료", result , "");

		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	@DeleteMapping("/delete/{commentNo}")
	public ResponseEntity<ResponseDTO> deleteComment(@PathVariable String commentNo){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "댓글 삭제 중, 오류가 발생하였습니다.", false, "error");
				
		try {
			
			int result = service.deleteComment(commentNo);
			
			
			
			res = new ResponseDTO(HttpStatus.OK, "댓글 삭제 완료", result , "");

		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	@PatchMapping("/update")
	public ResponseEntity<ResponseDTO> deleteComment(@RequestBody Comment comment){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "댓글 삭제 중, 오류가 발생하였습니다.", false, "error");
				
		try {
			
			int result = service.updateComment(comment);
			
			
			
			res = new ResponseDTO(HttpStatus.OK, "댓글 수정 완료", result , "");

		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	
	
	
	
}
