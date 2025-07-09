package kr.or.iei.user.controller;

import java.io.File;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.or.iei.common.annotation.NoTokenCheck;
import kr.or.iei.common.model.dto.ResponseDTO;
import kr.or.iei.user.model.dto.LoginUser;
import kr.or.iei.user.model.dto.User;
import kr.or.iei.user.model.service.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/user")
public class UserController {
	
	
	
	@Autowired
	private UserService service;
	
	@Value("${file.uploadPath}")
    private String uploadPath; 
	
	@PostMapping("/local/test")
	public ResponseEntity<ResponseDTO> localTest(@RequestBody User user) {
		
		ResponseDTO res = new ResponseDTO(HttpStatus.OK, "jwtTest localUser", null, null);
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	@PostMapping("/kakao/test")
	public ResponseEntity<ResponseDTO> kakaoTest(@RequestBody User user) {
		
		ResponseDTO res = new ResponseDTO(HttpStatus.OK, "jwtTest kakaoUser", null, null);
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//refreshToken으로 accessToken 재발급 처리
	@PostMapping("/refresh")
	public ResponseEntity<ResponseDTO> refreshToken(@RequestBody User user){
		System.out.println("localUser refresh 토큰 재발급하러 들어옴");
		ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "토큰 재발급 실패", null, "error");
		
		try {
			String reAccessToken = service.refreshToken(user);
			
			//accessToken 재발급 완료!
			res = new ResponseDTO(HttpStatus.OK, "", reAccessToken, "");
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
	}
	
	//아이디 중복 체크
	//query : select count(*) from tbl_user where user_id = #{_parameter}
		@GetMapping("/{userId}/chkId")
		@NoTokenCheck
		public ResponseEntity<ResponseDTO> chkUserId(@PathVariable String userId){
			ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "아이디 중복 체크 중, 오류가 발생하였습니다.", false, "error");
			
			try {
				int count = service.chkUserId(userId);
				res = new ResponseDTO(HttpStatus.OK, "", count, "success");
			}catch(Exception e) {
				e.printStackTrace();
			}
					
			
			return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
		}
		
		//이메일 중복 체크
		//query : select count(*) from tbl_user where user_email = #{_parameter}
		@GetMapping("/{userEmail}/chkEmail")
		@NoTokenCheck
		public ResponseEntity<ResponseDTO> chkUserEmail(@PathVariable String userEmail){
			ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "이메일 중복 체크 중, 오류가 발생하였습니다.", false, "error");
			
			try {
				int count = service.chkUserEmail(userEmail);
				res = new ResponseDTO(HttpStatus.OK, "", count, "success");
			}catch(Exception e) {
				e.printStackTrace();
			}
					
			
			return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
		}
		
		
		//회원가입
		//query : insert into tbl_user (user_no, user_id, user_nickname, user_email, user_password, user_role, user_join_date, user_post_like_count, user_comment_like_count, user_sanction_count, user_social_type) 
		//
		@PostMapping
		@NoTokenCheck
		public ResponseEntity<ResponseDTO> insertUser(@RequestBody User user){
			ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "회원가입 중, 오류가 발생하였습니다.", false, "error") ;
			
