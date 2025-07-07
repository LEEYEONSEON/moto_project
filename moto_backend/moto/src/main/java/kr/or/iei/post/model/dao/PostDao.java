package kr.or.iei.post.model.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

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

	ArrayList<PostFile> selectPostFileList(ArrayList<Integer> postNoArr);

	int deletePost(int postNo);
	 // 게시글 수정
    int updatePostContent(Post post);

    // 삭제할 파일 정보 조회
    List<PostFile> selectPostFilesByIds(List<Integer> delFiles);

    // 실제 파일 삭제
    int deletePostFiles(List<Integer> delFiles);

	
}
