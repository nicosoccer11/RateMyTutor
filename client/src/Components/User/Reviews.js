import React, { useEffect, useState } from 'react';
import './Reviews.css';
import CreateReview from './CreateReview';
import axios from 'axios';

function Reviews({ reviews, user, update, updateValue }) {

    const [showCreateReview, setShowCreateReview] = useState(false);
    const [visibleReviews, setVisibleReviews] = useState(5);


    const handleNewReview = async (score, paragraph) => {
        try {
            await axios.post('http://localhost:5000/reviews', {
                score: score,
                paragraph: paragraph,
                userReviewingID: localStorage.getItem('user'),
                tutorReviewedID: user
            });
            update(!updateValue);
        } catch (error) {
            console.error('Error adding new review:', error);
        }
    };

    const handleAddReviewClick = () => {
        setShowCreateReview(true);
    };

    const handleShowMore = () => {
        setVisibleReviews(prevCount => prevCount + 5);
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
            {reviews && reviews.length > 0 ? (
                <>
                    {reviews.slice().reverse().slice(0, visibleReviews).map((review, index) => (
                        <div key={review.reviewid} className="review">
                            <div className="review-content">
                                <div className={`review-rating ${review.ratingColor}`}>
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
                    ))}
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
