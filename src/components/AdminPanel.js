import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import {
    X, ClipboardList, BookCheck, DollarSign, Users,
    LogOut, Plus, UserPlus
} from 'lucide-react';
import './Admin.css';

const AdminPanel = ({
                        campaigns, setCampaigns,
                        libraryItems, setLibraryItems,
                        volunteerEvents, setVolunteerEvents,
                        financialData,
                        membershipCount
                    }) => {
    const [currentView, setCurrentView] = useState('campaigns');
    const [showModal, setShowModal] = useState(false);
    const [newCampaign, setNewCampaign] = useState({ name: '', targetGoal: 0, image: '', status: 'Active' });

    // --- LOCAL STATE FOR INPUTS (Fixes the typing issue) ---
    const [localMembership, setLocalMembership] = useState(membershipCount || 0);
    const [localFinancial, setLocalFinancial] = useState(financialData || { current: 0, target: 0 });

    // Sync local state when real-time data comes in from App.js
    useEffect(() => {
        if (membershipCount !== undefined) setLocalMembership(membershipCount);
    }, [membershipCount]);

    useEffect(() => {
        if (financialData) setLocalFinancial(financialData);
    }, [financialData]);

    // --- Supabase Update Functions ---
    const updateFinancials = async (updates) => {
        // Update local state immediately for responsiveness
        setLocalFinancial(prev => ({ ...prev, ...updates }));

        const { error } = await supabase
            .from('site_stats')
            .update(updates)
            .eq('id', 1);
        
        if (error) console.error("Error updating financial data:", error.message);
    };

    const updateMembership = async (val) => {
        // Handle empty input to prevent NaN errors
        const newValue = val === '' ? 0 : parseInt(val);
        
        // Update local state immediately
        setLocalMembership(val);

        const { error } = await supabase
            .from('site_stats')
            .update({ membership_count: newValue })
            .eq('id', 1);

        if (error) console.error("Error updating membership count:", error.message);
    };

    const handleAddCampaign = (e) => {
        e.preventDefault();
        setCampaigns([...campaigns, { ...newCampaign, id: Date.now(), slotsFilled: 0 }]);
        setShowModal(false);
        setNewCampaign({ name: '', targetGoal: 0, image: '', status: 'Active' });
    };

    const renderView = () => {
        switch(currentView) {
            case 'campaigns':
                return (
                    <div className="view-container">
                        <button className="btn-add-main" onClick={() => setShowModal(true)}><Plus size={18} /> New Campaign</button>
                        <div className="table-wrapper">
                            <table className="admin-table">
                                <thead><tr><th>Image</th><th>Name</th><th>Goal</th><th>Status</th></tr></thead>
                                <tbody>
                                {campaigns.map(c => (
                                    <tr key={c.id}>
                                        <td><img src={c.image} alt="" className="table-thumb" /></td>
                                        <td><strong>{c.name}</strong></td>
                                        <td>{c.targetGoal}</td>
                                        <td><span className="badge-active">{c.status}</span></td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'library':
                return (
                    <div className="view-container">
                        <div className="header-action-row">
                            <h2 className="section-title">Library Acquisitions Vetting</h2>
                            <button className="btn-manual">+ Log Manual Donation</button>
                        </div>
                        <div className="stats-row">
                            <div className="stat-card"><span>Pending Reviews</span><strong>0</strong></div>
                            <div className="stat-card"><span>Approved This Year</span><strong>1</strong></div>
                            <div className="stat-card"><span>Rejected Submissions</span><strong>250</strong></div>
                        </div>
                        <div className="table-wrapper transparent">
                            <table className="admin-table styled">
                                <thead>
                                <tr><th>Date</th><th>Book Title & Author</th><th>Donor Name</th><th>Status</th><th>Action</th></tr>
                                </thead>
                                <tbody>
                                <tr className="teal-row">
                                    <td>22 Dec 2025</td>
                                    <td>Old Kuala Lumpur Map (1920)</td>
                                    <td>John Doe</td>
                                    <td>Pending Review</td>
                                    <td className="action-cell">
                                        <button className="btn-table-approve">✅ Approve</button>
                                        <button className="btn-table-reject">❌ Reject</button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'volunteer':
                return (
                    <div className="view-container">
                        <div className="header-action-row">
                            <h2 className="section-title">Volunteer Impact Logs</h2>
                            <button className="btn-manual">+ Log New Impact</button>
                        </div>
                        <div className="stats-row">
                            <div className="stat-card"><span>Total Events</span><strong>0</strong></div>
                            <div className="stat-card"><span>Total Volunteers</span><strong>1</strong></div>
                            <div className="stat-card"><span>Waste Collected</span><strong>250</strong></div>
                        </div>
                        <div className="table-wrapper transparent">
                            <table className="admin-table styled">
                                <thead>
                                <tr><th>Date</th><th>Group/Volunteer</th><th>Event Type</th><th>Key Outcome</th><th>Action</th></tr>
                                </thead>
                                <tbody>
                                <tr className="teal-row">
                                    <td>15 Sep 2025</td>
                                    <td>Corporate Team A</td>
                                    <td>Cleanup Drive</td>
                                    <td>50kg Waste Removed</td>
                                    <td><button className="btn-table-edit">Edit</button></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'financials':
                return (
                    <div className="view-container">
                        <div className="header-action-row">
                            <h2 className="section-title">Finance & Membership Control</h2>
                            <div className="dual-actions">
                                <button className="btn-manual"><DollarSign size={16}/> Log Donation</button>
                                <button className="btn-manual"><UserPlus size={16}/> Add Member</button>
                            </div>
                        </div>

                        <div className="admin-grid-two">
                            {/* Finance Card */}
                            <div className="admin-card-control">
                                <div className="card-badge finance">Finance</div>
                                <div className="input-group">
                                    <label>Goal (RM)</label>
                                    <input 
                                        type="number" 
                                        value={localFinancial.target} 
                                        onChange={(e) => updateFinancials({ financial_target: parseInt(e.target.value) || 0 })} 
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Current (RM)</label>
                                    <input 
                                        type="number" 
                                        value={localFinancial.current} 
                                        onChange={(e) => updateFinancials({ financial_current: parseInt(e.target.value) || 0 })} 
                                    />
                                </div>
                                <div className="progress-preview">
                                    <div className="progress-bar-bg">
                                        <div className="progress-bar-fill gold" style={{ width: `${(localFinancial.current / (localFinancial.target || 1)) * 100}%` }}></div>
                                    </div>
                                    <span>{((localFinancial.current / (localFinancial.target || 1)) * 100).toFixed(1)}% of Goal</span>
                                </div>
                            </div>

                            {/* Membership Card */}
                            <div className="admin-card-control">
                                <div className="card-badge member">Membership</div>
                                <div className="input-group">
                                    <label>Member Goal</label>
                                    <input type="number" value={500} disabled className="disabled-input" />
                                </div>
                                <div className="input-group">
                                    <label>Current Active</label>
                                    <input 
                                        type="number" 
                                        value={localMembership} 
                                        onChange={(e) => updateMembership(e.target.value)} 
                                    />
                                </div>
                                <div className="progress-preview">
                                    <div className="progress-bar-bg">
                                        <div className="progress-bar-fill teal" style={{ width: `${(localMembership / 500) * 100}%` }}></div>
                                    </div>
                                    <span>{((localMembership / 500) * 100).toFixed(1)}% of Goal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="admin-layout">
            <aside className="sidebar">
                <div className="sidebar-brand">BWM ADMIN</div>
                <nav className="sidebar-nav">
                    <button onClick={() => setCurrentView('campaigns')} className={`nav-item ${currentView === 'campaigns' ? 'active' : ''}`}><ClipboardList size={18} /> Campaigns</button>
                    <button onClick={() => setCurrentView('library')} className={`nav-item ${currentView === 'library' ? 'active' : ''}`}><BookCheck size={18} /> Library</button>
                    <button onClick={() => setCurrentView('volunteer')} className={`nav-item ${currentView === 'volunteer' ? 'active' : ''}`}><Users size={18} /> Volunteers</button>
                    <button onClick={() => setCurrentView('financials')} className={`nav-item ${currentView === 'financials' ? 'active' : ''}`}><DollarSign size={18} /> Finance & Members</button>
                </nav>
                <a href="/" className="exit-link"><LogOut size={18} /> Public Site</a>
            </aside>

            <main className="admin-body">
                <header className="body-header">
                    <h1>{currentView === 'financials' ? 'FINANCE & MEMBERSHIP' : currentView.toUpperCase()}</h1>
                </header>
                {renderView()}
            </main>

            {showModal && (
                <div className="modal-bg">
                    <div className="modal-box">
                        <div className="modal-head"><h2>New Campaign</h2><X onClick={() => setShowModal(false)} className="pointer" /></div>
                        <form onSubmit={handleAddCampaign} className="modal-form">
                            <input placeholder="Name" required onChange={e => setNewCampaign({...newCampaign, name: e.target.value})} />
                            <input placeholder="Target Seats" type="number" required onChange={e => setNewCampaign({...newCampaign, targetGoal: parseInt(e.target.value)})} />
                            <input placeholder="Image URL" onChange={e => setNewCampaign({...newCampaign, image: e.target.value})} />
                            <button type="submit" className="btn-add-main">Save</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;