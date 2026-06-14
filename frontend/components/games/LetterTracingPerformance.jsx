'use client';

import { useState, useEffect } from 'react';
import styles from './LetterTracingPerformance.module.css';

export default function LetterTracingPerformance({ userId, apiBaseUrl = '/api' }) {
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
      const response = await fetch(
        `${apiBaseUrl}/letter-tracing/performance?userId=${userId}&timeRange=${timeRange}`
      );
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
          <p className={styles.noDataSubtext}>
            Start tracing letters to see your progress!
          </p>
        </div>
      </div>
    );
  }

  const { stats, letterProgress, accuracyTrend, recentSessions } = performanceData;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Letter Tracing Performance</h1>
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
          <div className={styles.statValue}>{stats.totalSessions || 0}</div>
          <div className={styles.statLabel}>Total Sessions</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statValue}>{stats.averageAccuracy || 0}%</div>
          <div className={styles.statLabel}>Average Accuracy</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🔤</div>
          <div className={styles.statValue}>{stats.lettersCompleted || 0}</div>
          <div className={styles.statLabel}>Letters Completed</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statValue}>{stats.totalAttempts || 0}</div>
          <div className={styles.statLabel}>Total Attempts</div>
        </div>
      </div>

      {/* Letter Progress Chart */}
      {letterProgress && letterProgress.length > 0 && (
        <div className={styles.chartSection}>
          <h2 className={styles.sectionTitle}>Letter-by-Letter Progress</h2>
          <div className={styles.letterChart}>
            {letterProgress.map((item, index) => (
              <div key={index} className={styles.letterBar}>
                <div className={styles.letterLabel}>{item.letter}</div>
                <div className={styles.barContainer}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${item.accuracy}%` }}
                  >
                    {item.accuracy > 15 && (
                      <span className={styles.barValue}>{item.accuracy}%</span>
                    )}
                  </div>
                  {item.accuracy <= 15 && (
                    <span className={styles.barValueOutside}>{item.accuracy}%</span>
                  )}
                </div>
                <div className={styles.letterStats}>
                  {item.attempts} {item.attempts === 1 ? 'try' : 'tries'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accuracy Trend Chart */}
      {accuracyTrend && accuracyTrend.length > 0 && (
        <div className={styles.chartSection}>
          <h2 className={styles.sectionTitle}>Accuracy Trend Over Time</h2>
          <div className={styles.lineChart}>
            <svg viewBox="0 0 800 300" className={styles.svg}>
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((y) => (
                <g key={y}>
                  <line
                    x1="50"
                    y1={250 - y * 2}
                    x2="750"
                    y2={250 - y * 2}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                  <text x="20" y={255 - y * 2} fill="#6b7280" fontSize="12">
                    {y}%
                  </text>
                </g>
              ))}

              {/* Data line */}
              {accuracyTrend.length > 1 && (
                <polyline
                  points={accuracyTrend
                    .map((point, i) => {
                      const x = 50 + (i * 700) / (accuracyTrend.length - 1);
                      const y = 250 - point.accuracy * 2;
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
                const x = 50 + (i * 700) / Math.max(accuracyTrend.length - 1, 1);
                const y = 250 - point.accuracy * 2;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill="#667eea" />
                    <title>{`Session ${i + 1}: ${point.accuracy}%`}</title>
                  </g>
                );
              })}

              {/* X-axis labels */}
              {accuracyTrend.map((point, i) => {
                const x = 50 + (i * 700) / Math.max(accuracyTrend.length - 1, 1);
                return (
                  <text key={i} x={x} y="280" fill="#6b7280" fontSize="10" textAnchor="middle">
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
                  <th>Letters</th>
                  <th>Attempts</th>
                  <th>Accuracy</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((session, index) => (
                  <tr key={index}>
                    <td>{new Date(session.date).toLocaleDateString()}</td>
                    <td>{session.lettersCompleted}</td>
                    <td>{session.totalAttempts}</td>
                    <td>
                      <span
                        className={`${styles.badge} ${
                          session.accuracy >= 80
                            ? styles.badgeSuccess
                            : session.accuracy >= 60
                            ? styles.badgeWarning
                            : styles.badgeDanger
                        }`}
                      >
                        {session.accuracy}%
                      </span>
                    </td>
                    <td>{session.avgTimePerLetter}s/letter</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Most Difficult Letters */}
      {stats.difficultLetters && stats.difficultLetters.length > 0 && (
        <div className={styles.chartSection}>
          <h2 className={styles.sectionTitle}>Most Challenging Letters</h2>
          <p className={styles.sectionSubtitle}>Letters that need more practice</p>
          <div className={styles.letterGrid}>
            {stats.difficultLetters.slice(0, 10).map((item, index) => (
              <div key={index} className={styles.letterCard}>
                <div className={styles.letterBig}>{item.letter}</div>
                <div className={styles.letterAccuracy}>
                  <div className={styles.accuracyBar}>
                    <div
                      className={styles.accuracyFill}
                      style={{
                        width: `${item.accuracy}%`,
                        backgroundColor:
                          item.accuracy >= 80
                            ? '#10b981'
                            : item.accuracy >= 60
                            ? '#f59e0b'
                            : '#ef4444',
                      }}
                    ></div>
                  </div>
                  <span className={styles.accuracyText}>{item.accuracy}%</span>
                </div>
                <div className={styles.letterAttempts}>
                  {item.attempts} {item.attempts === 1 ? 'attempt' : 'attempts'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}