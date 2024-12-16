import React, { useState, useEffect } from 'react';

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchItems();
    }, [searchQuery]); // Trigger fetch when searchQuery changes

    const fetchItems = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.error("No access token found");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/items/?search=${searchQuery}`, {
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

    return (
        <div className="itemlist-container">
            <h1>Medicine Stock</h1>

            <form onSubmit={(e) => e.preventDefault()} className="itemlist-form">
                <input
                    type="text"
                    placeholder="Search medicine by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="itemlist-searchBar"
                />
            </form>

            <ul className="itemlist">
                {items.map((item) => (
                    <li key={item.id}>
                        <p>{item.name} - Batch: {item.batch_number} - Status: {item.quality_status}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ItemList;
