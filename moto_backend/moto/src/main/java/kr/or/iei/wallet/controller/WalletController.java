package kr.or.iei.wallet.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

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
	WalletService service;
	
	
	//지갑 조회
	@GetMapping("/{userNo}")
    public ResponseEntity<ResponseDTO> getWallet(@PathVariable int userNo) {

		ResponseDTO res = new ResponseDTO(HttpStatus.OK, "지갑 조회 중, 오류가 발생하였습니다.", null, "error");
        Wallet wallet = service.getWalletByUserNo(userNo);
        if(wallet == null) {
        	
        	res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "회원의 지갑이 존재하지 않습니다. ", null, "warning");
        	return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
        }
    	res = new ResponseDTO(HttpStatus.OK, "", wallet, "");


        return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
    }
	
	//회원가입시, 지갑 생성
	//	기본 값 1억원
	@PostMapping("/{userNo}")
	public ResponseEntity<ResponseDTO> createWallet(@PathVariable int userNo){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, null, null, "error");
        int result = service.createWallet(userNo);
        //지갑 생성이 되지 않았을 때
        if(result == 0) {
        	return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
        }
    	res = new ResponseDTO(HttpStatus.OK, null, null, null);

        return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//매수, 매도, copyTrading으로 인한 지갑 잔고 없데이트 
	//	바꿀 지갑 속성 : 보유현금, 총 평가금액
	//  - 처리
	//		- 기존 포트폴리오의 보유 종목과 수량에 따라 총금액(현금 + 보유종목 가치) 변경
	//		- 매수, 매도시
	//			- 현금에서 증감 처리
	//			- 보유종목에 수량 처리
	//			- 기존에 받아오던 실시간 종목들에 변화 반영
	
	@PutMapping("/{userNo}")
	public ResponseEntity<ResponseDTO> updateWallet(@RequestBody Wallet wallet){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, null, null, "error");
        int result = service.updateWallet(wallet);
        //지갑 수정이 되지 않았을 때
        if(result == 0) {
        
        	return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
        }
        
    	res = new ResponseDTO(HttpStatus.OK, null, null, null);

        return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	
	
	

}
