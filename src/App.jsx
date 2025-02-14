// src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = 'http://localhost:5000/api';

function App() {
    const [dashboardData, setDashboardData] = useState({
        total_emissions: 0,
        emissions_by_scope: { 'Scope 1': 0, 'Scope 2': 0, 'Scope 3': 0 },
        emissions_trend: []
    });
    const [filters, setFilters] = useState({
        scope: 'All Scopes',
        businessUnit: 'All Units'
    });
    const [businessUnits, setBusinessUnits] = useState([]);
    const [activityTypes, setActivityTypes] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch dashboard data when filters change
    useEffect(() => {
        fetchDashboardData();
    }, [filters]);

    // Initial data fetch for business units and activity types
    useEffect(() => {
        fetchBusinessUnits();
        fetchActivityTypes();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.scope !== 'All Scopes') params.scope = filters.scope;
            if (filters.businessUnit !== 'All Units') params.business_unit = filters.businessUnit;

            const response = await axios.get(`${API_URL}/dashboard/summary`, {
                params
            });
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBusinessUnits = async () => {
        try {
            const response = await axios.get(`${API_URL}/business-units`);
            setBusinessUnits(['All Units', ...response.data]);
        } catch (error) {
            console.error('Error fetching business units:', error);
        }
    };

    const fetchActivityTypes = async () => {
        try {
            const response = await axios.get(`${API_URL}/activity-types`);
            setActivityTypes(['All Types', ...response.data]);
        } catch (error) {
            console.error('Error fetching activity types:', error);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Chart data configuration
    const chartData = {
        labels: dashboardData.emissions_trend.map(item => item.month),
        datasets: [{
            label: 'Emissions (kgCO₂e)',
            data: dashboardData.emissions_trend.map(item => item.emissions),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Emissions Trend by Month'
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Month'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Emissions (kgCO₂e)'
                }
            }
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 fixed h-full transition-all duration-300">
                <h2 className="text-2xl font-bold text-center">Emissions Dashboard</h2>
                <nav>
                    <a href="#" className="block py-2.5 px-4 rounded hover:bg-gray-700">Dashboard</a>
                    <a href="#" className="block py-2.5 px-4 rounded hover:bg-gray-700">Data Upload</a>
                    <a href="#" className="block py-2.5 px-4 rounded hover:bg-gray-700">Reports</a>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-64 p-8 overflow-auto">
                <div className="text-3xl font-bold mb-8">Dashboard Overview</div>

                {/* Filters */}
                <div className="mb-6 flex space-x-4">
                    <select
                        name="scope"
                        value={filters.scope}
                        onChange={handleFilterChange}
                        className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        <option value="All Scopes">All Scopes</option>
                        <option value="Scope 1">Scope 1</option>
                        <option value="Scope 2">Scope 2</option>
                        <option value="Scope 3">Scope 3</option>
                    </select>

                    <select
                        name="businessUnit"
                        value={filters.businessUnit}
                        onChange={handleFilterChange}
                        className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        {businessUnits.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-2">Loading data...</p>
                    </div>
                )}

                {/* Dashboard Cards */}
                {!loading && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-transform card-hover">
                                <h3 className="text-lg font-semibold mb-2">Total Emissions</h3>
                                <p className="text-2xl font-bold text-green-600">
                                    {dashboardData.total_emissions} kgCO₂e
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-transform card-hover">
                                <h3 className="text-lg font-semibold mb-2">Scope 1 Emissions</h3>
                                <p className="text-2xl font-bold text-blue-600">
                                    {dashboardData.emissions_by_scope['Scope 1']} kgCO₂e
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-transform card-hover">
                                <h3 className="text-lg font-semibold mb-2">Scope 2 Emissions</h3>
                                <p className="text-2xl font-bold text-purple-600">
                                    {dashboardData.emissions_by_scope['Scope 2']} kgCO₂e
                                </p>
                            </div>
                        </div>

                        {/* Emissions Trend Chart */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="h-96">
                                <Bar data={chartData} options={chartOptions} />
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* CSS for card hover effect */}
            <style jsx>{`
        .card-hover:hover {
          transform: translateY(-5px);
          transition: transform 0.3s;
        }
      `}</style>
        </div>
    );
}

export default App;
