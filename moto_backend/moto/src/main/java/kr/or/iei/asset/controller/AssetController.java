package kr.or.iei.asset.controller;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import kr.or.iei.asset.model.dto.Asset;
import kr.or.iei.asset.model.service.AssetService;
import kr.or.iei.asset.websocket.PriceBroadcaster;
import kr.or.iei.common.annotation.NoTokenCheck;



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
	
	

	
}
