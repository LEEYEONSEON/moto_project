import Header from './component/common/Header';
import Footer from './component/common/Footer';
import Join from './component/user/Join'
import Login from './component/user/Login'
import './App.css'
import PageMain from './component/PageMain';
import Sidebar from './component/common/Sidebar';
import { Route, Routes } from 'react-router-dom';
import AssetPage from './component/asset/AssetPage';
import WalletInfo from './component/wallet/WalletInfo';
import KakaoLogout from './component/common/KakaoLogout';





function App() {
  
  return (
    <div className='wrap'>
      <Header/>
      <main className='content' style={{display:"flex"}}>
      <Sidebar/>
      <Routes>
      <Route path='/' element={<PageMain />} />
      <Route path='/main/:reqPage' element={<PageMain />} />
      <Route path='/join' element={<Join />} />
      <Route path='/login' element={<Login/>} />
      <Route path='/kakaoLogout' element={<KakaoLogout />} />
      <Route path="/asset" element={<AssetPage />} />
      <Route path='/wallet' element={<WalletInfo/>} />
      </Routes>
      </main>
      <Footer/>
    </div>
  );
}

export default App;
