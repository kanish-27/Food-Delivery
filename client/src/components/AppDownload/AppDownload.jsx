import React from 'react'
import './AppDownload.css'
import { FaGooglePlay, FaApple } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const AppDownload = () => {
    return (
        <div className='app-download' id='app-download'>
            <p>For Better Experience Download <br /> FastFood App</p>
            <div className="app-download-platforms">
                <Link to="/mock-app-store" className="store-btn">
                    <FaGooglePlay size={30} />
                    <div className="store-text">
                        <small>GET IT ON</small>
                        <span>Google Play</span>
                    </div>
                </Link>
                <Link to="/mock-app-store" className="store-btn">
                    <FaApple size={30} />
                    <div className="store-text">
                        <small>Download on the</small>
                        <span>App Store</span>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default AppDownload
