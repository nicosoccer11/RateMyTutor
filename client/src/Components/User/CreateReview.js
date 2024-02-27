import React, { useState } from 'react';
import axios from 'axios';
import './CreateReview.css'; // Import CSS for styling the popup

function CreateReview({ onClose, onSubmit }) {
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Call onSubmit callback with the entered content
        await onSubmit(rating, content);
        // Close the popup
        onClose();
    };

    const handleCancel = () => {
        // Close the popup
        onClose();
    };

    return (
        <div className="create-review-overlay">
            <div className="create-review-popup">
                <h2>Create a New Review</h2>
                <form onSubmit={handleSubmit}>
                    <textarea
                        className="review-content-input"
                        placeholder="Enter your review content..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <h2>Rating:</h2>
                    <select
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(parseInt(e.target.value))}
                    >
                        {[...Array(10).keys()].map((num) => (
                            <option key={num + 1} value={num + 1}>{num + 1}</option>
                        ))}
                    </select>
                    <div className="button-container">
                        <button type="submit" className="submit-button">Submit</button>
                        <button type="button" onClick={handleCancel} className="cancel-button">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateReview;
