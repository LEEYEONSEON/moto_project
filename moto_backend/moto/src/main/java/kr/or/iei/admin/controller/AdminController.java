package kr.or.iei.admin.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
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
		
		ResponseDTO res = new ResponseDTO(HttpStatus.OK, "회원 리스트 조회중, 오류가 발생하였습니다.", null, "error");
		
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
}
