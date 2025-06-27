import Header from './component/common/Header';
import Footer from './component/common/Footer';
import { Route, Routes } from 'react-router-dom';

import Join from  './component/user/Join';
import Login from './component/user/Login';

import './App.css'

function App() {


  
  return (
    <div className='wrap'>
      <Header/>
      <main className='content'>
          <Routes>
            
            <Route path='/join' element={<Join />} />
            <Route path='/login' element={<Login/>} />
          </Routes>
        </main>
      <Footer/>
    </div>

  )
}

export default App
