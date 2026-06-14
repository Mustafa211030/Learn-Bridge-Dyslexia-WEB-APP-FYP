// pages/student/parent-view.jsx
// Parent dashboard view - Shows comprehensive stats from ALL games
// FIXED: Uses correct Express backend URL

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../../contexts/AuthContext';
import StudentLayout from '../../components/student/StudentLayout';
import styles from '../../styles/StudentParentView.module.css';

// CRITICAL: Default to Express backend, not /api
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ParentView() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Stats from different games
  const [mathQuestStats, setMathQuestStats] = useState(null);
  const [phonemeStats, setPhonemeStats] = useState(null);
  const [wordFormationStats, setWordFormationStats] = useState(null);
  const [letterTracingStats, setLetterTracingStats] = useState(null);
  const [aggregatedStats, setAggregatedStats] = useState(null);

  const userId = user?._id || user?.id;

  // Ensure we use the correct API URL
  const actualApiUrl = API_BASE.startsWith('/api') 
    ? 'http://localhost:5000/api' 
    : API_BASE;

  useEffect(() => {
    if (userId) {
      fetchAllGameStats();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const fetchAllGameStats = async () => {
    setLoading(true);
    setError(null);

    console.log('Fetching stats for userId:', userId);
    console.log('Using API URL:', actualApiUrl);

    try {
      // Fetch stats from all game endpoints in parallel
      const [mathRes, phonemeRes, wordRes, letterRes] = await Promise.allSettled([
        fetch(`${actualApiUrl}/mathquest/analytics/${userId}?days=30`).then(r => r.json()),
        fetch(`${actualApiUrl}/phoneme-game/performance?userId=${userId}&timeRange=all`).then(r => r.json()),
        fetch(`${actualApiUrl}/word-formation/performance?userId=${userId}&timeRange=all`).then(r => r.json()),
        fetch(`${actualApiUrl}/letter-tracing/performance?userId=${userId}&timeRange=all`).then(r => r.json()),
      ]);

      console.log('MathQuest response:', mathRes);
      console.log('Phoneme response:', phonemeRes);
      console.log('Word Formation response:', wordRes);
      console.log('Letter Tracing response:', letterRes);

      // Process MathQuest stats
      if (mathRes.status === 'fulfilled' && mathRes.value.success) {
        if (mathRes.value.data?.hasData || mathRes.value.data?.summary) {
          setMathQuestStats(mathRes.value.data);
        }
      }

      // Process Phoneme stats
      if (phonemeRes.status === 'fulfilled' && phonemeRes.value.success) {
        const pData = phonemeRes.value;
        if (pData.stats || pData.levelProgress || pData.recentSessions) {
          setPhonemeStats(pData);
        }
      }

      // Process Word Formation stats
      if (wordRes.status === 'fulfilled' && wordRes.value.success) {
        const wData = wordRes.value;
        if (wData.stats || wData.scoreProgress || wData.recentSessions) {
          setWordFormationStats(wData);
        }
      }

      // Process Letter Tracing stats
      if (letterRes.status === 'fulfilled' && letterRes.value.success) {
        const lData = letterRes.value;
        if (lData.stats || lData.letterProgress || lData.recentSessions) {
          setLetterTracingStats(lData);
        }
      }

      // Aggregate stats
      aggregateStats(
        mathRes.status === 'fulfilled' ? mathRes.value : null,
        phonemeRes.status === 'fulfilled' ? phonemeRes.value : null,
        wordRes.status === 'fulfilled' ? wordRes.value : null,
        letterRes.status === 'fulfilled' ? letterRes.value : null
      );

    } catch (err) {
      console.error('Failed to fetch game stats:', err);
      setError('Failed to load game statistics');
    } finally {
      setLoading(false);
    }
  };

  const aggregateStats = (math, phoneme, word, letter) => {
    let totalGames = 0;
    let totalPlayTime = 0;
    let totalAccuracy = 0;
    let accuracyCount = 0;
    let gamesWithData = 0;

    // Math Quest
    if (math?.success && math?.data) {
      const summary = math.data.summary || math.data;
      if (summary.totalGames > 0) {
        totalGames += summary.totalGames || 0;
        totalPlayTime += summary.totalPlayTime || 0;
        if (summary.avgAccuracy) {
          totalAccuracy += summary.avgAccuracy;
          accuracyCount++;
        }
        gamesWithData++;
      }
    }

    // Phoneme Game
    if (phoneme?.success && phoneme?.stats) {
      const stats = phoneme.stats;
      if (stats.totalGames > 0) {
        totalGames += stats.totalGames || 0;
        if (stats.averageAccuracy) {
          totalAccuracy += stats.averageAccuracy;
          accuracyCount++;
        }
        gamesWithData++;
      }
    }

    // Word Formation
    if (word?.success && word?.stats) {
      const stats = word.stats;
      if (stats.totalSessions > 0) {
        totalGames += stats.totalSessions || 0;
        if (stats.averageAccuracy) {
          totalAccuracy += stats.averageAccuracy;
          accuracyCount++;
        }
        gamesWithData++;
      }
    }

    // Letter Tracing
    if (letter?.success && letter?.stats) {
      const stats = letter.stats;
      if (stats.totalSessions > 0) {
        totalGames += stats.totalSessions || 0;
        if (stats.averageAccuracy) {
          totalAccuracy += stats.averageAccuracy;
          accuracyCount++;
        }
        gamesWithData++;
      }
    }

    setAggregatedStats({
      totalGames,
      totalPlayTime,
      averageAccuracy: accuracyCount > 0 ? Math.round(totalAccuracy / accuracyCount) : 0,
      gamesWithData
    });
  };

  const formatPlayTime = (minutes) => {
    if (!minutes) return '0m';
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <StudentLayout title="Parent View">
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading progress data...</p>
        </div>
      </StudentLayout>
    );
  }

  if (!userId) {
    return (
      <StudentLayout title="Parent View">
        <div className={styles.error}>
          <span className={styles.errorIcon}>🔒</span>
          <p>Please login to view progress</p>
        </div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout title="Parent View">
        <div className={styles.error}>
          <span className={styles.errorIcon}>😕</span>
          <p>{error}</p>
          <button onClick={fetchAllGameStats} className={styles.retryBtn}>
            Try Again
          </button>
        </div>
      </StudentLayout>
    );
  }

  const hasAnyData = mathQuestStats || phonemeStats || wordFormationStats || letterTracingStats;

  return (
    <StudentLayout title="Parent View">
      <Head>
        <title>Parent View | LearnBridge Student</title>
      </Head>

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <span className={styles.headerIcon}>👨‍👩‍👧</span>
            <div>
              <h1 className={styles.title}>Parent Dashboard</h1>
              <p className={styles.subtitle}>
                Learning progress for {user?.firstName || 'Student'}
              </p>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div style={{ 
          padding: '12px', 
          background: '#f0f9ff', 
          borderRadius: '8px', 
          marginBottom: '16px',
          fontSize: '12px'
        }}>
          <strong>Debug:</strong> userId={userId} | API={actualApiUrl}<br/>
          MathQuest={mathQuestStats ? '✅' : '❌'} | 
          Phoneme={phonemeStats ? '✅' : '❌'} | 
          WordForm={wordFormationStats ? '✅' : '❌'} | 
          LetterTrace={letterTracingStats ? '✅' : '❌'}
        </div>

        {/* Student Info Card */}
        <div className={styles.studentCard}>
          <div className={styles.studentAvatar}>
            {user?.firstName?.charAt(0)?.toUpperCase() || '👤'}
          </div>
          <div className={styles.studentInfo}>
            <h2 className={styles.studentName}>{user?.firstName} {user?.lastName}</h2>
            <span className={styles.studentLevel}>Student</span>
          </div>
        </div>

        {/* Overall Summary Stats */}
        {aggregatedStats && (
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>🎮</span>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{aggregatedStats.totalGames}</span>
                <span className={styles.statLabel}>Total Sessions</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>⏱️</span>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{formatPlayTime(aggregatedStats.totalPlayTime)}</span>
                <span className={styles.statLabel}>Time Learning</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>🎯</span>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{aggregatedStats.averageAccuracy}%</span>
                <span className={styles.statLabel}>Avg. Accuracy</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>📚</span>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{aggregatedStats.gamesWithData}</span>
                <span className={styles.statLabel}>Active Games</span>
              </div>
            </div>
          </div>
        )}

        {!hasAnyData ? (
          <div className={styles.noDataCard}>
            <span className={styles.noDataIcon}>📊</span>
            <h3>No Game Data Yet</h3>
            <p>Start playing games to see progress here!</p>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
              Go to Games Hub and complete a game session.
            </p>
          </div>
        ) : (
          <div className={styles.gamesGrid}>
            {/* Math Quest Stats */}
            {mathQuestStats && (
              <div className={styles.gameCard}>
                <div className={styles.gameHeader}>
                  <span className={styles.gameIcon}>🧮</span>
                  <h3 className={styles.gameTitle}>Math Quest</h3>
                </div>
                <div className={styles.gameStats}>
                  <div className={styles.gameStat}>
                    <span className={styles.gameStatLabel}>Games Played</span>
                    <span className={styles.gameStatValue}>
                      {mathQuestStats.summary?.totalGames || 0}
                    </span>
                  </div>
                  <div className={styles.gameStat}>
                    <span className={styles.gameStatLabel}>Highest Score</span>
                    <span className={styles.gameStatValue}>
                      {mathQuestStats.summary?.highestScore || 0}
                    </span>
                  </div>
                  <div className={styles.gameStat}>
                    <span className={styles.gameStatLabel}>Avg. Accuracy</span>
                    <span className={styles.gameStatValue}>
                      {mathQuestStats.summary?.avgAccuracy || 0}%
                    </span>
                  </div>
                  <div className={styles.gameStat}>
                    <span className={styles.gameStatLabel}>Best Streak</span>
                    <span className={styles.gameStatValue}>
                      🔥 {mathQuestStats.summary?.bestStreak || 0}
                    </span>
                  </div>
                </div>
                {mathQuestStats.accuracyByOperation?.length > 0 && (
                  <div className={styles.operationStats}>
                    <h4>By Operation:</h4>
                    {mathQuestStats.accuracyByOperation.map((op, i) => (
                      <div key={i} className={styles.operationBar}>
                        <span className={styles.opName}>{op.operation}</span>
                        <div className={styles.opBarContainer}>
                          <div 
                            className={styles.opBarFill} 
                            style={{ width: `${op.accuracy}%` }}
                          ></div>
                        </div>
                        <span className={styles.opValue}>{op.accuracy}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Phoneme Game Stats */}
            {phonemeStats && (
              <div className={styles.gameCard}>
                <div className={styles.gameHeader}>
                  <span className={styles.gameIcon}>🔤</span>
                  <h3 className={styles.gameTitle}>Phoneme Recognition</h3>
                </div>
                <div className={styles.gameStats}>
                  <div className={styles.gameStat}>
                    <span className={styles.gameStatLabel}>Games Played</span>
                    <span className={styles.gameStatValue}>
                      {phonemeStats.stats?.totalGames || 0}
                    </span>
                  </div>
                  <div className={styles.gameStat}>
                    <span className={styles.gameStatLabel}>Total Score</span>
                    <span className={styles.gameStatValue}>
                      {phonemeStats.stats?.totalScore || 0}
                    </span>
                  </div>
                  <div className={styles.gameStat}>
                    <span className={styles.gameStatLabel}>Avg. Accuracy</span>
                    <span className={styles.gameStatValue}>
                      {phonemeStats.stats?.averageAccuracy || 0}%
                    </span>
                  </div>
                  <div className={styles.gameStat}>
                    <span className={styles.gameStatLabel}>Levels Done</span>
                    <span className={styles.gameStatValue}>
                      {phonemeStats.stats?.levelsCompleted || 0}
                    </span>
                  </div>
                </div>
                {phonemeStats.levelProgress?.length > 0 && (
                  <div className={styles.levelProgress}>
                    <h4>Level Progress:</h4>
                    <div className={styles.levelsGrid}>
                      {phonemeStats.levelProgress.map((level, i) => (
                        <div key={i} className={styles.levelBadge}>
                          <span className={styles.levelNum}>L{level.level}</span>
                          <span className={styles.levelAcc}>{level.accuracy}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Word Formation Stats */}
            {wordFormationStats && (
              <div className={styles.gameCard}>
                <div className={styles.gameHeader}>
                  <span className={styles.gameIcon}>📝</span>
                  <h3 className={styles.gameTitle}>Word Formation</h3>
                </div>
                <div className={styles.gameStats}>
                  <div className={styles.gameStat}>
                    <span className={styles.gameStatLabel}>Sessions</span>
                    <span className={styles.gameStatValue}>
                      {wordFormationStats.stats?.totalSessions || 0}
                    </span>
                  </div>
                  <div className={styles.gameStat}>
                    <span className={styles.gameStatLabel}>High Score</span>
                    <span className={styles.gameStatValue}>
                      {wordFormationStats.stats?.highestScore || 0}
                    </span>
                  </div>
                  <div className={styles.gameStat}>
                    <span className={styles.gameStatLabel}>Avg. Accuracy</span>
                    <span className={styles.gameStatValue}>
                      {wordFormationStats.stats?.averageAccuracy || 0}%
                    </span>
                  </div>
                  <div className={styles.gameStat}>
                    <span className={styles.gameStatLabel}>Words Solved</span>
                    <span className={styles.gameStatValue}>
                      {wordFormationStats.stats?.totalWords || 0}
                    </span>
                  </div>
                </div>
                {wordFormationStats.recentSessions?.length > 0 && (
                  <div className={styles.recentActivity}>
                    <h4>Recent Sessions:</h4>
                    {wordFormationStats.recentSessions.slice(0, 3).map((session, i) => (
                      <div key={i} className={styles.sessionItem}>
                        <span>{new Date(session.date).toLocaleDateString()}</span>
                        <span>Score: {session.score}</span>
                        <span>{session.accuracy}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Letter Tracing Stats */}
            {letterTracingStats && (
              <div className={styles.gameCard}>
                <div className={styles.gameHeader}>
                  <span className={styles.gameIcon}>✍️</span>
                  <h3 className={styles.gameTitle}>Letter Tracing</h3>
                </div>
                <div className={styles.gameStats}>
                  <div className={styles.gameStat}>
                    <span className={styles.gameStatLabel}>Sessions</span>
                    <span className={styles.gameStatValue}>
                      {letterTracingStats.stats?.totalSessions || 0}
                    </span>
                  </div>
                  <div className={styles.gameStat}>
                    <span className={styles.gameStatLabel}>Letters Done</span>
                    <span className={styles.gameStatValue}>
                      {letterTracingStats.stats?.lettersCompleted || 0}
                    </span>
                  </div>
                  <div className={styles.gameStat}>
                    <span className={styles.gameStatLabel}>Avg. Accuracy</span>
                    <span className={styles.gameStatValue}>
                      {letterTracingStats.stats?.averageAccuracy || 0}%
                    </span>
                  </div>
                  <div className={styles.gameStat}>
                    <span className={styles.gameStatLabel}>Total Tries</span>
                    <span className={styles.gameStatValue}>
                      {letterTracingStats.stats?.totalAttempts || 0}
                    </span>
                  </div>
                </div>
                {letterTracingStats.letterProgress?.length > 0 && (
                  <div className={styles.letterProgress}>
                    <h4>Letters Practiced:</h4>
                    <div className={styles.lettersGrid}>
                      {letterTracingStats.letterProgress.slice(0, 10).map((item, i) => (
                        <div 
                          key={i} 
                          className={styles.letterBadge}
                          style={{
                            backgroundColor: item.accuracy >= 80 ? '#d1fae5' : 
                                           item.accuracy >= 60 ? '#fef3c7' : '#fee2e2'
                          }}
                        >
                          <span className={styles.letterChar}>{item.letter}</span>
                          <span className={styles.letterAcc}>{item.accuracy}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Refresh Button */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button 
            onClick={fetchAllGameStats}
            style={{
              padding: '12px 24px',
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🔄 Refresh Stats
          </button>
        </div>

        {/* Footer Note */}
        <div className={styles.footerNote}>
          <p>
            💡 <strong>Tip:</strong> Play more games to see detailed progress and statistics!
          </p>
        </div>
      </div>
    </StudentLayout>
  );
}