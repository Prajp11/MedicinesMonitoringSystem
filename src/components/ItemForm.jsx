import React, { useState, useEffect } from 'react';

const ItemForm = () => {
    const [newItem, setNewItem] = useState({
        name: '',
        batch_number: '',
        quality_status: ''
    });

    const [items, setItems] = useState([]);  // To store and display items

    // Fetch items when the component mounts
    useEffect(() => {
        const fetchItems = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.error("No access token found");
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:8000/api/items/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setItems(data);  // Update the state with fetched items
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();  // Fetch items on component mount
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value });
    };

    // Add Item
    const handleAddItem = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');  // Get token from localStorage
    
        if (!token) {
            console.error("No access token found");
            return;
        }
    
        try {
            const response = await fetch('http://127.0.0.1:8000/api/items/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            setItems([...items, data]);  // Add the new item to the list
            setNewItem({ name: '', batch_number: '', quality_status: '' });  // Reset form fields
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    // Delete Item
    const handleRemoveItem = async (id) => {
        const token = localStorage.getItem('accessToken');  // Get token from localStorage

        if (!token) {
            console.error("No access token found");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/items/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Remove the deleted item from the list
            setItems(items.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    return (
        <div>
            <h2>Manage Medicine Items</h2>
            
            {/* Add Item Form */}
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
            
            {/* Display Items */}
            <ul>
                {items.map(item => (
                    <li key={item.id}>
                        <p>{item.name} - Batch: {item.batch_number} - Status: {item.quality_status}</p>
                        <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ItemForm;