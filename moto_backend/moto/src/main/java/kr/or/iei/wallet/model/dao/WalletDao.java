package kr.or.iei.wallet.model.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.wallet.model.dto.Wallet;

@Mapper
public interface WalletDao {

	Wallet getWalletByUserNo(int userNo);

	int createWallet(int userNo);

	int updateWallet(Wallet wallet);


}
