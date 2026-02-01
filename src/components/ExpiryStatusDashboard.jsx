import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const ExpiryStatusDashboard = () => {
  const [statusStats, setStatusStats] = useState(null);
  const [expiryStats, setExpiryStats] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStatusStatistics = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/status/statistics/');
      if (!response.ok) throw new Error('Failed to fetch status statistics');
      const data = await response.json();
      console.log('Status statistics:', data);
      setStatusStats(data);
    } catch (err) {
      console.error('Error fetching status stats:', err);
    }
  };

  const fetchExpiryStatistics = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/items/expiry_stats/');
      if (!response.ok) throw new Error('Failed to fetch expiry statistics');
      const data = await response.json();
      console.log('Expiry statistics:', data);
      setExpiryStats(data);
    } catch (err) {
      console.error('Error fetching expiry stats:', err);
    }
  };

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:8000/api/items/';
      const params = new URLSearchParams();
      
      if (statusFilter) params.append('status', statusFilter);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      console.log('Fetching items from:', url);

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch items');
      
      const data = await response.json();
      console.log('Items data:', data);
      setItems(data.results || data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchStatusStatistics();
    fetchExpiryStatistics();
    fetchItems();
  }, [fetchItems]);

  const handleApplyFilter = () => {
    fetchItems();
  };

  const handleResetFilter = () => {
    setStatusFilter('');
    setSearchTerm('');
  };

  const getStatusClass = (status) => {
    const classes = {
      active: 'status-active',
      expired: 'status-expired',
      quarantine: 'status-quarantine'
    };
    return classes[status] || 'status-unknown';
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: '✅',
      expired: '❌',
      quarantine: '⚠️'
    };
    return icons[status] || '❓';
  };

  const getExpiryStatusClass = (expiryStatus) => {
    const classes = {
      safe: 'expiry-safe',
      warning: 'expiry-warning',
      critical: 'expiry-critical',
      expired: 'expiry-expired'
    };
    return classes[expiryStatus] || 'expiry-unknown';
  };

  const getExpiryStatusText = (daysUntilExpiry, isExpired) => {
    if (isExpired) return `Expired ${Math.abs(daysUntilExpiry)} days ago`;
    if (daysUntilExpiry <= 7) return `Expires in ${daysUntilExpiry} days - CRITICAL`;
    if (daysUntilExpiry <= 30) return `Expires in ${daysUntilExpiry} days - Warning`;
    if (daysUntilExpiry <= 90) return `Expires in ${daysUntilExpiry} days`;
    return `${daysUntilExpiry} days remaining`;
  };

  const filteredItems = items.filter(item => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        item.name?.toLowerCase().includes(search) ||
        item.batch_number?.toLowerCase().includes(search) ||
        item.manufacturer?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  if (error && !statusStats) {
    return (
      <div className="expiry-status-dashboard">
        <div className="dashboard-header">
          <h1>📅 Expiry & Status Management</h1>
          <Link to="/dashboard" className="back-button">← Back to Dashboard</Link>
        </div>
        <div className="error-message">
          <p>⚠️ {error}</p>
          <button onClick={() => { fetchStatusStatistics(); fetchExpiryStatistics(); fetchItems(); }} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="expiry-status-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>📅 Expiry & Status Management Dashboard</h1>
          <p className="header-subtitle">Real-time tracking of medicine status, expiry dates, and auto-alerts</p>
        </div>
        <Link to="/dashboard" className="back-button">← Back to Dashboard</Link>
      </div>

      {/* Status Statistics Cards */}
      {statusStats && (
        <div className="status-stats-grid">
          <div className="status-stat-card total-items">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Total Medicines</h3>
              <p className="stat-number">{statusStats.total_items?.toLocaleString() || 0}</p>
              <p className="stat-detail">All tracked items</p>
            </div>
          </div>

          <div className="status-stat-card active-items">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Active (Safe to Use)</h3>
              <p className="stat-number">{statusStats.active?.count?.toLocaleString() || 0}</p>
              <p className="stat-detail">{statusStats.active?.percentage?.toFixed(1)}% of total</p>
            </div>
          </div>

          <div className="status-stat-card expired-items">
            <div className="stat-icon">❌</div>
            <div className="stat-content">
              <h3>Expired</h3>
              <p className="stat-number">{statusStats.expired?.count?.toLocaleString() || 0}</p>
              <p className="stat-detail">{statusStats.expired?.percentage?.toFixed(1)}% of total</p>
            </div>
          </div>

          <div className="status-stat-card quarantine-items">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <h3>Quarantine</h3>
              <p className="stat-number">{statusStats.quarantine?.count?.toLocaleString() || 0}</p>
              <p className="stat-detail">{statusStats.quarantine?.percentage?.toFixed(1)}% of total</p>
            </div>
          </div>
        </div>
      )}

      {/* Status Logic Explanation */}
      <div className="status-logic-section">
        <h2>🎯 Auto-Status Update Logic</h2>
        <div className="logic-cards-grid">
          <div className="logic-card expired-logic">
            <div className="logic-header">
              <span className="logic-icon">❌</span>
              <h3>EXPIRED</h3>
            </div>
            <p className="logic-condition">Condition: <strong>Expiry Date &lt; Today</strong></p>
            <p className="logic-description">Items that have passed their expiry date are automatically marked as expired.</p>
          </div>

          <div className="logic-card quarantine-logic">
            <div className="logic-header">
              <span className="logic-icon">⚠️</span>
              <h3>QUARANTINE</h3>
            </div>
            <p className="logic-condition">Conditions (ANY):</p>
            <ul className="logic-list">
              <li>Quality Score &lt; 60</li>
              <li>Has Critical Alerts</li>
              <li>Contamination &gt; 1 ppm</li>
            </ul>
            <p className="logic-description">Items with quality issues are automatically quarantined.</p>
          </div>

          <div className="logic-card active-logic">
            <div className="logic-header">
              <span className="logic-icon">✅</span>
              <h3>ACTIVE</h3>
            </div>
            <p className="logic-condition">Condition: <strong>All Other Cases</strong></p>
            <p className="logic-description">Safe to use - no quality issues, not expired, meets all standards.</p>
          </div>
        </div>
      </div>

      {/* Expiry Statistics */}
      {expiryStats && (
        <div className="expiry-stats-section">
          <h2>⏰ Expiry Timeline Overview</h2>
          <div className="expiry-timeline-grid">
            {expiryStats.expired_count > 0 && (
              <div className="timeline-card expired-timeline">
                <div className="timeline-icon">❌</div>
                <div className="timeline-content">
                  <h3>Already Expired</h3>
                  <p className="timeline-number">{expiryStats.expired_count}</p>
                  <p className="timeline-detail">Items past expiry date</p>
                </div>
              </div>
            )}
            {expiryStats.expiring_in_7_days > 0 && (
              <div className="timeline-card critical-timeline">
                <div className="timeline-icon">🔴</div>
                <div className="timeline-content">
                  <h3>Critical (≤7 Days)</h3>
                  <p className="timeline-number">{expiryStats.expiring_in_7_days}</p>
                  <p className="timeline-detail">Immediate attention needed</p>
                </div>
              </div>
            )}
            {expiryStats.expiring_in_30_days > 0 && (
              <div className="timeline-card warning-timeline">
                <div className="timeline-icon">🟡</div>
                <div className="timeline-content">
                  <h3>Warning (8-30 Days)</h3>
                  <p className="timeline-number">{expiryStats.expiring_in_30_days}</p>
                  <p className="timeline-detail">Plan for replacement</p>
                </div>
              </div>
            )}
            {expiryStats.expiring_in_90_days > 0 && (
              <div className="timeline-card watch-timeline">
                <div className="timeline-icon">🔵</div>
                <div className="timeline-content">
                  <h3>Watch (31-90 Days)</h3>
                  <p className="timeline-number">{expiryStats.expiring_in_90_days}</p>
                  <p className="timeline-detail">Monitor closely</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="items-filter-section">
        <h2>🔍 Filter Medicines</h2>
        <div className="filter-controls-grid">
          <div className="filter-group">
            <label>Status</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Statuses</option>
              <option value="active">Active (Safe to Use)</option>
              <option value="expired">Expired</option>
              <option value="quarantine">Quarantine</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Name, Batch, or Manufacturer..."
              className="filter-input"
            />
          </div>

          <div className="filter-actions">
            <button onClick={handleApplyFilter} className="filter-apply-btn">
              Apply Filter
            </button>
            <button onClick={handleResetFilter} className="filter-reset-btn">
              Reset
            </button>
          </div>
        </div>
        {(statusFilter || searchTerm) && (
          <div className="active-filters-info">
            <span>Active Filters:</span>
            {statusFilter && <span className="filter-tag">Status: {statusFilter}</span>}
            {searchTerm && <span className="filter-tag">Search: {searchTerm}</span>}
          </div>
        )}
      </div>

      {/* Items List */}
      <div className="items-list-section">
        <h2>📦 Medicine Inventory ({filteredItems.length})</h2>
        
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading inventory data...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="no-items-message">
            <span className="no-items-icon">📭</span>
            <h3>No Items Found</h3>
            <p>No medicines match your current filter criteria.</p>
          </div>
        ) : (
          <div className="items-table-container">
            <table className="items-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Batch Number</th>
                  <th>Status</th>
                  <th>Expiry Date</th>
                  <th>Days Until Expiry</th>
                  <th>Quality</th>
                  <th>Alerts</th>
                  <th>Manufacturer</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className={`item-row ${getStatusClass(item.status)}`}>
                    <td className="item-name">{item.name}</td>
                    <td className="batch-number">{item.batch_number}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(item.status)}`}>
                        {getStatusIcon(item.status)} {item.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="expiry-date">
                      {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <span className={`expiry-countdown ${getExpiryStatusClass(item.expiry_status)}`}>
                        {item.days_until_expiry !== null && item.days_until_expiry !== undefined 
                          ? getExpiryStatusText(item.days_until_expiry, item.is_expired)
                          : 'N/A'}
                      </span>
                    </td>
                    <td>
                      <div className="quality-info">
                        <span className={`quality-score score-${item.quality_grade?.toLowerCase()}`}>
                          {item.quality_score?.toFixed(1)}
                        </span>
                        <span className={`quality-grade grade-${item.quality_grade?.toLowerCase()}`}>
                          {item.quality_grade}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="alerts-info">
                        {item.alert_count > 0 ? (
                          <>
                            <span className="alert-count">{item.alert_count} total</span>
                            {item.critical_alert_count > 0 && (
                              <span className="critical-alert-count">
                                {item.critical_alert_count} critical
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="no-alerts">No alerts</span>
                        )}
                      </div>
                    </td>
                    <td className="manufacturer">{item.manufacturer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpiryStatusDashboard;
