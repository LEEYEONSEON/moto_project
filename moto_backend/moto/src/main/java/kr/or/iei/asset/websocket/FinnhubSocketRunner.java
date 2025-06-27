package kr.or.iei.asset.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import kr.or.iei.asset.controller.PriceBroadcaster;
import kr.or.iei.asset.model.service.AssetService;
import kr.or.iei.common.annotation.NoTokenCheck;

import java.net.URI;
import java.net.URISyntaxException;

@Component
public class FinnhubSocketRunner implements CommandLineRunner {

    private final PriceBroadcaster priceStream;
    private final AssetService service;

    @Autowired
    public FinnhubSocketRunner(PriceBroadcaster priceStream, AssetService service) {
        this.priceStream = priceStream;
        this.service = service;
    }

    @Override
    @NoTokenCheck
    public void run(String... args) throws URISyntaxException {
        URI uri = new URI("wss://ws.finnhub.io?token=d0um1shr01qn5fk68a3gd0um1shr01qn5fk68a40");
        // WebSocketClient는 run() 내에서 완전한 의존성 주입 이후에 생성해야 안전함
        new Thread(() -> {
            FinnhubWebSocketClient client = new FinnhubWebSocketClient(uri, priceStream, service);
            client.connect();
        }).start();
    }
}