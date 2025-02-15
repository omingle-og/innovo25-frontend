// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Filters from './Filters';
import EmissionsSummary from './EmissionsSummary';
import Charts from './Charts';
import Loading from './Loading';
import Error from './Error';

const API_URL = 'http://192.168.135.3:5000/api'; // or your server URL

function Dashboard() {
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

export default Dashboard;