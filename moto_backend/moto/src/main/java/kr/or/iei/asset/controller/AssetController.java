package kr.or.iei.asset.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.asset.model.dto.Asset;
import kr.or.iei.asset.model.service.AssetService;
import kr.or.iei.common.annotation.NoTokenCheck;
import kr.or.iei.common.model.dto.ResponseDTO;

@RestController
@CrossOrigin("*")
@RequestMapping("/asset")
public class AssetController {
	
	@Autowired
	private AssetService service;
	
	
	//기존 assetList 불러오기
	@GetMapping
	@NoTokenCheck
	public ResponseEntity<ResponseDTO>getAssetList() {
		
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "자산 조회 중, 오류가 발생하였습니다.", false, "error");
		
		try {
			ArrayList<Asset> assetList = service.selectAllAsset();	
			res = new ResponseDTO(HttpStatus.OK, "", assetList, "");
		}catch(Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
}
