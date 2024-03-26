import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import './Search.css';
import axios from 'axios';
import Profile from '../User/Profile';
import Chat from '../Messages/Chat';
import Post from '../Home/Post';

function Search() {
    const navigate = useNavigate();
    const searchLocation = useLocation();
    const queryParams = new URLSearchParams(searchLocation.search);
    const [query, setQuery] = useState('');
    const [data, setData] = useState(queryParams.get('q'));
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const user2Username = localStorage.getItem('user');
    const [postsMessage, setPostsMessage] = useState('');
    const [usersMessage, setUsersMessage] = useState('');
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
        console.log(searchData, user2Username);
        try {
            const response = await axios.get(`http://localhost:5000/users/search`, {
                params: {
                    term: searchData,
                    requesterUsername: user2Username,
                },
            });
            setUsers(response.data.usernames);
            setPosts(response.data.posts);
            setPostsMessage(response.data.posts.length === 0 ? 'No results found, try looking at users or another search.' : '');
            setUsersMessage(response.data.usernames.length === 0 ? 'No results found, try looking at posts or another search.' : '');
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
    };

    return (
        <div className="search-container">
            <form className="search-form" onSubmit={handleSearch}>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Enter one or multiple search terms (e.g., Python, Houston, Calculus)..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className="search-button">Search</button>
            </form>
            <div className="search-tabs">
                <button className={`search-tab ${searchType === 'users' ? 'active' : ''}`} onClick={() => handleTabChange('users')}>Users</button>
                <button className={`search-tab ${searchType === 'posts' ? 'active' : ''}`} onClick={() => handleTabChange('posts')}>Posts</button>
            </div>
            {searchType === 'users' && (
                <div>
                    {usersMessage.length !== 0 && <p>{usersMessage}</p>
                    }
                    <div className="user-list-box">
                        <ul className="user-list">

                            {users && users.length > 0 && users.map((user) => (
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
                    </div>
                </div>)}
            {searchType === 'posts' && (
                <div>
                    {postsMessage.length !== 0 && <p>{postsMessage}</p>
                    }
                    <ul className="post-list">
                        {posts && posts.length > 0 && posts.map((post) => (
                            <Post key={post.postid} content={post.content} user={post.userid} />
                        ))}
                    </ul>
                </div>)}
            <Routes>
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/messages/:id" element={<Chat />} />
            </Routes>
        </div>
    );
}

export default Search;
