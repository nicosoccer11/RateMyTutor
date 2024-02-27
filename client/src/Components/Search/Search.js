import React, { useState } from 'react';
import './Search.css';
import axios from 'axios';

function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        try {
            await axios.post('http://localhost:5000/reviews', {
                query,
            });
            setResults(response.data);
        } catch (error) {
            console.error('Error getting users:', error);
        }
    };

    return (
        <div className="search-container">
            <form className="search-form" onSubmit={handleSearch}>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className="search-button">Search</button>
            </form>
            {/* <div className="user-list-box">
                <ul className="user-list">
                    {results.map((user) => (
                        <li key={user.id} className="user-item">
                            <img
                                className="user-avatar"
                                src={`https://via.placeholder.com/50?text=${friend.name}`}
                                alt={user.name}
                            />
                            <div className="friend-info">
                                <h3>
                                    <Link className='name' to={`/profile/${friend.id}`}>{friend.name}</Link>
                                    <button className="message" onClick={() => handleSendMessage(friend.id)}>Message</button>
                                </h3>
                            </div>
                        </li>
                    ))}
                </ul>
            </div> */}
        </div>
    );
}

export default Search;
