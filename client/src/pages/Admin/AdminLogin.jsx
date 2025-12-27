import React, { useState } from 'react'
import axios from 'axios'
import './AdminLogin.css'
import { toast } from 'react-toastify'

const AdminLogin = ({ setAdminToken, url }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(url + "/api/user/login", { email, password })
            if (response.data.success) {
                if (response.data.role === 'admin') {
                    setAdminToken(response.data.token)
                    localStorage.setItem('adminToken', response.data.token)
                    toast.success("Welcome Admin")
                } else {
                    toast.error("Access Denied: Not an Admin Account")
                }
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error("Error logging in")
        }
    }

    return (
        <div className='admin-login'>
            <form onSubmit={onSubmitHandler} className='admin-login-container'>
                <div className="admin-login-title">
                    <h2>Admin Panel</h2>
                </div>
                <div className="admin-login-inputs">
                    <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='Admin Email' required />
                    <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='Password' required />
                </div>
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}

export default AdminLogin
