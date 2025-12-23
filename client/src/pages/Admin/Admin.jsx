import React from 'react'
import './Admin.css'
import Sidebar from '../../components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Dashboard from './pages/Dashboard/Dashboard'
import Edit from './pages/Edit/Edit'

const Admin = () => {

    const url = "http://localhost:4000"

    return (
        <div className='admin'>
            <Sidebar />
            <div className="admin-content">
                <Routes>
                    <Route path='/' element={<Dashboard url={url} />} />
                    <Route path='/add' element={<Add url={url} />} />
                    <Route path='/list' element={<List url={url} />} />
                    <Route path='/orders' element={<Orders url={url} />} />
                    <Route path='/edit/:id' element={<Edit url={url} />} />
                </Routes>
            </div>
        </div>
    )
}

export default Admin
