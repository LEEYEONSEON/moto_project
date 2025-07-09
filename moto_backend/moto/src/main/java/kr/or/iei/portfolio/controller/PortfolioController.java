package kr.or.iei.portfolio.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.common.annotation.NoTokenCheck;
import kr.or.iei.common.model.dto.ResponseDTO;
import kr.or.iei.portfolio.model.dto.Portfolio;
import kr.or.iei.portfolio.model.service.PortfolioService;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/portfolio")
public class PortfolioController {
	@Autowired
	private PortfolioService service;
	
	
	
	
	//포트폴리오 조회용
	@GetMapping("/{userNo}")
	@NoTokenCheck
	public ResponseEntity<ResponseDTO> getPortfolioByUserNo(@PathVariable String userNo) {
	   
		
	    ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "", false, "error");
		
	    //System.out.println("userNo : " + userNo);
	    try {
			
	    	List<Portfolio> list = service.getPortfolioByUserNo(userNo); // <-- 유저 번호로 포트폴리오 조회
	    	System.out.println("list: " + list);
	    	
	            res = new ResponseDTO(HttpStatus.OK, "", list, "success");
	        
	    } catch (Exception e) {
	        e.printStackTrace();
	        res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "조회 중 오류 발생", false, "error");
	    }

	    return new ResponseEntity<>(res, res.getHttpStatus());
	}
	
	
}
