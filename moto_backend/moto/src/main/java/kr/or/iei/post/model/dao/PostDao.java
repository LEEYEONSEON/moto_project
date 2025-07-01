package kr.or.iei.post.model.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.common.model.dto.PageInfo;
import kr.or.iei.post.model.dto.Post;
import kr.or.iei.post.model.dto.PostFile;

@Mapper
public interface PostDao {

	int selectPostNo();

	int insertPost(Post post);

	int insertPostFile(PostFile file);

	int selectPostListCnt();

	ArrayList<Post> selectPostList(PageInfo pageInfo);

	ArrayList<PostFile> selectPostFileList(int postNo);

	

}
