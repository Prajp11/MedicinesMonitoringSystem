import React, { useState } from 'react';
import { addItem } from '../api';

const ItemForm = ({ onMedicineAdded }) => {
  const [newItem, setNewItem] = useState({
    name: '',
    batch_number: '',
    quality_status: '',
  });
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const addedItem = await addItem(newItem);
      onMedicineAdded(addedItem);
      setMessage('Item added successfully!');
      setNewItem({ name: '', batch_number: '', quality_status: '' });
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleAddItem}>
      <div>
        <label>Medicine Name:</label>
        <input
          type="text"
          name="name"
          value={newItem.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Batch Number:</label>
        <input
          type="text"
          name="batch_number"
          value={newItem.batch_number}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Quality Status:</label>
        <input
          type="text"
          name="quality_status"
          value={newItem.quality_status}
          onChange={handleInputChange}
          required
        />
      </div>
      <button type="submit">Add Item</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ItemForm;