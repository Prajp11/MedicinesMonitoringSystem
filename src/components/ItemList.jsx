import React, { useEffect, useState } from 'react';

const ItemList = () => {
    const [items, setItems] = useState([]); // Store items fetched from the backend
    const [searchQuery, setSearchQuery] = useState(''); // Store the search query
    const [newItem, setNewItem] = useState({ name: '', batch_number: '', quality_status: '' }); // For new item

    // Fetch items from the backend
    useEffect(() => {
        const fetchItems = async () => {
            const token = localStorage.getItem('accessToken'); // JWT token from localStorage
            if (!token) {
                console.error("No access token found");
                return;
            }

            const queryParam = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''; // Query for searching

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/items/${queryParam}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Authorization header
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch items');
                }

                const data = await response.json();
                setItems(data); // Update the items state
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
    }, [searchQuery]); // Refetch when searchQuery changes

    // Handle input changes for the new item form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value });
    };

    // Add a new item
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
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });

            if (!response.ok) {
                throw new Error('Failed to add item');
            }

            const data = await response.json();
            setItems([...items, data]); // Append the new item to the list
            setNewItem({ name: '', batch_number: '', quality_status: '' }); // Reset form
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    // Remove an item
    const handleRemoveItem = async (id) => {
        const token = localStorage.getItem('accessToken');
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
                throw new Error('Failed to remove item');
            }

            setItems(items.filter(item => item.id !== id)); // Remove the item locally
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    return (
        <div className="itemlist-container">
            <h1 className="itemlist-title">Medicine Stock Management</h1>

            {/* Search bar */}
            <input
                type="text"
                placeholder="Search medicines by name, batch, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update the search query
                className="itemlist-searchBar"
            />

            {/* Add new item form */}
            <form onSubmit={handleAddItem} className="itemlist-form">
                <h2>Add New Medicine</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Medicine Name"
                    value={newItem.name}
                    onChange={handleInputChange}
                    className="itemlist-formInput"
                    required
                />
                <input
                    type="text"
                    name="batch_number"
                    placeholder="Batch Number"
                    value={newItem.batch_number}
                    onChange={handleInputChange}
                    className="itemlist-formInput"
                    required
                />
                <input
                    type="text"
                    name="quality_status"
                    placeholder="Quality Status"
                    value={newItem.quality_status}
                    onChange={handleInputChange}
                    className="itemlist-formInput"
                    required
                />
                <button type="submit" className="itemlist-submitButton">Add Medicine</button>
            </form>

            {/* List of items */}
            <ul className="itemlist-itemList">
                {items.map(item => (
                    <li key={item.id} className="itemlist-item">
                        <p className="itemlist-itemText">
                            <strong>Name:</strong> {item.name}<br />
                            <strong>Batch:</strong> {item.batch_number}<br />
                            <strong>Status:</strong> {item.quality_status}
                        </p>
                        <button onClick={() => handleRemoveItem(item.id)} className="itemlist-removeButton">Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ItemList;