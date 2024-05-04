import React, { useState } from 'react';
import './Posts.css';
import CreatePost from '../Home/CreatePost';
import Post from '../Home/Post';
import axios from 'axios';

function Posts({ posts, user, update, updateValue }) {
    // State to manage the visibility of the create post form
    const [showCreatePost, setShowCreatePost] = useState(false);
    // State to manage the number of visible posts
    const [visiblePosts, setVisiblePosts] = useState(5);

    // Function to handle click event for adding a new post
    const handleAddPostClick = () => {
        setShowCreatePost(true);
    };

    // Function to handle click event for showing more posts
    const handleShowMore = () => {
        setVisiblePosts(prevCount => prevCount + 5);
    };

    // Function to handle submission of a new post
    const handleNewPost = async (content) => {
        try {
            // Send a POST request to create a new post
            await axios.post('http://localhost:5000/posts', {
                content: content,
                username: localStorage.getItem('user')
            });
            // Trigger an update to refresh the posts
            update(!updateValue);
        } catch (error) {
            console.error('Error adding new post:', error);
        }
    };

    return (
        <div className="posts">
            <h2>Posts</h2>
            {/* Render the "Add Post" button for the logged-in user */}
            {localStorage.getItem('user') === user && <button className="add-post" onClick={handleAddPostClick}>Add Post</button>}
            {/* Render the create post form if showCreatePost state is true */}
            {showCreatePost && <CreatePost onClose={() => setShowCreatePost(false)} onSubmit={handleNewPost} />}
            {/* Render posts */}
            {posts && posts.length > 0 ? (
                <>
                    {/* Render visible posts */}
                    {posts.slice(0, visiblePosts).map((post, index) => (
                        <Post key={index} user={post.userid} content={post.content} postid={post.postid} />
                    ))}
                    {/* Render "Show More" button if there are more posts to display */}
                    {posts.length > visiblePosts && (
                        <div className="show-more-button-container">
                            <button className="show-more-button" onClick={handleShowMore}>
                                Show More
                            </button>
                        </div>
                    )}
                </>
            ) : (
                // Render a message if there are no posts
                <p>No Posts available.</p>
            )}
        </div>
    );
}

export default Posts;
