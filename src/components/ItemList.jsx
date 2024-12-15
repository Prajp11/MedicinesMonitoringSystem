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
            const token = localStorage.getItem('accessToken'); // Get token from localStorage
            if (!token) {
                console.error("No access token found");
                return;
            }

            const queryParam = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : '';

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/items/${queryParam}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,  // Include the token in the request header
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

    // Other logic for adding and removing items

    return (
        <div>
            <h1>Medicine Stock</h1>
            <input
                type="text"
                placeholder="Search medicine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <ul>
                {items.map((item) => (
                    <li key={item.id}>{item.name} - {item.batch_number} - {item.quality_status}</li>
                ))}
            </ul>
        </div>
    );
};

export default ItemList;