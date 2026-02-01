import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PerformanceAnalytics = () => {
  const [inspectorStats, setInspectorStats] = useState([]);
  const [supplierStats, setSupplierStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('inspectors'); // 'inspectors' or 'suppliers'

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch inspector stats
      const inspectorResponse = await fetch('http://localhost:8000/api/inspector-stats/');
      if (!inspectorResponse.ok) throw new Error('Failed to fetch inspector statistics');
      const inspectorData = await inspectorResponse.json();
      console.log('Inspector stats:', inspectorData);
      setInspectorStats(inspectorData.inspectors || []);

      // Fetch supplier stats
      const supplierResponse = await fetch('http://localhost:8000/api/supplier-stats/');
      if (!supplierResponse.ok) throw new Error('Failed to fetch supplier statistics');
      const supplierData = await supplierResponse.json();
      console.log('Supplier stats:', supplierData);
      setSupplierStats(supplierData.suppliers || []);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching performance data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const getTrendIcon = (trend) => {
    const icons = {
      up: '📈',
      down: '📉',
      stable: '➡️',
      new: '🆕'
    };
    return icons[trend] || '➡️';
  };

  const getTrendClass = (trend) => {
    const classes = {
      up: 'trend-up',
      down: 'trend-down',
      stable: 'trend-stable',
      new: 'trend-new'
    };
    return classes[trend] || 'trend-stable';
  };

  const getGradeColor = (grade) => {
    const colors = {
      A: '#10b981',
      B: '#3b82f6',
      C: '#f59e0b',
      D: '#f97316',
      F: '#ef4444'
    };
    return colors[grade] || '#6b7280';
  };

  if (error) {
    return (
      <div className="performance-analytics">
        <div className="analytics-header">
          <h1>📊 Performance Analytics</h1>
          <Link to="/dashboard" className="back-button">← Back to Dashboard</Link>
        </div>
        <div className="error-message">
          <p>⚠️ {error}</p>
          <button onClick={fetchPerformanceData} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="performance-analytics">
      <div className="analytics-header">
        <div className="header-content">
          <h1>📊 Performance Analytics Dashboard</h1>
          <p className="header-subtitle">Track inspector and supplier performance with real-time analytics</p>
        </div>
        <Link to="/dashboard" className="back-button">← Back to Dashboard</Link>
      </div>

      {/* Tab Switcher */}
      <div className="analytics-tabs">
        <button
          className={`tab-button ${activeTab === 'inspectors' ? 'active' : ''}`}
          onClick={() => setActiveTab('inspectors')}
        >
          <span className="tab-icon">👨‍⚕️</span>
          <span className="tab-label">Inspector Performance ({inspectorStats.length})</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'suppliers' ? 'active' : ''}`}
          onClick={() => setActiveTab('suppliers')}
        >
          <span className="tab-icon">🏢</span>
          <span className="tab-label">Supplier Performance ({supplierStats.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading performance data...</p>
        </div>
      ) : (
        <>
          {/* Inspector Performance Section */}
          {activeTab === 'inspectors' && (
            <div className="inspectors-section">
              <div className="section-header">
                <h2>👨‍⚕️ Inspector Performance</h2>
                <p className="section-description">
                  Track individual inspector performance, quality scores, and trends over time
                </p>
              </div>

              {inspectorStats.length === 0 ? (
                <div className="no-data-message">
                  <span className="no-data-icon">📭</span>
                  <h3>No Inspector Data Available</h3>
                  <p>No inspector statistics found in the system.</p>
                </div>
              ) : (
                <div className="performance-cards-grid">
                  {inspectorStats.map((inspector, index) => (
                    <div key={index} className="performance-card inspector-card">
                      <div className="card-header">
                        <div className="inspector-info">
                          <div className="inspector-avatar">
                            {inspector.inspector_name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="inspector-details">
                            <h3>{inspector.inspector_name}</h3>
                            <p className="inspector-meta">
                              {inspector.total_inspections} inspections
                            </p>
                          </div>
                        </div>
                        <button className="view-details-btn" title="View Details">
                          📊
                        </button>
                        <div className={`trend-indicator ${getTrendClass(inspector.trend)}`}>
                          <span className="trend-icon">{getTrendIcon(inspector.trend)}</span>
                          {inspector.trend !== 'new' && (
                            <span className="trend-percentage">
                              {inspector.trend_percentage > 0 ? '+' : ''}
                              {inspector.trend_percentage?.toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="card-stats">
                        <div className="stat-item primary-stat">
                          <span className="stat-label">Overall Quality Score</span>
                          <span className="stat-value large">
                            {inspector.average_quality_score?.toFixed(1)}
                          </span>
                        </div>

                        <div className="stat-row">
                          <div className="stat-item">
                            <span className="stat-label">Current Month</span>
                            <span className="stat-value">
                              {inspector.current_month?.average_score?.toFixed(1)}
                            </span>
                            <span className="stat-detail">
                              {inspector.current_month?.inspections} inspections
                            </span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Previous Month</span>
                            <span className="stat-value">
                              {inspector.previous_month?.average_score?.toFixed(1)}
                            </span>
                            <span className="stat-detail">
                              {inspector.previous_month?.inspections} inspections
                            </span>
                          </div>
                        </div>

                        <div className="stat-item acceptance-stat">
                          <span className="stat-label">Acceptance Rate</span>
                          <div className="acceptance-bar">
                            <div 
                              className="acceptance-progress" 
                              style={{ width: `${inspector.acceptance_rate}%` }}
                            >
                              <span className="acceptance-text">{inspector.acceptance_rate?.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grade-distribution">
                        <h4>Grade Distribution</h4>
                        <div className="grades-chart">
                          {Object.entries(inspector.grade_distribution || {}).map(([grade, count]) => (
                            <div key={grade} className="grade-bar-item">
                              <div className="grade-label-row">
                                <span className="grade-label">{grade}</span>
                                <span className="grade-count">{count}</span>
                              </div>
                              <div className="grade-bar">
                                <div 
                                  className="grade-progress" 
                                  style={{ 
                                    width: `${(count / inspector.total_inspections) * 100}%`,
                                    backgroundColor: getGradeColor(grade)
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Supplier Performance Section */}
          {activeTab === 'suppliers' && (
            <div className="suppliers-section">
              <div className="section-header">
                <h2>🏢 Supplier Performance</h2>
                <p className="section-description">
                  Monitor supplier quality, compliance, and batch status across all suppliers
                </p>
              </div>

              {supplierStats.length === 0 ? (
                <div className="no-data-message">
                  <span className="no-data-icon">📭</span>
                  <h3>No Supplier Data Available</h3>
                  <p>No supplier statistics found in the system.</p>
                </div>
              ) : (
                <div className="performance-cards-grid">
                  {supplierStats.map((supplier, index) => (
                    <div key={index} className="performance-card supplier-card">
                      <div className="card-header">
                        <div className="supplier-info">
                          <div className="supplier-icon">🏢</div>
                          <div className="supplier-details">
                            <h3>{supplier.supplier_name}</h3>
                            <p className="supplier-meta">
                              {supplier.total_batches} batches supplied
                            </p>
                          </div>
                        </div>
                        <div className={`trend-indicator ${getTrendClass(supplier.trend)}`}>
                          <span className="trend-icon">{getTrendIcon(supplier.trend)}</span>
                          {supplier.trend !== 'new' && (
                            <span className="trend-percentage">
                              {supplier.trend_percentage > 0 ? '+' : ''}
                              {supplier.trend_percentage?.toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="card-stats">
                        <div className="stat-item primary-stat">
                          <span className="stat-label">Overall Quality Score</span>
                          <span className="stat-value large">
                            {supplier.average_quality_score?.toFixed(1)}
                          </span>
                        </div>

                        <div className="stat-row">
                          <div className="stat-item">
                            <span className="stat-label">Current Month</span>
                            <span className="stat-value">
                              {supplier.current_month?.average_score?.toFixed(1)}
                            </span>
                            <span className="stat-detail">
                              {supplier.current_month?.batches} batches
                            </span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Previous Month</span>
                            <span className="stat-value">
                              {supplier.previous_month?.average_score?.toFixed(1)}
                            </span>
                            <span className="stat-detail">
                              {supplier.previous_month?.batches} batches
                            </span>
                          </div>
                        </div>

                        <div className="stat-row">
                          <div className="stat-item">
                            <span className="stat-label">Acceptance Rate</span>
                            <div className="mini-progress">
                              <div 
                                className="mini-bar acceptance" 
                                style={{ width: `${supplier.acceptance_rate}%` }}
                              ></div>
                            </div>
                            <span className="stat-value small">{supplier.acceptance_rate?.toFixed(1)}%</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Environmental Compliance</span>
                            <div className="mini-progress">
                              <div 
                                className="mini-bar compliance" 
                                style={{ width: `${supplier.environmental_compliance}%` }}
                              ></div>
                            </div>
                            <span className="stat-value small">{supplier.environmental_compliance?.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="batch-status">
                        <h4>Batch Status Breakdown</h4>
                        <div className="status-grid">
                          <div className="status-item active">
                            <span className="status-icon">✅</span>
                            <span className="status-count">{supplier.active_batches}</span>
                            <span className="status-label">Active</span>
                          </div>
                          <div className="status-item expired">
                            <span className="status-icon">❌</span>
                            <span className="status-count">{supplier.expired_batches}</span>
                            <span className="status-label">Expired</span>
                          </div>
                          <div className="status-item quarantine">
                            <span className="status-icon">⚠️</span>
                            <span className="status-count">{supplier.quarantined_batches}</span>
                            <span className="status-label">Quarantine</span>
                          </div>
                        </div>
                      </div>

                      <div className="grade-distribution">
                        <h4>Grade Distribution</h4>
                        <div className="grades-chart">
                          {Object.entries(supplier.grade_distribution || {}).map(([grade, count]) => (
                            <div key={grade} className="grade-bar-item">
                              <div className="grade-label-row">
                                <span className="grade-label">{grade}</span>
                                <span className="grade-count">{count}</span>
                              </div>
                              <div className="grade-bar">
                                <div 
                                  className="grade-progress" 
                                  style={{ 
                                    width: `${(count / supplier.total_batches) * 100}%`,
                                    backgroundColor: getGradeColor(grade)
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PerformanceAnalytics;
