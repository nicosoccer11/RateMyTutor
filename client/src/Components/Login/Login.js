// Import React library, styles for the Login component, Signup component, ErrorPopup component, axios, and jwtDecode
import React, { useState, useEffect } from 'react';
import './Login.css';
import Signup from './Signup';
import ErrorPopup from './ErrorPopup';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

// Define the Login functional component
function Login({ onLogin }) {
  // State variables initialization
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send login request to the server
      const response = await axios.post('http://localhost:5000/users/login', {
        username,
        password,
      });
      // Store username in local storage and perform login actions
      localStorage.setItem('user', response.data.username);
      onLogin();
    } catch (error) {
      console.error('Error logging in:', error);
      // Display error message if login fails
      setError('Incorrect username or password');
      setPassword('');
    }
  };

  // Function to handle callback from Google OAuth
  function handleCallback(response) {
    const decoded = jwtDecode(response.credential);
    // Send the decoded information to the backend
    axios.post('http://localhost:5000/users/google-auth', {
      email: decoded.email,
      given_name: decoded.given_name,
      family_name: decoded.family_name,
      picture: decoded.picture
    })
      .then(response => {
        // Store the username in local storage and perform login actions
        localStorage.setItem('user', response.data.username);
        onLogin();
      })
      .catch(error => {
        console.error('Error during Google OAuth login:', error);
      });
  }

  // Initialize Google Sign-In button
  useEffect(() => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      google.accounts.id.initialize({
        client_id: "127410190553-p0cbq1a04i9u4gkush6olhkop9u4a773.apps.googleusercontent.com",
        callback: handleCallback
      })
      google.accounts.id.renderButton(
        document.getElementById("signInDiv"),
        {
          theme: "outline",
          size: "large",
        });
    }
  }, []);

  // Function to handle signup button click
  const handleToggleSignup = () => {
    setIsSignup(true);
  };

  // Function to close error popup
  const handleCloseError = () => {
    setError(null);
  };

  // Render the Login component
  return (
    <div className="login-container">
      {/* Display error popup if error exists */}
      {error && <ErrorPopup message={error} onClose={handleCloseError} />}
      {/* Render Signup component if isSignup state is true, otherwise render login form */}
      {isSignup ? <Signup onLogin={onLogin} setIsSignup={setIsSignup} /> : <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="login-label" htmlFor="username">Username:</label>
            <input
              className="login-input"
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="login-label" htmlFor="password">Password:</label>
            <input
              className="login-input"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="login-button" type="submit">Login</button>
        </form>
        {/* Display signup button */}
        <p>Don't have an account? <button className="signup-button" onClick={handleToggleSignup}>Sign up</button></p>
      </div>}
      {/* Google Sign-In button container */}
      <div id="signInDiv"></div>
    </div>
  );
}

// Export the Login component
export default Login;
