package kr.or.iei.asset.websocket;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.or.iei.asset.model.dto.Asset;
import kr.or.iei.asset.model.service.AssetService;
import okhttp3.*;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;

@Component
public class KisWebSocket extends WebSocketListener{
	
		private final ObjectMapper objectMapper = new ObjectMapper();
		private WebSocket webSocket;
		 
		@Value("${kis.app.key}")
	    private String appKey;
	
	    @Value("${kis.app.secret}")
	    private String appSecret;
	    
	    @Value("${kis.ws.url}")
	    private String url;
	    
	    private String approvalKey;
	    
	    @Autowired
	    private AssetService service;
	    
	    // 실시간 방송 기능 주입
	    @Autowired
	    private PriceBroadcaster priceStream;
	
	    // 한국투자증권 클라이언트 ID(AppKey), Secret(AppSecret) 이용해서 한투 access token 발급받는 작업
	    public String getAccessToken() {
	        RestTemplate rt = new RestTemplate();
	
	        HttpHeaders headers = new HttpHeaders();
	              
	        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED); // <-- 폼 전송 형식 지정
	        
	        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
	        body.add("grant_type", "client_credentials"); // <-- 고정값
	        body.add("appkey", appKey); // <-- 발급받은 키
	        body.add("appsecret", appSecret); // <-- 발급받은 시크릿
	
	        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);
	
	        String url = "https://openapi.koreainvestment.com:9443/oauth2/token"; // <-- 한투 인증 엔드포인트
	
	        ResponseEntity<Map> response = rt.postForEntity(url, entity, Map.class);
	        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
	            String accessToken = Objects.requireNonNull(response.getBody().get("access_token")).toString();
	            return accessToken;
	        }
	        return response.getBody().get("access_token").toString(); // <-- 발급된 토큰 반환
	    }
	    
	    
	    public String getApprovalKey() {
	    	if(approvalKey != null) {
	    		return approvalKey;
	    	}
	    	
	        RestTemplate rt = new RestTemplate();
	
	        HttpHeaders headers = new HttpHeaders();
	        headers.setContentType(MediaType.APPLICATION_JSON);
	        
	        String accessToken = getAccessToken();
	        
	        headers.add("authorization", "Bearer " + accessToken);
	
	        Map<String, String> requestBody = new HashMap<>();
	        
	        requestBody.put("grant_type", "client_credentials");
	        requestBody.put("appkey", appKey);
	        requestBody.put("secretkey", appSecret);
	        
	        HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);
	        
	        String url = "https://openapi.koreainvestment.com:9443/oauth2/Approval"; //Approval key 는 9443에서 받기.
	       
	        ResponseEntity<Map> response = rt.postForEntity(url, entity, Map.class);
	        
	        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
	            String approvalKey = Objects.requireNonNull(response.getBody().get("approval_key")).toString();
	            System.out.println("appporval key 발급 완료"); 
	            System.out.println(approvalKey);
	            return approvalKey;
	        }
	
	        return response.getBody().get("approval_key").toString();
	    }
	    
	    public void connectAndSend() {
	        OkHttpClient client = new OkHttpClient();

	        Request request = new Request.Builder()
	            .url(this.url) 
	            .build();

	        client.newWebSocket(request, this);
	        
	        //연결 종료 코드
	        // client.dispatcher().executorService().shutdown();
	    }
	    
	    //연결 성공 시, 호출되는 메소드
	    @Override
	    public void onOpen(WebSocket webSocket, Response response) {
	        this.webSocket = webSocket;
	        
	        System.out.println("WebSocket 연결 성공");
	        
	        Map<String, Object> header = new HashMap<String, Object>();
            header.put("approval_key", getApprovalKey());
            header.put("custtype", "P");			//P : 개인, B : 법인
            header.put("tr_type", "1");				//1 : 등록, 2 : 해제
            header.put("content-type", "utf-8");
            
            
            List<Asset> assetList = service.selectAllAsset();
            
            for(int i=0; i<assetList.size(); i++) {
               Asset asset = assetList.get(i);
            
            Map<String, String> input = new HashMap<>();
            input.put("tr_id", "H0STCNT0");
            input.put("tr_key", asset.getAssetCode());  //삼성전자 종목 코드
            
            Map<String, Object> body = new HashMap<>();
            body.put("input", input);
            
            Map<String, Object> request = new HashMap<>();
            request.put("header", header);
            request.put("body", body);
            
            String requestJson = "";
            
            try {
				requestJson = objectMapper.writeValueAsString(request);
			} catch (JsonProcessingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
            
            webSocket.send(requestJson);
	        System.out.println("메세지 전송 : " + requestJson);
            
            }
            

            

            
            
			
            
	       
	    }
	    
	    //메시지 수신 시 호출
	    @Override
	    public void onMessage(WebSocket webSocket, String text) {
	        if(!text.startsWith("{") && text.startsWith("0")) {
	        	
	        	String [] allData = text.split("\\|");
	        	
	        	String trId = allData[1]; 		//TR ID => "H0STCNT0"
	        	String dataCnt = allData[2];	//체결 데이터 갯수
	        	String data = allData[3];		//실제 데이터 ^로 구분되어 있음. Ex) 005930^112738^62200^2^1400^2.30^62107.12^61300^62700^61100^62200^62100^74^14855897^922656921050^35401^52383^16982^158.15^5471885^8653611^1^0.59^98.72^090009^2^900^091751^5^-500^090009^2^1100^20250703^20^N^58096^131529^2520021^1259279^0.25^8816018^168.51^0^^61300^005930^112739^62200^2^1400^2.30^62107.12^61300^62700^61100^62200^62100^1^14855898^922656983250^35401^52384^16983^158.15^5471885^8653612^1^0.59^98.72^090009^2^900^091751^5^-500^090009^2^1100^20250703^20^N^58022^131529^2520027^1259279^0.25^8816018^168.51^0^^61300^005930^112739^62200^2^1400^2.30^62107.12^61300^62700^61100^62200^62100^28^14855926^922658724850^35401^52385^16984^158.15^5471885^8653640^1^0.59^98.72^090009^2^900^091751^5^-500^090009^2^1100^20250703^20^N^58022^131529^2520027^1259279^0.25^8816018^168.51^0^^61300
	        	
	        	String[] fields = data.split("\\^");
	        	
	        	String assetCode      = fields[0];   // 유가증권단축종목코드
	        	String currentTime    = fields[1];   // 주식체결시간
	        	String currentPrice   = fields[2];   // 주식현재가
	        	String sign           = fields[3];   // 전일대비부호
	        	String priceChange    = fields[4];   // 전일대비
	        	String changeRate     = fields[5];   // 전일대비율
	        	String avgPrice       = fields[6];   // 가중평균주식가격
	        	String open           = fields[7];   // 주식시가
	        	String high           = fields[8];   // 주식최고가
	        	String low            = fields[9];   // 주식최저가
	            String ask1           = fields[10];  // 매도호가1
	            String bid1           = fields[11];  // 매수호가1
	            String tradeVolume    = fields[12];  // 체결거래량
	            String accVolume      = fields[13];  // 누적거래량
	            String accAmount      = fields[14];  // 누적거래대금
	            String askCnt         = fields[15];  // 매도체결건수
	            String bidCnt         = fields[16];  // 매수체결건수
	            String netBidCnt      = fields[17];  // 순매수체결건수
	            String intensity      = fields[18];  // 체결강도
	            String totalAskQty    = fields[19];  // 총매도수량
	            String totalBidQty    = fields[20];  // 총매수수량
	            String tradeType      = fields[21];  // 체결구분
	            String bidRatio       = fields[22];  // 매수비율
	            String volumeRate     = fields[23];  // 전일거래량대비등락율
	            String openTime       = fields[24];  // 시가시간
	            String openType       = fields[25];  // 시가대비구분
	            String openDiff       = fields[26];  // 시가대비
	            String highTime       = fields[27];  // 최고가시간
	            String highType       = fields[28];  // 고가대비구분
	            String highDiff       = fields[29];  // 고가대비
	            String lowTime        = fields[30];  // 최저가시간
	            String lowType        = fields[31];  // 저가대비구분
	            String lowDiff        = fields[32];  // 저가대비
	            String businessDate   = fields[33];  // 영업일자
	            String marketType     = fields[34];  // 신장운영구분코드
	            String tradeStop      = fields[35];  // 거래정지여부
	            String askRemain      = fields[36];  // 매도호가잔량
	            String bidRemain      = fields[37];  // 매수호가잔량
	            String totalAskRemain = fields[38];  // 총매도호가잔량
	            String totalBidRemain = fields[39];  // 총매수호가잔량
	            String turnoverRate   = fields[40];  // 거래량회전율
	            String prevVolume     = fields[41];  // 전일동시간누적거래량
	            String prevVolumeRate = fields[42];  // 전일동시간누적거래량비율
	            String timeCode       = fields[43];  // 시간구분코드
	            String endType        = fields[44];  // 임의종료구분코드
	            String viBasePrice    = fields[45];  // 정적VI발동기준가
	            
	            List<Asset> assetList = service.selectAllAsset();
	            
	            for(int i=0; i<assetList.size(); i++) {
	                 Asset asset = assetList.get(i);
	                 if (asset.getAssetCode().equals(assetCode)) {
	                    
	                    //System.out.println("Matching asset found for code: " + assetCode);
	                    
	                    asset.setCurrentPrice(currentPrice);
	                    asset.setPriceChange(priceChange);
	                    asset.setChangeRate(changeRate);
	                    priceStream.broadcast(asset);
	                    
	                    //System.out.println("Updated asset in KisWebSocket: " + asset);
	                    
	                 }
	              }
	        	
	            
	            //System.out.println(trId);
	        	//System.out.println(dataCnt);
	        	//data에서, 원하는 데이터 추출하여 DB 저장
	        	System.out.println(data);
	        }else {
	        	//응답 헤더 및 바디
	        	System.out.println(text);
	        }
	        
	        
	    }


	    @Override
	    public void onClosed(WebSocket webSocket, int code, String reason) {
	        System.out.println("WebSocket 종료");
	    }

	    @Override
	    public void onFailure(WebSocket webSocket, Throwable t, Response response) {
	        System.err.println("WebSocket 오류");
	    }
}


