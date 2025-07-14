package kr.or.iei.asset.controller;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import kr.or.iei.asset.model.dto.Asset;
import kr.or.iei.asset.model.dto.TradeDto;
import kr.or.iei.asset.model.service.AssetService;
import kr.or.iei.asset.websocket.PriceBroadcaster;
import kr.or.iei.common.annotation.NoTokenCheck;
import kr.or.iei.common.model.dto.ResponseDTO;



@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/asset")
public class AssetController {
	
	@Autowired
	private AssetService service;
	
	// 실시간 방송 기능 주입
    @Autowired
    private PriceBroadcaster priceStream;
	
	
	@GetMapping("")
	@NoTokenCheck
	public List<Asset> getAssetList() {
		List<Asset> allAssetList = service.selectAllAsset();
		//System.out.println(allAssetList);
		
		return allAssetList;
	}
	
	@GetMapping("/price-stream")
	@NoTokenCheck
	public SseEmitter streamPrice() {
	    return priceStream.subscribe(); 
	}
	
	@PostMapping("/insert")
	public ResponseEntity<ResponseDTO> insertBuyAsset(@RequestBody TradeDto trade){
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "주식 구매 중, 오류가 발생하였습니다.", false, "error");
		System.out.println(trade);
		try {
		
		int result = service.insertBuyAsset(trade);
		
		if(result > 0) {
			res = new ResponseDTO(HttpStatus.OK, "주식 매수가 완료되었습니다.", true, "success");
		}else {
			res = new ResponseDTO(HttpStatus.OK, "주식 매수 중, 오류가 발생하였습니다.", false, "warning");
		}
			
		} catch (Exception e) {
			
			if (e instanceof java.net.SocketException &&
			        e.getMessage() != null &&
			        e.getMessage().contains("Connection reset by peer")) {
			        System.err.println("❌ KIS 서버에서 연결 거부");
			    }
			
			//e.printStackTrace();
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
