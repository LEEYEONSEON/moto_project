package kr.or.iei.comment.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.comment.model.dao.CommentDao;
import kr.or.iei.comment.model.dto.Comment;

@Service
public class CommentService {
	
	@Autowired private CommentDao dao;

	public List<Comment> selectCommentList(int postNo) {
		return dao.selectCommentList(postNo);
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

}
