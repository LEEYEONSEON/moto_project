package kr.or.iei.asset.websocket;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;



import kr.or.iei.asset.controller.PriceBroadcaster;
import kr.or.iei.asset.model.dto.Asset;
import kr.or.iei.asset.model.service.AssetService;
import kr.or.iei.common.annotation.NoTokenCheck;

import java.net.URI;

public class FinnhubWebSocketClient extends WebSocketClient {
	
	private final PriceBroadcaster priceStream;
	private final AssetService service;
	
	
    public FinnhubWebSocketClient(URI serverUri, PriceBroadcaster priceStream, AssetService service) {
        super(serverUri);
        this.priceStream = priceStream;
        this.service = service;
    }

    @Override
    @NoTokenCheck
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
    @NoTokenCheck
    public void onMessage(String message) {
    	priceStream.broadcast(message);  // 시세 프론트로 전달
    }

    @Override
    @NoTokenCheck
    public void onClose(int code, String reason, boolean remote) {
        System.out.println("❌ 연결 종료: " + reason);
    }

    @Override
    @NoTokenCheck
    public void onError(Exception ex) {
        System.out.println("⚠️ 에러 발생: " + ex.getMessage());
    }
}
