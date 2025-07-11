package kr.or.iei.asset.model.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.asset.model.dto.Asset;
import kr.or.iei.asset.model.dto.TradeDto;

@Mapper
public interface AssetDao {

	ArrayList<Asset> selectAllAsset();


	int insertBuyAsset(TradeDto trade);

	void resultPayWallet(TradeDto trade);


	int selectAssetNo(int assetCode);


	int watchListSellAsset(TradeDto trade);


	void resultSellPayWallet(TradeDto trade);


	int insertPortFolio(TradeDto trade);


	


	int selectPortfolioNo(TradeDto trade);


	int searchHoldingAssetNo(TradeDto trade);


	


	void mergeHolding(TradeDto trade);





}
