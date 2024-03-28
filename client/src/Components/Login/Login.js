import React, { useState,useEffect } from 'react';
import './Login.css';
import Signup from './Signup';
import ErrorPopup from './ErrorPopup';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";


function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/users/login', {
        username,
        password,
      });
      localStorage.setItem('user', response.data.username);
      console.log("setting local storage \'user\' to:", response.data.username)
      onLogin();
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Incorrect username or password');
      setPassword('');
    }
  };

  function handleCallback(response) {
    const decoded = jwtDecode(response.credential);
    // Send the decoded information to your backend
    axios.post('http://localhost:5000/users/google-auth', {
      email: decoded.email,
      given_name: decoded.given_name,
      family_name: decoded.family_name,
      picture: decoded.picture
    })
    .then(response => {
      // Set the username in local storage and perform login actions
      console.log("data ", response.data);
      localStorage.setItem('user', response.data.username);
      onLogin();
    })
    .catch(error => {
      console.error('Error during Google OAuth login:', error);
    });
  }

    useEffect(() => {
      /* global google */
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
    }, []);

  const handleToggleSignup = () => {
    setIsSignup(true);
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <div className="login-container">
      {error && <ErrorPopup message={error} onClose={handleCloseError} />}
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
        <p>Don't have an account? <button className="signup-button" onClick={handleToggleSignup}>Sign up</button></p>
      </div>}
      <div id="signInDiv"></div>
    </div>
  );
}

export default Login;
