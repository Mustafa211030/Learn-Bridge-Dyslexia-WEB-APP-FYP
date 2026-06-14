'use client';
import { useState, useEffect } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import styles from './PerformanceAnalytics.module.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const COLORS = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#f44336',
  gold: '#FFD700',
  addition: '#4CAF50',
  subtraction: '#2196F3',
  multiplication: '#FF9800',
  division: '#9C27B0'
};

export default function PerformanceAnalytics({ odId, odName, onBack }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState(30);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [analytics, setAnalytics] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);

  useEffect(() => {
    if (odId) {
      fetchAllData();
    }
  }, [odId, timeRange]);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [analyticsRes, statsRes, historyRes] = await Promise.all([
        fetch(`${API_BASE}/mathquest/analytics/${odId}?days=${timeRange}`),
        fetch(`${API_BASE}/mathquest/stats/${odId}`),
        fetch(`${API_BASE}/mathquest/history/${odId}?page=1&limit=10`)
      ]);

      const analyticsData = await analyticsRes.json();
      const statsData = await statsRes.json();
      const historyData = await historyRes.json();

      if (analyticsData.success) setAnalytics(analyticsData.data);
      if (statsData.success) setUserStats(statsData.data);
      if (historyData.success) {
        setGameHistory(historyData.data.sessions);
        setHasMoreHistory(historyData.data.pagination.hasMore);
      }

    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError('Failed to load analytics data');
    }
    
    setLoading(false);
  };

  const loadMoreHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/mathquest/history/${odId}?page=${historyPage + 1}&limit=10`);
      const data = await res.json();
      
      if (data.success) {
        setGameHistory(prev => [...prev, ...data.data.sessions]);
        setHistoryPage(prev => prev + 1);
        setHasMoreHistory(data.data.pagination.hasMore);
      }
    } catch (err) {
      console.error('Failed to load more history:', err);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading your performance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <span>❌</span>
          <p>{error}</p>
          <button onClick={fetchAllData}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!analytics?.hasData) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <span>🎮</span>
          <h2>No Games Played Yet!</h2>
          <p>Play some Math Quest games to see your performance analytics here.</p>
          {onBack && (
            <button className={styles.btnPrimary} onClick={onBack}>
              Start Playing
            </button>
          )}
        </div>
      </div>
    );
  }

  const { summary, scoreTrend, accuracyByOperation, dailyPerformance, 
          questionsBreakdown, avgTimeByOperation, streakHistory, recentGames } = analytics;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {onBack && (
            <button className={styles.backBtn} onClick={onBack}>
              ← Back
            </button>
          )}
          <div>
            <h1>📊 Performance Analytics</h1>
            <p>Welcome back, {odName || 'Player'}!</p>
          </div>
        </div>
        
        <div className={styles.timeFilter}>
          <label>Time Range:</label>
          <select value={timeRange} onChange={(e) => setTimeRange(Number(e.target.value))}>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabs}>
        <button 
          className={activeTab === 'overview' ? styles.active : ''} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'charts' ? styles.active : ''} 
          onClick={() => setActiveTab('charts')}
        >
          Charts
        </button>
        <button 
          className={activeTab === 'history' ? styles.active : ''} 
          onClick={() => setActiveTab('history')}
        >
          Game History
        </button>
        <button 
          className={activeTab === 'achievements' ? styles.active : ''} 
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className={styles.content}>
          {/* Summary Cards */}
          <div className={styles.summaryGrid}>
            <div className={`${styles.card} ${styles.highlight}`}>
              <div className={styles.cardIcon}>🏆</div>
              <div className={styles.cardContent}>
                <span className={styles.cardValue}>{summary.totalScore}</span>
                <span className={styles.cardLabel}>Total Score</span>
              </div>
            </div>
            
            <div className={styles.card}>
              <div className={styles.cardIcon}>🎮</div>
              <div className={styles.cardContent}>
                <span className={styles.cardValue}>{summary.totalGames}</span>
                <span className={styles.cardLabel}>Games Played</span>
              </div>
            </div>
            
            <div className={styles.card}>
              <div className={styles.cardIcon}>🎯</div>
              <div className={styles.cardContent}>
                <span className={styles.cardValue}>{summary.avgAccuracy}%</span>
                <span className={styles.cardLabel}>Avg Accuracy</span>
              </div>
            </div>
            
            <div className={styles.card}>
              <div className={styles.cardIcon}>⭐</div>
              <div className={styles.cardContent}>
                <span className={styles.cardValue}>{summary.highestScore}</span>
                <span className={styles.cardLabel}>Highest Score</span>
              </div>
            </div>
            
            <div className={styles.card}>
              <div className={styles.cardIcon}>🔥</div>
              <div className={styles.cardContent}>
                <span className={styles.cardValue}>{summary.bestStreak}</span>
                <span className={styles.cardLabel}>Best Streak</span>
              </div>
            </div>
            
            <div className={styles.card}>
              <div className={styles.cardIcon}>⏱️</div>
              <div className={styles.cardContent}>
                <span className={styles.cardValue}>{summary.totalPlayTime}m</span>
                <span className={styles.cardLabel}>Total Play Time</span>
              </div>
            </div>
            
            <div className={styles.card}>
              <div className={styles.cardIcon}>{summary.improvementRate >= 0 ? '📈' : '📉'}</div>
              <div className={styles.cardContent}>
                <span className={`${styles.cardValue} ${summary.improvementRate >= 0 ? styles.positive : styles.negative}`}>
                  {summary.improvementRate >= 0 ? '+' : ''}{summary.improvementRate}%
                </span>
                <span className={styles.cardLabel}>Improvement</span>
              </div>
            </div>
            
            <div className={styles.card}>
              <div className={styles.cardIcon}>❤️</div>
              <div className={styles.cardContent}>
                <span className={styles.cardValue} style={{ fontSize: '1rem', textTransform: 'capitalize' }}>
                  {summary.favoriteOperation}
                </span>
                <span className={styles.cardLabel}>Favorite</span>
              </div>
            </div>
          </div>

          {/* Quick Charts Row */}
          <div className={styles.chartsRow}>
            <div className={styles.chartCard}>
              <h3>Score Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={scoreTrend.slice(-10)}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" tick={{ fill: '#fff', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#fff', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="score" stroke={COLORS.primary} fill="url(#scoreGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.chartCard}>
              <h3>Questions Breakdown</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={questionsBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {questionsBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Games */}
          <div className={styles.recentSection}>
            <h3>Recent Games</h3>
            <div className={styles.recentGames}>
              {recentGames.slice(0, 5).map((game, index) => (
                <div key={index} className={styles.recentGame}>
                  <div className={styles.gameOp}>
                    {game.operation === 'addition' && '➕'}
                    {game.operation === 'subtraction' && '➖'}
                    {game.operation === 'multiplication' && '✖️'}
                    {game.operation === 'division' && '➗'}
                  </div>
                  <div className={styles.gameInfo}>
                    <span className={styles.gameScore}>{game.score} pts</span>
                    <span className={styles.gameAccuracy}>{game.accuracy}% accuracy</span>
                  </div>
                  <div className={styles.gameDate}>
                    {new Date(game.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Charts Tab */}
      {activeTab === 'charts' && (
        <div className={styles.content}>
          <div className={`${styles.chartCard} ${styles.fullWidth}`}>
            <h3>Accuracy by Operation</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={accuracyByOperation}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="operation" tick={{ fill: '#fff' }} />
                <YAxis tick={{ fill: '#fff' }} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="accuracy" fill={COLORS.primary} radius={[8, 8, 0, 0]}>
                  {accuracyByOperation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.operation] || COLORS.primary} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={`${styles.chartCard} ${styles.fullWidth}`}>
            <h3>Daily Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" tick={{ fill: '#fff', fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fill: '#fff' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#fff' }} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="avgScore" stroke={COLORS.gold} name="Avg Score" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="avgAccuracy" stroke={COLORS.success} name="Accuracy %" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={`${styles.chartCard} ${styles.fullWidth}`}>
            <h3>Average Time per Question (seconds)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={avgTimeByOperation} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" tick={{ fill: '#fff' }} />
                <YAxis dataKey="operation" type="category" tick={{ fill: '#fff' }} width={100} />
                <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="avgTime" fill={COLORS.secondary} radius={[0, 8, 8, 0]}>
                  {avgTimeByOperation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.operation] || COLORS.secondary} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className={styles.content}>
          <div className={styles.historyList}>
            {gameHistory.map((game, index) => (
              <div key={index} className={styles.historyItem}>
                <div className={styles.historyIcon}>
                  {game.operation === 'addition' && '➕'}
                  {game.operation === 'subtraction' && '➖'}
                  {game.operation === 'multiplication' && '✖️'}
                  {game.operation === 'division' && '➗'}
                </div>
                <div className={styles.historyDetails}>
                  <div className={styles.historyMain}>
                    <span className={styles.historyOperation}>
                      {game.operation.charAt(0).toUpperCase() + game.operation.slice(1)}
                    </span>
                    <span className={styles.historyDate}>
                      {new Date(game.completedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.historyStats}>
                    <span>🏆 {game.score} pts</span>
                    <span>🎯 {game.accuracy}%</span>
                    <span>✅ {game.correctAnswers}/{game.totalQuestions}</span>
                    <span>🔥 {game.maxStreak} streak</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {hasMoreHistory && (
            <button className={styles.loadMore} onClick={loadMoreHistory}>
              Load More
            </button>
          )}
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && userStats && (
        <div className={styles.content}>
          <div className={styles.achievementsGrid}>
            {userStats.achievements && userStats.achievements.length > 0 ? (
              userStats.achievements.map((ach, index) => (
                <div key={index} className={`${styles.achievementCard} ${styles.earned}`}>
                  <span className={styles.achievementIcon}>{ach.icon}</span>
                  <div className={styles.achievementInfo}>
                    <h4>{ach.name}</h4>
                    <p>{ach.description}</p>
                    <span className={styles.achievementDate}>
                      Earned: {new Date(ach.earnedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noAchievements}>
                <span>🏅</span>
                <p>No achievements yet. Keep playing to earn badges!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
