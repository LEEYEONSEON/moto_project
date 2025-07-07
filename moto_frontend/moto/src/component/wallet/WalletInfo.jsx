import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import "./WalletInfo.css";

export default function WalletInfo() {
  const axiosInstance = createInstance();
  const { loginMember, kakaoMember } = useUserStore();
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState(null);

  const userNo = loginMember?.userNo || kakaoMember?.userNo;

  useEffect(() => {
    if (!userNo) return;

    axiosInstance
      .get(`${import.meta.env.VITE_BACK_SERVER}/wallet/${userNo}`)
      .then((res) => {
        setWallet(res.data.resData);
      })
      .catch((err) => {
        console.error("지갑 조회 실패", err);
        setError("지갑 정보를 불러오지 못했습니다.");
      });
  }, [userNo]);

  if (!userNo) return <p>로그인 후 지갑을 확인할 수 있습니다.</p>;
  if (error) return <p className="wallet-error">{error}</p>;
  if (!wallet) return <p>지갑 정보를 불러오는 중입니다...</p>;

  const { walletCashBalance, walletTotalValuation } = wallet;
  const investedRatio = 1 - walletCashBalance / walletTotalValuation;
  const availableRatio = 1 - investedRatio;


  return (
    <div className="wallet-container" style={{width:"100%"}}>
      <div className="wallet-header">
        <div className="wallet-title">총 보유 자산</div>
        <div className="wallet-currency">KRW</div>
      </div>

      <div className="wallet-total">
        {walletTotalValuation.toLocaleString()} 원
      </div>

      <div className="wallet-bar">
        <div
          className="wallet-bar-fill"
          style={{ width: `${investedRatio * 100}%` }}
        ></div>
      </div>

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

      <div className="wallet-add-button">💰 현금 추가</div>

    </div>
  );
}
