import React, { useState } from 'react';
import './Posts.css';
import CreatePost from '../Home/CreatePost';
import Post from '../Home/Post';

function Posts({ posts, user }) {
    const [showCreatePost, setShowCreatePost] = useState(false);

    const handleAddPostClick = () => {
        setShowCreatePost(true);
    };

    return (
        <div className="posts">
            <h2>Posts</h2>
            {localStorage.getItem('user') === user && <button className="add-post" onClick={handleAddPostClick}>Add Post</button>}
            {showCreatePost && <CreatePost onClose={() => setShowCreatePost(false)} />}
            {posts && posts.length !== 0 && posts.map((post, index) => (
                <Post key={index} user={post.userid} content={post.content} />
            ))}
        </div>
    );
}

export default Posts;
