import React, { useState, useEffect } from 'react'
import './MockPlayStore.css'
import { FaStar, FaGooglePlay, FaCheckCircle, FaArrowLeft, FaHamburger } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const MockPlayStore = () => {
    const navigate = useNavigate();
    const [installing, setInstalling] = useState(false);
    const [installed, setInstalled] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleInstall = () => {
        if (installed) {
            navigate('/'); // Open the app (go home)
            return;
        }
        setInstalling(true);
        // Simulate download
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 5;
            setProgress(currentProgress);
            if (currentProgress >= 100) {
                clearInterval(interval);
                setInstalling(false);
                setInstalled(true);
            }
        }, 100);
    }

    return (
        <div className="mock-store-container">
            <div className="mock-store-header">
                <FaArrowLeft className="back-icon" onClick={() => navigate('/')} />
                <div className="search-bar">
                    <FaGooglePlay className="play-icon" />
                    <span>FastFood App</span>
                </div>
            </div>

            <div className="app-details">
                <div className="app-header-section">
                    <div className="app-icon">
                        <FaHamburger size={40} />
                    </div>
                    <div className="app-info">
                        <h1>FastFood: Order & Delivery</h1>
                        <p className="developer">FastFood Inc.</p>
                        <div className="app-meta">
                            <span>Contains ads</span>
                            <span>In-app purchases</span>
                        </div>
                    </div>
                </div>

                <div className="app-stats">
                    <div className="stat-item">
                        <span className="rating">4.7 <FaStar className="star" /></span>
                        <span className="label">95K reviews</span>
                    </div>
                    <div className="divider"></div>
                    <div className="stat-item">
                        <span className="download-size">25 MB</span>
                    </div>
                    <div className="divider"></div>
                    <div className="stat-item">
                        <span className="downloads">1M+</span>
                        <span className="label">Downloads</span>
                    </div>
                </div>

                <button
                    className={`install-btn ${installed ? 'open' : ''} ${installing ? 'downloading' : ''}`}
                    onClick={handleInstall}
                    disabled={installing}
                >
                    {installing ? `Downloading... ${progress}%` : installed ? 'Open' : 'Install'}
                </button>

                {installed && <div className="install-success"><FaCheckCircle /> App Installed</div>}

                <div className="app-screenshots">
                    <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=600&fit=crop" alt="Screenshot 1" className="screenshot" />
                    <img src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=600&fit=crop" alt="Screenshot 2" className="screenshot" />
                    <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=600&fit=crop" alt="Screenshot 3" className="screenshot" />
                </div>

                <div className="about-section">
                    <h2>About this app</h2>
                    <p>Order food from your favorite restaurants. Fast delivery, great offers, and delicious meals delivered to your doorstep.</p>
                </div>
            </div>
        </div>
    )
}

export default MockPlayStore