			try {
				int result = service.insertUser(user);
				
				if(result > 0) {
					res = new ResponseDTO(HttpStatus.OK, "회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.", true, "success");
				}else {
					res = new ResponseDTO(HttpStatus.OK, "회원가입 중, 오류가 발생하였습니다.", false, "warning");
				}
			}catch(Exception e) {
				e.printStackTrace();
			}
			
			
			return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
		}
		
		//로그인
		//query : select user_id as userId, user_password as userPassword, user_level as userLevel from tbl_user where user_id = userId
		@PostMapping("/login")
		@NoTokenCheck
		public ResponseEntity<ResponseDTO> userLogin(@RequestBody User user){
			
			
			ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "로그인 중, 오류가 발생하였습니다.", null, "error");
			
			try {
				LoginUser loginUser = service.userLogin(user);
				
				if(loginUser == null) {
					res = new ResponseDTO(HttpStatus.OK, "아이디 및 비밀번호를 확인하세요.", null, "warning");
				}else {
					res = new ResponseDTO(HttpStatus.OK, "", loginUser, "");
				}
				
			}catch(Exception e) {
				e.printStackTrace();
			}
			
			return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
		}
		
		//마이페이지에서 기본적으로 보여줄 회원 정보 조회
		@GetMapping("/{userNo}")
		public ResponseEntity<ResponseDTO> searchUserInfo(@PathVariable int userNo){
			ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "회원 정보 조회 중, 오류가 발생하였습니다.", null, "error");
			
			try {
			
				User user  = service.searchUserInfo(userNo);
				
				if(user != null) {
					res = new ResponseDTO(HttpStatus.OK, "", user, "");
					System.out.println(user);
				}else {
					res = new ResponseDTO(HttpStatus.OK, "회원 정보 조회 중, 오류가 발생하였습니다.", null, "warning");
				}
				
			} catch (Exception e) {
				e.printStackTrace();
				
			}
			
			return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
		}
		
		
		// 회원 정보 수정 
		@PatchMapping("/{userNo}")
		public ResponseEntity<ResponseDTO> updateUserInfo(@PathVariable int userNo, @RequestBody User user) {
		    
		    ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "회원 정보 수정 중, 오류가 발생하였습니다.", null, "error");

		    try {
		        // URL 경로 userNo를 User 객체에 세팅
		        user.setUserNo(userNo);

		        int result = service.updateUserInfo(user);
		        if(result > 0) {
		            res = new ResponseDTO(HttpStatus.OK, "정보가 수정되었습니다.", true, "success");
		        } else {
		            res = new ResponseDTO(HttpStatus.OK, "수정에 실패했습니다.", false, "warning");
		        }
		    } catch(Exception e) {
		        e.printStackTrace();
		        res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류가 발생했습니다.", false, "error");
		    }
		    return new ResponseEntity<>(res, res.getHttpStatus());
		}
		
		//이미지 변경
		@PatchMapping("/updateProfileImage/{userNo}")
		public ResponseEntity<ResponseDTO> updateProfileImage(
		        @PathVariable int userNo,
		        @RequestPart(value = "userProfileImg", required = false) MultipartFile userProfileImg) {

		    ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "프로필 사진 수정 중 오류가 발생하였습니다.", null, "error");

		    try {
		        if (userProfileImg != null && !userProfileImg.isEmpty()) {
		            // 이미지를 저장하는 메서드 호출
		            String imageUrl = saveProfileImage(userProfileImg);

		            if (imageUrl == null) {
		                res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "파일 저장 중 오류가 발생하였습니다.", null, "error");
		            } else {
		                // 이미지 URL을 DB에 업데이트
		                int result = service.updateUserProfileImage(userNo, imageUrl);

		                if (result > 0) {
		                    res = new ResponseDTO(HttpStatus.OK, "프로필 사진이 수정되었습니다.", true, "success");
		                } else {
		                    res = new ResponseDTO(HttpStatus.OK, "프로필 사진 수정에 실패했습니다.", false, "warning");
		                }
		            }
		        } else {
		            res = new ResponseDTO(HttpStatus.OK, "이미지가 선택되지 않았습니다.", false, "warning");
		        }
		    } catch (Exception e) {
		        e.printStackTrace();
		        res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류가 발생했습니다.", false, "error");
		    }

		    return new ResponseEntity<>(res, res.getHttpStatus());
		}
		    // 이미지 파일 저장 메서드
	    private String saveProfileImage(MultipartFile file) {
	        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

	        File uploadDir = new File(uploadPath + "/userProfile");
	        if (!uploadDir.exists()) {
	            uploadDir.mkdirs();
	        }

	        File dest = new File(uploadDir, fileName);

	        try {
	            file.transferTo(dest);
	        } catch (IOException e) {
	            e.printStackTrace();
	            return null;
	        }

	        // 클라이언트에서 접근 가능한 URL 경로 반환
	        return "/userProfile/" + fileName;
	    }

	
	
		
		//회원 탈퇴
		@DeleteMapping("/{userNo}")
		public ResponseEntity<ResponseDTO> deleteUser(@PathVariable int userNo){
			ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "삭제 중, 오류가 발생하였습니다.", false, "error");
			
			try {
				int result = service.deleteUser(userNo);
				
				if(result > 0) {
					res = new ResponseDTO(HttpStatus.OK, "회원 탈퇴가 정상 처리 되었습니다.", true, "success");
				}else {
					res = new ResponseDTO(HttpStatus.OK, "삭제 중, 오류가 발생하였습니다.", false, "warning");
				}
				
			}catch(Exception e) {
				e.printStackTrace();
			}
			
			return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
		} 
		
		//비밀번호 변경을 위한 체크
		@PostMapping("/checkPw")
		public ResponseEntity<ResponseDTO> checkPw(@RequestBody User user){
			ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "기존 비밀번호 체크 중, 오류가 발생하였습니다.", false, "error");
			
			try {
				boolean chkResult = service.checkUserPassword(user);
				
				//토큰 검증 성공 ==> 비밀번호 일치 결과 (true or false)
				res = new ResponseDTO(HttpStatus.OK, "", chkResult, "");
				
				
			}catch(Exception e) {
				e.printStackTrace();
			}
			
			return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
		}
		
		
		//회원 비밀번호 변경
		@PatchMapping("/updatePassword")
		public ResponseEntity<ResponseDTO> updateUserPassword(@RequestBody User user){
			ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "비밀번호 변경 중, 오류가 발생하였습니다.", false, "error");
			
			try {
				int result = service.updateUserPassword(user);
				
				if(result > 0) {
					res = new ResponseDTO(HttpStatus.OK, "비밀번호가 정상적으로 변경되었습니다.", true, "success");
				}else {
					res = new ResponseDTO(HttpStatus.OK, "비밀번호 변경 중, 오류가 발생하였습니다.", false, "warning");
				}
				
			}catch(Exception e) {
				e.printStackTrace();
			}
			
			return new ResponseEntity<ResponseDTO>(res, res.getHttpStatus());
		}
		
				
}
