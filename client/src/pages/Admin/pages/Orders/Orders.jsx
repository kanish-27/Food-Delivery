import React, { useState, useEffect } from 'react'
import './Orders.css'
import axios from "axios"
import { toast } from 'react-toastify'
import { FaBox } from 'react-icons/fa'

const Orders = ({ url }) => {

    const [orders, setOrders] = useState([]);

    const fetchAllOrders = async () => {
        const response = await axios.get(url + "/api/order/list");
        if (response.data.success) {
            setOrders(response.data.data);
        }
        else {
            toast.error("Error")
        }
    }

    const statusHandler = async (event, orderId) => {
        const response = await axios.post(url + "/api/order/status", {
            orderId,
            status: event.target.value
        })
        if (response.data.success) {
            await fetchAllOrders();
        }
    }

    useEffect(() => {
        fetchAllOrders();
    }, [])

    return (
        <div className='order add'>
            <h3>Order Page</h3>
            <div className="order-list">
                {orders.map((order, index) => (
                    <div key={index} className='order-item'>
                        <div className="order-item-image">
                            <FaBox size={24} color='#ff6347' />
                        </div>
                        <div className="order-item-details">
                            <p className='order-id'>Order #{order._id.slice(-6)}</p>
                            <p className='order-food-list'>
                                {order.items.map((item, index) => {
                                    if (index === order.items.length - 1) {
                                        return item.name + " x " + item.quantity
                                    }
                                    else {
                                        return item.name + " x " + item.quantity + ", "
                                    }
                                })}
                            </p>
                            <div className="order-customer-info">
                                <p className="customer-name">{order.address.firstName + " " + order.address.lastName}</p>
                                <div className="customer-address">
                                    <p>{order.address.street}, {order.address.city}, {order.address.state}, {order.address.zipcode}</p>
                                </div>
                                <p className='customer-phone'>{order.address.phone}</p>
                            </div>
                        </div>

                        <div className="order-meta-info">
                            <p className="items-count">Items: {order.items.length}</p>
                            <p className="order-amount">₹{order.amount}</p>
                        </div>

                        <div className="order-status-selector">
                            <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className={`status-select ${order.status.toLowerCase().replace(/\s/g, '-')}`}>
                                <option value="Payment Pending">Payment Pending</option>
                                <option value="Food Processing">Food Processing</option>
                                <option value="Out for delivery">Out for delivery</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Orders
