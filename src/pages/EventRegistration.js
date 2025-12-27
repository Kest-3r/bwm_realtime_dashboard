import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, ArrowLeft } from 'lucide-react';
import './Pages.css';

const EventRegistration = () => {
    const navigate = useNavigate();
    return (
        <div className="page-wrapper-cream">
            <button className="btn-back-pill" onClick={() => navigate('/')}><ArrowLeft size={16} /> Back to Dashboard</button>
            <div className="form-card-centered">
                <img src="https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&q=80&w=1000" className="form-hero" alt="Workshop"/>
                <h2 className="form-header-text">Heritage Impact Assessment Workshop</h2>
                <div className="form-event-details">
                    <p><Calendar size={18}/> 22-26 April 2024</p>
                    <p><MapPin size={18}/> Melaka, Malaysia</p>
                    <p><DollarSign size={18}/> RM 50.00 / people</p>
                </div>
                <form className="stacked-form">
                    <div className="input-row"><label>Full Name</label><input type="text"/></div>
                    <div className="input-row"><label>Email Address</label><input type="email"/></div>
                    <div className="input-row"><label>Phone Number</label><input type="text"/></div>
                    <div className="input-row"><label>Number of people</label><input type="number"/></div>
                    <button type="submit" className="btn-form-submit">Confirm Registration</button>
                </form>
            </div>
        </div>
    );
};
export default EventRegistration;