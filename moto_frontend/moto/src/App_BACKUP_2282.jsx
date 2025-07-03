import Header from './component/common/Header';
import Footer from './component/common/Footer';
import Join from './component/user/Join';
import Login from './component/user/Login';
import PageMain from './component/PageMain';
import Sidebar from './component/common/Sidebar';
import KakaoLogout from './component/common/KakaoLogout';
import { Route, Routes } from 'react-router-dom';
import MypageMain from './component/user/MypageMain';
import './App.css';

function App() {
  return (
    <div className='wrap'>
<<<<<<< HEAD
      <Header />
=======
      <Header/>
      
      <main className='content' style={{display:"flex"}}>
      <Sidebar/>
      <Routes>
      <Route path='/' element={<PageMain />} />
      <Route path='/main/:reqPage' element={<PageMain />} />
      <Route path='/join' element={<Join />} />
      <Route path='/login' element={<Login/>} />
      <Route path='/kakaoLogout' element={<KakaoLogout/>} />
      </Routes>
      </main>
      <Footer/>
    </div>
>>>>>>> master

      <main className='content' style={{ display: "flex" }}>
        <Sidebar />
        <Routes>
          <Route path='/' element={<PageMain />} />
          <Route path='/main/:reqPage' element={<PageMain />} />
          <Route path='/join' element={<Join />} />
          <Route path='/login' element={<Login />} />
          <Route path="/users/me/*" element={<MypageMain />} />
          <Route path='/mypage/*' element={<MypageMain />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
