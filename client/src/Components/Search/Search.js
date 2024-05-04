import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import './Search.css';
import axios from 'axios';
import Profile from '../User/Profile';
import Chat from '../Messages/Chat';
import Post from '../Home/Post';

function Search() {
    // Hook for navigation
    const navigate = useNavigate();

    // Get search query and location
    const searchLocation = useLocation();
    const queryParams = new URLSearchParams(searchLocation.search);

    // State variables
    const [query, setQuery] = useState('');
    const [data, setData] = useState(queryParams.get('q'));
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const user2Username = localStorage.getItem('user');
    const [postsMessage, setPostsMessage] = useState('');
    const [usersMessage, setUsersMessage] = useState('');
    const [searchType, setSearchType] = useState('users');
    const [images, setImages] = useState({});
    const [buttonText, setButtonText] = useState({});

    // Effect to handle initial search based on query
    useEffect(() => {
        if (data) {
            handleSearch(null, data);
        }
        else if (localStorage.getItem('searchQuery')) {
            handleSearch(null, localStorage.getItem('searchQuery'));
            setData(localStorage.getItem('searchQuery'));
        }
    }, []);

    // Effect to fetch images and button text when users state updates
    useEffect(() => {
        const fetchImages = async () => {
            const newImages = {};
            const buttonText = {};
            for (let user of users) {
                const img = await fetchPicture(user.username);
                newImages[user.username] = img;
                if (user.isFriend && !(await checkStatus(user.username))) {
                    buttonText[user.username] = '';
                }
                else {
                    buttonText[user.username] = user.isFriend ? 'Requested' : 'Add Friend';
                }
            }
            setImages(newImages);
            setButtonText(buttonText);
        };
        fetchImages();
    }, [users]);

    // Function to check friend request status
    const checkStatus = async (userUsername) => {
        try {
            const response = await axios.get(`http://localhost:5000/friends/status/${user2Username}/${userUsername}`);
            if (response.data.status === 'requested') {
                return true;
            }
            else {
                return false;
            }
        } catch (error) {
            console.error('Error getting status:', error);
        }
    };

    // Function to handle search
    const handleSearch = async (e, input) => {
        if (e != null) {
            e.preventDefault();
        }
        const searchData = input || query;
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

    // Function to add or remove user as friend
    const handleAddUser = async (user1Username) => {
        if (buttonText[user1Username] === 'Requested') {
            try {
                const response = await axios.post(`http://localhost:5000/friends/delete`, {
                    user1Username: user2Username,
                    user2Username: user1Username,
                });
                setButtonText({ ...buttonText, [user1Username]: 'Add Friend' });
            }
            catch (error) {
                console.error('Error getting users:', error);
            }
            return;
        }
        try {
            const response = await axios.post(`http://localhost:5000/friends/add`, {
                user1Username: user2Username,
                user2Username: user1Username,
            });
            setButtonText({ ...buttonText, [user1Username]: 'Requested' });
        } catch (error) {
            console.error('Error getting users:', error);
        }
    };

    // Function to handle tab change
    const handleTabChange = (type) => {
        setSearchType(type);
    };

    // Function to fetch user picture
    const fetchPicture = async (user) => {
        try {
            const response = await axios.get(`http://localhost:5000/image/get/${user}`);
            return response.data.imageUrl;
        } catch (error) {
            console.error('Error fetching image:', error);
            return null;
        }
    };

    return (
        <div class="search-results-container">
            <div className="search-container">
                {/* Search form */}
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
                {/* Search tabs */}
                <div className="search-tabs">
                    <button className={`search-tab ${searchType === 'users' ? 'active' : ''}`} onClick={() => handleTabChange('users')}>Users</button>
                    <button className={`search-tab ${searchType === 'posts' ? 'active' : ''}`} onClick={() => handleTabChange('posts')}>Posts</button>
                </div>
                {/* Users or posts based on search type */}
                {searchType === 'users' && (
                    <div className='users'>
                        {usersMessage.length !== 0 && <p>{usersMessage}</p>}
                        <ul className="user-list">
                            {users && users.length > 0 && users.map((user) => (
                                <li key={user.username} className="user-item">
                                    {images[user.username] && <img
                                        className="user-avatar"
                                        src={images[user.username]}
                                        alt={user.name}
                                    />}
                                    <div className="user-info">
                                        <h3>
                                            <Link className='name' to={`/profile/${user.username}`}>{user.username}</Link>
                                            {buttonText[user.username] !== '' ?
                                                <button className={`link-button ${buttonText[user.username] === 'Requested' ? 'requested' : ''}`} onClick={() => handleAddUser(user.username)}>{buttonText[user.username]}</button> : null
                                            }
                                        </h3>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {searchType === 'posts' && (
                    <div>
                        {postsMessage.length !== 0 && <p>{postsMessage}</p>}
                        <ul className="post-list">
                            {posts && posts.length > 0 && posts.map((post) => (
                                <Post key={post.postid} content={post.content} user={post.userid} />
                            ))}
                        </ul>
                    </div>
                )}
                {/* Routes for profile and chat */}
                <Routes>
                    <Route path="/profile/:id" element={<Profile />} />
                    <Route path="/messages/:id" element={<Chat />} />
                </Routes>
            </div>
        </div>
    );
}

export default Search;
