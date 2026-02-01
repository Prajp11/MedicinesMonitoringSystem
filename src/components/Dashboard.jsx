import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Analyze from '../Images/DashboardImages/Analyze.jpg';
import Assessment from '../Images/DashboardImages/Assessment.jpg';
import Digital from '../Images/DashboardImages/digital.jpg';
import Statuscheck from '../Images/DashboardImages/Statuscheck.jpg';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    approved: 0,
    rejected: 0,
    pending: 0
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Simulated stats - replace with actual API call
    setStats({
      totalItems: 3247,
      approved: 2891,
      rejected: 356,
      pending: 12
    });
  }, []);

  const projectData = [
    {
      id: 1,
      title: 'Analysis Module',
      image: Analyze,
      description: 'Precise evaluation of medicine and consumable quality using advanced automated algorithms to detect anomalies.',
      icon: '📊',
      color: '#667eea',
      link: '/items'
    },
    {
      id: 2,
      title: 'Assessment Module',
      image: Assessment,
      description: 'Ensures all supplies meet compliance standards. Automates testing protocols and reduces human error.',
      icon: '✓',
      color: '#764ba2',
      link: '/items'
    },
    {
      id: 3,
      title: 'Digital Monitoring',
      image: Digital,
      description: 'Real-time monitoring system with continuous supervision, instant updates and compliance notifications.',
      icon: '📡',
      color: '#f093fb',
      link: '/items'
    },
    {
      id: 4,
      title: 'Status Check',
      image: Statuscheck,
      description: 'Detailed breakdown of approved and rejected supplies with clear insights for decision-making.',
      icon: '🔍',
      color: '#4facfe',
      link: '/items'
    },
  ];

  const quickActions = [
    { name: 'Add Medicine', icon: '➕', link: '/items', color: '#27ae60' },
    { name: 'Update Record', icon: '✏️', link: '/update-medicine', color: '#f39c12' },
    { name: 'Delete Item', icon: '🗑️', link: '/delete-medicine', color: '#e74c3c' },
    { name: 'Quality Dashboard', icon: '📊', link: '/quality-scores', color: '#8b5cf6' },
    { name: 'Acceptance Stats', icon: '📦', link: '/acceptance-stats', color: '#10b981' },
    { name: 'Environmental Alerts', icon: '🚨', link: '/environmental-alerts', color: '#ef4444' },
    { name: 'Expiry Management', icon: '📅', link: '/expiry-status', color: '#f59e0b' },
    { name: 'Performance Analytics', icon: '📊', link: '/performance-analytics', color: '#3b82f6' },
  ];

  return (
    <div className="modern-dashboard">
      {/* Hero Header */}
      <div className="dashboard-hero">
        <div className="dashboard-hero-content">
          <div className="welcome-section">
            <h1 className="dashboard-main-title">
              Welcome back{user?.first_name ? `, ${user.first_name}` : ''}! 👋
            </h1>
            <p className="dashboard-tagline">
              Quality Testing & Monitoring Dashboard
            </p>
          </div>
          <div className="user-badge">
            <div className="user-avatar">{user?.first_name?.charAt(0) || 'U'}</div>
            <div className="user-info">
              <div className="user-name">{user?.username || 'User'}</div>
              <div className="user-role">{user?.profile?.role || 'Inspector'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon">📦</div>
          <div className="stat-details">
            <div className="stat-value">{stats.totalItems.toLocaleString()}</div>
            <div className="stat-label">Total Items</div>
          </div>
          <div className="stat-trend">+12% this month</div>
        </div>

        <div className="stat-card stat-approved">
          <div className="stat-icon">✅</div>
          <div className="stat-details">
            <div className="stat-value">{stats.approved.toLocaleString()}</div>
            <div className="stat-label">Approved</div>
          </div>
          <div className="stat-trend">89% success rate</div>
        </div>

        <div className="stat-card stat-rejected">
          <div className="stat-icon">❌</div>
          <div className="stat-details">
            <div className="stat-value">{stats.rejected.toLocaleString()}</div>
            <div className="stat-label">Rejected</div>
          </div>
          <div className="stat-trend">-3% from last month</div>
        </div>

        <div className="stat-card stat-pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-details">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending Review</div>
          </div>
          <div className="stat-trend">Requires attention</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-heading">Quick Actions</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <Link 
              key={index} 
              to={action.link} 
              className="quick-action-card"
              style={{ '--action-color': action.color }}
            >
              <div className="action-icon">{action.icon}</div>
              <div className="action-name">{action.name}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Modules Section */}
      <div className="modules-section">
        <div className="section-header-dash">
          <h2 className="section-heading">System Modules</h2>
          <p className="section-desc">
            Comprehensive suite of modules for automated quality monitoring
          </p>
        </div>

        <div className="modules-grid">
          {projectData.map((module, index) => (
            <div 
              key={module.id} 
              className="module-card"
              data-index={index}
            >
              <div className="module-header" style={{ background: `linear-gradient(135deg, ${module.color}, ${module.color}dd)` }}>
                <div className="module-icon-large">{module.icon}</div>
                <div className="module-img-wrapper">
                  <img src={module.image} alt={module.title} className="module-image" />
                  <div className="module-overlay"></div>
                </div>
              </div>
              <div className="module-body">
                <h3 className="module-title">{module.title}</h3>
                <p className="module-description">{module.description}</p>
                <Link to={module.link} className="module-link">
                  Explore Module <span className="arrow">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="system-status">
        <div className="status-header">
          <h3>System Status</h3>
          <span className="status-indicator online">● Online</span>
        </div>
        <div className="status-items">
          <div className="status-item">
            <span className="status-name">Database Connection</span>
            <span className="status-value success">Connected</span>
          </div>
          <div className="status-item">
            <span className="status-name">API Services</span>
            <span className="status-value success">Running</span>
          </div>
          <div className="status-item">
            <span className="status-name">Last Sync</span>
            <span className="status-value">Just now</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
