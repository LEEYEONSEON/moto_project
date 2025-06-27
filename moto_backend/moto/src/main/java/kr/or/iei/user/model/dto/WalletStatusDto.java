package kr.or.iei.user.model.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * WalletStatusDTO
 * - 사용자 지갑의 현재 상태 정보를 담는 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WalletStatusDto {
    private BigDecimal cashBalance;       // 현금 잔액
    private BigDecimal totalValuation;    // 총 평가 금액
    private BigDecimal profitRate;        // 수익률 (%)
}