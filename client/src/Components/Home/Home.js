import React, { useState, useEffect } from 'react';
import "./home.css";
import axios from 'axios';
import CreatePost from './CreatePost';
import SearchBar from './SearchBar';
import Post from './Post';



function Home() {

    const [posts, setPosts] = useState([]);
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
        fetchPostsInfo();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleNewPost = async (content) => {
        try {
            await axios.post('http://localhost:5000/posts', {
                content: content,
                username: localStorage.getItem('user')
            });
            // const response = await axios.get('http://localhost:5000/posts');
            // setPosts(response.data.posts);
        } catch (error) {
            console.error('Error adding new post:', error);
        }
    };

    const handleAddPostClick = () => {
        setShowCreatePost(true);
    };

    return (
        <div>
            <SearchBar />
            <button className="add-post-button" onClick={handleAddPostClick}>Add Post</button>
            {showCreatePost ? <CreatePost onClose={() => setShowCreatePost(false)} onSubmit={handleNewPost} /> : <></>}
            {posts.length !== 0 && posts.map((post, index) => (

                <Post key={index} user={post.userid} content={post.content} />
            ))}
        </div>
    );
}

export default Home;