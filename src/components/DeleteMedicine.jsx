import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchItems, deleteItem } from '../api'; // Ensure API functions are imported

const DeleteMedicine = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]); // List of medicines
  const [searchQuery, setSearchQuery] = useState(''); // Search input value
  const [filteredMedicines, setFilteredMedicines] = useState([]); // Search results
  const [message, setMessage] = useState(''); // Success/Error message

  // Fetch all medicines on component mount
  useEffect(() => {
    const loadMedicines = async () => {
      try {
        const data = await fetchItems(); // Fetch all items
        setMedicines(data);
        setFilteredMedicines(data); // Default search results to all medicines
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    };
    loadMedicines();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter medicines based on name, batch number, or accepted/rejected status
    const results = medicines.filter(
      (medicine) =>
        medicine.name.toLowerCase().includes(query) ||
        medicine.batch_number.toLowerCase().includes(query) ||
        medicine.accepted_or_rejected.toLowerCase().includes(query)
    );
    setFilteredMedicines(results);
  };

  // Handle delete medicine
  const handleDelete = async (id) => {
    try {
      await deleteItem(id); // API call to delete the item
      setMedicines(medicines.filter((medicine) => medicine.id !== id)); // Update state
      setFilteredMedicines(filteredMedicines.filter((medicine) => medicine.id !== id));
      setMessage('Medicine deleted successfully!');
      setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error('Error deleting medicine:', error);
      setMessage('Failed to delete medicine.');
    }
  };

  return (
    <div className="delete-medicine-container">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="back-to-dashboard-btn"
        style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '10px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
        }}
      >
        <span>←</span> Back to Dashboard
      </button>
      
      <h2>Delete Medicine</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name, batch number, or status"
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
      />

      {/* Success/Error Message */}
      {message && <p className="message">{message}</p>}

      {/* Medicine List */}
      <ul className="medicine-list">
        {filteredMedicines.length > 0 ? (
          filteredMedicines.map((medicine) => (
            <li key={medicine.id} className="medicine-item">
              <span>
                <strong>Name:</strong> {medicine.name} | <strong>Batch:</strong> {medicine.batch_number} |{' '}
                <strong>Status:</strong> {medicine.accepted_or_rejected}
              </span>
              <button
                onClick={() => handleDelete(medicine.id)}
                className="delete-button"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No medicines found matching your search.</p>
        )}
      </ul>
    </div>
  );
};

export default DeleteMedicine;