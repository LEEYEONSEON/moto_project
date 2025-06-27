package kr.or.iei.asset.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import kr.or.iei.asset.controller.AssetSseController;
import kr.or.iei.asset.model.service.AssetService;

import java.net.URI;

@Component
public class FinnhubSocketRunner implements CommandLineRunner {

	@Autowired
	private AssetSseController assetSseController;
	
	@Autowired
	private AssetService service;

    @Override
    public void run(String... args) throws Exception {
    	
    	 URI uri = new URI("wss://ws.finnhub.io?token=d0um1shr01qn5fk68a3gd0um1shr01qn5fk68a40");

        FinnhubWebSocketClient client = new FinnhubWebSocketClient(uri, assetSseController, service);
        client.connect();
    }
}
