import React, { useState } from 'react';
import './Login.css';
import Signup from './Signup';
import axios from 'axios';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    
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
        }
      };

    const handleToggleSignup = () => {
        setIsSignup(true);
      };

    return (
        <div className="login-container">
            {isSignup ? <Signup onLogin={onLogin} setIsSignup={setIsSignup}/> : <div>
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
        </div>
    );
}

export default Login;
