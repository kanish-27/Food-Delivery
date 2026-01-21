import React, { useState, useEffect } from 'react'
import './Orders.css'
import axios from "axios"
import { toast } from 'react-toastify'
import { FaBoxOpen, FaUser, FaClipboardList, FaRupeeSign, FaTimes } from 'react-icons/fa'

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

    const [selectedOrder, setSelectedOrder] = useState(null);

    const statusHandler = async (event, orderId) => {
        // Stop propagation is handled in the select's onClick wrapper if needed, 
        // but here we just need to ensure the select click doesn't bubble if it overlaps.
        // Actually, we will put stopPropagation on the select container or event.
        const response = await axios.post(url + "/api/order/status", {
            orderId,
            status: event.target.value
        })
        if (response.data.success) {
            await fetchAllOrders();
            // Update selected order if it's currently open
            if (selectedOrder && selectedOrder._id === orderId) {
                setSelectedOrder(prev => ({ ...prev, status: event.target.value }));
            }
        }
    }

    useEffect(() => {
        fetchAllOrders();
    }, [])

    const orderStatuses = [
        { label: "Payment Pending", value: "Payment Pending", color: "#ff6b6b" },
        { label: "Food Processing", value: "Food Processing", color: "#4facfe" },
        { label: "Out for delivery", value: "Out for delivery", color: "#ffb74d" },
        { label: "Delivered", value: "Delivered", color: "#00f260" }
    ];

    const getOrdersByStatus = (status) => orders.filter(o => o.status === status);

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
    }

    const closeOrderDetails = () => {
        setSelectedOrder(null);
    }

    // Helper to format currency
    const formatPrice = (amount) => {
        return "₹" + amount;
    }

    return (
        <div className='orders-page'>
            <h3>Order Dashboard</h3>
            <div className="kanban-board">
                {orderStatuses.map((statusObj) => (
                    <div key={statusObj.value} className="kanban-column">
                        <div className="kanban-header" style={{ borderBottomColor: statusObj.color }}>
                            <h4>{statusObj.label}</h4>
                            <span className="count-badge" style={{ backgroundColor: statusObj.color + '40', color: statusObj.color }}>
                                {getOrdersByStatus(statusObj.value).length}
                            </span>
                        </div>
                        <div className="kanban-content">
                            {getOrdersByStatus(statusObj.value).map((order) => (
                                <div key={order._id} className='kanban-card' onClick={() => openOrderDetails(order)}>
                                    <div className="card-header">
                                        <div className="order-icon-wrapper">
                                            <FaBoxOpen size={20} color={statusObj.color} />
                                        </div>
                                        <span className='order-id-chip'>#{order._id.slice(-6)}</span>
                                    </div>

                                    <div className="card-body">
                                        <div className="info-row">
                                            <FaClipboardList className="info-icon" />
                                            <div className='items-text'>
                                                {order.items.map((item, idx) => (
                                                    <span key={idx}>
                                                        {item.name} x {item.quantity}{idx !== order.items.length - 1 ? ", " : ""}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="info-row">
                                            <FaUser className="info-icon" />
                                            <span className="customer-name">{order.address.firstName} {order.address.lastName}</span>
                                        </div>
                                        <div className="info-row customer-details">
                                            <span>{order.address.street}, {order.address.city}</span>
                                            <span>{order.address.phone}</span>
                                        </div>
                                    </div>

                                    <div className="card-footer">
                                        <div className="amount-wrapper">
                                            <FaRupeeSign size={12} />
                                            <span className="amount">{order.amount}</span>
                                        </div>
                                        <div className="status-control" onClick={(e) => e.stopPropagation()}>
                                            <select
                                                onChange={(event) => statusHandler(event, order._id)}
                                                value={order.status}
                                                className="status-select-mini"
                                            >
                                                {orderStatuses.map(s => (
                                                    <option key={s.value} value={s.value}>{s.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {getOrdersByStatus(statusObj.value).length === 0 && (
                                <div className="empty-column-state">
                                    No orders
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="order-modal-overlay" onClick={closeOrderDetails}>
                    <div className="order-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                Order #{selectedOrder._id.slice(-6)}
                                <span
                                    className="modal-status-badge"
                                    style={{
                                        backgroundColor: orderStatuses.find(s => s.value === selectedOrder.status)?.color + '20',
                                        color: orderStatuses.find(s => s.value === selectedOrder.status)?.color
                                    }}
                                >
                                    {selectedOrder.status}
                                </span>
                            </h2>
                            <button className="close-modal-btn" onClick={closeOrderDetails}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="modal-body">
                            {/* Left Col: Items */}
                            <div className="modal-items-section">
                                <div className="modal-section-title">
                                    <FaBoxOpen /> Order Items ({selectedOrder.items.length})
                                </div>
                                <div className="modal-items-list">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="modal-item-row">
                                            <div className="modal-item-image">
                                                {item.image ? (
                                                    <img src={url + "/images/" + item.image} alt={item.name} />
                                                ) : (
                                                    <FaBoxOpen size={24} color="#555" />
                                                )}
                                            </div>
                                            <div className="modal-item-info">
                                                <h4>{item.name}</h4>
                                                <p>Quantity: {item.quantity}</p>
                                                {/* Price per item if available, else hidden */}
                                                {item.price && <p>Unit Price: {formatPrice(item.price)}</p>}
                                            </div>
                                            <div className="modal-item-total">
                                                {item.price ? formatPrice(item.price * item.quantity) : `x${item.quantity}`}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Col: Details */}
                            <div className="modal-details-section">
                                <div className="modal-section-title">
                                    <FaUser /> Customer Details
                                </div>
                                <div className="customer-detail-box">
                                    <div className="detail-row">
                                        <span className="detail-label">Name:</span>
                                        <span className="detail-value">{selectedOrder.address.firstName} {selectedOrder.address.lastName}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Phone:</span>
                                        <span className="detail-value">{selectedOrder.address.phone}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Email:</span>
                                        <span className="detail-value">{selectedOrder.address.email || "N/A"}</span>
                                    </div>
                                    <div className="modal-divider"></div>
                                    <div className="detail-row">
                                        <span className="detail-label">Address:</span>
                                        <span className="detail-value">
                                            {selectedOrder.address.street}, {selectedOrder.address.city},<br />
                                            {selectedOrder.address.state}, {selectedOrder.address.zipcode}
                                        </span>
                                    </div>
                                </div>

                                <div className="modal-section-title">
                                    <FaRupeeSign /> Payment Info
                                </div>
                                <div className="payment-detail-box">
                                    <div className="detail-row">
                                        <span className="detail-label">Total Amount:</span>
                                        <span className="detail-value" style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                                            {formatPrice(selectedOrder.amount)}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Method:</span>
                                        <span className="detail-value">
                                            {/* Fallback to 'Card' if true, or COD if false, or show method string if exists */}
                                            {selectedOrder.paymentMethod ? selectedOrder.paymentMethod : (selectedOrder.payment ? "Online Payment" : "Cash on Delivery")}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Status:</span>
                                        <span className={`detail-value payment-status ${selectedOrder.payment ? 'paid' : 'pending'}`}>
                                            {selectedOrder.payment ? "Paid" : "Pending / COD"}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Date:</span>
                                        <span className="detail-value">
                                            {new Date(selectedOrder.date || Date.now()).toLocaleDateString() + " " + new Date(selectedOrder.date || Date.now()).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Orders
