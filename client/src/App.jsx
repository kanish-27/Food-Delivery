import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import Admin from './pages/Admin/Admin'
import MockPayment from './pages/MockPayment/MockPayment'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  const [showLogin, setShowLogin] = useState(false)
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      {isAdmin ? (
        <Routes>
          <Route path='/admin/*' element={<Admin />} />
        </Routes>
      ) : location.pathname === '/mock-payment' ? (
        <Routes>
          <Route path='/mock-payment' element={<MockPayment />} />
        </Routes>
      ) : (
        <>
          <div className='app'>
            <Navbar setShowLogin={setShowLogin} />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/cart' element={<Cart setShowLogin={setShowLogin} />} />
              <Route path='/order' element={<PlaceOrder />} />
              <Route path='/verify' element={<Verify />} />
              <Route path='/myorders' element={<MyOrders />} />
              <Route path='/mock-payment' element={<MockPayment />} />
            </Routes>
          </div>
          <Footer />
        </>
      )}
      <ToastContainer />
    </>
  )
}

export default App
