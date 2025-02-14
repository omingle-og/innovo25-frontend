import React from 'react';
import PropTypes from 'prop-types';

const Loading = ({ message = 'Loading data...', size = 'medium' }) => {
    const sizeClasses = {
        small: 'h-6 w-6',
        medium: 'h-8 w-8',
        large: 'h-12 w-12'
    };

    return (
        <div className="text-center py-4" role="status" aria-live="polite">
            <div
                className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-blue-500 mx-auto`}
            />
            <p className="mt-2 text-gray-600">{message}</p>
        </div>
    );
};

Loading.propTypes = {
    message: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large'])
};

export default Loading;
