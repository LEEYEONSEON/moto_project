package kr.or.iei.asset.websocket;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.springframework.beans.factory.annotation.Autowired;

import kr.or.iei.asset.controller.AssetSseController;
import kr.or.iei.asset.model.dto.Asset;
import kr.or.iei.asset.model.service.AssetService;

import java.net.URI;

public class FinnhubWebSocketClient extends WebSocketClient {
	
	private final AssetSseController sseController;
	private final AssetService service;
	
	@Autowired
    public FinnhubWebSocketClient(URI serverUri, AssetSseController sseController, AssetService service) {
        super(serverUri);
        this.sseController = sseController;
        this.service = service;
    }

    @Override
    public void onOpen(ServerHandshake handshake) {
        System.out.println("✅ 연결됨!");

        if (this.isOpen()) {
        	for (Asset asset : service.selectAllAsset()) {
        		send("{\"type\":\"subscribe\",\"symbol\":\"" + asset.getAssetCode() + "\"}");
        	}
        } else {
            System.out.println("❗ 아직 열려있지 않음!");
        }
    }

    @Override
    public void onMessage(String message) {
    	sseController.broadcastPrice(message);  // 시세 프론트로 전달
    }

    @Override
    public void onClose(int code, String reason, boolean remote) {
        System.out.println("❌ 연결 종료: " + reason);
    }

    @Override
    public void onError(Exception ex) {
        System.out.println("⚠️ 에러 발생: " + ex.getMessage());
    }
}
