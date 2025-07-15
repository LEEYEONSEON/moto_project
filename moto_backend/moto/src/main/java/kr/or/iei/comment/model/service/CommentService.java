package kr.or.iei.comment.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.comment.model.dao.CommentDao;
import kr.or.iei.comment.model.dto.Comment;
import kr.or.iei.like.model.dto.Like;

@Service
public class CommentService {
	
	@Autowired private CommentDao dao;

	public List<Comment> selectCommentList(Comment comment) {
		return dao.selectCommentList(comment);
	}

	public int insertComment(Comment comment) {
		return dao.insertComment(comment);
	}

	public int deleteComment(String commentNo) {
		return dao.deleteComment(commentNo);
	}

	public int updateComment(Comment comment) {
		return dao.updateComment(comment);
	}

	public boolean toggleLike(Like like) {
		
		int count = dao.checkLikeExists(like); // 이미 눌렀는지 확인
		
		boolean liked = false; //선언 및 초기화
		int delta;
		
		
		if (count > 0) { //이미 좋아요였던 상태에서 사용자가 토글 누른 경우:
            dao.deleteLike(like); //좋아요 삭제
            delta = -1;
         // 좋아요가 아닌 false 값 리턴

        } else { //좋아요 누르지 않았던 사용자가 토글 누른 경우
            dao.insertLike(like); //좋아요 처리
            delta = 1;
            liked = true;
            Map<String, Object> map = new HashMap<>();
            map.put("commentNo", like.getLikeTargetId());
            map.put("delta", 1);
            dao.updateLikeCount(map); // like 수 +1
            return true; //좋아요 처리; 좋아요 값 리턴.
        
        }
		
        Map<String, Object> map = new HashMap<>();
        map.put("commentNo", like.getLikeTargetId());
        map.put("delta", delta);
        
        dao.updateLikeCount(map); // like 수 -1
        
        return liked;

	}

}
