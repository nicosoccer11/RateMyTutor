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
            if(updatedQualities[qualityIndex - 1].hasquality === 0){
                console.log("ADDING", qualityIndex);
                const response = await axios.post('http://localhost:5000/user-qualities/add', {
                    username: user,
                    qualityId: qualityIndex
                });
                updatedQualities[qualityIndex - 1].hasquality = 1;
            }
            else {
                console.log("removing", qualityIndex);
                console.log(user, qualityIndex);
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
                        className={`quality-item ${quality.hasquality ? 'active' : ''}`}
                        onClick={() => handleQualityToggle(quality.qualityid)}
                    >
                        {quality.hasquality ? (<span className="checkmark">&#10003;{quality.qualityname}</span>) :
                            (<span>{quality.qualityname}</span>)}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Qualities;
