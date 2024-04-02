import React, { useState, useEffect } from 'react';
import "./home.css";
import axios from 'axios';
import CreatePost from './CreatePost';
import ProfileCard from '../User/ProfileCard';
import SuggestedUsersList from '../User/SuggestedUsers';
import SearchBar from './SearchBar'
import Post from './Post';

function Home() {

    const [posts, setPosts] = useState([]);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const username = localStorage.getItem('user');

    useEffect(() => {
        const fetchPostsInfo = async () => {
            try {
                const response = await axios.get('http://localhost:5000/posts/friends/' + username, {
                });
                setPosts(response.data.posts);
            } catch (error) {
                console.error('Error retrieving profile data:', error);
            }
        };
        const fetchSuggestedUsers = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/users/suggested-friends/${username}`, {
                });
                
                let tempUsers = response.data.map(user => ({
                    ...user,
                    name: `${user.firstname} ${user.lastname}`
                  }));
                setSuggestedUsers(tempUsers);
                console.log(suggestedUsers);
            } catch (error) {
                console.error('Error retrieving profile data:', error);
            }
        };
        fetchPostsInfo();
        fetchSuggestedUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const handleAddPostClick = () => {
        setShowCreatePost(true);
    };


    return (
        <div className='full-container'>
            <SearchBar />
            {suggestedUsers && suggestedUsers.length > 0 && <SuggestedUsersList users={suggestedUsers} />}
            <ProfileCard username={username} email={`${username}@mail.com`} name={username} />
            <div className='new-post-container'>
                <button className="add-post-button" onClick={handleAddPostClick}>
                    <img src='images/plus.png'></img>
                </button>
                <div className="textbox">New Post</div>
            </div>

            {showCreatePost ? <CreatePost onClose={() => setShowCreatePost(false)} onSubmit={handleNewPost} /> : <></>}
            {posts.length !== 0 && posts.map((post, index) => (

                <Post key={index} user={post.userid} content={post.content} postid={post.postid} />
            ))}
        </div>
    );
}

export default Home;