package kr.or.iei.user.model.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.iei.user.model.dto.UserUpdateDto;
import kr.or.iei.user.model.dto.UserProfileDto;

@Mapper
public interface UpdateDao {

    // ▶ 회원 정보 수정
    int updateUserInfo(UserUpdateDto dto);

    // ▶ 비밀번호 변경
    int updateUserPassword(@Param("userId") String userId, @Param("encodedPw") String encodedPw);

    // ▶ 기존 비밀번호 조회
    String selectPasswordByUserId(String userId);

    // ▶ 마이페이지용 정보 조회
    UserProfileDto selectUserProfile(String userId);
}
