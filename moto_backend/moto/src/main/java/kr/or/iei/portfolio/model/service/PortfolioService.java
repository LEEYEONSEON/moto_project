package kr.or.iei.portfolio.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.portfolio.model.dao.PortfolioDao;
import kr.or.iei.portfolio.model.dto.Portfolio;

@Service
public class PortfolioService {
	
	@Autowired
	private PortfolioDao dao;

	public List<Portfolio> getPortfolioByUserNo(String userNo) {
		
		//1. 구매한 주식 목록 가져오기 == 총 매수 수량 - 총 매도 수량 > 0 인 종목만 조회,
		//보유주식수 == buy 와 sell 이 asset_no 가 같은 경우 == 총 buy - 총 sell == 주식 수
		//평균매수가 매도해도 바뀌지 않음. 평균매수가 == SUM(BUY 수량 * 가격)/SUM(BUY 수량)
		//currentPrice, profit profitRate 는 현재 시세 가져와야 calculate 가능한것
		
		/*
		 SELECT 종목정보
		  FROM tbl_asset
		  JOIN tbl_trade
	      GROUP BY 종목
		  HAVING 매수합 - 매도합 > 0
		  
		 */
		
		List<Portfolio> rawData = dao.getPortfolioByUserNo(userNo);
		
		
		
		
		
		return rawData;
	}

}
