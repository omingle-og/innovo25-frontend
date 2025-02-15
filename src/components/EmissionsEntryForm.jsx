import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://192.168.135.3:5000/api';

const EmissionsEntryForm = () => {
    const [entryMethod, setEntryMethod] = useState('manual');
    const [formData, setFormData] = useState({
        activity_type: '',
        business_unit: '',
        date: new Date().toISOString().split('T')[0],
        scope: 'Scope 1',
        fuel_type: '',
        quantity: '',
        unit: '',
        source: '',
        reference_id: '',
        notes: ''
    });
    const [calculatedEmissions, setCalculatedEmissions] = useState(0);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null); // State for tracking the selected file

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/upload/csv`, formData);
            console.log('Emission data submitted:', response.data);
            setFormData({
                activity_type: '',
                business_unit: '',
                date: new Date().toISOString().split('T')[0],
                scope: 'Scope 1',
                fuel_type: '',
                quantity: '',
                unit: '',
                source: '',
                reference_id: '',
                notes: ''
            });
        } catch (error) {
            console.error('Failed to submit emission data:', error);
            alert('Error submitting data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCSVSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${API_URL}/upload/csv`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('CSV upload response:', response.data);
            alert('CSV file uploaded successfully!');
            setFile(null); // Reset file state after upload
        } catch (error) {
            console.error('Failed to upload CSV:', error);
            alert('Error uploading CSV. Please check the file and try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle file selection for both drag and drop and click
    const handleFileSelect = (files) => {
        if (files && files.length > 0) {
            setFile(files[0]);
        }
    };

    // Drag and drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('highlight');
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('highlight');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('highlight');
        handleFileSelect(e.dataTransfer.files);
    };

    return (
        <div className="flex-1 ml-64 p-8 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Emissions Data Entry</h1>

                {/* Entry Method Toggle */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="flex space-x-4">
                        <button
                            className={`px-4 py-2 rounded-md ${entryMethod === 'csv'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                                }`}
                            onClick={() => setEntryMethod('csv')}
                        >
                            CSV Upload
                        </button>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <form onSubmit={handleCSVSubmit}>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center drop-area"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}>
                            <div className="mx-auto h-12 w-12 text-gray-400">
                                <svg
                                    className="h-12 w-12"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M24 38c8.837 0 16-3.582 16-8V14"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M24 6c8.837 0 16 3.582 16 8s-7.163 8-16 8S8 17.418 8 14s7.163-8 16-8z"
                                    />
                                </svg>
                            </div>
                            <div className="mt-4">
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <span>Upload CSV file</span>
                                    <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                        accept=".csv"
                                        onChange={(e) => handleFileSelect(e.target.files)}
                                    />
                                </label>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                                Drag and drop or click to upload your CSV file
                            </p>
                            {file && <p className="text-green-500">{file.name} selected</p>}
                            <button
                                type="submit"
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                disabled={loading || !file}
                            >
                                {loading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Uploading...</span>
                                    </div>
                                ) : (
                                    'Upload'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <style>
                    {`
                    .drop-area {
                    border: 2px dashed #ccc;
                    border-radius: 20px;
                    width: 480px;
                    font-family: sans-serif;
                    margin: 100px auto;
                    padding: 20px;
                    }
                    .drop-area.highlight {
                    border-color: purple;
                    }
                `}
                </style>
            </div>
        </div>
    );
};

export default EmissionsEntryForm;
