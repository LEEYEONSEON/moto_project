package kr.or.iei.user.model.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * WalletHistoryDTO
 * - 지갑 거래 내역 정보를 담는 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WalletHistoryDto {
    private String transactionId;         // 거래 고유 ID
    private Date transactionDate;         // 거래 날짜
    private String assetName;             // 자산명 (주식, 코인 등)
    private String transactionType;       // 거래 유형 (매수, 매도, 복구 등)
    private BigDecimal quantity;          // 거래 수량
    private BigDecimal price;             // 거래 가격 (단가)
    private BigDecimal totalAmount;       // 총 거래 금액
}
