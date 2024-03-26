import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SearchBar.css';

function SearchBar() {
    const [query, setQuery] = useState('');

    return (
        <div className="search-container">
            <form className="search-bar-form">
                <input
                    type="text"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="search-input"
                />
                <Link to={`/search?q=${query}`} className="search-link">
                    <button type="submit" className="search-button">
                        Search
                    </button>
                </Link>
            </form>
        </div>

    );
}

export default SearchBar;
