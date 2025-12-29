// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Import the client

// Components & Pages
import PublicDashboard from './components/PublicDashboard';
import AdminPanel from './components/AdminPanel';
import DonationPage from './pages/DonationPage';
import EventRegistration from './pages/EventRegistration';
import LibraryArchive from './pages/LibraryArchive';
import LibraryItemDetail from './pages/LibraryItemDetail';
import MembershipRegistration from './pages/MembershipRegistration';
import VolunteerTimeline from './pages/VolunteerTimeline';
import VolunteerEventDetail from './pages/VolunteerEventDetail';

function App() {
    // 1. Shared Global State (Initialized as empty/null)
    const [financialData, setFinancialData] = useState({ current: 0, target: 0 });
    const [membershipCount, setMembershipCount] = useState(0);

    // 2. Mock Data for others (as requested, only the 3 stats moved to DB)
    const [campaigns, setCampaigns] = useState([
        { id: 1, name: "Heritage Cleanup 2025", slotsFilled: 45, targetGoal: 100, image: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?q=80&w=1200" },
        { id: 2, name: "Batu Caves Restoration", slotsFilled: 80, targetGoal: 150, image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1200" }
    ]);
    const [libraryItems, setLibraryItems] = useState([
        { id: 1, title: "Old Kuala Lumpur Map (1920)", donor: "John Doe", category: "Cartography", date: "22 Dec 2025", description: "A rare hand-drawn map showing the colonial layout of central KL." }
    ]);
    const [volunteerEvents, setVolunteerEvents] = useState([
        { id: 1, title: "Cleanup Drive", group: "Corporate Team A", impact: "50kg Waste Removed", date: "15 Sep 2025", description: "Large-scale effort to clean heritage grounds." }
    ]);

    // REAL-TIME LOGIC: Fetch and Subscribe
    useEffect(() => {
        // Function to fetch initial data for id: 1
        const fetchStats = async () => {
            const { data, error } = await supabase
                .from('site_stats')
                .select('*')
                .eq('id', 1)
                .single();

            if (data) {
                setFinancialData({ current: data.financial_current, target: data.financial_target });
                setMembershipCount(data.membership_count);
            }
        };

        fetchStats();

        // Subscribe to real-time changes on the site_stats table
        const channel = supabase
            .channel('realtime_stats')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'site_stats', filter: 'id=eq.1' },
                (payload) => {
                    const updated = payload.new;
                    setFinancialData({ 
                        current: updated.financial_current, 
                        target: updated.financial_target 
                    });
                    setMembershipCount(updated.membership_count);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <PublicDashboard
                        campaigns={campaigns}
                        libraryItems={libraryItems}
                        volunteerEvents={volunteerEvents}
                        membershipCount={membershipCount}
                        financialData={financialData}
                    />
                } />
                <Route path="/volunteer-timeline" element={<VolunteerTimeline events={volunteerEvents} />} />
                <Route path="/volunteer-timeline/:id" element={<VolunteerEventDetail events={volunteerEvents} />} />
                <Route path="/library-archive" element={<LibraryArchive items={libraryItems} />} />
                <Route path="/library-archive/:id" element={<LibraryItemDetail items={libraryItems} />} />
                <Route path="/donate" element={<DonationPage financialData={financialData} />} />
                <Route path="/membership-registration" element={<MembershipRegistration membershipCount={membershipCount} />} />
                <Route path="/event-registration/:id" element={<EventRegistration />} />
                <Route path="/admin" element={
                    <AdminPanel
                        campaigns={campaigns} setCampaigns={setCampaigns}
                        libraryItems={libraryItems} setLibraryItems={setLibraryItems}
                        volunteerEvents={volunteerEvents} setVolunteerEvents={setVolunteerEvents}
                        financialData={financialData}
                        membershipCount={membershipCount}
                    />
                } />
            </Routes>
        </Router>
    );
}

export default App;