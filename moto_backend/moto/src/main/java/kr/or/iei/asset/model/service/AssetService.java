package kr.or.iei.asset.model.service;

import java.util.ArrayList;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import kr.or.iei.asset.model.dao.AssetDao;
import kr.or.iei.asset.model.dto.Asset;
import kr.or.iei.common.annotation.NoTokenCheck;

@Service
public class AssetService {
	
	@Autowired
	private AssetDao dao;
	
	
	@Value("${finnhub.api.url}") private String finnHubApiUrl;
	@Value("${finnhub.api.key}") private String finnHubApiKey;
	private final RestTemplate rt = new RestTemplate(); //외부 REST API에 GET/POST 요청을 보낼 때 쓰이는 HTTP 클라이언트
	
	@NoTokenCheck
	public ArrayList<Asset> selectAllAsset() {
		ArrayList<Asset> assetList = new ArrayList<>(); //기본 가산 정보 가져와 담을 리스트 객체
		
		//DB에서 기본 자산 정보 가져와서 assetList 에 담기
		assetList = dao.selectAllAsset();
	
		
		for(Asset asset : assetList) {	
			
			//심볼 별로 Finnhub 호출 url 조립
			String url = finnHubApiUrl + "?symbol=" + asset.getAssetCode() +"&token=" + finnHubApiKey; 
			
			try {
				// 1) Finnhub에서 받은 JSON 응답을 Map<String,Object> 형태로 변환해서 resp에 저장
				Map <String, Object> response = rt.getForObject(url, Map.class);
				
				// 2) response.get("c") 로 현재가 (c)를 꺼내 Number 로 캐스팅한 뒤, double 타입으로 변환.
				//FinnHb quote API 필드 중 "c" == 현재가, "pc"는 전일종가를 의미.
				double current = ((Number) response.get("c")).doubleValue();
				asset.setCurrentPrice(current);
				
				// 3) response.get("pc") 로 전일종가(pc) 를 꺼내 Number 로 캐스팅 한 뒤, double 타입으로 변환
				double prevClose = ((Number) response.get("pc")).doubleValue();
				//(현재주식가격-전일종가가격) / 전일종가 * 100 == 변동률 (%)
				asset.setPrevClose(prevClose);
				double priceChangeRate = ((current-prevClose)/prevClose * 100);
				asset.setPriceChangeRate(priceChangeRate);
		
			}catch (Exception e) {
				System.err.println(asset.getAssetCode() + ": 가격 조회 실패!" + e.getMessage());
			}
		}
		
		
		
		return assetList;
	}

}
