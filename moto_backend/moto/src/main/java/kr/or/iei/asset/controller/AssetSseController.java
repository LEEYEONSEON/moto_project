package kr.or.iei.asset.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import kr.or.iei.common.annotation.NoTokenCheck;

import java.io.IOException;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
public class AssetSseController {
	
	
	
    private final CopyOnWriteArrayList<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    @GetMapping("/api/price-stream")
    @NoTokenCheck
    public SseEmitter streamPrice() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));

        return emitter;
    }

    public void broadcastPrice(String jsonData) {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("price").data(jsonData));
            } catch (IOException e) {
                emitters.remove(emitter);
            }
        }
    }
}