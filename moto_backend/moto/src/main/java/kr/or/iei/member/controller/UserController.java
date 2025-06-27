package kr.or.iei.member.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.common.annotation.NoTokenCheck;
import kr.or.iei.common.model.dto.ResponseDTO;
import kr.or.iei.member.model.dto.LoginUser;
import kr.or.iei.member.model.dto.User;
import kr.or.iei.member.model.service.UserService;

@RestController
@CrossOrigin("*")
@RequestMapping("/user")
public class UserController {
	
	
	@Autowired
	private UserService service;
	
	//아이디 중복 체크
	//query : select count(*) from tbl_user where user_id = #{_parameter}
		@GetMapping("/{userId}/chkId")
		@NoTokenCheck
		public ResponseEntity<ResponseDTO> chkUserId(@PathVariable String userId){
			ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "아이디 중복 체크 중, 오류가 발생하였습니다.", false, "error");
			
			try {
				int count = service.chkUserId(userId);
				res = new ResponseDTO(HttpStatus.OK, "", count, "success");
			}catch(Exception e) {
				e.printStackTrace();
			}
					
			
			return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
		}
		
		//이메일 중복 체크
		//query : select count(*) from tbl_user where user_email = #{_parameter}
		@GetMapping("/{userEmail}/chkEmail")
		@NoTokenCheck
		public ResponseEntity<ResponseDTO> chkUserEmail(@PathVariable String userEmail){
			ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "이메일 중복 체크 중, 오류가 발생하였습니다.", false, "error");
			
			try {
				int count = service.chkUserEmail(userEmail);
				res = new ResponseDTO(HttpStatus.OK, "", count, "success");
			}catch(Exception e) {
				e.printStackTrace();
			}
					
			
			return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
		}
		
		
		//회원가입
		//query : insert into tbl_user (user_no, user_id, user_nickname, user_email, user_password, user_role, user_join_date, user_post_like_count, user_comment_like_count, user_sanction_count, user_social_type) 
		//
		@PostMapping
		@NoTokenCheck
		public ResponseEntity<ResponseDTO> insertUser(@RequestBody User user){
			ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "회원가입 중, 오류가 발생하였습니다.", false, "error") ;
			
			try {
				int result = service.insertUser(user);
				
				if(result > 0) {
					res = new ResponseDTO(HttpStatus.OK, "회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.", true, "success");
				}else {
					res = new ResponseDTO(HttpStatus.OK, "회원가입 중, 오류가 발생하였습니다.", false, "warning");
				}
			}catch(Exception e) {
				e.printStackTrace();
			}
			
			
			return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
		}
		
		//로그인
		//query : select user_id as userId, user_password as userPassword, user_level as userLevel from tbl_user where user_id = userId
		@PostMapping("/login")
		@NoTokenCheck
		public ResponseEntity<ResponseDTO> userLogin(@RequestBody User user){
			
			
			ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "로그인 중, 오류가 발생하였습니다.", null, "error");
			
			try {
				LoginUser loginUser = service.userLogin(user);
				
				if(loginUser == null) {
					res = new ResponseDTO(HttpStatus.OK, "아이디 및 비밀번호를 확인하세요.", null, "warning");
				}else {
					res = new ResponseDTO(HttpStatus.OK, "", loginUser, "");
				}
				
			}catch(Exception e) {
				e.printStackTrace();
			}
			
			return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
		}
}
