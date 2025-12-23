import React from 'react'
import './Sidebar.css'
import { NavLink } from 'react-router-dom'
import { FaPlus, FaList, FaBox, FaHome } from 'react-icons/fa'

const Sidebar = () => {
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
            </div>
        </div>
    )
}

export default Sidebar
