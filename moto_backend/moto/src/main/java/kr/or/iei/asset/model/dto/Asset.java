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
}
