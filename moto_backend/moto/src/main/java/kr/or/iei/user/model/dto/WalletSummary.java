package kr.or.iei.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class WalletSummary {
    private String userNo;         // 회원 고유번호 (Member.userNo와 매칭)
    private String totalAsset;     // 총 자산 (예: "1000000")
    private String cashBalance;    // 현금 잔액 (예: "800000")
    private String profitRate;     // 수익률 (예: "25.00")
}