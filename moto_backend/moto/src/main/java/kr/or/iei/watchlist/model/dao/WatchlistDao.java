package kr.or.iei.watchlist.model.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.watchlist.model.dto.Watchlist;

@Mapper
public interface WatchlistDao {

	int addWatchlist(Map<String, Object> param);

	int deleteWatchlist(Map<String, Object> param);

	List<Watchlist> selectWatchlistByUserNo(String userNo);

}
