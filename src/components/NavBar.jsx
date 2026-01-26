import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const NavBar = ({ setLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, [location]); // Re-check on route change

  // Handle Logout
  const handleLogout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Update logged-in state and redirect to login
    setLoggedIn(false);
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  // Handle Login Navigation
  const handleLogin = () => {
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking on a link
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="nav-bar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-link" onClick={closeMobileMenu}>
            <div className="brand-logo-wrapper">
              <div className="brand-icon">🏥</div>
              <div className="brand-pulse"></div>
            </div>
            <div className="brand-text-container">
              <span className="brand-text">Quality Monitor</span>
              <span className="brand-tagline">Healthcare Excellence</span>
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={closeMobileMenu}>
                <span className="nav-icon">🏠</span>
                Home
              </Link>
            </li>
            
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link" onClick={closeMobileMenu}>
                    <span className="nav-icon">📊</span>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/items" className="nav-link" onClick={closeMobileMenu}>
                    <span className="nav-icon">📋</span>
                    Items
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/delete-medicine" className="nav-link" onClick={closeMobileMenu}>
                    <span className="nav-icon">🗑️</span>
                    Delete Medicine
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/update-medicine" className="nav-link" onClick={closeMobileMenu}>
                    <span className="nav-icon">✏️</span>
                    Update Medicine
                  </Link>
                </li>
              </>
            ) : null}
            
            <li className="nav-item">
              <Link to="/about" className="nav-link" onClick={closeMobileMenu}>
                <span className="nav-icon">ℹ️</span>
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link" onClick={closeMobileMenu}>
                <span className="nav-icon">📞</span>
                Contact Us
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/chatbot" className="nav-link" onClick={closeMobileMenu}>
                <span className="nav-icon">🤖</span>
                Chatbot
              </Link>
            </li>
            
            <li className="nav-item auth-item">
              {isLoggedIn ? (
                <button 
                  onClick={handleLogout} 
                  className="nav-link logout-btn"
                >
                  <span className="nav-icon">🚪</span>
                  Logout
                </button>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="nav-link login-btn enhanced-login"
                >
                  <span className="nav-icon">🔐</span>
                  Login
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;