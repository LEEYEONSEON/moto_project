package kr.or.iei.portfolio.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class Portfolio {
	private String assetCode;
    private String assetName;
    private int quantity;
    private int avgBuyPrice;
}
