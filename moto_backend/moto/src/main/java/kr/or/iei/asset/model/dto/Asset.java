package kr.or.iei.asset.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class Asset {
	private String assetNo;
	private String assetName;
	private String assetCode;
	private String assetType;
	private String assetCurrency;
	
	private String currentPrice; //api 에서 조회해온 현재 시세
	private String priceChange; // 전일 대비
	private String ChangeRate; //전일 종가 대비 현재가 변동률(%)
	private Double low52;
	private Double high52;
	
}
