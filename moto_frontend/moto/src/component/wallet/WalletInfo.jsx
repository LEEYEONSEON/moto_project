
import React, { useEffect, useState } from "react";

import createInstance from "../../axios/Interceptor";

import useUserStore from "../../store/useUserStore";

import "./WalletInfo.css";

export default function WalletInfo() {


  const axiosInstance = createInstance();
  const { loginMember, kakaoMember } = useUserStore();
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState(null);

  const userNo = loginMember?.userNo || kakaoMember?.userNo;


  useEffect(function () {

    if (!userNo) return;

    axiosInstance
      .get(`${import.meta.env.VITE_BACK_SERVER}/wallet/${userNo}`)
      .then(function (res) {
        setWallet(res.data.resData);
      })
      .catch(function (err) {
        console.error("지갑 조회 실패", err);
        setError("지갑 정보를 불러오지 못했습니다.");
      });
  }, [userNo]); 

  // 로그인되지 않은 경우 안내 메시지
  if (!userNo) {
    return <p>로그인 후 지갑을 확인할 수 있습니다.</p>;
  }

  // 에러가 발생했을 경우 에러 메시지 출력
  if (error) {
    return <p className="wallet-error">{error}</p>;
  }

  // 아직 지갑 정보가 로딩되지 않은 경우 로딩 문구 출력
  if (!wallet) {
    return <p>지갑 정보를 불러오는 중입니다...</p>;
  }

  // 지갑 정보에서 현금 잔액과 총 자산을 구조분해 할당으로 추출
  const { walletCashBalance, walletTotalValuation } = wallet;

  // 총 자산 중 투자 비율 계산 (1 - 현금/총자산)
  const investedRatio = 1 - walletCashBalance / walletTotalValuation;

  // 현금 비율 계산 (남은 비율)
  const availableRatio = 1 - investedRatio;

  // 실제 화면 렌더링 (JSX 반환)
  return (
  <div className="wallet-container">
   
      {/* 지갑이 존재할 경우: 전체 JSX 묶음*/}
      <div>
        {/* 상단: 타이틀 및 화폐 단위 */}
        <div className="wallet-header">
          <div className="wallet-title">총 보유 자산</div>
          <div className="wallet-currency">KRW</div>
        </div>

        {/* 자산 금액 출력 */}
        <div className="wallet-total">
          {wallet.walletTotalValuation.toLocaleString()} 원
        </div>

        {/* 투자 비율 막대바 */}
        <div className="wallet-bar">
          <div
            className="wallet-bar-fill"
            style={{ width: `${investedRatio * 100}%` }}
          ></div>
        </div>

        {/* 투자됨 / 현금 보유 비율 표시 */}
        <div className="wallet-stats">
          <div>
            <span className="wallet-percent">
              {(investedRatio * 100).toFixed(2)}%
            </span>
            <div className="wallet-label">투자됨</div>
          </div>
          <div>
            <span className="wallet-percent">
              {(availableRatio * 100).toFixed(2)}%
            </span>
            <div className="wallet-label">현금 보유</div>
          </div>
        </div>
 
        <div className="wallet-header">
          <div className="wallet-title">남은 자산</div>
          <div className="wallet-currency">KRW</div>
        </div>

        {/* 자산 금액 출력 */}
        <div className="wallet-total" style={{paddingBottom:"20px"}}>
          {wallet.walletCashBalance.toLocaleString()} 원
        </div>
        
        {/* 현금 추가 버튼 */}
        <div className="wallet-add-button">💰 현금 추가</div>

      </div>
      
  </div>
);
}
