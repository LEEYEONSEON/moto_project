package kr.or.iei.user.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.user.model.dao.UpdateDao;
import kr.or.iei.user.model.dto.UserPasswordUpdateDto;
import kr.or.iei.user.model.dto.UserUpdateDto;
import kr.or.iei.user.model.dto.UserProfileDto;

@Service
public class UpdateService {

    @Autowired
    private UpdateDao updateDao;

    @Autowired
    private BCryptPasswordEncoder encoder;

    // ▶ 회원 기본정보 수정 (닉네임, 이메일, 프로필 이미지)
    @Transactional
    public int updateUserInfo(UserUpdateDto dto) {
        return updateDao.updateUserInfo(dto);
    }

    // ▶ 비밀번호 변경 로직 (기존 비밀번호 확인 후 변경)
    @Transactional
    public int updateUserPassword(UserPasswordUpdateDto dto) {
        // DB에서 기존 암호화된 비밀번호 조회
        String dbPw = updateDao.selectPasswordByUserId(dto.getUserId());

        // 비밀번호 불일치 시 실패 처리
        if (dbPw == null || !encoder.matches(dto.getCurrentPassword(), dbPw)) {
            return 0;
        }

        // 새 비밀번호 암호화 후 업데이트
        String encodedPw = encoder.encode(dto.getNewPassword());
        return updateDao.updateUserPassword(dto.getUserId(), encodedPw);
    }

    // ▶ 마이페이지 조회용 사용자 정보 반환
    public UserProfileDto getUserProfile(String userId) {
        return updateDao.selectUserProfile(userId);
    }
}
