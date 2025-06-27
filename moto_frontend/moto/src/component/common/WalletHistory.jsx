import { useEffect, useState } from "react";

export default function WalletHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory([
      { id: 1, type: "입금", amount: 100000, date: "2025-06-01" },
      { id: 2, type: "출금", amount: 50000, date: "2025-06-10" },
    ]);
  }, []);

  return (
    <div>
      <h3>📈 입출금 이력</h3>
      <ul>
        {history.map(item => (
          <li key={item.id}>
            [{item.date}] {item.type}: ₩{item.amount.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}