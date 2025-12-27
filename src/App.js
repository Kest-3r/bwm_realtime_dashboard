import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import PublicDashboard from './components/PublicDashboard';
import AdminPanel from './components/AdminPanel';

// Pages
import DonationPage from './pages/DonationPage';
import EventRegistration from './pages/EventRegistration';
import LibraryArchive from './pages/LibraryArchive';
import LibraryItemDetail from './pages/LibraryItemDetail';
import MembershipRegistration from './pages/MembershipRegistration';
import VolunteerTimeline from './pages/VolunteerTimeline';
import VolunteerEventDetail from './pages/VolunteerEventDetail';

function App() {
    // 1. Shared Global State for Dashboards
    const [financialData, setFinancialData] = useState({ current: 32500, target: 50000 });
    const [membershipCount, setMembershipCount] = useState(375);

    // 2. Campaign Carousel Data
    const [campaigns, setCampaigns] = useState([
        {
            id: 1,
            name: "Heritage Cleanup 2025",
            slotsFilled: 45,
            targetGoal: 100,
            image: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?q=80&w=1200"
        },
        {
            id: 2,
            name: "Batu Caves Restoration",
            slotsFilled: 80,
            targetGoal: 150,
            image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1200"
        }
    ]);

    // 3. Library State (Passed as 'items' to match LibraryArchive.js)
    const [libraryItems, setLibraryItems] = useState([
        {
            id: 1,
            title: "Old Kuala Lumpur Map (1920)",
            donor: "John Doe",
            category: "Cartography",
            date: "22 Dec 2025",
            description: "A rare hand-drawn map showing the colonial layout of central KL."
        }
    ]);

    // 4. Volunteer State (Passed as 'events' to match VolunteerTimeline.js)
    const [volunteerEvents, setVolunteerEvents] = useState([
        {
            id: 1,
            title: "Cleanup Drive",
            group: "Corporate Team A",
            impact: "50kg Waste Removed",
            date: "15 Sep 2025",
            description: "A large-scale effort to clean the heritage grounds surrounding the BWM headquarters."
        }
    ]);

    return (
        <Router>
            <Routes>
                {/* Public Dashboard */}
                <Route path="/" element={
                    <PublicDashboard
                        campaigns={campaigns}
                        libraryItems={libraryItems}
                        volunteerEvents={volunteerEvents}
                        membershipCount={membershipCount}
                        financialData={financialData}
                    />
                } />

                {/* --- FIX: Mapping state to the EXACT prop names expected by your pages --- */}

                {/* Volunteer Routes */}
                <Route path="/volunteer-timeline" element={
                    <VolunteerTimeline events={volunteerEvents} />
                } />
                <Route path="/volunteer-timeline/:id" element={
                    <VolunteerEventDetail events={volunteerEvents} />
                } />

                {/* Library Routes */}
                <Route path="/library-archive" element={
                    <LibraryArchive items={libraryItems} />
                } />
                <Route path="/library-archive/:id" element={
                    <LibraryItemDetail items={libraryItems} />
                } />

                {/* Action & Registration Pages */}
                <Route path="/donate" element={
                    <DonationPage financialData={financialData} setFinancialData={setFinancialData} />
                } />
                <Route path="/membership-registration" element={<MembershipRegistration />} />
                <Route path="/event-registration/:id" element={<EventRegistration />} />

                {/* Admin Management */}
                <Route path="/admin" element={
                    <AdminPanel
                        campaigns={campaigns} setCampaigns={setCampaigns}
                        libraryItems={libraryItems} setLibraryItems={setLibraryItems}
                        volunteerEvents={volunteerEvents} setVolunteerEvents={setVolunteerEvents}
                        financialData={financialData} setFinancialData={setFinancialData}
                        membershipCount={membershipCount} setMembershipCount={setMembershipCount}
                    />
                } />
            </Routes>
        </Router>
    );
}

export default App;