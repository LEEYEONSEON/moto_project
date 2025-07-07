package kr.or.iei.wallet.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Wallet {
	
	private int walletNo;
	private int userNo;
	private int walletCashBalance;
	private int walletTotalValuation;
}
