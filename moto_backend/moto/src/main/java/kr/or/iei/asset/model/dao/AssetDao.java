package kr.or.iei.asset.model.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.asset.model.dto.Asset;

@Mapper
public interface AssetDao {

	ArrayList<Asset> selectAllAsset();

}
