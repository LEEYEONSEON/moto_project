package kr.or.iei.asset.websocket;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import kr.or.iei.asset.model.dto.Asset;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;

@Component
public class PriceBroadcaster {

	
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();
    

    
    public SseEmitter subscribe() {
        
    	
    	
    	SseEmitter emitter = new SseEmitter(60 * 60 * 1000L); // 1시간 유지
        emitters.add(emitter);

        emitter.onCompletion(new Runnable() {
            @Override
            public void run() {
                emitters.remove(emitter);
            }
        });

        emitter.onTimeout(new Runnable() {
            @Override
            public void run() {
                emitters.remove(emitter);
            }
        });

        emitter.onError(new Consumer<Throwable>() {
            @Override
            public void accept(Throwable throwable) {
                emitters.remove(emitter);
            }
        });

        ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();
        executor.scheduleAtFixedRate(new Runnable() {
            @Override
            public void run() {
                try {
                    emitter.send(SseEmitter.event().name("ping").data("keep-alive"));
                } catch (Exception e) {
                    emitter.complete();
                    emitters.remove(emitter);
                    executor.shutdown();
                }
            }
        }, 0, 30, TimeUnit.SECONDS); // 30초마다 ping

        return emitter;
    }
    
    
    

    public void broadcast(Asset updatedAsset) {
      
    	if(updatedAsset != null) {
    	   	
            for (SseEmitter emitter : emitters) {
            
	            	try {	                	
	                    emitter.send(SseEmitter.event()
	                        .name("asset")
	                        .data(updatedAsset));
	                            
                	} catch (Exception e) {
                		emitter.complete(); // 연결 명시적으로 종료
                		emitters.remove(emitter); // 리스트에서 제거
                	}
            	  		
    		
            }	
 
    	}
    
    }
    
    @PostConstruct
    public void init() {
        emitters.clear(); // 서버 재시작 시 남은 연결 초기화
    }
    
    @PreDestroy
    public void onDestroy() {
        for (SseEmitter emitter : emitters) {
            emitter.completeWithError(new IOException());
        }
    }

	
}