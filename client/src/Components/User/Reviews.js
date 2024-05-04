import React, { useEffect, useState } from 'react';
import './Reviews.css';
import CreateReview from './CreateReview';
import axios from 'axios';

function Reviews({ reviews, user, hadSession, update, updateValue }) {
    // State to manage whether to show the CreateReview component
    const [showCreateReview, setShowCreateReview] = useState(false);
    // State to manage the number of visible reviews
    const [visibleReviews, setVisibleReviews] = useState(5);

    // Function to handle adding a new review
    const handleNewReview = async (score, paragraph) => {
        try {
            // Send POST request to add a new review
            await axios.post('http://localhost:5000/reviews', {
                score: score,
                paragraph: paragraph,
                userReviewingID: localStorage.getItem('user'),
                tutorReviewedID: user
            });
            // Update the parent component to trigger fetching updated reviews
            update(!updateValue);
        } catch (error) {
            console.error('Error adding new review:', error);
        }
    };

    // Function to handle click event for adding a review
    const handleAddReviewClick = () => {
        setShowCreateReview(true);
    };

    // Function to handle showing more reviews
    const handleShowMore = () => {
        setVisibleReviews(prevCount => prevCount + 5);
    };

    return (
        <div id="reviews" className="reviews">
            <h2>Reviews</h2>
            {/* Render add review button only if there was a session and the user is not the tutor */}
            {hadSession && user !== localStorage.getItem('user') && (
                <div className="add-review-button-container">
                    <button className="add-review-button" onClick={handleAddReviewClick}>
                        Add Review
                    </button>
                    {/* Render CreateReview component if showCreateReview is true */}
                    {showCreateReview ? <CreateReview onClose={() => setShowCreateReview(false)} onSubmit={handleNewReview} /> : <></>}
                </div>
            )}
            {/* Render reviews if available, otherwise render a message */}
            {reviews && reviews.length > 0 ? (
                <>
                    {/* Render each review */}
                    {reviews.slice().reverse().slice(0, visibleReviews).map((review, index) => (
                        <div key={review.reviewid} className="review">
                            <div className="review-content">
                                {/* Render review rating */}
                                <div className={`review-rating ${review.ratingColor}`}>
                                    <p>Quality:</p>
                                    <div className="review-score">
                                        {review.score}
                                    </div>
                                </div>
                                {/* Render review text */}
                                <div className="review-text">
                                    <p>{review.paragraph}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Render 'Show More' button if there are more reviews to show */}
                    {reviews.length > visibleReviews && (
                        <div className="show-more-button-container">
                            <button className="show-more-button" onClick={handleShowMore}>
                                Show More
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <p>No reviews available.</p>
            )}
        </div>
    );
}

export default Reviews;
