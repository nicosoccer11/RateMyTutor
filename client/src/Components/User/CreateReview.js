import React, { useState } from 'react';
import axios from 'axios';
import './CreateReview.css'; // Import CSS for styling the popup

function CreateReview({ onClose, onSubmit }) {
    // State variables to track review content and rating
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(1);

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Call the onSubmit callback with the entered rating and content
        await onSubmit(rating, content);
        // Close the popup after submission
        onClose();
    };

    // Function to handle cancellation
    const handleCancel = () => {
        // Close the popup without submitting
        onClose();
    };

    return (
        // Popup overlay and container
        <div className="create-review-overlay">
            <div className="create-review-popup">
                {/* Popup title */}
                <h2>Create a New Review</h2>
                {/* Review form */}
                <form onSubmit={handleSubmit}>
                    {/* Text area for review content */}
                    <textarea
                        className="review-content-input"
                        placeholder="Enter your review content..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    {/* Rating selection */}
                    <h2>Rating:</h2>
                    <select
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(parseInt(e.target.value))}
                    >
                        {/* Generate rating options from 1 to 10 */}
                        {[...Array(10).keys()].map((num) => (
                            <option key={num + 1} value={num + 1}>{num + 1}</option>
                        ))}
                    </select>
                    {/* Buttons for submission and cancellation */}
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
