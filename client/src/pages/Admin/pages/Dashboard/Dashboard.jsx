import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import axios from 'axios'
import { FaUsers, FaShoppingBag, FaBoxOpen, FaChartLine } from 'react-icons/fa'

const Dashboard = ({ url }) => {

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalFoodItems: 0,
        totalOrders: 0,
        totalRevenue: 0,
        recentOrders: []
    })

    const fetchStats = async () => {
        try {
            const response = await axios.get(url + "/api/admin/stats");
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    }

    useEffect(() => {
        fetchStats();
    }, [])

    return (
        <div className='dashboard'>
            <h1>Dashboard Overview</h1>
            <div className="dashboard-cards">
                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: '#e2f0ff', color: '#007bff' }}>
                        <FaShoppingBag />
                    </div>
                    <div className="card-info">
                        <h2>{stats.totalOrders}</h2>
                        <p>Total Orders</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: '#fff0ed', color: 'tomato' }}>
                        <FaChartLine />
                    </div>
                    <div className="card-info">
                        <h2>₹{stats.totalRevenue}</h2>
                        <p>Total Revenue</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: '#e5f9f6', color: '#00c853' }}>
                        <FaUsers />
                    </div>
                    <div className="card-info">
                        <h2>{stats.totalUsers}</h2>
                        <p>Total Users</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-icon" style={{ backgroundColor: '#fff8e1', color: '#ffb300' }}>
                        <FaBoxOpen />
                    </div>
                    <div className="card-info">
                        <h2>{stats.totalFoodItems}</h2>
                        <p>Menu Items</p>
                    </div>
                </div>
            </div>

            <div className="recent-orders">
                <h2>Recent Orders</h2>
                <div className="recent-orders-table">
                    <div className="table-header">
                        <p>Order ID</p>
                        <p>Customer</p>
                        <p>Amount</p>
                        <p>Status</p>
                    </div>
                    {stats.recentOrders.map((order, index) => (
                        <div key={index} className="table-row">
                            <p className='order-id'>#{order._id.slice(-6)}</p>
                            <p>{order.address.firstName} {order.address.lastName}</p>
                            <p>₹{order.amount}</p>
                            <p className={`status ${order.status.toLowerCase().replace(' ', '-')}`}>{order.status}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
