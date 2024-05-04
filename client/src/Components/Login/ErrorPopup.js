// Import React library and styles for the ErrorPopup component
import React from 'react';
import './ErrorPopup.css';

// Define the ErrorPopup functional component
function ErrorPopup({ message, onClose }) {
  return (
    // Popup container
    <div className="popup">
      {/* Popup content */}
      <div className="popup-content">
        {/* Error message */}
        <p>{message}</p>
        {/* Close button */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

// Export the ErrorPopup component
export default ErrorPopup;
