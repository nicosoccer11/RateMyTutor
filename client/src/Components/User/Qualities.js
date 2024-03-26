// Qualities.js

import React, { useState, useEffect } from 'react';
import './Qualities.css';
import axios from 'axios';

function Qualities({ qualities }) {
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleQualityToggle = async (qualityIndex) => {
    // Update user quality
    try {
      const updatedQualities = [...qualities];
      updatedQualities[qualityIndex] = !updatedQualities[qualityIndex]; // Toggle value
      setQualities(updatedQualities);
      await axios.patch(`http://localhost:5000/qualities/${username}`, { qualities: updatedQualities });
    } catch (error) {
      console.error('Error updating user quality:', error);
    }
  };

  return (
    <div className="qualities-container">
      <h3>Qualities</h3>
      {editMode && isCurrentUser && (
        <button onClick={toggleEditMode}>Save</button>
      )}
      {!editMode && isCurrentUser && (
        <button onClick={toggleEditMode}>Edit</button>
      )}
      <div className="qualities-list">
        {qualities.map((quality, index) => (
          <div
            key={index}
            className={`quality-item ${quality ? 'active' : ''} ${isCurrentUser ? 'editable' : ''}`}
            onClick={() => editMode && isCurrentUser && handleQualityToggle(index)}
          >
            {quality && <span className="checkmark">&#10003;</span>}
            <span>{quality ? 'Yes' : 'No'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Qualities;
