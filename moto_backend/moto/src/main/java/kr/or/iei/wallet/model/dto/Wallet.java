package kr.or.iei.wallet.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Wallet {

    private int walletNo;               // 지갑 고유번호
    private int userNo;                // 사용자 고유번호 (FK)
    private Double walletCashBalance;   // 보유 현금
    private Double walletTotalValuation;// 총 평가 금액			//사용자가 보유한 종목과 수량에 대해 실시간으로 업데이트

}
