import React, { useEffect, useState } from 'react';
import './Reviews.css';
import CreateReview from './CreateReview';
import axios from 'axios';

function Reviews({ reviews, user }) {

    const [showAddReview, setShowAddReview] = useState(false);
    const [showCreateReview, setShowCreateReview] = useState(false);

    const handleNewReview = async (score, paragraph) => {
        try {
            await axios.post('http://localhost:5000/reviews', {
                score: score,
                paragraph: paragraph,
                userReviewingID: localStorage.getItem('user'),
                tutorReviewedID: user
            });
        } catch (error) {
            console.error('Error adding new review:', error);
        }
    };

    const handleAddReviewClick = () => {
        setShowCreateReview(true);
    };

    return (
        <div id="reviews" className="reviews">
            <h2>Reviews</h2>
            {user != localStorage.getItem('user') && <div className="add-review-button-container">
                <button className="add-review-button" onClick={handleAddReviewClick}>
                    Add Review
                </button>
                {showCreateReview ? <CreateReview onClose={() => setShowCreateReview(false)} onSubmit={handleNewReview} /> : <></>}
            </div>}
            {reviews ? (
                reviews.map((review, index) => (
                    <div key={review.reviewid} className="review">
                        <div className="review-content">
                            <div className="review-rating">
                                <p>Quality:</p>
                                <div className="review-score">
                                    {review.score}
                                </div>
                            </div>
                            <div className="review-text">
                                <p>{review.paragraph}</p>
                            </div>
                        </div>
                    </div>
                ))
            ) : <></>}


        </div>
    );
}

export default Reviews;
