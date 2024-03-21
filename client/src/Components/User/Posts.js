import React, { useState } from 'react';
import './Posts.css';
import CreatePost from '../Home/CreatePost';

function Posts({ posts }) {
    const [showCreatePost, setShowCreatePost] = useState(false);

    const handleAddPostClick = () => {
        setShowCreatePost(true);
    };

    return (
        <div className="posts-container">
            <h2>Posts</h2>
            <button className="add-post" onClick={handleAddPostClick}>Add Post</button>
            {showCreatePost && <CreatePost onClose={() => setShowCreatePost(false)} />}
            {posts && posts.length !== 0 && posts.map((post, index) => (
                <div key={index} className="post">
                    <p>{post.content}</p>
                </div>
            ))}
        </div>
    );
}

export default Posts;
