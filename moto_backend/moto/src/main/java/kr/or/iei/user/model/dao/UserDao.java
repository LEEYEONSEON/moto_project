package kr.or.iei.user.model.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.user.model.dto.User;

@Mapper
public interface UserDao {

	int chkUserId(String userId);

	int chkUserEmail(String userEmail);

	int insertUser(User user);

	User userLogin(String userId);

	int updateUserInfo(User user);

	int updateUserPassword(User user);

	User getUserProfile(String userId);
	

}
