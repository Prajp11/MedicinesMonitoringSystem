import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SearchResult = () => {
    const [results, setResults] = useState([]);
    const location = useLocation();

    const query = new URLSearchParams(location.search).get('query'); // Extract search query

    useEffect(() => {
        fetchSearchResults();
    }, [query]);

    const fetchSearchResults = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.error("No access token found");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/items/?search=${encodeURIComponent(query)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch search results');
            }
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    return (
        <div className="search-results-container">
            <h1>Search Results</h1>
            <ul className="search-results-list">
                {results.map((result) => (
                    <li key={result.id}>
                        <p>{result.name} - Batch: {result.batch_number} - Status: {result.quality_status}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchResult;