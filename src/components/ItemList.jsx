import React, { useState, useEffect } from 'react';
import VoiceInput from './VoiceInput';
import { parseVoiceCommand, formatParsedData } from '../utils/voiceParser';
// Enhanced styles are now in App.css - Premium UI design with modern aesthetics

const ItemList = () => {
  const [items, setItems] = useState([]); // List of medicines
  const [newItem, setNewItem] = useState({
    name: '',
    batch_number: '',
    accepted_or_rejected: '',
  });
  const [message, setMessage] = useState(''); // Success or error message
  const [isLoading, setIsLoading] = useState(false); // Loading state for better UX
  const [showFullList, setShowFullList] = useState(false); // State to toggle full list visibility

  // Fetch existing items from API
  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No access token found. Please log in.');
        setMessage('Please log in to view medicines.');
        return;
      }

      try {
        const endpoint = 'http://localhost:8000/api/items/';
        const response = await fetch(endpoint, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          // Token is invalid or expired, try to refresh
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const refreshResponse = await fetch('http://localhost:8000/api/auth/refresh/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: refreshToken }),
              });

              if (refreshResponse.ok) {
                const { access } = await refreshResponse.json();
                localStorage.setItem('accessToken', access);
                
                // Retry fetching items with new token
                const retryResponse = await fetch(endpoint, {
                  headers: { 
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json',
                  },
                });

                if (retryResponse.ok) {
                  const data = await retryResponse.json();
                  setItems(data);
                  console.log(`Successfully fetched ${data.length} medicines`);
                  return;
                }
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
            }
          }
          
          // If refresh failed, clear tokens and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setMessage('Session expired. Please log in again.');
          setTimeout(() => window.location.href = '/login', 2000);
          return;
        }

        if (!response.ok) {
          // Get error details from response
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            console.error('Backend error details:', errorData);
            errorMessage = errorData.detail || errorData.message || errorMessage;
          } catch (e) {
            // If response is not JSON, use status text
            errorMessage = `${response.status} ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setItems(data);
        console.log(`Successfully fetched ${data.length} medicines from backend`);

      } catch (error) {
        console.error('Error fetching items:', error);
        
        // More user-friendly error messages
        let userMessage = 'Error fetching medicines. ';
        if (error.message.includes('500')) {
          userMessage += 'Backend server error. Please check your Django backend logs for details.';
        } else if (error.message.includes('Failed to fetch')) {
          userMessage += 'Cannot connect to backend. Make sure your Django server is running on port 8000.';
        } else {
          userMessage += error.message;
        }
        
        setMessage(userMessage);
        setTimeout(() => setMessage(''), 10000);
      }
    };

    fetchItems();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  // Handle voice input
  const handleVoiceInput = (transcript) => {
    const parsedData = parseVoiceCommand(transcript);
    
    // Map parsed data to form fields
    const updatedItem = { ...newItem };
    
    if (parsedData.medicine_name) {
      updatedItem.name = parsedData.medicine_name;
    }
    if (parsedData.batch_number) {
      updatedItem.batch_number = parsedData.batch_number;
    }
    if (parsedData.quality_status) {
      updatedItem.accepted_or_rejected = parsedData.quality_status;
    }
    
    setNewItem(updatedItem);
    
    // Show feedback message
    const summary = formatParsedData(parsedData);
    if (summary !== 'No data recognized') {
      setMessage(`Voice input captured: ${summary}`);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  // Handle form submission
  const handleAddItem = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setMessage('No access token found. Please log in.');
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = 'http://localhost:8000/api/items/';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      });

      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const refreshResponse = await fetch('http://localhost:8000/api/auth/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
          });

          if (refreshResponse.ok) {
            const { access } = await refreshResponse.json();
            localStorage.setItem('accessToken', access);
            
            // Retry adding item with new token
            const retryResponse = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`,
              },
              body: JSON.stringify(newItem),
            });

            if (retryResponse.ok) {
              const addedItem = await retryResponse.json();
              setItems(prevItems => [addedItem, ...prevItems]);
              setNewItem({ name: '', batch_number: '', accepted_or_rejected: '' });
              setMessage('Medicine added successfully!');
              setTimeout(() => setMessage(''), 3000);
              setIsLoading(false);
              return;
            }
          }
        }
        
        // If refresh failed
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setMessage('Session expired. Please log in again.');
        setTimeout(() => window.location.href = '/login', 2000);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const addedItem = await response.json();
      setItems(prevItems => [addedItem, ...prevItems]);
      setNewItem({ name: '', batch_number: '', accepted_or_rejected: '' });
      setMessage('Medicine added successfully!');
      console.log('Successfully added medicine');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error adding medicine:', error);
      setMessage(`Error adding medicine: ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate summary statistics
  const acceptedMedicines = items.filter(item => item.accepted_or_rejected.toLowerCase() === 'accepted');
  const rejectedMedicines = items.filter(item => item.accepted_or_rejected.toLowerCase() === 'rejected');

  // Function to clear localStorage (for demo purposes only)
  const clearLocalStorage = () => {
    if (window.confirm('Clear local storage? This will only affect demo data, not your database.')) {
      localStorage.removeItem('medicineItems');
      setMessage('Local storage cleared. Reload to fetch from database.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="medicine-container">
      {/* Enhanced header with gradient background */}
      <div className="medicine-header">
        <h1 className="medicine-title">
          <span className="title-icon">💊</span>
          Medicine Inventory Management
        </h1>
        <p className="medicine-subtitle">Add and manage your pharmaceutical inventory</p>
      </div>

      {/* Enhanced form with card layout */}
      <div className="form-card">
        <div className="form-header">
          <h2 className="form-title">Add New Medicine</h2>
          <p className="form-description">Enter medicine details to add to inventory</p>
        </div>
        
        {/* Voice Input Component */}
        <VoiceInput 
          onVoiceData={handleVoiceInput}
          placeholder="Click to add medicine by voice"
          showTranscript={true}
        />
        
        <form className="enhanced-form" onSubmit={handleAddItem}>
          <div className="form-grid">
            <div className="input-wrapper">
              <label className="input-label">
                <span className="label-icon">🏷️</span>
                Medicine Name
              </label>
              <input
                type="text"
                name="name"
                value={newItem.name}
                onChange={handleInputChange}
                className="enhanced-input"
                placeholder="Enter medicine name"
                required
              />
            </div>

            <div className="input-wrapper">
              <label className="input-label">
                <span className="label-icon">📦</span>
                Batch Number
              </label>
              <input
                type="text"
                name="batch_number"
                value={newItem.batch_number}
                onChange={handleInputChange}
                className="enhanced-input"
                placeholder="Enter batch number"
                required
              />
            </div>

            <div className="input-wrapper">
              <label className="input-label">
                <span className="label-icon">✅</span>
                Quality Status
              </label>
              <select
                name="accepted_or_rejected"
                value={newItem.accepted_or_rejected}
                onChange={handleInputChange}
                className="enhanced-select"
                required
              >
                <option value="">Select status</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className={`submit-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Adding Medicine...
              </>
            ) : (
              <>
                <span className="button-icon">➕</span>
                Add Medicine
              </>
            )}
          </button>
        </form>

        {/* Enhanced message display */}
        {message && (
          <div className={`message-banner ${message.includes('Error') ? 'error' : 'success'}`}>
            <span className="message-icon">
              {message.includes('Error') ? '❌' : '✅'}
            </span>
            {message}
          </div>
        )}
      </div>

      {/* Summary Cards Section */}
      <div className="summary-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="section-icon">📊</span>
            Inventory Overview
          </h2>
          <p className="section-subtitle">Quick summary of your medicine inventory status</p>
        </div>

        <div className="summary-cards-grid">
          {/* Accepted Medicines Summary Card */}
          <div className="summary-card accepted-card">
            <div className="card-icon-wrapper accepted-icon">
              <span className="card-icon">✅</span>
            </div>
            <div className="card-content">
              <h3 className="card-title">Accepted Medicines</h3>
              <div className="card-number">{acceptedMedicines.length}</div>
              <p className="card-description">
                Medicines that passed quality control and are ready for distribution
              </p>
              <div className="card-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Items</span>
                  <span className="stat-value">{acceptedMedicines.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Percentage</span>
                  <span className="stat-value">
                    {items.length > 0 ? Math.round((acceptedMedicines.length / items.length) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
            <div className="card-pattern accepted-pattern"></div>
          </div>

          {/* Rejected Medicines Summary Card */}
          <div className="summary-card rejected-card">
            <div className="card-icon-wrapper rejected-icon">
              <span className="card-icon">❌</span>
            </div>
            <div className="card-content">
              <h3 className="card-title">Rejected Medicines</h3>
              <div className="card-number">{rejectedMedicines.length}</div>
              <p className="card-description">
                Medicines that failed quality control and require attention
              </p>
              <div className="card-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Items</span>
                  <span className="stat-value">{rejectedMedicines.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Percentage</span>
                  <span className="stat-value">
                    {items.length > 0 ? Math.round((rejectedMedicines.length / items.length) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
            <div className="card-pattern rejected-pattern"></div>
          </div>
        </div>

        {/* View All Button */}
        <div className="view-all-section">
          <button 
            className="view-all-button"
            onClick={() => setShowFullList(!showFullList)}
          >
            <span className="button-icon">
              {showFullList ? '👁️‍🗨️' : '📋'}
            </span>
            {showFullList ? 'Hide Detailed List' : 'View All Medicines'}
            <span className="button-arrow">
              {showFullList ? '↑' : '↓'}
            </span>
          </button>
          
          {items.length > 0 && (
            <button 
              className="clear-all-button"
              onClick={clearLocalStorage}
            >
              <span className="button-icon">🗑️</span>
              Clear Demo Data
            </button>
          )}
        </div>
      </div>

      {/* Detailed Medicine List - Only shown when showFullList is true */}
      {showFullList && (
        <div className="medicines-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">📋</span>
              Detailed Medicine Inventory ({items.length} items)
            </h2>
          </div>

          {items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No medicines in inventory</h3>
              <p>Add your first medicine using the form above</p>
            </div>
          ) : (
            <div className="medicine-grid">
              {items.map((item) => (
                <div key={item.id} className="medicine-card">
                  <div className="card-header">
                    <h3 className="medicine-name">{item.name}</h3>
                    <span className={`status-badge ${
                      item.accepted_or_rejected.toLowerCase() === 'accepted' 
                        ? 'accepted' 
                        : 'rejected'
                    }`}>
                      {item.accepted_or_rejected}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="batch-info">
                      <span className="batch-label">Batch Number:</span>
                      <span className="batch-number">{item.batch_number}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemList;
