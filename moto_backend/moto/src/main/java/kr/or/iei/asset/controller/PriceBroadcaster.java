package kr.or.iei.asset.controller;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import kr.or.iei.common.annotation.NoTokenCheck;

import java.io.IOException;
import java.util.concurrent.CopyOnWriteArrayList;

@Service

public class PriceBroadcaster {

    private final CopyOnWriteArrayList<SseEmitter> emitters = new CopyOnWriteArrayList<>();
    @NoTokenCheck
    public SseEmitter connect() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));

        return emitter;
    }
    @NoTokenCheck
    public void broadcast(String jsonData) {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("price").data(jsonData));
            } catch (IOException e) {
                emitters.remove(emitter);
            }
        }
    }
}
