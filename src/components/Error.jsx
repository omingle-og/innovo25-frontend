// components/Error.jsx
import React from 'react';

export default function Error({ error }) {
    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
        </div>
    );
}
