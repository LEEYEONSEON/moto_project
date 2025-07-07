package kr.or.iei.asset.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;


import kr.or.iei.asset.model.dao.AssetDao;
import kr.or.iei.asset.model.dto.Asset;



@Service
public class AssetService {
	
	@Autowired
	private AssetDao dao;
	
	public List<Asset> selectAllAsset() {
		return dao.selectAllAsset();
	}




	

}
