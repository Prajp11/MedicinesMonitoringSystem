import React, { useState } from 'react';
import { addItem } from '../api';  // Importing the addItem function for API calls
import { ToastContainer, toast } from 'react-toastify';  // Importing ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css';  // Importing CSS for react-toastify

const ItemForm = ({ onMedicineAdded }) => {
  const [newItem, setNewItem] = useState({
    name: '',
    batch_number: '',
    quality_status: '',
  });

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state for better UX

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  // Handle form submission to add new item
  const handleAddItem = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const addedItem = await addItem(newItem);  // Add item using API call
      onMedicineAdded(addedItem);  // Notify the parent component to update the list
      setNewItem({ name: '', batch_number: '', quality_status: '' });  // Reset form fields
      setMessage('Medicine added successfully!');

      // Show success notification
      toast.success('Medicine added successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const errorMessage = `Error: ${error.message}`;
      setMessage(errorMessage);  // Show error message in the form

      // Show error notification
      toast.error('Failed to add medicine. Please try again!');
      
      // Clear error message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="item-form-container">
      {/* Enhanced header */}
      <div className="form-header">
        <h2 className="form-title">
          <span className="title-icon">💊</span>
          Add Medicine to Inventory
        </h2>
        <p className="form-description">Enter medicine details to add to your pharmaceutical inventory</p>
      </div>

      {/* Enhanced form with premium styling */}
      <form onSubmit={handleAddItem}>
        <div>
          <label>
            <span className="label-icon">🏷️</span>
            Medicine Name
          </label>
          <input
            type="text"
            name="name"
            value={newItem.name}
            onChange={handleInputChange}
            placeholder="Enter medicine name"
            required
          />
        </div>

        <div>
          <label>
            <span className="label-icon">📦</span>
            Batch Number
          </label>
          <input
            type="text"
            name="batch_number"
            value={newItem.batch_number}
            onChange={handleInputChange}
            placeholder="Enter batch number"
            required
          />
        </div>

        <div>
          <label>
            <span className="label-icon">✅</span>
            Quality Status
          </label>
          <select
            name="quality_status"
            value={newItem.quality_status}
            onChange={handleInputChange}
            required
          >
            <option value="">Select quality status</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className={isLoading ? 'loading' : ''}
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

      {/* Toast notifications container */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default ItemForm;