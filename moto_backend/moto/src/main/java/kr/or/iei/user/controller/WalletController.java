package kr.or.iei.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import kr.or.iei.common.model.dto.ResponseDTO;
import kr.or.iei.user.model.dto.WalletHistoryDto;
import kr.or.iei.user.model.dto.WalletPageDto;
import kr.or.iei.user.model.dto.WalletStatusDto;
import kr.or.iei.user.model.service.WalletService;

@RestController
@RequestMapping("/users/{userId}/wallet")
@CrossOrigin("http://localhost:5173")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @GetMapping
    public ResponseEntity<ResponseDTO> getWalletStatus(@PathVariable String userId) {
        ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "지갑 상태 조회 중 오류가 발생했습니다.", null, "error");
        try {
            WalletStatusDto status = walletService.getWalletStatus(userId);
            res = new ResponseDTO(HttpStatus.OK, "지갑 상태 조회 성공", status, "success");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(res, res.getHttpStatus());
    }

    @GetMapping("/history")
    public ResponseEntity<ResponseDTO> getWalletHistory(
            @PathVariable String userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {

        ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "지갑 내역 조회 중 오류가 발생했습니다.", null, "error");
        try {
            List<WalletHistoryDto> history = walletService.getWalletHistory(userId, page, size);
            res = new ResponseDTO(HttpStatus.OK, "지갑 내역 조회 성공", history, "success");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(res, res.getHttpStatus());
    }

    @GetMapping("/page")
    public ResponseEntity<ResponseDTO> getWalletPageInfo(
            @PathVariable String userId,
            @RequestParam(defaultValue = "20") int size) {

        ResponseDTO res = new ResponseDTO(HttpStatus.INTERNAL_SERVER_ERROR, "지갑 페이지 정보 조회 중 오류가 발생했습니다.", null, "error");
        try {
            WalletPageDto pageInfo = walletService.getWalletPageInfo(userId, size);
            res = new ResponseDTO(HttpStatus.OK, "지갑 페이지 정보 조회 성공", pageInfo, "success");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(res, res.getHttpStatus());
    }
}
