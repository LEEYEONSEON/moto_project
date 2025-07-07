package kr.or.iei.asset.websocket;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import kr.or.iei.asset.model.dto.Asset;


import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class PriceBroadcaster {

	
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();
    

    
    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.add(emitter);

        // 연결 끊겼을 때 emitter 제거
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));

        return emitter;
    }

    public void broadcast(Asset updatedAsset) {
      
    	if(updatedAsset != null) {
    	   	
            for (SseEmitter emitter : emitters) {
                try {
                    emitter.send(SseEmitter.event()
                        .name("asset")
                        .data(updatedAsset));
                } catch (IOException e) {
                	emitter.complete(); // 연결 명시적으로 종료
                    emitters.remove(emitter); // 리스트에서 제거
                }
            }   		
    	}
 
    }
    
    

	
}