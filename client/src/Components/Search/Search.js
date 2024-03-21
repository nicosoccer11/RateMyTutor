import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import './Search.css';
import axios from 'axios';
import Profile from '../User/Profile';
import Chat from '../Messages/Chat';

function Search() {
    const navigate = useNavigate();
    const searchLocation = useLocation();
    const queryParams = new URLSearchParams(searchLocation.search);
    const [query, setQuery] = useState('');
    const [data, setData] = useState(queryParams.get('q'));
    const [results, setResults] = useState([]);
    const user2Username = localStorage.getItem('user');
    const [searchMessage, setSearchMessage] = useState('');
    const [searchType, setSearchType] = useState('users');

    useEffect(() => {
        if (data) {
            handleSearch(null, data);
        }
        else if (localStorage.getItem('searchQuery')) {
            handleSearch(null, localStorage.getItem('searchQuery'));
            setData(localStorage.getItem('searchQuery'));
        }

    }, []);

    const handleSearch = async (e, input) => {
        if (e != null) {
            e.preventDefault();
        }
        const searchData = input || query;
        try {
            const response = await axios.get(`http://localhost:5000/users/search?username=${searchData}&requester=${user2Username}`, {
            });
            setResults(response.data);
            setSearchMessage(response.data.length === 0 ? 'No results found, try another search.' : '');
            localStorage.setItem('searchQuery', searchData);
            navigate(`?q=${searchData}`);
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
            setResults([]);
            setSearchMessage('');
            handleSearch(null);
        } catch (error) {
            console.error('Error getting users:', error);
        }
    };

    const handleSendMessage = (friendId) => {
        console.log(`Sending message to ${friendId}`);
    };

    const handleTabChange = (type) => {
        setSearchType(type);
        // Perform search when tab changes
        handleSearch(null, query);
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
            {searchMessage && <p className="search-message">{searchMessage}</p>}
            <div className="search-tabs">
                <button className={`search-tab ${searchType === 'users' ? 'active' : ''}`} onClick={() => handleTabChange('users')}>Users</button>
                <button className={`search-tab ${searchType === 'posts' ? 'active' : ''}`} onClick={() => handleTabChange('posts')}>Posts</button>
            </div>
            {searchType === 'users' && (<div className="user-list-box">
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
                                    {user.isFriend ?
                                        <button className="add-friend" onClick={() => handleSendMessage(user.username)}><Link to={`/messages/${user.username}`}>Message</Link></button> :
                                        <button className="add-friend" onClick={() => handleAddUser(user.username)}>Add Friend</button>
                                    }
                                </h3>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>)}
            {searchType === 'posts' && (
                <ul className="post-list">
                    {results.map((post) => (
                        <li key={post.id} className="post-item">
                            {/* Render post information */}
                        </li>
                    ))}
                </ul>
            )}
            <Routes>
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/messages/:id" element={<Chat />} />
            </Routes>
        </div>
    );
}

export default Search;
