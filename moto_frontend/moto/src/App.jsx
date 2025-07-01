import Header from './component/common/Header';
import Footer from './component/common/Footer';
import Join from './component/common/Join';
import Login from './component/common/Login';
import UserUpdate from './component/common/UserUpdate';
import UserPasswordUpdate from './component/common/UserPasswordUpdate';
import './App.css';
import PageMain from './component/PageMain';
import Sidebar from './component/common/Sidebar';
import { Route, Routes } from 'react-router-dom';
import WalletPage from './component/common/WalletPage';
import { UserProvider } from "./component/common/UserContext";
import Mypage from './component/user/Mypage';

function App() {
  return (
    <UserProvider>
      <div className='wrap'>
        <Header/>
        <main className='content' style={{display:"flex"}}>
          <Sidebar/>
          <Routes>
            <Route path='/' element={<PageMain />} />
            <Route path='/join' element={<Join />} />
            <Route path='/login' element={<Login />} />
            <Route path='/user/update/info' element={<UserUpdate />} />
            <Route path="/user/update/password" element={<UserPasswordUpdate />} />
            <Route path="/watchlists/:userId" element={<WalletPage />} />
            <Route path='/user/me' element={<Mypage />} />
          </Routes>
        </main>
        <Footer/>
      </div>
    </UserProvider>
  )
}

export default App;
