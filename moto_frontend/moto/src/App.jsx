import Header from './component/common/Header';
import Footer from './component/common/Footer';
import WalletPage from './component/common/WalletPage';
import Main from './component/common/Main';
import Join from './component/user/Join';
import Login from './component/user/Login';
import { Routes, Route } from 'react-router-dom';

import './App.css';

function App() {
  return (
    <div className='wrap'>
      <Header/>
      <main className='content'>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users/me/wallet" element={<WalletPage />} />
        </Routes>
      </main>
      <Footer/>
    </div>
  )
}

export default App;