package kr.or.iei.wallet.model.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.wallet.model.dto.Wallet;

@Mapper
public interface WalletDao {

	int searchWallet(int userNo);

	Wallet selectWallet(int userNo);

}
