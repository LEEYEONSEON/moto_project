import Header from './component/common/Header';
import Footer from './component/common/Footer';

import './App.css'
import { Route, Routes } from 'react-router-dom';
import AssetPage from './component/asset/AssetPage';
import Sidebar from './component/common/Sidebar';
import PageMain from './component/PageMain';

function App() {
    return (
    <div className='wrap'>
      <Header />
      <div className='main-content' style={{display:"flex"}}>
      <Sidebar />
      <Routes>
        <Route path='/' element={<PageMain />}/>
        <Route path="/asset" element={<AssetPage />} />
      </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App
