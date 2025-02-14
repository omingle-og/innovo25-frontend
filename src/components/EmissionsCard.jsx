import React from 'react';

export default function EmissionsCard({ title, value, color }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className={`text-2xl font-bold ${color}`}>
                {value.toLocaleString()} kgCO₂e
            </p>
        </div>
    );
}
