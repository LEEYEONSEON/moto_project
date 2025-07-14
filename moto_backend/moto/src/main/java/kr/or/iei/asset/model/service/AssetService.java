package kr.or.iei.asset.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import kr.or.iei.asset.model.dao.AssetDao;
import kr.or.iei.asset.model.dto.Asset;
import org.springframework.transaction.annotation.Transactional;
import kr.or.iei.asset.model.dao.AssetDao;
import kr.or.iei.asset.model.dto.Asset;
import kr.or.iei.asset.model.dto.TradeDto;




@Service
public class AssetService {
	
	@Autowired
	private AssetDao dao;
	
	public List<Asset> selectAllAsset() {
		return dao.selectAllAsset();
	}


	@Transactional
	public int insertBuyAsset(TradeDto trade) {
		// 1. 매수
		int result = dao.insertBuyAsset(trade);
		
		// 2. 포트폴리오 추가
		int insPortFolio = dao.insertPortFolio(trade);
		
		// 3. 포트폴리오 업데이트 / 생성
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
		
		int result = dao.watchListSellAsset(trade);
		if(result > 0) {
			dao.resultSellPayWallet(trade);
			return result;
		}
		return result;
	}



}
