import React from 'react'
import './Sidebar.css'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaPlus, FaList, FaBox, FaHome, FaSignOutAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'

const Sidebar = ({ setAdminToken }) => {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("adminToken");
        setAdminToken("");
        toast.success("Logged out");
        navigate('/admin');
    }

    return (
        <div className='sidebar'>
            <div className="sidebar-options">
                <NavLink to='/admin' end className={({ isActive }) => isActive ? "sidebar-option active" : "sidebar-option"}>
                    <FaHome size={20} />
                    <p>Dashboard</p>
                </NavLink>
                <NavLink to='/admin/add' className={({ isActive }) => isActive ? "sidebar-option active" : "sidebar-option"}>
                    <FaPlus size={20} />
                    <p>Add Items</p>
                </NavLink>
                <NavLink to='/admin/list' className={({ isActive }) => isActive ? "sidebar-option active" : "sidebar-option"}>
                    <FaList size={20} />
                    <p>List Items</p>
                </NavLink>
                <NavLink to='/admin/orders' className={({ isActive }) => isActive ? "sidebar-option active" : "sidebar-option"}>
                    <FaBox size={20} />
                    <p>Orders</p>
                </NavLink>
                <div onClick={logout} className="sidebar-option">
                    <FaSignOutAlt size={20} />
                    <p>Logout</p>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
