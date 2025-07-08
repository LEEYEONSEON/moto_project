package kr.or.iei.common.kisController;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import kr.or.iei.asset.websocket.KisWebSocket;


@RestController
@RequestMapping("/asset")
public class KisController {
      
   @Autowired
   private KisWebSocket socketTest;
   

   @GetMapping("/ws-start")
   public void ss() {
      socketTest.connectAndSend(); // 웹소켓 연결 및 시세 수신 시작
   }

}