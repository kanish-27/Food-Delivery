import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { FaPaypal, FaApple, FaLock, FaCheckCircle, FaCreditCard } from 'react-icons/fa';
import './MockPayment.css';
import axios from 'axios';

const MockPayment = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const method = searchParams.get('method') || 'paypal';
    const amountVal = searchParams.get('amount');
    const navigate = useNavigate();
    const { url, token } = useContext(StoreContext);

    // States for simulation: 'login', 'review'
    const [step, setStep] = useState(method === 'paypal' ? 'login' : 'review');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [processing, setProcessing] = useState(false);
    const [amount, setAmount] = useState(amountVal || 0);

    useEffect(() => {
        // Optimistically verify order exists or fetch amount (optional for mock)
    }, [orderId]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (email && password) {
            setProcessing(true);
            setTimeout(() => {
                setProcessing(false);
                setStep('review');
            }, 1000);
        } else {
            alert("Please enter any simulated email and password.");
        }
    }

    const handlePayment = () => {
        setProcessing(true);
        setTimeout(() => {
            navigate(`/verify?success=true&orderId=${orderId}`);
        }, 2000);
    }

    const handleCancel = () => {
        navigate(`/verify?success=false&orderId=${orderId}`);
    }

    return (
        <div className="mock-payment-container">
            <div className={`mock-payment-card ${step}`}>
                <div className="mock-header">
                    {method === 'paypal' ? (
                        <FaPaypal size={40} color="#003087" />
                    ) : method === 'stripe' ? (
                        <FaCreditCard size={40} color="#6772e5" />
                    ) : (
                        <FaApple size={40} color="black" />
                    )}
                    <h2>
                        {method === 'paypal'
                            ? (step === 'login' ? 'Log in to PayPal' : 'Review your payment')
                            : method === 'stripe' ? 'Pay with Card' : 'Apple Pay'
                        }
                    </h2>
                </div>

                <div className="mock-body">
                    {step === 'login' && method === 'paypal' ? (
                        <form className="mock-login-form" onSubmit={handleLogin}>
                            <div className="input-group">
                                <input
                                    type="email"
                                    placeholder="Email or mobile number"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <a href="#" className="forgot-link">Forgot password?</a>

                            {processing ? (
                                <div className="spinner-small"></div>
                            ) : (
                                <button type="submit" className="pay-btn paypal">Log In</button>
                            )}

                            <div className="divider">
                                <span>or</span>
                            </div>

                            <button type="button" className="secondary-btn">Pay with Debit or Credit Card</button>
                        </form>
                    ) : (
                        // Review Step (or Apple Pay default)
                        <div className="mock-review-section">
                            <p className="merchant-info">Pay to: <strong>FastFood Inc.</strong></p>
                            <div className="amount-display">
                                <span className="currency">₹</span>
                                <span className="value">{parseFloat(amount).toFixed(2)}</span>
                            </div>

                            <div className="mock-loader-container">
                                {processing ? (
                                    <div className="processing-state">
                                        <div className="spinner"></div>
                                        <p>Processing Payment...</p>
                                        <small>Please do not close this window</small>
                                    </div>
                                ) : (
                                    <div className="action-state">
                                        <p className="secure-text"><FaLock size={12} /> Secure Payment Gateway (Sandbox)</p>

                                        {method === 'paypal' && (
                                            <div className="payment-source">
                                                <p>Paying with</p>
                                                <div className="card-row">
                                                    <FaPaypal color="#003087" />
                                                    <span>PayPal Balance</span>
                                                </div>
                                            </div>
                                        )}
                                        {method === 'stripe' && (
                                            <div className="payment-source">
                                                <p>Paying with</p>
                                                <div className="card-row">
                                                    <FaCreditCard color="#000" />
                                                    <span>Visa ending in 4242</span>
                                                </div>
                                            </div>
                                        )}

                                        <button className={`pay-btn ${method}`} onClick={handlePayment}>
                                            {method === 'paypal' ? 'Complete Purchase' : method === 'stripe' ? 'Pay Now' : 'Pay with Apple Pay'}
                                        </button>
                                        <button className="cancel-btn" onClick={handleCancel}>Cancel & Return to Store</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="mock-footer">
                    <p>Secured by <strong>Antigravity Simulation</strong>. No real money is transferred.</p>
                </div>
            </div>
        </div>
    );
};

export default MockPayment;
