// Qualities.js

import React, { useState, useEffect } from 'react';
import './Qualities.css';
import axios from 'axios';

function Qualities({ qualities, setQualities, user }) {
    const isCurrentUser = (user === localStorage.getItem('user'));

    const handleQualityToggle = async (qualityIndex) => {
        if (!isCurrentUser) {
            return;
        }
        try {
            const updatedQualities = [...qualities];
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
            setQualities(updatedQualities);
        } catch (error) {
            console.error('Error updating quality:', error);
        }
    };

    return (
        <div className="qualities-container">
            <h3>Qualities</h3>
            <div className="qualities-list">
                {qualities && qualities.length > 0 && qualities.map((quality) => (
                    <button
                        key={quality.qualityid}
                        className={`quality-item ${quality.hasquality ? (quality.hasmatch && !isCurrentUser ? 'match' : 'active ') : ''}`}
                        onClick={() => handleQualityToggle(quality.qualityid)}
                    >
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
