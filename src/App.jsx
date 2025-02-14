import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const API_URL = 'http://localhost:5000/api';

export default function App() {
    const [dashboardData, setDashboardData] = useState({
        total_emissions: 0,
        emissions_by_scope: { 'Scope 1': 0, 'Scope 2': 0, 'Scope 3': 0 },
        emissions_by_business_unit: {
            'Data Center': 0,
            'Manufacturing': 0,
            'Office Operations': 0,
            'Supply Chain': 0
        },
        emissions_trend: []
    });
    const [selectedScope, setSelectedScope] = useState('All Scopes');
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState('All Units');
    const [businessUnits, setBusinessUnits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (selectedScope !== 'All Scopes') {
                const formattedScope = selectedScope.replace(/\s+/g, '');
                params.append('scope', formattedScope);
            }
            if (selectedBusinessUnit !== 'All Units') {
                params.append('business_unit', selectedBusinessUnit);
            }

            const url = `${API_URL}/dashboard/summary${params.toString() ? `?${params.toString()}` : ''}`;
            console.log('Fetching URL:', url);

            const response = await axios.get(url);
            console.log('Raw API Response:', response.data);

            const newData = {
                total_emissions: Number(response.data.total_emissions) || 0,
                emissions_by_scope: {
                    'Scope 1': Number(response.data.emissions_by_scope?.['Scope 1']) || 0,
                    'Scope 2': Number(response.data.emissions_by_scope?.['Scope 2']) || 0,
                    'Scope 3': Number(response.data.emissions_by_scope?.['Scope 3']) || 0
                },
                emissions_by_business_unit: {
                    'Data Center': Number(response.data.emissions_by_business_unit?.['Data Center']) || 0,
                    'Manufacturing': Number(response.data.emissions_by_business_unit?.['Manufacturing']) || 0,
                    'Office Operations': Number(response.data.emissions_by_business_unit?.['Office Operations']) || 0,
                    'Supply Chain': Number(response.data.emissions_by_business_unit?.['Supply Chain']) || 0,
                },
                emissions_trend: Array.isArray(response.data.emissions_trend)
                    ? response.data.emissions_trend.map(item => ({
                        month: item.month,
                        emissions: Number(item.emissions) || 0
                    }))
                    : []
            };

            console.log('Transformed data:', newData);
            setDashboardData(newData);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchDashboardData();
        }, 100);
        return () => clearTimeout(timer);
    }, [selectedScope, selectedBusinessUnit]);

    const fetchBusinessUnits = async () => {
        try {
            const response = await axios.get(`${API_URL}/business-units`);
            setBusinessUnits(['All Units', ...response.data]);
        } catch (error) {
            console.error('Error fetching business units:', error);
            setError('Failed to load business units');
        }
    };

    useEffect(() => {
        fetchBusinessUnits();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        console.log('Filter changing:', name, value);

        if (name === 'scope') {
            setSelectedScope(value);
        } else if (name === 'businessUnit') {
            setSelectedBusinessUnit(value);
        }
    };

    // Chart Configurations
    const barChartData = {
        labels: dashboardData.emissions_trend.map(item => item.month),
        datasets: [{
            label: 'Emissions (business units)',
            data: dashboardData.emissions_trend.map(item => item.emissions),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const scopePieChartData = {
        labels: Object.keys(dashboardData.emissions_by_scope),
        datasets: [{
            data: Object.values(dashboardData.emissions_by_scope),
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1
        }]
    };

    const unitPieChartData = {
        labels: Object.keys(dashboardData.emissions_by_business_unit),
        datasets: [{
            data: Object.values(dashboardData.emissions_by_business_unit),
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: `Emissions Trend by Month ${selectedScope !== 'All Scopes' ? `(${selectedScope})` : ''}`
            }
        }
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right' },
            title: { display: true, text: 'Emissions by Scope' }
        }
    };

    const unitPieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right' },
            title: { display: true, text: 'Emissions by Unit' }
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 fixed h-full">
                <h2 className="text-2xl font-bold text-center">Emissions Dashboard</h2>
                <nav>
                    <a href="#" className="block py-2.5 px-4 rounded hover:bg-gray-700">Dashboard</a>
                    <a href="#" className="block py-2.5 px-4 rounded hover:bg-gray-700">Data Upload</a>
                    <a href="#" className="block py-2.5 px-4 rounded hover:bg-gray-700">Reports</a>
                </nav>
            </div>

            <div className="flex-1 ml-64 p-8 overflow-auto">
                <div className="text-3xl font-bold mb-8">Dashboard Overview</div>

                <div className="mb-6 flex space-x-4">
                    <select
                        name="scope"
                        value={selectedScope}
                        onChange={handleFilterChange}
                        className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        <option value="All Scopes">All Scopes</option>
                        <option value="Scope1">Scope 1</option>
                        <option value="Scope2">Scope 2</option>
                        <option value="Scope3">Scope 3</option>
                    </select>

                    <select
                        name="businessUnit"
                        value={selectedBusinessUnit}
                        onChange={handleFilterChange}
                        className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        {businessUnits.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <p>{error}</p>
                    </div>
                )}

                {loading && (
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-2">Loading data...</p>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold mb-2">Total Emissions</h3>
                                <p className="text-2xl font-bold text-green-600">
                                    {dashboardData.total_emissions.toLocaleString()} kgCO₂e
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold mb-2">Scope 1 Emissions</h3>
                                <p className="text-2xl font-bold text-blue-600">
                                    {dashboardData.emissions_by_scope['Scope 1'].toLocaleString()} kgCO₂e
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold mb-2">Scope 2 Emissions</h3>
                                <p className="text-2xl font-bold text-purple-600">
                                    {dashboardData.emissions_by_scope['Scope 2'].toLocaleString()} kgCO₂e
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="h-96">
                                    <Bar data={barChartData} options={chartOptions} />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="h-96">
                                    <Pie data={scopePieChartData} options={pieChartOptions} />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="h-96">
                                    <Pie data={unitPieChartData} options={unitPieChartOptions} />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
