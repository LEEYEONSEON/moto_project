package kr.or.iei.member.model.dao;

import kr.or.iei.member.model.dto.WalletSummary;

public interface WalletDao {
    // userNo로 지갑 요약 정보 조회
    WalletSummary selectWalletSummary(String userNo);
}