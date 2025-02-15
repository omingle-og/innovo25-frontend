// Sidebar.jsx
import React from 'react';

export default function Sidebar({ onViewChange }) {
    return (
        <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 fixed h-full">
            <h2 className="text-2xl font-bold text-center">Emissions Dashboard</h2>
            <nav>
                <a 
                    href="#" 
                    className="block py-2.5 px-4 rounded hover:bg-gray-700"
                    onClick={(e) => {
                        e.preventDefault();
                        console.log('Navigating to dashboard'); // Debug log
                        onViewChange('dashboard');
                    }}
                >
                    Dashboard
                </a>
                <a 
                    href="#" 
                    className="block py-2.5 px-4 rounded hover:bg-gray-700"
                    onClick={(e) => {
                        e.preventDefault();
                        console.log('Navigating to entryForm'); // Debug log
                        onViewChange('entryForm');
                    }}
                >
                    Data Upload
                </a>
                <a 
                    href="#" 
                    className="block py-2.5 px-4 rounded hover:bg-gray-700"
                    onClick={(e) => {
                        e.preventDefault();
                        console.log('Navigating to reports'); // Debug log
                        onViewChange('reports');
                    }}
                >
                    Reports
                </a>
            </nav>
        </div>
    );
}