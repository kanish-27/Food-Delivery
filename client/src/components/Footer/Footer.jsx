import React from 'react'
import './Footer.css'
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa'

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <h1 style={{ color: "tomato" }}>FastFood.</h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
                        molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
                        numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium.</p>
                    <div className="footer-social-icons">
                        <FaFacebook size={30} />
                        <FaTwitter size={30} />
                        <FaLinkedin size={30} />
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2 className='footer-content-title'>COMPANY</h2>
                    <ul>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2 className='footer-content-title'>GET IN TOUCH</h2>
                    <ul>
                        <li>+1-212-456-7890</li>
                        <li>contact@tomato.com</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className="footer-copyright">Copyright 2024 © Tomato.com - All Right Reserved.</p>
        </div>
    )
}

export default Footer
