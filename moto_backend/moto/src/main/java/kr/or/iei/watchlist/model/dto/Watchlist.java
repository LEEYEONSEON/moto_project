package kr.or.iei.watchlist.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class Watchlist {
	
	private String assetCode;
	private String userNo;
	private String assetName;
	private String high52;
	private String low52;
	
	private String currentPrice; //api 에서 조회해온 현재 시세
	private String priceChange; // 전일 대비
	private String ChangeRate; //전일 종가 대비 현재가 변동률(%)
}
