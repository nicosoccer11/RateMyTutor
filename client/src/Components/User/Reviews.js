import React from 'react';
import './Reviews.css';

function Reviews() {
    return (
        <div className="reviews">
            <h2>Reviews</h2>
            <div className="review">
                <div className="review-content">
                    <div className="review-rating">
                        <p>Quality:</p>
                        <div className="review-score">
                            5.0
                        </div>
                    </div>
                    <div className="review-text">
                        <p>Good computer architecture class because of the two projects. Do the project on your own, you will learn a lot. Coming to the classes, lectures are okish, but fun sometimes. Heavy homeworks for a very little credit.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reviews;
