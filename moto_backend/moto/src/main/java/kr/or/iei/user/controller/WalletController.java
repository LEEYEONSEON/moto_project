package kr.or.iei.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import kr.or.iei.user.model.dto.WalletHistoryDto;
import kr.or.iei.user.model.dto.WalletPageDto;
import kr.or.iei.user.model.dto.WalletStatusDto;
import kr.or.iei.user.model.service.WalletService;

@RestController
@RequestMapping("/users/{userId}/wallet")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @GetMapping
    public ResponseEntity<WalletStatusDto> getWalletStatus(@PathVariable Long userId) {
        WalletStatusDto status = walletService.getWalletStatus(userId);
        return ResponseEntity.ok(status);
    }

    @GetMapping("/history")
    public ResponseEntity<List<WalletHistoryDto>> getWalletHistory(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        List<WalletHistoryDto> history = walletService.getWalletHistory(userId, page, size);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/page")
    public ResponseEntity<WalletPageDto> getWalletPageInfo(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "20") int size) {
        WalletPageDto pageInfo = walletService.getWalletPageInfo(userId, size);
        return ResponseEntity.ok(pageInfo);
    }
}