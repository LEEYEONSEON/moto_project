package kr.or.iei.watchlist.model.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.asset.model.dto.TradeDto;
import kr.or.iei.watchlist.model.dto.Watchlist;

@Mapper
public interface WatchlistDao {

	int addWatchlist(Map<String, Object> param);

	int deleteWatchlist(Map<String, Object> param);

	List<Watchlist> selectWatchlistByUserNo(String userNo);

	int selectAssetNo(int assetCode);

	int insertWatchlistBuyAsset(TradeDto trade);

	void resultPayWallet(TradeDto trade);

	int watchListSellAsset(TradeDto trade);

	void resultSellPayWallet(TradeDto trade);

	int insertPortFolio(TradeDto trade);



	void mergeHolding(TradeDto trade);



}
