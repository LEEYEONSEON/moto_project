package kr.or.iei.admin.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.common.model.dto.ResponseDTO;
import kr.or.iei.user.model.dto.User;
import kr.or.iei.user.model.service.UserService;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/admin")
public class AdminController {
	
	@Autowired
	private UserService service;
	
	@GetMapping("/allList")
	public ResponseEntity<ResponseDTO> selectAllList(){
		
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "회원 리스트 조회중, 오류가 발생하였습니다.", null, "error");
		
		try {
			
			ArrayList<User> userList = service.selectAllList();
			
			if(userList != null) {
				res = new ResponseDTO(HttpStatus.OK, "", userList, "");
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res,res.getHttpStatus());
	}
	
	@PatchMapping("/user")
	public ResponseEntity<ResponseDTO> updateUserRole(@RequestBody User user){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "회원 등급 변경 중, 오류가 발생하였습니다.", false, "error");
		System.out.println(user);
		try {
			
			int result = service.updateUserRole(user);
			
			if(result > 0) {
				res = new ResponseDTO(HttpStatus.OK,"회원 등급 변경이 완료되었습니다.", true, "success");
			}else {
				res = new ResponseDTO(HttpStatus.OK, "회원 등급 변경 중, 오류가 발생하였습니다.", false, "warning");
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	@DeleteMapping("/user/{userNo}" )
	public ResponseEntity<ResponseDTO> deleteUser(@PathVariable int userNo){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "회원 삭제 중, 오류가 발생하였습니다.", false, "error");
		
		try {
			
			int result = service.deleteUser(userNo);
			
			if(result > 0) {
				res = new ResponseDTO(HttpStatus.OK, "회원 삭제가 완료되었습니다.", true, "success");
			}else {
				res = new ResponseDTO(HttpStatus.OK, "회원 삭제 중, 오류가 발생하였습니다.", false, "warning");
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDTO>(res,res.getHttpStatus());
	}

}
