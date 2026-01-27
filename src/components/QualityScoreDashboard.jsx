import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const QualityScoreDashboard = () => {
    const [statistics, setStatistics] = useState(null);
    const [topPerformers, setTopPerformers] = useState([]);
    const [poorPerformers, setPoorPerformers] = useState([]);
    const [allMedicines, setAllMedicines] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview'); // overview, top, worst, all

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const token = localStorage.getItem('accessToken');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            // Fetch statistics
            const statsResponse = await fetch('http://localhost:8000/api/quality-scores/statistics/', { headers });
            if (!statsResponse.ok) throw new Error('Failed to fetch statistics');
            const statsData = await statsResponse.json();
            setStatistics(statsData);

            // Fetch top performers
            const topResponse = await fetch('http://localhost:8000/api/quality-scores/top/', { headers });
            if (!topResponse.ok) throw new Error('Failed to fetch top performers');
            const topData = await topResponse.json();
            setTopPerformers(topData.top_performers || []);

            // Fetch poor performers
            const worstResponse = await fetch('http://localhost:8000/api/quality-scores/worst/', { headers });
            if (!worstResponse.ok) throw new Error('Failed to fetch poor performers');
            const worstData = await worstResponse.json();
            setPoorPerformers(worstData.poor_performers || []);

            // Fetch all medicines
            const allResponse = await fetch('http://localhost:8000/api/quality-scores/', { headers });
            if (!allResponse.ok) throw new Error('Failed to fetch all medicines');
            const allData = await allResponse.json();
            setAllMedicines(allData.medicines || []);

            setLoading(false);
        } catch (err) {
            console.error('Error fetching quality data:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const getScoreBadge = (score) => {
        if (score >= 90) return { class: 'excellent', label: 'A', status: 'Excellent' };
        if (score >= 80) return { class: 'good', label: 'B', status: 'Good' };
        if (score >= 70) return { class: 'fair', label: 'C', status: 'Fair' };
        if (score >= 60) return { class: 'poor', label: 'D', status: 'Poor' };
        return { class: 'failed', label: 'F', status: 'Failed' };
    };

    const getScoreColor = (score) => {
        if (score >= 90) return '#10b981'; // Green
        if (score >= 80) return '#3b82f6'; // Blue
        if (score >= 70) return '#f59e0b'; // Orange
        if (score >= 60) return '#f97316'; // Dark Orange
        return '#ef4444'; // Red
    };

    const getExpiryStatus = (daysUntilExpiry) => {
        if (daysUntilExpiry < 0) return { class: 'expired', label: 'Expired', icon: '❌' };
        if (daysUntilExpiry <= 30) return { class: 'critical', label: 'Critical', icon: '⚠️' };
        if (daysUntilExpiry <= 90) return { class: 'warning', label: 'Warning', icon: '⚡' };
        return { class: 'safe', label: 'Safe', icon: '✅' };
    };

    if (loading) {
        return (
            <div className="quality-dashboard-loading">
                <div className="loading-spinner-large"></div>
                <p>Loading Quality Scores...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="quality-dashboard-error">
                <div className="error-icon">❌</div>
                <h3>Error Loading Data</h3>
                <p>{error}</p>
                <button onClick={fetchAllData} className="retry-button">
                    🔄 Retry
                </button>
                <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="quality-score-dashboard">
            {/* Header */}
            <div className="quality-header">
                <div className="header-content">
                    <Link to="/dashboard" className="back-button">
                        ← Back
                    </Link>
                    <div className="header-title">
                        <h1>📊 Quality Score Dashboard</h1>
                        <p>Real-time quality monitoring and analytics</p>
                    </div>
                    <button onClick={fetchAllData} className="refresh-btn">
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {/* Statistics Overview */}
            {statistics && (
                <div className="stats-overview">
                    <div className="stat-card-q total">
                        <div className="stat-icon-q">📦</div>
                        <div className="stat-details-q">
                            <div className="stat-value-q">{statistics.total_medicines}</div>
                            <div className="stat-label-q">Total Medicines</div>
                        </div>
                    </div>

                    <div className="stat-card-q average">
                        <div className="stat-icon-q">⭐</div>
                        <div className="stat-details-q">
                            <div className="stat-value-q">{statistics.average_score.toFixed(1)}</div>
                            <div className="stat-label-q">Average Score</div>
                        </div>
                    </div>

                    <div className="stat-card-q highest">
                        <div className="stat-icon-q">🏆</div>
                        <div className="stat-details-q">
                            <div className="stat-value-q">{statistics.highest_score.toFixed(1)}</div>
                            <div className="stat-label-q">Highest Score</div>
                        </div>
                    </div>

                    <div className="stat-card-q lowest">
                        <div className="stat-icon-q">⚠️</div>
                        <div className="stat-details-q">
                            <div className="stat-value-q">{statistics.lowest_score.toFixed(1)}</div>
                            <div className="stat-label-q">Lowest Score</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Grade Distribution */}
            {statistics && (
                <div className="grade-distribution">
                    <h3>Grade Distribution</h3>
                    <div className="grade-cards">
                        <div className="grade-card grade-a">
                            <div className="grade-letter">A</div>
                            <div className="grade-count">{statistics.grade_distribution.A || 0}</div>
                            <div className="grade-status">Excellent</div>
                        </div>
                        <div className="grade-card grade-b">
                            <div className="grade-letter">B</div>
                            <div className="grade-count">{statistics.grade_distribution.B || 0}</div>
                            <div className="grade-status">Good</div>
                        </div>
                        <div className="grade-card grade-c">
                            <div className="grade-letter">C</div>
                            <div className="grade-count">{statistics.grade_distribution.C || 0}</div>
                            <div className="grade-status">Fair</div>
                        </div>
                        <div className="grade-card grade-d">
                            <div className="grade-letter">D</div>
                            <div className="grade-count">{statistics.grade_distribution.D || 0}</div>
                            <div className="grade-status">Poor</div>
                        </div>
                        <div className="grade-card grade-f">
                            <div className="grade-letter">F</div>
                            <div className="grade-count">{statistics.grade_distribution.F || 0}</div>
                            <div className="grade-status">Failed</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs Navigation */}
            <div className="quality-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    📊 Overview
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'top' ? 'active' : ''}`}
                    onClick={() => setActiveTab('top')}
                >
                    🏆 Top 5 Best
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'worst' ? 'active' : ''}`}
                    onClick={() => setActiveTab('worst')}
                >
                    ⚠️ Needs Attention
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    📋 All Medicines
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="overview-grid">
                        <div className="overview-section">
                            <h3>🏆 Top 3 Performers</h3>
                            <div className="mini-table">
                                {topPerformers.slice(0, 3).map((medicine, index) => {
                                    const badge = getScoreBadge(medicine.quality_score);
                                    return (
                                        <div key={medicine.id} className="mini-row">
                                            <span className="mini-rank">#{index + 1}</span>
                                            <span className="mini-name">{medicine.name}</span>
                                            <span className="mini-batch">{medicine.batch_number}</span>
                                            <span className={`mini-badge ${badge.class}`}>
                                                {medicine.quality_score.toFixed(1)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="overview-section">
                            <h3>⚠️ Needs Attention</h3>
                            <div className="mini-table">
                                {poorPerformers.slice(0, 3).map((medicine, index) => {
                                    const badge = getScoreBadge(medicine.quality_score);
                                    return (
                                        <div key={medicine.id} className="mini-row warning">
                                            <span className="mini-rank">#{index + 1}</span>
                                            <span className="mini-name">{medicine.name}</span>
                                            <span className="mini-batch">{medicine.batch_number}</span>
                                            <span className={`mini-badge ${badge.class}`}>
                                                {medicine.quality_score.toFixed(1)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Top 5 Best Tab */}
                {activeTab === 'top' && (
                    <div className="table-container">
                        <h2 className="table-heading">🏆 Top 5 Best Quality Medicines</h2>
                        <div className="quality-table-wrapper">
                            <table className="quality-table-modern">
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Medicine</th>
                                        <th>Batch</th>
                                        <th>Manufacturer</th>
                                        <th>Score</th>
                                        <th>Grade</th>
                                        <th>Temperature</th>
                                        <th>Humidity</th>
                                        <th>pH</th>
                                        <th>Purity</th>
                                        <th>Expiry</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topPerformers.map((medicine, index) => {
                                        const badge = getScoreBadge(medicine.quality_score);
                                        const expiryStatus = getExpiryStatus(medicine.days_until_expiry);
                                        return (
                                            <tr key={medicine.id} className="top-row">
                                                <td className="rank-cell">
                                                    <span className="rank-badge">#{index + 1}</span>
                                                </td>
                                                <td className="medicine-cell">{medicine.name}</td>
                                                <td>{medicine.batch_number}</td>
                                                <td>{medicine.manufacturer}</td>
                                                <td>
                                                    <div className="score-visual">
                                                        <div 
                                                            className="score-bar-fill"
                                                            style={{
                                                                width: `${medicine.quality_score}%`,
                                                                backgroundColor: getScoreColor(medicine.quality_score)
                                                            }}
                                                        >
                                                            <span className="score-text">{medicine.quality_score.toFixed(1)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`grade-badge ${badge.class}`}>
                                                        {badge.label}
                                                    </span>
                                                </td>
                                                <td>{medicine.temperature}°C</td>
                                                <td>{medicine.humidity}%</td>
                                                <td>{medicine.ph_level}</td>
                                                <td>{medicine.active_ingredient_purity}%</td>
                                                <td>
                                                    <span className={`expiry-badge ${expiryStatus.class}`}>
                                                        {expiryStatus.icon} {medicine.days_until_expiry} days
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Worst 5 Tab */}
                {activeTab === 'worst' && (
                    <div className="table-container">
                        <h2 className="table-heading">⚠️ Top 5 Medicines Needing Attention</h2>
                        <div className="quality-table-wrapper">
                            <table className="quality-table-modern">
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Medicine</th>
                                        <th>Batch</th>
                                        <th>Manufacturer</th>
                                        <th>Score</th>
                                        <th>Grade</th>
                                        <th>Temperature</th>
                                        <th>Humidity</th>
                                        <th>pH</th>
                                        <th>Purity</th>
                                        <th>Expiry</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {poorPerformers.map((medicine, index) => {
                                        const badge = getScoreBadge(medicine.quality_score);
                                        const expiryStatus = getExpiryStatus(medicine.days_until_expiry);
                                        return (
                                            <tr key={medicine.id} className="warning-row-q">
                                                <td className="rank-cell">
                                                    <span className="rank-badge warning">#{index + 1}</span>
                                                </td>
                                                <td className="medicine-cell">{medicine.name}</td>
                                                <td>{medicine.batch_number}</td>
                                                <td>{medicine.manufacturer}</td>
                                                <td>
                                                    <div className="score-visual">
                                                        <div 
                                                            className="score-bar-fill"
                                                            style={{
                                                                width: `${medicine.quality_score}%`,
                                                                backgroundColor: getScoreColor(medicine.quality_score)
                                                            }}
                                                        >
                                                            <span className="score-text">{medicine.quality_score.toFixed(1)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`grade-badge ${badge.class}`}>
                                                        {badge.label}
                                                    </span>
                                                </td>
                                                <td>{medicine.temperature}°C</td>
                                                <td>{medicine.humidity}%</td>
                                                <td>{medicine.ph_level}</td>
                                                <td>{medicine.active_ingredient_purity}%</td>
                                                <td>
                                                    <span className={`expiry-badge ${expiryStatus.class}`}>
                                                        {expiryStatus.icon} {medicine.days_until_expiry} days
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* All Medicines Tab */}
                {activeTab === 'all' && (
                    <div className="table-container">
                        <div className="table-header-controls">
                            <h2 className="table-heading">📋 All Medicines Quality Report</h2>
                            <div className="filter-controls">
                                <label>Filter by Grade:</label>
                                <select 
                                    value={selectedGrade} 
                                    onChange={(e) => setSelectedGrade(e.target.value)}
                                    className="grade-filter"
                                >
                                    <option value="all">All Grades</option>
                                    <option value="A">Grade A (Excellent)</option>
                                    <option value="B">Grade B (Good)</option>
                                    <option value="C">Grade C (Fair)</option>
                                    <option value="D">Grade D (Poor)</option>
                                    <option value="F">Grade F (Failed)</option>
                                </select>
                            </div>
                        </div>
                        <div className="quality-table-wrapper">
                            <table className="quality-table-modern">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Medicine</th>
                                        <th>Batch</th>
                                        <th>Category</th>
                                        <th>Score</th>
                                        <th>Grade</th>
                                        <th>Status</th>
                                        <th>Expiry</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allMedicines
                                        .filter(med => selectedGrade === 'all' || med.quality_grade === selectedGrade)
                                        .map((medicine, index) => {
                                            const badge = getScoreBadge(medicine.quality_score);
                                            const expiryStatus = getExpiryStatus(medicine.days_until_expiry);
                                            return (
                                                <tr key={medicine.id}>
                                                    <td>{index + 1}</td>
                                                    <td className="medicine-cell">{medicine.name}</td>
                                                    <td>{medicine.batch_number}</td>
                                                    <td>{medicine.category}</td>
                                                    <td>
                                                        <div className="score-visual">
                                                            <div 
                                                                className="score-bar-fill"
                                                                style={{
                                                                    width: `${medicine.quality_score}%`,
                                                                    backgroundColor: getScoreColor(medicine.quality_score)
                                                                }}
                                                            >
                                                                <span className="score-text">{medicine.quality_score.toFixed(1)}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`grade-badge ${badge.class}`}>
                                                            {badge.label}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge ${badge.class}`}>
                                                            {badge.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`expiry-badge ${expiryStatus.class}`}>
                                                            {expiryStatus.icon} {medicine.days_until_expiry} days
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QualityScoreDashboard;
