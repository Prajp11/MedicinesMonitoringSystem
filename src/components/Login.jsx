import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';  // Make sure you have the login function in the api.js

const Login = ({ setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Hardcoded credentials
  const validUsername = 'archin@0106';
  const validPassword = 'prajwal@p1111';

  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if username and password match the hardcoded values
    if (username === validUsername && password === validPassword) {
      try {
        // Call the login function to get the JWT token
        const accessToken = await login(username, password);
        
        // Set the logged-in state to true
        setLoggedIn(true);

        // Store the access token and refresh token in localStorage
        localStorage.setItem('accessToken', accessToken); // Replace with the real access token
        localStorage.setItem('refreshToken', 'dummyRefreshToken'); // Refresh token will be set similarly in backend

        // Redirect the user to the dashboard
        navigate('/dashboard');
      } catch (error) {
        // Display error message if login fails
        setError('Invalid username or password');
      }
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;