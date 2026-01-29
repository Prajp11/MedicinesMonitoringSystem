import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const EnvironmentalAlerts = () => {
  const [alertStats, setAlertStats] = useState(null);
  const [alertItems, setAlertItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [severityFilter, setSeverityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [limitFilter, setLimitFilter] = useState('');

  const fetchAlertStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/alerts/count/');
      if (!response.ok) throw new Error('Failed to fetch alert statistics');
      const data = await response.json();
      setAlertStats(data);
    } catch (err) {
      console.error('Error fetching alert stats:', err);
    }
  };

  const fetchAlertItems = useCallback(async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:8000/api/alerts/list/';
      const params = new URLSearchParams();
      
      if (severityFilter) params.append('severity', severityFilter);
      if (typeFilter) params.append('type', typeFilter);
      if (limitFilter) params.append('limit', limitFilter);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      console.log('Fetching alerts from:', url);

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch alert items');
      
      const data = await response.json();
      console.log('Alert items data:', data);
      setAlertItems(data.items || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching alert items:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [severityFilter, typeFilter, limitFilter]);

  useEffect(() => {
    fetchAlertStats();
    fetchAlertItems();
  }, [fetchAlertItems]);

  const handleApplyFilter = () => {
    fetchAlertItems();
  };

  const handleResetFilter = () => {
    setSeverityFilter('');
    setTypeFilter('');
    setLimitFilter('');
  };

  const getSeverityClass = (severity) => {
    return severity === 'critical' ? 'severity-critical' : 'severity-warning';
  };

  const getAlertTypeIcon = (type) => {
    const icons = {
      temperature: '🌡️',
      humidity: '💧',
      contamination: '⚠️',
      purity: '✨',
      ph_level: '🧪'
    };
    return icons[type] || '📊';
  };

  const getAlertTypeColor = (type) => {
    const colors = {
      temperature: '#ef4444',
      humidity: '#3b82f6',
      contamination: '#f59e0b',
      purity: '#8b5cf6',
      ph_level: '#10b981'
    };
    return colors[type] || '#6b7280';
  };

  if (error && !alertStats) {
    return (
      <div className="environmental-alerts">
        <div className="alerts-header">
          <h1>🚨 Environmental Alert System</h1>
          <Link to="/dashboard" className="back-button">← Back to Dashboard</Link>
        </div>
        <div className="error-message">
          <p>⚠️ {error}</p>
          <button onClick={() => { fetchAlertStats(); fetchAlertItems(); }} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="environmental-alerts">
      <div className="alerts-header">
        <div className="header-content">
          <h1>🚨 Environmental Alert System</h1>
          <p className="header-subtitle">Real-time monitoring and alerts for environmental conditions</p>
        </div>
        <Link to="/dashboard" className="back-button">← Back to Dashboard</Link>
      </div>

      {/* Alert Statistics Cards */}
      {alertStats && (
        <div className="alert-stats-grid">
          <div className="alert-stat-card total-alerts">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Total Alerts</h3>
              <p className="stat-number">{alertStats.total_alerts?.toLocaleString() || 0}</p>
              <p className="stat-detail">
                {alertStats.items_with_alerts?.toLocaleString() || 0} / {alertStats.total_items?.toLocaleString() || 0} items affected
              </p>
            </div>
          </div>

          <div className="alert-stat-card critical-alerts">
            <div className="stat-icon">🔴</div>
            <div className="stat-content">
              <h3>Critical Alerts</h3>
              <p className="stat-number">{alertStats.critical_alerts?.toLocaleString() || 0}</p>
              <p className="stat-detail">
                {((alertStats.critical_alerts / alertStats.total_alerts) * 100).toFixed(1)}% of total
              </p>
            </div>
          </div>

          <div className="alert-stat-card warning-alerts">
            <div className="stat-icon">🟡</div>
            <div className="stat-content">
              <h3>Warning Alerts</h3>
              <p className="stat-number">{alertStats.warning_alerts?.toLocaleString() || 0}</p>
              <p className="stat-detail">
                {((alertStats.warning_alerts / alertStats.total_alerts) * 100).toFixed(1)}% of total
              </p>
            </div>
          </div>

          <div className="alert-stat-card alert-coverage">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3>Alert Coverage</h3>
              <p className="stat-number">
                {((alertStats.items_with_alerts / alertStats.total_items) * 100).toFixed(1)}%
              </p>
              <p className="stat-detail">Items being monitored</p>
            </div>
          </div>
        </div>
      )}

      {/* Alert Types Breakdown */}
      {alertStats?.alert_types && (
        <div className="alert-types-section">
          <h2>📋 Alert Types Breakdown</h2>
          <div className="alert-types-grid">
            {Object.entries(alertStats.alert_types).map(([type, count]) => (
              <div key={type} className="alert-type-card">
                <div className="alert-type-header">
                  <span className="alert-type-icon">{getAlertTypeIcon(type)}</span>
                  <span className="alert-type-name">{type.replace('_', ' ').toUpperCase()}</span>
                </div>
                <div className="alert-type-count" style={{ color: getAlertTypeColor(type) }}>
                  {count.toLocaleString()}
                </div>
                <div className="alert-type-bar">
                  <div 
                    className="alert-type-progress" 
                    style={{ 
                      width: `${(count / alertStats.total_alerts) * 100}%`,
                      backgroundColor: getAlertTypeColor(type)
                    }}
                  ></div>
                </div>
                <div className="alert-type-percentage">
                  {((count / alertStats.total_alerts) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="alerts-filter-section">
        <h2>🔍 Filter Alerts</h2>
        <div className="filter-controls-grid">
          <div className="filter-group">
            <label>Severity</label>
            <select 
              value={severityFilter} 
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Alert Type</label>
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Types</option>
              <option value="temperature">Temperature</option>
              <option value="humidity">Humidity</option>
              <option value="contamination">Contamination</option>
              <option value="purity">Purity</option>
              <option value="ph_level">pH Level</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Limit Results</label>
            <input
              type="number"
              value={limitFilter}
              onChange={(e) => setLimitFilter(e.target.value)}
              placeholder="No limit"
              className="filter-input"
              min="1"
            />
          </div>

          <div className="filter-actions">
            <button onClick={handleApplyFilter} className="filter-apply-btn">
              Apply Filters
            </button>
            <button onClick={handleResetFilter} className="filter-reset-btn">
              Reset
            </button>
          </div>
        </div>
        {(severityFilter || typeFilter || limitFilter) && (
          <div className="active-filters-info">
            <span>Active Filters:</span>
            {severityFilter && <span className="filter-tag">Severity: {severityFilter}</span>}
            {typeFilter && <span className="filter-tag">Type: {typeFilter}</span>}
            {limitFilter && <span className="filter-tag">Limit: {limitFilter}</span>}
          </div>
        )}
      </div>

      {/* Alert Items List */}
      <div className="alert-items-section">
        <h2>⚠️ Items with Alerts ({alertItems.length})</h2>
        
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading alert data...</p>
          </div>
        ) : alertItems.length === 0 ? (
          <div className="no-alerts-message">
            <span className="no-alerts-icon">✅</span>
            <h3>No Alerts Found</h3>
            <p>All items are within normal parameters or no items match your filter criteria.</p>
          </div>
        ) : (
          <div className="alert-items-grid">
            {alertItems.map((item) => (
              <div key={item.id} className="alert-item-card">
                <div className="alert-item-header">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p className="batch-number">Batch: {item.batch_number}</p>
                  </div>
                  <div className="alert-badges">
                    <span className="alert-count-badge">
                      {item.alert_count} {item.alert_count === 1 ? 'Alert' : 'Alerts'}
                    </span>
                    {item.critical_count > 0 && (
                      <span className="critical-badge">
                        {item.critical_count} Critical
                      </span>
                    )}
                  </div>
                </div>

                <div className="item-details">
                  <div className="detail-row">
                    <span className="detail-label">Manufacturer:</span>
                    <span className="detail-value">{item.manufacturer}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Supplier:</span>
                    <span className="detail-value">{item.supplier}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Category:</span>
                    <span className="detail-value">{item.category}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Quality Score:</span>
                    <span className={`quality-grade grade-${item.quality_grade?.toLowerCase()}`}>
                      {item.quality_score?.toFixed(1)} ({item.quality_grade})
                    </span>
                  </div>
                </div>

                <div className="environmental-readings">
                  <h4>📊 Current Readings</h4>
                  <div className="readings-grid">
                    <div className="reading-item">
                      <span className="reading-icon">🌡️</span>
                      <span className="reading-label">Temp:</span>
                      <span className="reading-value">{item.temperature}°C</span>
                    </div>
                    <div className="reading-item">
                      <span className="reading-icon">💧</span>
                      <span className="reading-label">Humidity:</span>
                      <span className="reading-value">{item.humidity}%</span>
                    </div>
                    <div className="reading-item">
                      <span className="reading-icon">⚠️</span>
                      <span className="reading-label">Contamination:</span>
                      <span className="reading-value">{item.contaminant_level}%</span>
                    </div>
                    <div className="reading-item">
                      <span className="reading-icon">✨</span>
                      <span className="reading-label">Purity:</span>
                      <span className="reading-value">{item.active_ingredient_purity}%</span>
                    </div>
                    <div className="reading-item">
                      <span className="reading-icon">🧪</span>
                      <span className="reading-label">pH:</span>
                      <span className="reading-value">{item.ph_level}</span>
                    </div>
                  </div>
                </div>

                <div className="alerts-list">
                  <h4>🚨 Active Alerts</h4>
                  {item.alerts.map((alert, index) => (
                    <div key={index} className={`alert-detail ${getSeverityClass(alert.severity)}`}>
                      <div className="alert-detail-header">
                        <span className="alert-type-badge" style={{ backgroundColor: getAlertTypeColor(alert.type) }}>
                          {getAlertTypeIcon(alert.type)} {alert.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`severity-badge ${getSeverityClass(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="alert-message">{alert.message}</p>
                      <div className="alert-meta">
                        <span className="alert-value">Value: {alert.value}</span>
                        <span className="alert-threshold">Threshold: {alert.threshold}</span>
                        <span className="alert-timestamp">
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnvironmentalAlerts;
