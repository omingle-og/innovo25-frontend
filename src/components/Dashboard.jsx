import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import Filters from './Filters';
import EmissionsSummary from './EmissionsSummary';
import Charts from './Charts';
import Loading from './Loading';
import Error from './Error';

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

const API_URL = 'http://192.168.135.3:5000/api';

export default function App() {
    const [dashboardData, setDashboardData] = useState({
        total_emissions: 0,
        emissions_by_scope: { 'Scope 1': 0, 'Scope 2': 0, 'Scope 3': 0 },
        emissions_by_business_unit: {},  // Now empty object, will be filled dynamically
        emissions_trend: []
    });
    const [selectedScope, setSelectedScope] = useState('All Scopes');
    const [selectedBusinessUnit, setSelectedBusinessUnit] = useState('All Units');
    const [businessUnits, setBusinessUnits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [advice, setAdvice] = useState(''); // State to store the advice
    const [loadingAdvice, setLoadingAdvice] = useState(false);
    const [showAdvice, setShowAdvice] = useState(false);


    // const fetchAdvice = async () => {
    //     try {
    //         const start = Date.now();
    //         console.log('Fetching advice...');
    //
    //         const response = await axios.post(`${API_URL}/advice`, dashboardData);
    //         console.log('API Response:', response.data);
    //
    //         console.log('Time taken:', Date.now() - start, 'ms');
    //
    //         setAdvice(response.data.advice); // Ensure it's accessing the correct property
    //     } catch (error) {
    //         console.error('Error fetching advice:', error);
    //         setAdvice('Failed to fetch advice.');
    //     }
    // };


    const fetchAdvice = async () => {
        setLoadingAdvice(true);
        setShowAdvice(true); // Automatically show the advice section when fetching starts
        try {
            const response = await axios.post(`${API_URL}/advice`, dashboardData);
            setAdvice(response.data.advice);
        } catch (error) {
            setAdvice('Failed to fetch advice.');
        } finally {
            setLoadingAdvice(false);
        }
    };



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
                emissions_by_business_unit: response.data.emissions_by_business_unit || {},
                business_unit_trend: response.data.business_unit_trend || {},
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

    const barChartData = {
        labels: dashboardData.emissions_trend.map(item => item.month),
        datasets: [{
            label: 'Emissions (kgCO₂e)',
            data: dashboardData.emissions_trend.map(item => item.emissions),
            backgroundColor: 'rgba(209, 90, 222, 1.0)',
            borderColor: 'rgba(209, 90, 222, 1.0)',
            // borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2
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

    // Dynamic colors for business unit chart
    const getColors = (count) => {
        const baseColors = [
            ['rgba(255, 99, 132, 0.8)', 'rgba(255, 99, 132, 1)'],
            ['rgba(54, 162, 235, 0.8)', 'rgba(54, 162, 235, 1)'],
            ['rgba(255, 206, 86, 0.8)', 'rgba(255, 206, 86, 1)'],
            ['rgba(75, 192, 192, 0.8)', 'rgba(75, 192, 192, 1)'],
            ['rgba(153, 102, 255, 0.8)', 'rgba(153, 102, 255, 1)'],
            ['rgba(255, 159, 64, 0.8)', 'rgba(255, 159, 64, 1)'],
            ['rgba(199, 199, 199, 0.8)', 'rgba(199, 199, 199, 1)'],
            ['rgba(83, 102, 255, 0.8)', 'rgba(83, 102, 255, 1)'],
        ];

        // Repeat colors if there are more units than colors
        const colors = [];
        for (let i = 0; i < count; i++) {
            colors.push(baseColors[i % baseColors.length]);
        }
        return colors;
    };

    const unitPieChartData = {
        labels: Object.keys(dashboardData.emissions_by_business_unit),
        datasets: [{
            data: Object.values(dashboardData.emissions_by_business_unit),
            backgroundColor: getColors(Object.keys(dashboardData.emissions_by_business_unit).length).map(c => c[0]),
            borderColor: getColors(Object.keys(dashboardData.emissions_by_business_unit).length).map(c => c[1]),
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
            title: { display: true, text: 'Emissions by Business Unit' }
        }
    };

    return (
        <>
            <div className="text-3xl font-bold mb-8">Dashboard Overview</div>

            <Filters
                selectedScope={selectedScope}
                selectedBusinessUnit={selectedBusinessUnit}
                businessUnits={businessUnits}
                handleFilterChange={handleFilterChange}
                loading={loading}
            />

            {error && <Error error={error} />}

            {loading && <Loading />}

            {!loading && !error && (
                <>
                    <EmissionsSummary dashboardData={dashboardData} />

                    <button
                        onClick={fetchAdvice}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4"
                    >
                        {loadingAdvice ? 'Fetching...' : 'Get Carbon Reduction Advice'}
                    </button>

                    {showAdvice && (
                        <div className="mt-4 p-4 bg-gray-100 rounded shadow relative">
                            <button
                                onClick={() => setShowAdvice(false)}
                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                            >
                                ✖ Hide
                            </button>

                            <h3 className="text-lg font-semibold mb-2">Carbon Reduction Advice:</h3>

                            {loadingAdvice ? (
                                <div className="text-gray-600">Loading advice...</div>
                            ) : (
                                <ReactMarkdown>{advice}</ReactMarkdown>
                            )}
                        </div>
                    )}

                    <Charts
                        barChartData={barChartData}
                        scopePieChartData={scopePieChartData}
                        unitPieChartData={unitPieChartData}
                        chartOptions={chartOptions}
                        pieChartOptions={pieChartOptions}
                        unitPieChartOptions={unitPieChartOptions}
                    />
                </>
            )}
        </>
    );
}
