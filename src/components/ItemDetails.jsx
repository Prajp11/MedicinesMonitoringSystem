import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ItemDetails = () => {
    const [item, setItem] = useState(null);
    const { id } = useParams(); // Get the item ID from the URL

    useEffect(() => {
        const fetchItem = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.error("No access token found");
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/items/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,  // Include token in header
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setItem(data);
            } catch (error) {
                console.error('Error fetching item:', error);
            }
        };

        fetchItem();
    }, [id]);

    return (
        <div>
            <h1>Item Details</h1>
            {item ? (
                <div>
                    <p>Name: {item.name}</p>
                    <p>Batch Number: {item.batch_number}</p>
                    <p>Quality Status: {item.quality_status}</p>
                    {/* Display other item details here */}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ItemDetails;