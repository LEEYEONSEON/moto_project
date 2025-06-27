import Header from './component/common/Header';
import Footer from './component/common/Footer';
import { Route, Routes } from 'react-router-dom';
import Join from  './component/user/Join';
import Login from './component/user/Login';
import './App.css'
import AssetPage from './component/asset/AssetPage';
import Sidebar from './component/common/Sidebar';
import PageMain from './component/PageMain';

function App() {
  
  return (
    <div className='wrap'>
      <Header/>
      <main className='main-content' style={{display:"flex"}}>
          <Routes>
            <Route path='/' element={<PageMain />} />
            <Route path='/join' element={<Join />} />
            <Route path='/login' element={<Login/>} />
            <Route path="/asset" element={<AssetPage />} />
          </Routes>
        </main>
      <Footer/>

    </div>
  );
}

export default App
