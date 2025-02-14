import React from 'react';

export default function EmissionsSummary({ dashboardData }) {
    return (
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
    );
}
