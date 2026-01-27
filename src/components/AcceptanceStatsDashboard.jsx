import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const AcceptanceStatsDashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchAcceptanceStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setError('Authentication required. Please login.');
        setLoading(false);
        return;
      }

      let url = 'http://localhost:8000/api/acceptance-stats/';
      const params = new URLSearchParams();
      
      if (dateFrom) params.append('date_from', dateFrom);
      if (dateTo) params.append('date_to', dateTo);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      console.log('Fetching acceptance stats from:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch acceptance stats: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Acceptance stats data:', data);
      setStatsData(data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    fetchAcceptanceStats();
  }, [fetchAcceptanceStats]); // Initial load

  const handleApplyFilter = () => {
    fetchAcceptanceStats();
  };

  const handleResetFilter = () => {
    setDateFrom('');
    setDateTo('');
    // Reset and fetch all data
    setTimeout(() => {
      fetchAcceptanceStats();
    }, 100);
  };

  if (loading) {
    return (
      <div className="acceptance-stats-dashboard">
        <div className="dashboard-header">
          <h1>📦 Batch Acceptance Dashboard</h1>
          <Link to="/dashboard" className="back-button">← Back to Dashboard</Link>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading acceptance statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="acceptance-stats-dashboard">
        <div className="dashboard-header">
          <h1>📦 Batch Acceptance Dashboard</h1>
          <Link to="/dashboard" className="back-button">← Back to Dashboard</Link>
        </div>
        <div className="error-message">
          <p>⚠️ {error}</p>
          <button onClick={fetchAcceptanceStats} className="retry-button">Retry</button>
        </div>
      </div>
    );
  }

  if (!statsData) {
    return (
      <div className="acceptance-stats-dashboard">
        <div className="dashboard-header">
          <h1>📦 Batch Acceptance Dashboard</h1>
          <Link to="/dashboard" className="back-button">← Back to Dashboard</Link>
        </div>
        <p>No data available</p>
      </div>
    );
  }

  const { overview, rejection_reasons, supplier_stats, date_range } = statsData;

  return (
    <div className="acceptance-stats-dashboard">
      <div className="dashboard-header">
        <h1>📦 Batch Acceptance Dashboard</h1>
        <Link to="/dashboard" className="back-button">← Back to Dashboard</Link>
      </div>

      {/* Date Range Filter */}
      <div className="date-filter-section">
        <div className="filter-controls">
          <div className="date-input-group">
            <label>From:</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="date-input"
            />
          </div>
          <div className="date-input-group">
            <label>To:</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="date-input"
            />
          </div>
          <button onClick={handleApplyFilter} className="filter-apply-btn">
            Apply Filter
          </button>
          <button onClick={handleResetFilter} className="filter-reset-btn">
            Reset
          </button>
        </div>
        {date_range && (date_range.from || date_range.to) && (
          <div className="active-filter-info">
            <span>📅 Filtered Period: {date_range.from || 'Beginning'} to {date_range.to || 'Present'}</span>
          </div>
        )}
      </div>

      {/* Main Stats Cards */}
      <div className="stats-cards-grid">
        <div className="stat-card total-batches">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Batches</h3>
            <p className="stat-number">{overview.total_batches}</p>
          </div>
        </div>

        <div className="stat-card accepted-batches">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Accepted Batches</h3>
            <p className="stat-number">{overview.accepted_batches}</p>
            <p className="stat-percentage">{overview.acceptance_rate.toFixed(1)}%</p>
          </div>
        </div>

        <div className="stat-card rejected-batches">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>Rejected Batches</h3>
            <p className="stat-number">{overview.rejected_batches}</p>
            <p className="stat-percentage">{overview.rejection_rate.toFixed(1)}%</p>
          </div>
        </div>

        <div className="stat-card acceptance-rate">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Acceptance Rate</h3>
            <div className="rate-visual">
              <div 
                className="rate-bar" 
                style={{ width: `${overview.acceptance_rate}%` }}
              >
                <span className="rate-text">{overview.acceptance_rate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout for Rejection Reasons and Supplier Stats */}
      <div className="detailed-stats-section">
        {/* Rejection Reasons */}
        <div className="rejection-reasons-card">
          <h2>🔴 Top Rejection Reasons</h2>
          {rejection_reasons && rejection_reasons.length > 0 ? (
            <div className="rejection-reasons-list">
              {rejection_reasons.map((reason, index) => (
                <div key={index} className="rejection-reason-item">
                  <div className="reason-header">
                    <span className="reason-rank">#{index + 1}</span>
                    <span className="reason-name">{reason.reason}</span>
                    <span className="reason-count">{reason.count} batches</span>
                  </div>
                  <div className="reason-bar-container">
                    <div 
                      className="reason-bar" 
                      style={{ width: `${reason.percentage}%` }}
                    >
                      <span className="reason-percentage">{reason.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data-message">🎉 No rejections in this period!</p>
          )}
        </div>

        {/* Supplier Performance */}
        <div className="supplier-performance-card">
          <h2>🏢 Supplier Performance</h2>
          {supplier_stats && supplier_stats.length > 0 ? (
            <div className="supplier-table-container">
              <table className="supplier-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Supplier</th>
                    <th>Total</th>
                    <th>Accepted</th>
                    <th>Rejected</th>
                    <th>Acceptance Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {supplier_stats.map((supplier, index) => (
                    <tr key={index} className={index < 3 ? 'top-performer' : ''}>
                      <td>
                        <span className="rank-badge">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                        </span>
                      </td>
                      <td className="supplier-name">{supplier.supplier}</td>
                      <td>{supplier.total_batches}</td>
                      <td className="accepted-cell">{supplier.accepted}</td>
                      <td className="rejected-cell">{supplier.rejected}</td>
                      <td>
                        <div className="acceptance-rate-cell">
                          <div 
                            className={`rate-badge ${
                              supplier.acceptance_rate >= 95 ? 'excellent' :
                              supplier.acceptance_rate >= 85 ? 'good' :
                              supplier.acceptance_rate >= 70 ? 'average' : 'poor'
                            }`}
                          >
                            {supplier.acceptance_rate.toFixed(1)}%
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-data-message">No supplier data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcceptanceStatsDashboard;
