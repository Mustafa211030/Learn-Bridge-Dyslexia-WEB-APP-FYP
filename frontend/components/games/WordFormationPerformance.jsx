'use client';

import { useState, useEffect } from 'react';
import styles from './WordFormationPerformance.module.css';

export default function WordFormationPerformance({ userId, apiBaseUrl = '/api' }) {
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
        `${apiBaseUrl}/word-formation/performance?userId=${userId}&timeRange=${timeRange}`
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
            Start playing to see your progress!
          </p>
        </div>
      </div>
    );
  }

  const { stats, scoreProgress, accuracyTrend, recentSessions, wordDifficulty } = performanceData;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Word Formation Performance</h1>
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
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statValue}>{stats.highestScore || 0}</div>
          <div className={styles.statLabel}>Highest Score</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statValue}>{stats.averageAccuracy || 0}%</div>
          <div className={styles.statLabel}>Average Accuracy</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statValue}>{stats.totalWords || 0}</div>
          <div className={styles.statLabel}>Total Words Solved</div>
        </div>
      </div>

      {/* Score Progress Chart */}
      {scoreProgress && scoreProgress.length > 0 && (
        <div className={styles.chartSection}>
          <h2 className={styles.sectionTitle}>Score Progress Over Time</h2>
          <div className={styles.lineChart}>
            <svg viewBox="0 0 800 300" className={styles.svg}>
              {/* Grid lines */}
              {[0, 5, 10, 15, 20, 25].map((y) => (
                <g key={y}>
                  <line
                    x1="50"
                    y1={250 - y * 10}
                    x2="750"
                    y2={250 - y * 10}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                  <text x="20" y={255 - y * 10} fill="#6b7280" fontSize="12">
                    {y}
                  </text>
                </g>
              ))}

              {/* Data line */}
              {scoreProgress.length > 1 && (
                <polyline
                  points={scoreProgress
                    .map((point, i) => {
                      const x = 50 + (i * 700) / (scoreProgress.length - 1);
                      const y = 250 - Math.min(point.score, 25) * 10;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                  stroke="#43cea2"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data points */}
              {scoreProgress.map((point, i) => {
                const x = 50 + (i * 700) / Math.max(scoreProgress.length - 1, 1);
                const y = 250 - Math.min(point.score, 25) * 10;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="5" fill="#43cea2" />
                    <title>{`Session ${i + 1}: ${point.score} points`}</title>
                  </g>
                );
              })}

              {/* X-axis labels */}
              {scoreProgress.map((point, i) => {
                const x = 50 + (i * 700) / Math.max(scoreProgress.length - 1, 1);
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

      {/* Accuracy Trend Chart */}
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
                  stroke="#185a9d"
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
                    <circle cx={x} cy={y} r="5" fill="#185a9d" />
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
                  <th>Score</th>
                  <th>Level</th>
                  <th>Accuracy</th>
                  <th>Avg Time</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((session, index) => (
                  <tr key={index}>
                    <td>{new Date(session.date).toLocaleDateString()}</td>
                    <td><strong>{session.score}</strong></td>
                    <td>{session.level}</td>
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
                    <td>{session.avgTime}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Most Difficult Words */}
      {wordDifficulty && wordDifficulty.length > 0 && (
        <div className={styles.chartSection}>
          <h2 className={styles.sectionTitle}>Most Challenging Words</h2>
          <p className={styles.sectionSubtitle}>Words that need more practice</p>
          <div className={styles.wordGrid}>
            {wordDifficulty.slice(0, 12).map((item, index) => (
              <div key={index} className={styles.wordCard}>
                <div className={styles.wordText}>{item.word}</div>
                <div className={styles.wordHint}>{item.hint}</div>
                <div className={styles.wordAccuracy}>
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
                <div className={styles.wordAttempts}>
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