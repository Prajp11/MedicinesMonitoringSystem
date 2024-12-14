import React, { useEffect, useState } from 'react';

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [newItem, setNewItem] = useState({
        name: '',
        batch_number: '',
        quality_status: ''
    });

    useEffect(() => {
        const fetchItems = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.error("No access token found");
                return;
            }

            const queryParam = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : '';

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/items/${queryParam}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
    }, [searchQuery]);

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
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setItems([...items, data]);
            setNewItem({ name: '', batch_number: '', quality_status: '' });
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

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
                throw new Error('Network response was not ok');
            }

            setItems(items.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    return (
        <div className="itemlist-container">
            <h1 className="itemlist-title">Medicine Stock</h1>

            {/* Search bar */}
            <input
                type="text"
                placeholder="Search medicine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="itemlist-searchBar"
            />

            {/* Add new item form */}
            <form onSubmit={handleAddItem} className="itemlist-form">
                <h2>Add New Item</h2>
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
                <button type="submit" className="itemlist-submitButton">Add Item</button>
            </form>

            {/* Item list */}
            <ul className="itemlist-itemList">
                {items.map(item => (
                    <li key={item.id} className="itemlist-item">
                        <p className="itemlist-itemText">{item.name} - Batch: {item.batch_number} - Status: {item.quality_status}</p>
                        <button onClick={() => handleRemoveItem(item.id)} className="itemlist-removeButton">Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ItemList;
