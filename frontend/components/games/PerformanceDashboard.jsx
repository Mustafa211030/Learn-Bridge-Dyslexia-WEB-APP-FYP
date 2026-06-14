'use client';
import { useState, useEffect } from 'react';
import styles from './PerformanceDashboard.module.css';

export default function PerformanceDashboard({ userId, apiBaseUrl = '/api' }) {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchPerformanceData();
    }
  }, [userId, timeRange]);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${apiBaseUrl}/phoneme-game/performance?userId=${userId}&timeRange=${timeRange}`);
      const data = await response.json();
      
      if (data.success) {
        setPerformanceData(data);
      } else {
        setError(data.message || 'Failed to fetch performance data');
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
      setError('Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading performance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>❌ {error}</p>
          <button onClick={fetchPerformanceData} className={styles.retryBtn}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!performanceData || !performanceData.stats) {
    return (
      <div className={styles.container}>
        <div className={styles.noData}>
          <p>📊 No performance data available yet</p>
          <p className={styles.noDataSubtext}>Play some games to see your statistics!</p>
        </div>
      </div>
    );
  }

  const { stats, levelProgress, accuracyTrend, recentSessions } = performanceData;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Performance Dashboard</h1>
        <div className={styles.timeRangeSelector}>
          <button
            className={`${styles.timeBtn} ${timeRange === 'week' ? styles.active : ''}`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button
            className={`${styles.timeBtn} ${timeRange === 'month' ? styles.active : ''}`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button
            className={`${styles.timeBtn} ${timeRange === 'all' ? styles.active : ''}`}
            onClick={() => setTimeRange('all')}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎮</div>
          <div className={styles.statValue}>{stats.totalGames || 0}</div>
          <div className={styles.statLabel}>Total Games</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statValue}>{stats.averageAccuracy || 0}%</div>
          <div className={styles.statLabel}>Average Accuracy</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏆</div>
          <div className={styles.statValue}>{stats.totalScore || 0}</div>
          <div className={styles.statLabel}>Total Score</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statValue}>{stats.levelsCompleted || 0}</div>
          <div className={styles.statLabel}>Levels Completed</div>
        </div>
      </div>

      {/* Level Progress Chart */}
      {levelProgress && levelProgress.length > 0 && (
        <div className={styles.chartSection}>
          <h2 className={styles.sectionTitle}>Level Progress</h2>
          <div className={styles.levelChart}>
            {levelProgress.map((level, index) => (
              <div key={index} className={styles.levelBar}>
                <div className={styles.levelLabel}>Level {level.level}</div>
                <div className={styles.barContainer}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${level.accuracy}%` }}
                  >
                    {level.accuracy > 15 && (
                      <span className={styles.barValue}>{level.accuracy}%</span>
                    )}
                  </div>
                  {level.accuracy <= 15 && (
                    <span className={styles.barValueOutside}>{level.accuracy}%</span>
                  )}
                </div>
                <div className={styles.levelStats}>
                  {level.attempts} {level.attempts === 1 ? 'attempt' : 'attempts'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accuracy Trend Line Chart */}
      {accuracyTrend && accuracyTrend.length > 0 && (
        <div className={styles.chartSection}>
          <h2 className={styles.sectionTitle}>Accuracy Trend</h2>
          <div className={styles.lineChart}>
            <svg viewBox="0 0 800 300" className={styles.svg}>
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((y) => (
                <g key={y}>
                  <line
                    x1="50"
                    y1={250 - (y * 2)}
                    x2="750"
                    y2={250 - (y * 2)}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                  <text x="20" y={255 - (y * 2)} fill="#6b7280" fontSize="12">
                    {y}%
                  </text>
                </g>
              ))}

              {/* Data line */}
              {accuracyTrend.length > 1 && (
                <polyline
                  points={accuracyTrend
                    .map((point, i) => {
                      const x = 50 + (i * (700 / (accuracyTrend.length - 1)));
                      const y = 250 - (point.accuracy * 2);
                      return `${x},${y}`;
                    })
                    .join(' ')}
                  stroke="#667eea"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data points */}
              {accuracyTrend.map((point, i) => {
                const x = 50 + (i * (700 / Math.max(accuracyTrend.length - 1, 1)));
                const y = 250 - (point.accuracy * 2);
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill="#667eea" />
                    <title>{`Session ${i + 1}: ${point.accuracy}%`}</title>
                  </g>
                );
              })}

              {/* X-axis labels */}
              {accuracyTrend.map((point, i) => {
                const x = 50 + (i * (700 / Math.max(accuracyTrend.length - 1, 1)));
                return (
                  <text
                    key={i}
                    x={x}
                    y="280"
                    fill="#6b7280"
                    fontSize="10"
                    textAnchor="middle"
                  >
                    S{i + 1}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* Recent Sessions Table */}
      {recentSessions && recentSessions.length > 0 && (
        <div className={styles.chartSection}>
          <h2 className={styles.sectionTitle}>Recent Sessions</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Score</th>
                  <th>Accuracy</th>
                  <th>Levels</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((session, index) => (
                  <tr key={index}>
                    <td>{new Date(session.date).toLocaleDateString()}</td>
                    <td>{session.score}</td>
                    <td>
                      <span className={`${styles.badge} ${session.accuracy >= 80 ? styles.badgeSuccess : session.accuracy >= 60 ? styles.badgeWarning : styles.badgeDanger}`}>
                        {session.accuracy}%
                      </span>
                    </td>
                    <td>{session.levelsCompleted}/5</td>
                    <td>{session.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Phoneme Difficulty Analysis */}
      {stats.phonemeDifficulty && stats.phonemeDifficulty.length > 0 && (
        <div className={styles.chartSection}>
          <h2 className={styles.sectionTitle}>Phoneme Difficulty Analysis</h2>
          <p className={styles.sectionSubtitle}>Most challenging phonemes (lowest accuracy first)</p>
          <div className={styles.phonemeGrid}>
            {stats.phonemeDifficulty.slice(0, 10).map((phoneme, index) => (
              <div key={index} className={styles.phonemeCard}>
                <div className={styles.phonemeSound}>{phoneme.sound}</div>
                <div className={styles.phonemeWord}>{phoneme.word}</div>
                <div className={styles.phonemeAccuracy}>
                  <div className={styles.accuracyBar}>
                    <div
                      className={styles.accuracyFill}
                      style={{
                        width: `${phoneme.accuracy}%`,
                        backgroundColor: phoneme.accuracy >= 80 ? '#10b981' : phoneme.accuracy >= 60 ? '#f59e0b' : '#ef4444'
                      }}
                    ></div>
                  </div>
                  <span className={styles.accuracyText}>{phoneme.accuracy}%</span>
                </div>
                <div className={styles.phonemeAttempts}>
                  {phoneme.attempts} {phoneme.attempts === 1 ? 'attempt' : 'attempts'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}