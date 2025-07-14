package kr.or.iei.user.model.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.common.util.JwtUtils;
import kr.or.iei.user.model.dao.UserDao;
import kr.or.iei.user.model.dto.LoginUser;
import kr.or.iei.user.model.dto.User;
import kr.or.iei.wallet.model.dao.WalletDao;

@Service
public class UserService {
	@Autowired
	private UserDao dao;
	
	@Autowired
	private WalletDao walletDao;
	
	//WebConfig에서, 생성하여 컨테이너에 등록해놓은 객체 주입받아 사용하기
	@Autowired
	private BCryptPasswordEncoder encoder;
	
	@Autowired
	private JwtUtils jwtUtils;
	
	//accessToken 재발급
	public String refreshToken(User user) {
		//refreshToken 검증 통과 => accessToken 재발급 처리
		String accessToken = jwtUtils.createAccessToken(user.getUserNo(), user.getUserRole());
		return accessToken;
		
	}
	public int chkUserId(String userId) {
		// TODO Auto-generated method stub
		return dao.chkUserId(userId);
	}

	public int chkUserEmail(String userEmail) {
		// TODO Auto-generated method stub
		return dao.chkUserEmail(userEmail);
	}
	
	@Transactional
	public int insertUser(User user) {
		String encodePw = encoder.encode(user.getUserPassword()); //평문 => 암호화 60글자
		user.setUserPassword(encodePw);

		int result = dao.insertUser(user);
		

		if(result < 1) return result;

		int userNo = dao.selectCurrUserNo();
		result = walletDao.createWallet(userNo);
		return result;

	}

	public LoginUser userLogin(User user) {
		User chkUser = dao.userLogin(user.getUserId()); //아이디로 회원 정보 조회
		
		//아이디 잘못 입력하여, chkMember가 null인 경우 비밀번호 검증 불필요
		if(chkUser == null) {
			return null;
		}
		
		System.out.println(chkUser.getUserNo());
		
		if(encoder.matches(user.getUserPassword(), chkUser.getUserPassword())) {
			//평문 == 암호화 비밀번호(일치한경우)
			String accessToken = jwtUtils.createAccessToken(chkUser.getUserNo(), (chkUser.getUserRole()));
			String refreshToken = jwtUtils.createRefreshToken(chkUser.getUserNo(), chkUser.getUserRole());
			
			//스토리지에 저장되지 않도록 처리(비밀번호 검증 이외에 필요가 없으므로)
			chkUser.setUserPassword(null);
			
			LoginUser loginUser= new LoginUser(chkUser, accessToken, refreshToken);
			
			return loginUser;
		}else {
			//평문 != 암호화 비밀번호(일치하지 않은 경우)
			return null;			
		}
	}

	public User searchUserInfo(int userNo) {
		User user = dao.searchUserInfo(userNo);
		user.setUserPassword(null);
		return user; 	
	}	

	public int updateUserInfo(User user) {
		return dao.updateUserInfo(user);
	}
	

	public int updateUserProfileImage(int userNo, String imageUrl) {
		// User 객체를 이용해 DB에 프로필 이미지 URL을 업데이트하는 작업
		User user = new User();
		user.setUserNo(userNo);
		user.setUserProfileImg(imageUrl);  // userProfileImg 필드를 사용
		return dao.updateUserProfileImage(user);  
	}

	@Transactional
	public int updateUserRole(User user) {

		return dao.updateUserRole(user);
	}
	
	@Transactional
	public int deleteUser(int userNo) {
		
		return dao.deleteUser(userNo);
	}
	

	public User getUserProfile(String userId) {
		return dao.getUserProfile(userId);
	}
	

	@Transactional
	public boolean checkUserPassword(User user) {
		User u = dao.searchUserInfo(user.getUserNo());
		return encoder.matches(user.getUserPassword(), u.getUserPassword());
	}

	@Transactional
	public int updateUserPassword(User user) {
		
		String encodePw = encoder.encode(user.getUserPassword());
		user.setUserPassword(encodePw);
		
		return dao.updateUserPassword(user);
	}

	
	public ArrayList<User> selectAllList() {
		return dao.selectAllList();

	}
}
