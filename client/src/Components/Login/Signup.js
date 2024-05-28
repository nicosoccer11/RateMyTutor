import React, { useState } from 'react';
import './Signup.css';
import ErrorPopup from './ErrorPopup';
import axios from 'axios';

function Signup({ onLogin, setIsSignup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/users', {
        username,
        password,
        firstname: firstName,
        lastname: lastName,
        email
      });
      console.log('User created:', response.data);
      try {
        const response = await axios.post('http://localhost:5000/users/login', {
          username,
          password,
        });
        console.log(response.data);
        localStorage.setItem('user', response.data.username);
        onLogin();
      } catch (error) {
        console.error('Error logging in:', error);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Error occurred while signing up, please try again.');
    }
  };


  const handleCancel = () => {
    setIsSignup(false);
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <div className="signup-container">
      {error && <ErrorPopup message={error} onClose={handleCloseError} />}
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="signup-label" htmlFor="username">Username:</label>
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
          <input
            className="signup-input"
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <button className="signup-button" type="submit">Sign Up</button>
        <button className="signup-button" type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
}

export default Signup;
