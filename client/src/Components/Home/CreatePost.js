import React, { useState } from 'react';
import axios from 'axios';
import './CreatePost.css'; // Import CSS for styling the popup

function CreatePost({ onClose, onSubmit }) {
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Call onSubmit callback with the entered content
        await onSubmit(content);
        // Close the popup
        onClose();
    };

    const handleCancel = () => {
        // Close the popup
        onClose();
    };

    return (
        <div className="create-post-overlay">
            <div className="create-post-popup">
                <h2>Create a New Post</h2>
                <form onSubmit={handleSubmit}>
                    <textarea
                        className="post-content-input"
                        placeholder="Enter your post content..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <div className="button-container">
                        <button type="submit" className="submit-button">Post</button>
                        <button type="button" onClick={handleCancel} className="cancel-button">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreatePost;
