import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api'; // Import login function from api.js

const Login = ({ setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Hardcoded credentials
  const validUsername = 'Prajwalp11';
  const validPassword = 'Prajwal@123';

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate loading delay
    setTimeout(async () => {
      // Check if username and password match
      if (username === validUsername && password === validPassword) {
        try {
          // Get JWT token (dummy login function used for now)
          const accessToken = await login(username, password);

          // Set logged-in state
          setLoggedIn(true);
          setIsLoggedIn(true);

          // Store tokens in localStorage
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', 'dummyRefreshToken');

          // Redirect to dashboard
          navigate('/dashboard');
        } catch (error) {
          setError('Invalid username or password');
        }
      } else {
        setError('Invalid username or password');
      }
      setLoading(false);
    }, 1000);
  };

  // Handle Logout
  const handleLogout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Update state and redirect to login
    setLoggedIn(false);
    setIsLoggedIn(false);
    navigate('/login');
  };

  // Handle navigate to dashboard
  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {!isLoggedIn ? (
          <>
            <div className="login-header">
              <div className="login-icon">🔐</div>
              <h1 className="login-title">Welcome Back</h1>
              <p className="login-subtitle">
                Please sign in to access your Quality Monitoring System dashboard
              </p>
            </div>

            <div className="login-help">
              <p className="demo-credentials">
                <strong>Demo Credentials:</strong><br />
                Username: Prajwalp11<br />
                Password: Prajwal@123
              </p>
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label" htmlFor="username">Username</label>
                <div className="input-container">
                  <span className="input-icon">👤</span>
                  <input
                    id="username"
                    type="text"
                    className="form-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <div className="input-container">
                  <span className="input-icon">🔒</span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className={`login-button ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <div className="loading-content">
                    <div className="spinner"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="logged-in-content">
            <div className="login-header">
              <div className="login-icon">✅</div>
              <h1 className="login-title">Welcome Back!</h1>
              <p className="login-subtitle">You are successfully logged in</p>
            </div>

            <div className="success-message">
              <span className="success-icon">🎉</span>
              Login successful! Ready to access your dashboard.
            </div>

            <div className="dashboard-info">
              <h3>Dashboard Features Available:</h3>
              <ul className="features-list">
                <li>📊 Real-time quality monitoring</li>
                <li>📋 Medicine inventory management</li>
                <li>📈 Quality reports and analytics</li>
                <li>🔍 Advanced search functionality</li>
                <li>⚙️ System settings and configuration</li>
              </ul>
            </div>

            <div className="action-buttons">
              <button className="dashboard-button" onClick={handleGoToDashboard}>
                Go to Dashboard
              </button>
              <button className="dashboard-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;