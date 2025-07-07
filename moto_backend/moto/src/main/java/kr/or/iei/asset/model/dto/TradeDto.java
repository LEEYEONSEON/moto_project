package kr.or.iei.asset.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TradeDto {

	private int userNo;
	private String tradeType;
	private int amount;
	private int currentPrice;
	private int assetNo;
}
