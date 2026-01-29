import React, { useState } from 'react';
import './Contact.css';
import { toast } from 'react-toastify';
import axios from 'axios';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            // In a real app, you'd have a backend endpoint here. 
            // For now, we will simulate or use the endpoint we are about to create.
            const url = import.meta.env.VITE_API_URL || "http://localhost:4000";
            const response = await axios.post(`${url}/api/contact/send`, formData);
            if (response.data.success) {
                toast.success('Feedback sent successfully!');
                setFormData({ name: '', email: '', message: '' });
            } else {
                toast.error(response.data.message || 'Error sending feedback');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to send feedback. Please try again later.');
        }
    };

    return (
        <div className='contact-page'>
            <div className="contact-container">
                <h2>Get In Touch</h2>
                <p>We'd love to hear from you. Please fill out the form below.</p>
                <form onSubmit={onSubmit} className="contact-form">
                    <div className="form-group">
                        <label htmlFor="name">Your Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={onChange}
                            required
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Your Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={onChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            name="message"
                            rows="5"
                            value={formData.message}
                            onChange={onChange}
                            required
                            placeholder="How can we help you?"
                        ></textarea>
                    </div>
                    <button type="submit">Send Feedback</button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
