export default WalletPage;

import React, { useEffect, useState } from 'react';

function WalletPage({}) {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const dummyWallet = {
      cashBalance: 500000,
      valuationAmount: 1250000,
      profitRate: 12.5,
    };
    setWallet(dummyWallet);

    const dummyTransactions = [
      { id: 1, date: '2025-06-01', type: '매수', amount: 300000, description: '삼성전자 매수' },
      { id: 2, date: '2025-06-10', type: '매도', amount: 150000, description: '카카오 매도' },
      { id: 3, date: '2025-06-15', type: '복구', amount: 50000, description: '계좌 복구' },
    ];
    setTransactions(dummyTransactions);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filters.startDate && tx.date < filters.startDate) return false;
    if (filters.endDate && tx.date > filters.endDate) return false;
    return true;
  });

  return (
    <div style={{ padding: '20px' }}>
      <h2>지갑</h2>

      {wallet && (
        <div style={{ border: '1px solid #ccc', padding: '16px', marginBottom: '20px' }}>
          <h3>자산 현황 요약</h3>
          <p>현금 잔액: {wallet.cashBalance.toLocaleString()}원</p>
          <p>평가 금액: {wallet.valuationAmount.toLocaleString()}원</p>
          <p>수익률: {wallet.profitRate}%</p>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h3>거래 내역 필터</h3>
        <input type="date" name="startDate" onChange={handleFilterChange} />
        <input type="date" name="endDate" onChange={handleFilterChange} />
      </div>

      <table border="1" cellPadding="8" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>날짜</th>
            <th>유형</th>
            <th>금액</th>
            <th>설명</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map(tx => (
            <tr key={tx.id}>
              <td>{tx.date}</td>
              <td>{tx.type}</td>
              <td>{tx.amount.toLocaleString()}원</td>
              <td>{tx.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
