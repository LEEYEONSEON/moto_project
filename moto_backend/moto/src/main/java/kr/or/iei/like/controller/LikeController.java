package kr.or.iei.like.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import kr.or.iei.MotoApplication;
import kr.or.iei.comment.model.service.CommentService;
import kr.or.iei.common.model.dto.ResponseDTO;
import kr.or.iei.like.model.dto.Like;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/like")
public class LikeController {

    private final MotoApplication motoApplication;
	
	@Autowired private CommentService service;

    LikeController(MotoApplication motoApplication) {
        this.motoApplication = motoApplication;
    }
	
	@PostMapping("/toggle")
	public ResponseEntity<ResponseDTO> toggleLike(@RequestBody Like like) {
		
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "좋아요 중, 오류가 발생하였습니다.", false, "error");
		
		try {
			
			boolean liked = service.toggleLike(like);
			res = new ResponseDTO(HttpStatus.OK, "", liked , "");
	    	
		} catch (Exception e) {
			e.printStackTrace();
		}

        return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
    }

}
