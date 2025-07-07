package kr.or.iei.asset.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
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
		
		int result = dao.insertBuyAsset(trade);
		
		if(result > 0) {
			 dao.resultPayWallet(trade);
			 return result;
		}
		
		return result;
	}




	

}
