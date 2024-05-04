// Import React library, styles for the Signup component, ErrorPopup component, and axios
import React, { useState } from 'react';
import './Signup.css';
import ErrorPopup from './ErrorPopup';
import axios from 'axios';

// Define the Signup functional component
function Signup({ onLogin, setIsSignup }) {
  // State variables initialization
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send signup request to the server
      const response = await axios.post('http://localhost:5000/users', {
        username,
        password,
        firstname: firstName,
        lastname: lastName,
        email
      });
      try {
        // Log the user in after signup
        const response = await axios.post('http://localhost:5000/users/login', {
          username,
          password,
        });
        // Store username in local storage and perform login actions
        localStorage.setItem('user', response.data.username);
        onLogin();
      } catch (error) {
        console.error('Error logging in:', error);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      // Display error message if user creation fails
      setError('Error occurred while signing up, please try again.');
    }
  };

  // Function to handle cancel button click
  const handleCancel = () => {
    setIsSignup(false);
  };

  // Function to close error popup
  const handleCloseError = () => {
    setError(null);
  };

  // Render the Signup component
  return (
    <div className="signup-container">
      {/* Display error popup if error exists */}
      {error && <ErrorPopup message={error} onClose={handleCloseError} />}
      <h2>Sign Up</h2>
      {/* Signup form */}
      <form onSubmit={handleSubmit}>
        <div>
          <label className="signup-label" htmlFor="username">Username:</label>
          {/* Username input field */}
          <input
            className="signup-input"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="signup-label" htmlFor="password">Password:</label>
          {/* Password input field */}
          <input
            className="signup-input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="signup-label" htmlFor="email">Email:</label>
          {/* Email input field */}
          <input
            className="signup-input"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="signup-label" htmlFor="firstName">First Name:</label>
          {/* First name input field */}
          <input
            className="signup-input"
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label className="signup-label" htmlFor="lastName">Last Name:</label>
          {/* Last name input field */}
          <input
            className="signup-input"
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        {/* Submit and cancel buttons */}
        <button className="signup-button" type="submit">Sign Up</button>
        <button className="signup-button" type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
}

// Export the Signup component
export default Signup;
