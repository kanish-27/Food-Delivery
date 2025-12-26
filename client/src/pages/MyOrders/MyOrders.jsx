import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { FaBox, FaTrash } from 'react-icons/fa'

const MyOrders = () => {

    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [trackingOrder, setTrackingOrder] = useState(null);

    const fetchOrders = async () => {
        const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
        setData(response.data.data);
    }

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm("Are you sure you want to delete this order from your history?")) {
            try {
                const response = await axios.post(url + "/api/order/deleteorder", { orderId }, { headers: { token } });
                if (response.data.success) {
                    fetchOrders();
                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                console.error("Error deleting order:", error);
                alert("Failed to delete order");
            }
        }
    }

    const handleTrackOrder = (order) => {
        fetchOrders();
        setTrackingOrder(order);
    }

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token])

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className="container">
                {data.map((order, index) => {
                    return (
                        <div key={index} className="my-orders-order dark-mode-order">
                            <FaBox size={30} color='tomato' />
                            <p>{order.items.map((item, index) => {
                                if (index === order.items.length - 1) {
                                    return item.name + " x " + item.quantity
                                }
                                else {
                                    return item.name + " x " + item.quantity + ", "
                                }
                            })}</p>
                            <p>${order.amount}.00</p>
                            <p>Items: {order.items.length}</p>
                            <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                            <button onClick={() => handleTrackOrder(order)}>Track Order</button>
                            <button className="delete-btn" onClick={() => handleDeleteOrder(order._id)} title="Delete Order">
                                <FaTrash />
                            </button>
                        </div>
                    )
                })}
            </div>


            {
                trackingOrder && (
                    <div className="tracking-modal-overlay" onClick={() => setTrackingOrder(null)}>
                        <div className="tracking-modal" onClick={e => e.stopPropagation()}>
                            <div className="tracking-modal-header">
                                <h3>Order Tracking</h3>
                                <button className="close-btn" onClick={() => setTrackingOrder(null)}>&times;</button>
                            </div>
                            <div className="tracking-modal-content">
                                <div className="order-summary">
                                    <p><strong>Order ID:</strong> #{trackingOrder._id.slice(-6)}</p>
                                    <p><strong>Amount:</strong> ${trackingOrder.amount}.00</p>
                                </div>

                                <div className="tracking-stepper">
                                    <div className={`step ${trackingOrder.status === 'Food Processing' || trackingOrder.status === 'Out for delivery' || trackingOrder.status === 'Delivered' ? 'active' : ''}`}>
                                        <div className="step-icon">1</div>
                                        <p>Processing</p>
                                    </div>
                                    <div className={`step-line ${trackingOrder.status === 'Out for delivery' || trackingOrder.status === 'Delivered' ? 'active' : ''}`}></div>
                                    <div className={`step ${trackingOrder.status === 'Out for delivery' || trackingOrder.status === 'Delivered' ? 'active' : ''}`}>
                                        <div className="step-icon">2</div>
                                        <p>Out for Delivery</p>
                                    </div>
                                    <div className={`step-line ${trackingOrder.status === 'Delivered' ? 'active' : ''}`}></div>
                                    <div className={`step ${trackingOrder.status === 'Delivered' ? 'active' : ''}`}>
                                        <div className="step-icon">3</div>
                                        <p>Delivered</p>
                                    </div>
                                </div>

                                <div className="tracking-status-msg">
                                    <p>Current Status: <span>{trackingOrder.status}</span></p>
                                </div>

                                <div className="modal-section items-section">
                                    <h4>Items</h4>
                                    <div className="items-list">
                                        {trackingOrder.items.map((item, index) => (
                                            <div key={index} className="item-row">
                                                <img src={url + "/images/" + item.image} alt={item.name} />
                                                <div className="item-info">
                                                    <p className="item-name">{item.name}</p>
                                                    <p className="item-quantity">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="item-price">${item.price * item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="modal-section address-section">
                                    <h4>Delivery Address</h4>
                                    <div className="address-details">
                                        <p>{trackingOrder.address.firstName} {trackingOrder.address.lastName}</p>
                                        <p>{trackingOrder.address.email}</p>
                                        <p>{trackingOrder.address.street}</p>
                                        <p>{trackingOrder.address.city}, {trackingOrder.address.state}, {trackingOrder.address.zipcode}</p>
                                        <p>{trackingOrder.address.country}</p>
                                        <p>{trackingOrder.address.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    )
}

export default MyOrders
