package kr.or.iei.asset.model.service;

import java.util.ArrayList;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import kr.or.iei.asset.model.dao.AssetDao;
import kr.or.iei.asset.model.dto.Asset;

@Service
public class AssetService {
	
	@Autowired
	private AssetDao dao;
	
	
	@Value("${finnhub.api.url}") private String finnHubApiUrl;
	@Value("${finnhub.api.key}") private String finnHubApiKey;
	private final RestTemplate rt = new RestTemplate(); //외부 REST API에 GET/POST 요청을 보낼 때 쓰이는 HTTP 클라이언트
	
	public ArrayList<Asset> selectAllAsset() {
		ArrayList<Asset> assetList = new ArrayList<>(); //기본 가산 정보 가져와 담을 리스트 객체
		
		//DB에서 기본 자산 정보 가져와서 assetList 에 담기
		assetList = dao.selectAllAsset();
		
		for(Asset asset : assetList) {
			String url = finnHubApiUrl + "?symbol=" + asset.getAssetCode() +"&token=" + finnHubApiKey; //심볼 별로 Finnhub 호출 url 조립
			// 1) Finnhub에서 받은 JSON 응답을 Map<String,Object> 형태로 변환해서 resp에 저장
			Map <String, Object> response = rt.getForObject(url, Map.class);
		}
		
		
		return assetList;
	}

}
