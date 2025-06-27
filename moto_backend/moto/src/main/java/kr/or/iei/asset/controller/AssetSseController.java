package kr.or.iei.asset.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import kr.or.iei.common.annotation.NoTokenCheck;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AssetSseController {
	
	private final PriceBroadcaster priceStream;
	@NoTokenCheck
    @GetMapping("/api/price-stream")
    public SseEmitter stream() {
        return priceStream.connect();
    }
}