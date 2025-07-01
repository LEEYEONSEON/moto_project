package kr.or.iei.common.oauth.model.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.user.model.dto.User;

@Mapper
public interface OAuthUserDao {
	int insertUser(User user);
	User findByEmail(String userEmail);

	int updateUser(User existing);
}
