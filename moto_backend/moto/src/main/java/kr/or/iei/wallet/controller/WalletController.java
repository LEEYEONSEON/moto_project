package kr.or.iei.wallet.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.common.model.dto.ResponseDTO;
import kr.or.iei.wallet.model.dto.Wallet;
import kr.or.iei.wallet.model.service.WalletService;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/wallet")
public class WalletController {

	@Autowired
	private WalletService service;
	
	@GetMapping("/{userNo}")
	public ResponseEntity<ResponseDTO> searchWallet(@PathVariable int userNo){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "지갑 조회 중, 오류가 발생하였습니다.", false, "error");
		
		try {
		
			Wallet wallet = service.searchWallet(userNo);
			
			System.out.println(cnt);
			if(cnt > 0) {
				res = new ResponseDTO(HttpStatus.OK, "", cnt, "");
				
			}else {
				res = new ResponseDTO(HttpStatus.OK, "지갑 조회 중, 오류가 발생하였습니다.", cnt, "warning");
			}
			
		} catch (Exception e) {
			
		}
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
}
