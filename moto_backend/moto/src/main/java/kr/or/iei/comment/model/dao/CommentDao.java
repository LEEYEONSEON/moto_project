package kr.or.iei.comment.model.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.comment.model.dto.Comment;
import kr.or.iei.like.model.dto.Like;

@Mapper
public interface CommentDao {

	List<Comment> selectCommentList(Comment comment);

	int insertComment(Comment comment);

	int deleteComment(String commentNo);

	int updateComment(Comment comment);

	int checkLikeExists(Like like);

	void deleteLike(Like like);
	
	void insertLike(Like like);

	void updateLikeCount(Map<String, Object> map);

	

	

}
