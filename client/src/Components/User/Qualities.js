import React, { useState, useEffect } from 'react';
import './Qualities.css';
import axios from 'axios';

function Qualities({ qualities, setQualities, user }) {
    // Check if the current user matches the provided user
    const isCurrentUser = (user === localStorage.getItem('user'));

    // Function to handle toggling qualities
    const handleQualityToggle = async (qualityIndex) => {
        // If the current user is not the same as the provided user, do nothing
        if (!isCurrentUser) {
            return;
        }
        try {
            const updatedQualities = [...qualities];
            // Toggle the quality based on its current state
            if (updatedQualities[qualityIndex - 1].hasquality === 0) {
                const response = await axios.post('http://localhost:5000/user-qualities/add', {
                    username: user,
                    qualityId: qualityIndex
                });
                updatedQualities[qualityIndex - 1].hasquality = 1;
            }
            else {
                const response = await axios.delete('http://localhost:5000/user-qualities/remove', {
                    data: {
                        username: user,
                        qualityId: qualityIndex
                    }
                });
                updatedQualities[qualityIndex - 1].hasquality = 0;
            }
            // Update the state with the modified qualities
            setQualities(updatedQualities);
        } catch (error) {
            console.error('Error updating quality:', error);
        }
    };

    return (
        <div className="qualities-container">
            <h3>Qualities</h3>
            <div className="qualities-list">
                {/* Map through qualities and render buttons */}
                {qualities && qualities.length > 0 && qualities.map((quality) => (
                    <button
                        key={quality.qualityid}
                        // Set class based on whether quality is active, editable, or a match
                        className={`quality-item ${quality.hasquality ? (quality.hasmatch && !isCurrentUser ? 'match' : 'active') : 'editable'}`}
                        // Handle quality toggle on click
                        onClick={() => handleQualityToggle(quality.qualityid)}
                    >
                        {/* Render different content based on user and quality state */}
                        {isCurrentUser ? (
                            quality.hasquality ? (
                                <span className="checkmark">{quality.qualityname}</span>
                            ) : (
                                <span>{quality.qualityname}</span>
                            )
                        ) : (
                            quality.hasmatch ? (
                                <span className="matched-quality">{quality.qualityname} &#10003;</span>
                            ) : (
                                quality.hasquality ? (
                                    <span className="checkmark">{quality.qualityname}</span>
                                ) : (
                                    <span>{quality.qualityname}</span>
                                )
                            )
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Qualities;
