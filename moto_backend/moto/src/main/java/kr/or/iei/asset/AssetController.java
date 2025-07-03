package kr.or.iei.asset;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.common.model.dto.ResponseDTO;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/asset")
public class AssetController {
	
	
	@Value("hantu.app-key")
	String appKey;
	@Value("hantu.secret-key")
	String secretKey;
	
	
	@GetMapping("/approval")
	public ResponseEntity<ResponseDTO> getApprovalKey ()throws IOException{
        String apiUrl = "https://openapivts.koreainvestment.com:29443/oauth2/Approval"; // 모의투자 URL

        // 요청 본문 JSON
        String requestBody = String.format(
            "{\"grant_type\":\"client_credentials\",\"appkey\":\"%s\",\"secretkey\":\"%s\"}",
            appKey, secretKey
        );

        // URL 및 연결 설정
        URL url = new URL(apiUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json; charset=utf-8");
        conn.setDoOutput(true);

        // 요청 본문 전송
        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = requestBody.getBytes("utf-8");
            os.write(input, 0, input.length);
        }

        // 응답 읽기
        int status = conn.getResponseCode();
        InputStream responseStream = (status >= 200 && status < 300)
                ? conn.getInputStream()
                : conn.getErrorStream();

        StringBuilder responseBuilder = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(responseStream, "utf-8"))) {
            String responseLine;
            while ((responseLine = br.readLine()) != null) {
                responseBuilder.append(responseLine.trim());
            }
        }

        String response = responseBuilder.toString();

        // approval_key 추출 (단순한 파싱)
        String approvalKey = "";
        if (response.contains("approval_key")) {
            int start = response.indexOf("approval_key") + 15;
            int end = response.indexOf("\"", start);
            approvalKey = response.substring(start, end);
            System.out.println("approval_key : "+approvalKey);
        } else {
            throw new IOException("approval_key가 응답에 없습니다: " + response);
        }
        ResponseDTO res = new ResponseDTO(HttpStatus.OK, null, approvalKey, null);
        return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
}
