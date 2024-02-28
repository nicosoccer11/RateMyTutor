import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './Search.css';
import axios from 'axios';
import Profile from '../User/Profile';

function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const user2Username = localStorage.getItem('user');

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:5000/users/search?username=${query}&requester=${user2Username}`, {
            });
            setResults(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error getting users:', error);
        }
    };

    const handleAddUser = async (user1Username) => {
        try {
            const response = await axios.post(`http://localhost:5000/friends/add`, {
                user1Username,
                user2Username,
            });
            console.log(response.data);
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
            <div className="user-list-box">
                <ul className="user-list">
                    {results.map((user) => (
                        <li key={user.username} className="user-item">
                            <img
                                className="user-avatar"
                                src={`https://via.placeholder.com/50?text=${user.username}`}
                                alt={user.name}
                            />
                            <div className="user-info">
                                <h3>
                                    <Link className='name' to={`/profile/${user.username}`}>{user.username}</Link>
                                    {!user.isFriend && <button className="add-friend" onClick={() => handleAddUser(user.username)}>Add Friend</button>}
                                </h3>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <Routes>
                <Route path="/profile/:id" element={<Profile />} />
            </Routes>
        </div>
    );
}

export default Search;
