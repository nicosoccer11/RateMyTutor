import React, { useEffect, useState } from 'react';
import './Reviews.css';

function Reviews({ reviews }) {

    return (
        <div id="reviews" className="reviews">
            <h2>Reviews</h2>
            {reviews ? (
                reviews.map((review, index) => (
                    <div className="review">
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
