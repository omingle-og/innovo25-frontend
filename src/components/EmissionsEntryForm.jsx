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
              className={`px-4 py-2 rounded-md ${
                entryMethod === 'manual' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setEntryMethod('manual')}
            >
              Manual Entry
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                entryMethod === 'csv' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setEntryMethod('csv')}
            >
              CSV Upload
            </button>
          </div>
        </div>

        {entryMethod === 'manual' ? (
          <form onSubmit={handleManualSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activity Type
                  </label>
                  <select
                    name="activity_type"
                    value={formData.activity_type}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select activity type</option>
                    <option value="electricity">Electricity</option>
                    <option value="transport">Transport</option>
                    <option value="heating">Heating</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Unit
                  </label>
                  <select
                    name="business_unit"
                    value={formData.business_unit}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select business unit</option>
                    <option value="unit1">Unit 1</option>
                    <option value="unit2">Unit 2</option>
                    <option value="unit3">Unit 3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <Calendar className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Emissions Details */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Emissions Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scope
                  </label>
                  <div className="space-y-2">
                    {['Scope 1', 'Scope 2', 'Scope 3'].map((scope) => (
                      <label key={scope} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="scope"
                          value={scope}
                          checked={formData.scope === scope}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-500"
                        />
                        <span>{scope}</span>
                      </label>
                    ))}
                  </div>
                </div> */}

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fuel Type
                    </label>
                    <select
                      name="fuel_type"
                      value={formData.fuel_type}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select fuel type</option>
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="gas">Natural Gas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select unit</option>
                      <option value="liters">Liters</option>
                      <option value="kg">Kilograms</option>
                      <option value="kwh">kWh</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter source details"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reference ID (Optional)
                  </label>
                  <input
                    type="text"
                    name="reference_id"
                    value={formData.reference_id}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter reference ID"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter any additional information"
                  />
                </div>
              </div>
            </div>

            {/* Calculated Emissions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Calculated Emissions</h2>
                  <p className="text-sm text-gray-500">GHG Protocol (2025)</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">
                    {calculatedEmissions.toFixed(2)} kgCO₂e
                  </p>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                onClick={() => setFormData({})}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Save Draft
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </form>
        ) : (
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
        )}

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