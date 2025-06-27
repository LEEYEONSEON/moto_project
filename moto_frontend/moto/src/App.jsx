import Header from './component/common/Header';
import Footer from './component/common/Footer';
import WalletPage from './component/common/WalletPage';
import { Routes, Route } from 'react-router-dom';


import './App.css'
import Main from './component/Main';

function App() {
  return (
    <div className='wrap'>
      <Header/>
      <Routes>
        <Route path="/users/me/wallet" element={<WalletPage />} />
      </Routes>
      <Main />
      <Footer/>
    </div>

  )
}

export default App
