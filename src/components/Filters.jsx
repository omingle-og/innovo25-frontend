import React from 'react';

export default function Filters({
    selectedScope,
    selectedBusinessUnit,
    businessUnits,
    handleFilterChange,
    loading
}) {
    return (
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
    );
}
