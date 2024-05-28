import React, { useState } from 'react';
import './Posts.css';
import CreatePost from '../Home/CreatePost';
import Post from '../Home/Post';
import axios from 'axios';

function Posts({ posts, user, update, updateValue }) {
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [visiblePosts, setVisiblePosts] = useState(5);

    const handleAddPostClick = () => {
        setShowCreatePost(true);
    };

    const handleShowMore = () => {
        setVisiblePosts(prevCount => prevCount + 5);
    };

    const handleNewPost = async (content) => {
        try {
            await axios.post('http://localhost:5000/posts', {
                content: content,
                username: localStorage.getItem('user')
            });
            update(!updateValue);
        } catch (error) {
            console.error('Error adding new post:', error);
        }
    };

    return (
        <div className="posts">
            <h2>Posts</h2>
            {localStorage.getItem('user') === user && <button className="add-post" onClick={handleAddPostClick}>Add Post</button>}
            {showCreatePost && <CreatePost onClose={() => setShowCreatePost(false)} onSubmit={handleNewPost} />}
            {posts && posts.length > 0 ? (<>
                {posts.slice(0, visiblePosts).map((post, index) => (
                    <Post key={index} user={post.userid} content={post.content} postid={post.postid} />
                ))}
                {posts.length > visiblePosts && (
                    <div className="show-more-button-container">
                        <button className="show-more-button" onClick={handleShowMore}>
                            Show More
                        </button>
                    </div>
                )}
            </>) : ((
                <p>No Posts available.</p>
            ))}
        </div>
    );
}

export default Posts;
