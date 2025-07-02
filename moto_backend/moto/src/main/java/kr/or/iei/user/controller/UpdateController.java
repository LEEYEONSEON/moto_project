package kr.or.iei.user.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import kr.or.iei.common.model.dto.ResponseDTO;
import kr.or.iei.user.model.dto.UserPasswordUpdateDto;
import kr.or.iei.user.model.dto.UserUpdateDto;
import kr.or.iei.user.model.dto.UserProfileDto;
import kr.or.iei.user.model.service.UpdateService;

@RestController
@RequestMapping("/user")
@CrossOrigin("http://localhost:5173")
public class UpdateController {

    @Autowired
    private UpdateService updateService;

    // ▶ 회원 기본 정보 수정
    @PutMapping("/update/info")
    public ResponseEntity<ResponseDTO> updateUserInfo(@RequestBody UserUpdateDto dto) {
        ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "회원정보 수정 중 오류가 발생했습니다.", false, null);
        try {
            int result = updateService.updateUserInfo(dto);
            if (result > 0) {
                res = new ResponseDTO(HttpStatus.OK, "회원정보가 성공적으로 수정되었습니다.", true, null);
            } else {
                res = new ResponseDTO(HttpStatus.OK, "회원정보 수정에 실패하였습니다.", false, null);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(res, res.getHttpStatus());
    }

    // ▶ 비밀번호 변경 (기존 비밀번호 검증 포함)
    @PutMapping("/update/password")
    public ResponseEntity<ResponseDTO> updateUserPassword(@RequestBody UserPasswordUpdateDto dto) {
        ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "비밀번호 변경 중 오류가 발생했습니다.", false, null);
        try {
            int result = updateService.updateUserPassword(dto);
            if (result > 0) {
                res = new ResponseDTO(HttpStatus.OK, "비밀번호가 성공적으로 변경되었습니다.", true, null);
            } else {
                res = new ResponseDTO(HttpStatus.OK, "비밀번호 변경에 실패하였습니다. 현재 비밀번호를 확인해주세요.", false, null);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(res, res.getHttpStatus());
    }

    // ▶ 마이페이지용 사용자 정보 조회
    @GetMapping("/me")
    public ResponseEntity<ResponseDTO> getUserProfile(Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(
                new ResponseDTO(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.", null, "error"),
                HttpStatus.UNAUTHORIZED
            );
        }
        ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "유저 정보 조회 실패", null, "error");
        try {
            String userId = principal.getName(); // 로그인한 사용자의 ID 가져오기
            UserProfileDto dto = updateService.getUserProfile(userId);
            if(dto != null) {
                res = new ResponseDTO(HttpStatus.OK, "조회 성공", dto, "success");
            } else {
                res = new ResponseDTO(HttpStatus.OK, "유저 정보를 찾을 수 없습니다.", null, "warning");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(res, res.getHttpStatus());
    }
}
