import Sidebar from "./common/Sidebar";
import { Routes, Route } from "react-router-dom";
import WalletPage from './common/WalletPage';

export default function Main() {
  return (
    <section className="section" style={{ width: "100%", display: "flex", backgroundColor: "black" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px", color: "white" }}>
        <Routes>
          <Route path="/" element={<div>메인페이지</div>} />
          <Route path="/users/me/wallet" element={<WalletPage />} />
        </Routes>
      </div>
    </section>
  );
}