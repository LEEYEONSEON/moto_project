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

	
	

	
}
