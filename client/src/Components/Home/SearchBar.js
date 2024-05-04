// Import necessary modules from React and React Router
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Import styles for the SearchBar component
import './SearchBar.css';

// Define the SearchBar functional component
function SearchBar() {
    // Define state for the search query
    const [query, setQuery] = useState('');

    // Render the SearchBar component
    return (
        <div className="search-container">
            {/* Search form */}
            <form className="search-bar-form">
                {/* Input field for entering search query */}
                <input
                    type="text"
                    placeholder="Enter one or multiple search terms (e.g., Python, Houston, Calculus)..."
                    value={query}
                    // Update query state on input change
                    onChange={(e) => setQuery(e.target.value)}
                    className="search-input"
                />
                {/* Link to the search results page with the search query as URL parameter */}
                <Link to={`/search?q=${query}`} className="search-link">
                    {/* Search button */}
                    <button type="submit" className="search-button">
                        Search
                    </button>
                </Link>
            </form>
        </div>
    );
}

// Export the SearchBar component
export default SearchBar;
