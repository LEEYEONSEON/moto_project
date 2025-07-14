package kr.or.iei.watchlist.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
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

import kr.or.iei.asset.model.dto.TradeDto;
import kr.or.iei.common.model.dto.ResponseDTO;
import kr.or.iei.watchlist.model.dto.Watchlist;
import kr.or.iei.watchlist.model.service.WatchlistService;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/watchlist")
public class WatchlistController {
	
	@Autowired
	private WatchlistService service;
	
	
	@PostMapping("")
	public ResponseEntity<ResponseDTO> addWatchlist(@RequestBody Map<String, String> map) {
		
		String assetCode = map.get("assetCode");
		String userNo = map.get("userNo");
		
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "워치리스트에 종목 추가 중, 오류가 발생하였습니다.", false, "error");
		
		try {
			
			if (userNo == null) {
				res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "로그인 먼저 진행해주세요", false, "warning"); // 로그인 안 된 경우
		    }else { //로그인 된 경우
		    	
		    	int result = service.addWatchlist(assetCode, userNo);
		    	
		    	if(result>0) { //추가 성공.
		    		res = new ResponseDTO(HttpStatus.OK, "해당 종목이 워치리스트에 추가되었습니다.", true, "success");
		    	}else {
		    		res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "워치리스트에 종목 추가 중, 오류가 발생하였습니다.", false, "error");
		    	}
		    }
		}catch (DuplicateKeyException e) {
	        res = new ResponseDTO(HttpStatus.CONFLICT, "이미 추가된 종목입니다.", false, "error"); // 409 == 이렇게 해두면, 굳이 mapper 에서 중복체크 로직 실행할 필요 없음.
	    }catch (Exception e) {
			e.printStackTrace();
		}

		return new ResponseEntity<ResponseDTO>(res,res.getHttpStatus());
	}
	
	// 즐겨찾기 삭제 (DELETE)
	@DeleteMapping("")
	public ResponseEntity<ResponseDTO> deleteWatchlist(@RequestParam String assetCode, 
			  										   @RequestParam String userNo) {
	    
	    ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "워치리스트에서 제거 중 오류 발생", false, "error");

	    try {
	        int result = service.deleteWatchlist(assetCode, userNo);

	        if(result > 0) {
	            res = new ResponseDTO(HttpStatus.OK, "해당 종목이 워치리스트에서 제거되었습니다.", true, "success");
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	    }

	    return new ResponseEntity<>(res, res.getHttpStatus());
	}
	
	//즐겨찾기 조회용
	@GetMapping("/{userNo}")
	public ResponseEntity<ResponseDTO> getWatchlist(@PathVariable String userNo) {
	   
	    
	    ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "", false, "error");
	    
	    try {
	    	List<Watchlist> list = service.selectWatchlistByUserNo(userNo); // <-- 유저 번호로 종목 코드 목록 조회
	    	
	            res = new ResponseDTO(HttpStatus.OK, "", list, "success");
	        
	    } catch (Exception e) {
	        e.printStackTrace();
	        res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "조회 중 오류 발생", false, "error");
	    }

	    return new ResponseEntity<>(res, res.getHttpStatus());
	}
	
	
	@PostMapping("/insert")
	public ResponseEntity<ResponseDTO> insertWatchlistBuyAsset(@RequestBody TradeDto trade){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "주식 매수 중, 오류가 발생하였습니다.", false, "error");
		
		try {
		
		int result = service.insertWatchlistBuyAsset(trade);
		
		if(result > 0) {
			res = new ResponseDTO(HttpStatus.OK, "주식 매수가 완료되었습니다.", true, "success");
		}else {
			res = new ResponseDTO(HttpStatus.OK, "주식 매수 중, 오류가 발생하였습니다.", false, "warning");
		}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res,res.getHttpStatus());
	}
	
	@PatchMapping("/sellAsset")
	public ResponseEntity<ResponseDTO> watchListSellAsset(@RequestBody TradeDto trade){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "주식 매도 중, 오류가 발생하였습니다.", false, "error");
		
		try {
			
		int result = service.watchListSellAsset(trade);
		if(result > 0) {
			res = new ResponseDTO(HttpStatus.OK, "주식 매도가 완료되었습니다.", true, "success");
		}else {
			res = new ResponseDTO(HttpStatus.OK, "주식 매도 중, 오류가 발생하였습니다.", false, "warning");
		}
		
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());  
				
	}

	
	
}
