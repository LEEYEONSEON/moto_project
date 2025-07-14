package kr.or.iei.user.model.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.user.model.dto.User;

@Mapper
public interface UserDao {

	int chkUserId(String userId);

	int chkUserEmail(String userEmail);

	int insertUser(User user);

	User userLogin(String userId);

	int selectCurrUserNo();

	ArrayList<User> selectAllList();

	int updateUserInfo(User user);

	int updateUserPassword(User user);

	User getUserProfile(String userId);

	User searchUserInfo(int userNo);

	int deleteUser(int userNo);

	int updateProfileImage(int userNo, String filePath);

	int updateUserProfileImage(User user);

	int updateUserRole(User user);



	
	

	
}
