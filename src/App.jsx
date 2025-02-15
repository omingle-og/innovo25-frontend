// App.jsx
import React, { useState } from 'react';
import Dashboard from './components/Dashboard'; // Adjust path as needed
import Sidebar from './components/Sidebar'; // Adjust path as needed
import EmissionsEntryForm from './components/EmissionsEntryForm'; // Adjust path as needed
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

function App() {
    const [view, setView] = useState('dashboard');

    const handleViewChange = (newView) => {
        console.log('Changing view to:', newView); // Debug log
        setView(newView);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar onViewChange={handleViewChange} />
            <div className="flex-1 ml-64 p-8 overflow-auto">
                {view === 'dashboard' && <Dashboard />}
                {view === 'entryForm' && <EmissionsEntryForm />}
            </div>
        </div>
    );
}

export default App;