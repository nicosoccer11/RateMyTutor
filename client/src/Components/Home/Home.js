import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreatePost from './CreatePost';
import ProfileCard from '../User/ProfileCard';
import SuggestedUsersList from '../User/SuggestedUsers';
import SearchBar from './SearchBar';
import Post from './Post';
import "./home.css";

function Home() {
    // State variables to manage posts, suggested users, and create post popup
    const [posts, setPosts] = useState([]);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const username = localStorage.getItem('user');

    // Fetch posts and suggested users when the component mounts
    useEffect(() => {
        // Fetch posts from friends
        const fetchPostsInfo = async () => {
            try {
                const response = await axios.get('http://localhost:5000/posts/friends/' + username);
                setPosts(response.data.posts);
            } catch (error) {
                console.error('Error retrieving profile data:', error);
            }
        };

        // Fetch suggested users
        const fetchSuggestedUsers = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/users/suggested-friends/${username}`);
                // Map the response data to include a 'name' field
                let tempUsers = response.data.map(user => ({
                    ...user,
                    name: `${user.firstname} ${user.lastname}`
                }));
                setSuggestedUsers(tempUsers);
            } catch (error) {
                console.error('Error retrieving profile data:', error);
            }
        };

        fetchPostsInfo();
        fetchSuggestedUsers();
    }, [username]);

    // Handle submitting a new post
    const handleNewPost = async (content) => {
        try {
            await axios.post('http://localhost:5000/posts', {
                content: content,
                username: localStorage.getItem('user')
            });
        } catch (error) {
            console.error('Error adding new post:', error);
        }
    };

    // Show the create post popup when the "Add Post" button is clicked
    const handleAddPostClick = () => {
        setShowCreatePost(true);
    };

    return (
        <div className='home-container'>
            <div className='full-container'>
                <SearchBar />
                {suggestedUsers && suggestedUsers.length > 0 && <SuggestedUsersList users={suggestedUsers} />}
                <ProfileCard username={username} email={`${username}@mail.com`} name={username} />
                <div className='new-post-container'>
                    <button className="add-post-button" onClick={handleAddPostClick}>
                        <img src='images/plus.png' alt="Add Post" />
                    </button>
                    <div className="textbox">New Post</div>
                </div>
                {showCreatePost && <CreatePost onClose={() => setShowCreatePost(false)} onSubmit={handleNewPost} />}
                {posts.length !== 0 && posts.map((post, index) => (
                    <Post key={index} user={post.userid} content={post.content} postid={post.postid} />
                ))}
            </div>
        </div>
    );
}

export default Home;
