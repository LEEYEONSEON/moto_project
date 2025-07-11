package kr.or.iei.wallet.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.asset.model.dto.TradeDto;
import kr.or.iei.wallet.model.dao.WalletDao;
import kr.or.iei.wallet.model.dto.Wallet;

@Service
public class WalletService {
	
	@Autowired

	WalletDao dao;

	public Wallet getWalletByUserNo(int userNo) {
		return dao.getWalletByUserNo(userNo);
	}

	public int createWallet(int userNo) {
		return dao.createWallet(userNo);
	}

	public int updateWallet(Wallet wallet) {
		return dao.updateWallet(wallet);
	}
	



}
