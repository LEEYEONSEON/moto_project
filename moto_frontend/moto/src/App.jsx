import Header from './component/common/Header';
import Footer from './component/common/Footer';
import Join from './component/user/Join'
import Login from './component/user/Login'
import './App.css'
import Sidebar from './component/common/Sidebar';
import { Route, Routes } from 'react-router-dom';
import AssetPage from './component/asset/AssetPage';
import WatchlistPage from './component/watchlist/WatchlistPage';
import WalletInfo from './component/wallet/WalletInfo';
import KakaoLogout from './component/common/KakaoLogout';
import AdminMainPage from './component/admin/AdminMainPage';
import PortfolioPage from './component/portfolio/PortfolioPage';
import { useEffect, useState } from "react";
import useWsStore from "./store/useWsStore";
import PageMain from './component/PageMain';






function App() {
  

    //웹 소켓 사용해서 KIS 한국 투자증권 시세 연결 시작 하기 위한 용도 == 한번만 실행되도록 Zustand 로 wsStarted 상태 관리
    //앱에서 딱 한번 선언.  
    const { wsStarted, setWsStarted } = useWsStore();
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 기본은 닫힘

    useEffect(() => {
      if (!wsStarted) {
        fetch(serverUrl + "/asset/ws-start")
          .then(res => {
            if (res.ok) {
              setWsStarted(true);
              console.log("✅ WebSocket 연결 요청 보냄");
            }
          })
          .catch(err => {
            console.log("❌ WebSocket 연결 오류", err);
          });
      }
    }, []);

     function handleToggleSidebar() {
      setIsSidebarOpen(!isSidebarOpen);
    }



  return (
     <div className={`layout ${isSidebarOpen ? 'shifted' : ''}`}>
      <Sidebar onToggleSidebar={handleToggleSidebar}/>
      <div className="content-wrap">
        <Header />
        <main className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
          <Routes>
            <Route path='/' element={<PageMain />} />
            <Route path='/main/:reqPage' element={<PageMain />} />
            <Route path='/join' element={<Join />} />
            <Route path='/login' element={<Login />} />
            <Route path='/kakaoLogout' element={<KakaoLogout />} />
            <Route path="/asset/*" element={<AssetPage />} />
            <Route path='/wallet' element={<WalletInfo />} />
            <Route path='/admin' element={<AdminMainPage />} />
            <Route path="/watchlist/*" element={<WatchlistPage />} />
            <Route path="/portfolio/*" element={<PortfolioPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}


export default App;
