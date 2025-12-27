import React, { useContext, useState } from 'react'
import './Navbar.css'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import { FaSearch, FaShoppingBasket, FaUserCircle, FaSignOutAlt, FaBox } from 'react-icons/fa'

const Navbar = ({ setShowLogin }) => {

    const [menu, setMenu] = useState("home");
    const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    }

    return (
        <div className='navbar'>
            <Link to='/'><div className="logo">FastFood.</div></Link>
            <ul className="navbar-menu">
                <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
                <a href='#explore-menu' onClick={() => { setMenu("menu"); if (location.pathname !== '/') navigate('/'); }} className={menu === "menu" ? "active" : ""}>Menu</a>
                <a href='#app-download' onClick={() => { setMenu("mobile-app"); if (location.pathname !== '/') navigate('/'); }} className={menu === "mobile-app" ? "active" : ""}>Mobile App</a>
                <Link to='/contact' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact Us</Link>
            </ul>
            <div className="navbar-right">
                <FaSearch size={20} />
                <div className="navbar-search-icon">
                    <Link to='/cart'><FaShoppingBasket size={24} color='white' /></Link>
                    <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                </div>
                {!token ? <button onClick={() => setShowLogin(true)}>Sign In</button>
                    : <div className='navbar-profile'>
                        <FaUserCircle size={30} color='white' />
                        <ul className="nav-profile-dropdown">
                            <li onClick={() => navigate('/myorders')}><FaBox color='tomato' /><p>Orders</p></li>
                            <hr />
                            <li onClick={logout}><FaSignOutAlt color='tomato' /><p>Logout</p></li>
                        </ul>
                    </div>}
            </div>
        </div>
    )
}

export default Navbar
