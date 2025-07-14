package kr.or.iei.comment.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.comment.model.dto.Comment;

@Mapper
public interface CommentDao {

	List<Comment> selectCommentList(int postNo);

	int insertComment(Comment comment);

	int deleteComment(String commentNo);

	int updateComment(Comment comment);

}
