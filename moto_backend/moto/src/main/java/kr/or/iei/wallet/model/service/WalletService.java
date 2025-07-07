package kr.or.iei.wallet.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.wallet.model.dao.WalletDao;
import kr.or.iei.wallet.model.dto.Wallet;

@Service
public class WalletService {
	
	@Autowired
	private WalletDao dao;

	public Wallet searchWallet(int userNo) {
		
		int cnt = dao.searchWallet(userNo);
		
		if(cnt > 0) {
			Wallet wallet = dao.selectWallet(userNo);
		}
		
		
		return null;
	}

}
