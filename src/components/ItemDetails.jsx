import React, { useState, useEffect } from 'react';

const ItemDetails = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch items from the backend when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setItems([]);  // Clear results if search is empty
      return;
    }

    const fetchItems = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error("No access token found");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:8000/api/items/?search=${encodeURIComponent(searchQuery)}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }

        const data = await response.json();
        setItems(data);  // Set the fetched items
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [searchQuery]);

  return (
    <div className="item-details-container">
      <h1>Medicine Stock - Search Results</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search for medicine..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}  // Update search query on input change
        className="search-bar"
      />

      {loading && <p>Loading...</p>}

      {/* Display search results */}
      {items.length > 0 ? (
        <ul className="item-list">
          {items.map((item) => (
            <li key={item.id} className="item-list-item">
              <p><strong>Name:</strong> {item.name}</p>
              <p><strong>Batch Number:</strong> {item.batch_number}</p>
              <p><strong>Status:</strong> {item.quality_status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No medicines found.</p>
      )}
    </div>
  );
};

export default ItemDetails;