package kr.or.iei.watchlist.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.asset.model.dto.TradeDto;
import kr.or.iei.watchlist.model.dao.WatchlistDao;
import kr.or.iei.watchlist.model.dto.Watchlist;

@Service
public class WatchlistService {

	@Autowired
	private WatchlistDao dao;
	
	
	public int addWatchlist(String assetCode, String userNo) {
		
		Map<String, Object> param = new HashMap<>(); // <-- 여러 개 담기 위해 Map 사용
	    param.put("userNo", userNo);
	    param.put("assetCode", assetCode);
		
		return dao.addWatchlist(param);
	}

	public int deleteWatchlist(String assetCode, String userNo) {
		Map<String, Object> param = new HashMap<>(); // <-- 여러 개 담기 위해 Map 사용
	    param.put("userNo", userNo);
	    param.put("assetCode", assetCode);
		
		return dao.deleteWatchlist(param);
	}

	public List<Watchlist> selectWatchlistByUserNo(String userNo) {
		return dao.selectWatchlistByUserNo(userNo);
	}

	@Transactional
	public int insertWatchlistBuyAsset(TradeDto trade) {
		int assetNo = dao.selectAssetNo(trade.getAssetCode());
		
		trade.setAssetNo(assetNo);
		int result = dao.insertWatchlistBuyAsset(trade);
		
		dao.mergePortfolio(trade);
		dao.mergeHolding(trade);
		if(result > 0) {
			dao.resultPayWallet(trade);
			 return result;
		}
		return result;
	}

	@Transactional
	public int watchListSellAsset(TradeDto trade) {
	    int assetNo = dao.selectAssetNo(trade.getAssetCode());
	    trade.setAssetNo(assetNo);

	    int result = dao.watchListSellAsset(trade); // 거래 내역 추가

	    if(result > 0) {
	        dao.mergeHoldingSell(trade);            // 보유 수량 감소
	        dao.addSellCashToWallet(trade);        // 
	        dao.resultSellPayWallet(trade);         // 지갑 반영
	        return result;
	    }
	    return result;
	}

	
}
