import Header from './component/common/Header';
import Footer from './component/common/Footer';

import './App.css'
import PageMain from './component/PageMain';
import Sidebar from './component/common/Sidebar';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className='wrap'>
      <Header/>
      <main className='content' style={{display:"flex"}}>
      <Sidebar/>
      <Routes>
      <Route path='/' element={<PageMain />} />
      
      </Routes>
      </main>
      <Footer/>
    </div>

  )
}

export default App
