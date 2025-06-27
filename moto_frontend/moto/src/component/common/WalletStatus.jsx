import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function WalletStatus() {
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    axios.get("/api/wallet/1")  
      .then(res => setWallet(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!wallet) return <p>지갑 정보를 불러오는 중...</p>;

  const cashBalance = wallet.wallet_cash_balance ?? 0;
  const totalValuation = wallet.wallet_total_valuation ?? 0;

  return (
    <div>
      <h3>💰 지갑 현황</h3>
      <p><strong>현금 잔액:</strong> ₩{cashBalance.toLocaleString()}</p>
      <p><strong>총 자산 평가액:</strong> ₩{totalValuation.toLocaleString()}</p>
    </div>
  );
}