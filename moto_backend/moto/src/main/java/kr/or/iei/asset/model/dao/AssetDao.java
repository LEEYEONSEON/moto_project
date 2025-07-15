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

	int insertPortFolio(TradeDto trade);

	void mergeHolding(TradeDto trade);

	void mergePortfolio(TradeDto trade);

	void resultSellPayWalletStep1(TradeDto trade);

	void resultSellPayWalletStep2(TradeDto trade);





}
