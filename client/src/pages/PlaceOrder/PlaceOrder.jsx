import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaMoneyBillWave, FaPaypal, FaApple } from 'react-icons/fa'

const PlaceOrder = () => {
    const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext)
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    })
    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const placeOrder = async (event) => {
        event.preventDefault();
        let orderItems = [];
        food_list.map((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo)
            }
        })
        const deliveryFee = getTotalCartAmount() === 0 ? 0 : 2;
        const codFee = paymentMethod === "cod" ? 10 : 0;
        const totalAmount = getTotalCartAmount() + deliveryFee + codFee;
        let orderData = {
            address: data,
            items: orderItems,
            amount: totalAmount,
            paymentMethod: paymentMethod
        }
        if (paymentMethod === "stripe") {
            let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
            if (response.data.success) {
                const { session_url } = response.data;
                window.location.replace(session_url);
            }
            else {
                alert("Error or Payment Gateway not valid")
            }
        } else {
            let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
            if (response.data.success) {
                const { session_url } = response.data;
                window.location.replace(session_url);
            }
            else {
                alert("Error")
            }
        }
    }
    const navigate = useNavigate();
    useEffect(() => {
        if (!token) {
            navigate('/cart')
        }
        else if (getTotalCartAmount() === 0) {
            navigate('/cart')
        }
    }, [token])
    const deliveryFee = getTotalCartAmount() === 0 ? 0 : 2;
    const codFee = paymentMethod === "cod" ? 10 : 0;
    const totalAmount = getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + deliveryFee + codFee;
    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className="title">Delivery Information</p>
                <div className="multi-fields">
                    <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' />
                    <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' />
                </div>
                <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
                <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
                <div className="multi-fields">
                    <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
                    <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
                </div>
                <div className="multi-fields">
                    <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
                    <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
                </div>
                <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Delivery Fee</p>
                            <p>${deliveryFee}</p>
                        </div>
                        {paymentMethod === "cod" && (
                            <>
                                <hr />
                                <div className="cart-total-details">
                                    <p>COD Charges</p>
                                    <p>${codFee}</p>
                                </div>
                            </>
                        )}
                        <hr />
                        <div className="cart-total-details">
                            <b>Total</b>
                            <b>${totalAmount}</b>
                        </div>
                    </div>
                    <div className="payment-options">
                        <h2>Payment</h2>
                        <h3 className="payment-title">How would you like to pay?</h3>

                        <div className="payment-methods-list">
                            <div onClick={() => setPaymentMethod("stripe")} className={`payment-option-row ${paymentMethod === "stripe" ? "selected" : ""}`}>
                                <div className="payment-option-left">
                                    <div className={`radio-circle ${paymentMethod === "stripe" ? "active" : ""}`}></div>
                                    <span>Credit or Debit Card</span>
                                </div>
                                <div className="payment-option-right">
                                    <FaCcVisa className="pay-icon" size={24} />
                                    <FaCcMastercard className="pay-icon" size={24} />
                                    <FaCcAmex className="pay-icon" size={24} />
                                </div>
                            </div>
                            {paymentMethod === "stripe" && (
                                <div className="payment-details-form">
                                    <div className="card-row">
                                        <input required type="text" placeholder="Card Number" className="card-input" />
                                        <input required type="text" placeholder="Name on Card" className="card-input" />
                                    </div>
                                    <div className="card-row">
                                        <input required type="text" placeholder="Expiry (MM/YY)" className="card-input" />
                                        <input required type="text" placeholder="CVV" className="card-input" />
                                    </div>
                                </div>
                            )}

                            <div onClick={() => setPaymentMethod("paypal")} className={`payment-option-row ${paymentMethod === "paypal" ? "selected" : ""}`}>
                                <div className="payment-option-left">
                                    <div className={`radio-circle ${paymentMethod === "paypal" ? "active" : ""}`}></div>
                                    <span>PayPal</span>
                                </div>
                                <div className="payment-option-right">
                                    <FaPaypal className="pay-icon" style={{ color: paymentMethod === 'paypal' ? '#0070ba' : '#888' }} size={24} />
                                </div>
                            </div>
                            {paymentMethod === "paypal" && (
                                <div className="payment-details-form paypal-details">
                                    <p className="payment-redirect-msg">You will be redirected to PayPal to complete your secure payment.</p>
                                    <div className="secure-badge">
                                        <FaLock size={12} /> 100% Secure
                                    </div>
                                </div>
                            )}

                            <div onClick={() => setPaymentMethod("apple")} className={`payment-option-row ${paymentMethod === "apple" ? "selected" : ""}`}>
                                <div className="payment-option-left">
                                    <div className={`radio-circle ${paymentMethod === "apple" ? "active" : ""}`}></div>
                                    <span>Apple Pay</span>
                                </div>
                                <div className="payment-option-right">
                                    <FaApple className="pay-icon" style={{ color: paymentMethod === 'apple' ? 'white' : '#888' }} size={24} />
                                </div>
                            </div>
                            {paymentMethod === "apple" && (
                                <div className="payment-details-form apple-details">
                                    <p className="payment-redirect-msg">Authenticate securely with Apple Pay on your device.</p>
                                    <div className="secure-badge">
                                        <FaLock size={12} /> Encrypted
                                    </div>
                                </div>
                            )}

                            <div onClick={() => setPaymentMethod("cod")} className={`payment-option-row ${paymentMethod === "cod" ? "selected" : ""}`}>
                                <div className="payment-option-left">
                                    <div className={`radio-circle ${paymentMethod === "cod" ? "active" : ""}`}></div>
                                    <span>Cash On Delivery</span>
                                </div>
                                <div className="payment-option-right">
                                    <FaMoneyBillWave className="pay-icon" style={{ color: paymentMethod === 'cod' ? 'tomato' : '#888' }} size={24} />
                                </div>
                            </div>
                            {paymentMethod === "cod" && (
                                <div className="payment-details-form">
                                    <p className="payment-redirect-msg">Pay securely with cash upon delivery.</p>
                                </div>
                            )}
                        </div>
                        <button type='submit'>PLACE ORDER</button>
                    </div>
                </div>
            </div>
        </form>
    )
}
export default PlaceOrder