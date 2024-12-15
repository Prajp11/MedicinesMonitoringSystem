import React, { useState } from 'react';

const ItemForm = () => {
    const [newItem, setNewItem] = useState({
        name: '',
        batch_number: '',
        quality_status: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value });
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.error("No access token found");
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/items/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Include token in header
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('New item added:', data);
            // Optionally, update the state with the new item
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    return (
        <form onSubmit={handleAddItem}>
            <input
                type="text"
                name="name"
                placeholder="Medicine Name"
                value={newItem.name}
                onChange={handleInputChange}
                required
            />
            <input
                type="text"
                name="batch_number"
                placeholder="Batch Number"
                value={newItem.batch_number}
                onChange={handleInputChange}
                required
            />
            <input
                type="text"
                name="quality_status"
                placeholder="Quality Status"
                value={newItem.quality_status}
                onChange={handleInputChange}
                required
            />
            <button type="submit">Add Item</button>
        </form>
    );
};

export default ItemForm;