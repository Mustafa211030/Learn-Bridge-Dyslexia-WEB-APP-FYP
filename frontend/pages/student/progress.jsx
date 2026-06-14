// // pages/student/progress.jsx
// // Student Progress Page - View detailed analytics and progress

// import { useState, useEffect } from 'react';
// import Head from 'next/head';
// import { useRouter } from 'next/router';
// import { studentAPI } from '../../services/api';
// import StudentLayout from '../../components/student/StudentLayout';
// import ProgressChart, { StatCard, SkillProgressBar } from '../../components/student/ProgressChart';
// import BadgeGrid from '../../components/student/BadgeGrid';
// import styles from '../../styles/StudentProgress.module.css';

// const timeRanges = [
//   { id: 'week', label: 'This Week' },
//   { id: 'month', label: 'This Month' },
//   { id: 'year', label: 'This Year' }
// ];

// export default function StudentProgress() {
//   const router = useRouter();
//   const { game } = router.query;
//   const [progressData, setProgressData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [timeRange, setTimeRange] = useState('month');

//   useEffect(() => {
//     fetchProgressData();
//   }, [timeRange]);

//   const fetchProgressData = async () => {
//     try {
//       setLoading(true);
//       const response = await studentAPI.getProgress({ timeRange });
//       if (response.data?.success) {
//         setProgressData(response.data.data);
//       }
//     } catch (error) {
//       console.error('Failed to fetch progress:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatTime = (seconds) => {
//     if (seconds < 60) return `${seconds}s`;
//     if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
//     const hours = Math.floor(seconds / 3600);
//     const mins = Math.floor((seconds % 3600) / 60);
//     return `${hours}h ${mins}m`;
//   };

//   const getSkillColor = (name) => {
//     const colorMap = {
//       cognitive: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
//       language: 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)',
//       math: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
//       memory: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
//       reading: 'linear-gradient(90deg, #fa709a 0%, #fee140 100%)',
//       motorSkills: 'linear-gradient(90deg, #a8edea 0%, #fed6e3 100%)'
//     };
//     return colorMap[name] || 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)';
//   };

//   if (loading) {
//     return (
//       <StudentLayout title="My Progress">
//         <div className={styles.loadingState}>
//           <div className={styles.spinner}></div>
//           <p>Loading your progress...</p>
//         </div>
//       </StudentLayout>
//     );
//   }

//   const { overview, analytics, gameBreakdown, skillBreakdown, achievements, badges, recentActivity } = progressData || {};

//   // Prepare chart data
//   const chartData = analytics?.map(item => ({
//     label: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
//     value: item.avgScore || 0
//   })) || [];

//   const accuracyChartData = analytics?.map(item => ({
//     label: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
//     value: item.avgAccuracy || 0
//   })) || [];

//   return (
//     <StudentLayout title="My Progress">
//       <Head>
//         <title>My Progress | LearnBridge</title>
//       </Head>

//       <div className={styles.progressPage}>
//         {/* Header */}
//         <div className={styles.header}>
//           <div className={styles.headerContent}>
//             <h1 className={styles.title}>My Progress 📊</h1>
//             <p className={styles.subtitle}>Track your learning journey and achievements</p>
//           </div>
//           <div className={styles.timeRangeSelector}>
//             {timeRanges.map((range) => (
//               <button
//                 key={range.id}
//                 className={`${styles.timeRangeBtn} ${timeRange === range.id ? styles.active : ''}`}
//                 onClick={() => setTimeRange(range.id)}
//               >
//                 {range.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className={styles.tabs}>
//           <button
//             className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
//             onClick={() => setActiveTab('overview')}
//           >
//             Overview
//           </button>
//           <button
//             className={`${styles.tab} ${activeTab === 'games' ? styles.active : ''}`}
//             onClick={() => setActiveTab('games')}
//           >
//             Games
//           </button>
//           <button
//             className={`${styles.tab} ${activeTab === 'skills' ? styles.active : ''}`}
//             onClick={() => setActiveTab('skills')}
//           >
//             Skills
//           </button>
//           <button
//             className={`${styles.tab} ${activeTab === 'achievements' ? styles.active : ''}`}
//             onClick={() => setActiveTab('achievements')}
//           >
//             Achievements
//           </button>
//         </div>

//         {/* Content */}
//         <div className={styles.content}>
//           {activeTab === 'overview' && (
//             <>
//               {/* Stats Grid */}
//               <div className={styles.statsGrid}>
//                 <StatCard
//                   icon="🎮"
//                   label="Total Games"
//                   value={overview?.totalGamesPlayed || 0}
//                 />
//                 <StatCard
//                   icon="⏱️"
//                   label="Time Played"
//                   value={formatTime(overview?.totalTimePlayed || 0)}
//                 />
//                 <StatCard
//                   icon="🎯"
//                   label="Avg Accuracy"
//                   value={`${overview?.averageAccuracy || 0}%`}
//                 />
//                 <StatCard
//                   icon="⭐"
//                   label="Total Score"
//                   value={overview?.totalScore?.toLocaleString() || 0}
//                 />
//                 <StatCard
//                   icon="🔥"
//                   label="Current Streak"
//                   value={`${overview?.currentStreak || 0} days`}
//                 />
//                 <StatCard
//                   icon="🏆"
//                   label="Best Streak"
//                   value={`${overview?.longestStreak || 0} days`}
//                 />
//               </div>

//               {/* Charts Row */}
//               <div className={styles.chartsRow}>
//                 <div className={styles.chartCard}>
//                   <ProgressChart
//                     data={chartData}
//                     type="line"
//                     title="Score Trend"
//                     height={250}
//                   />
//                 </div>
//                 <div className={styles.chartCard}>
//                   <ProgressChart
//                     data={accuracyChartData}
//                     type="bar"
//                     title="Accuracy Over Time"
//                     height={250}
//                   />
//                 </div>
//               </div>

//               {/* Level Progress */}
//               <div className={styles.levelCard}>
//                 <div className={styles.levelHeader}>
//                   <h3>Learning Level</h3>
//                   <span className={styles.levelBadge}>Level {overview?.level?.current || 1}</span>
//                 </div>
//                 <div className={styles.levelProgress}>
//                   <div 
//                     className={styles.levelFill}
//                     style={{ 
//                       width: `${((overview?.level?.experiencePoints || 0) / (overview?.level?.pointsToNextLevel || 100)) * 100}%` 
//                     }}
//                   ></div>
//                 </div>
//                 <p className={styles.levelText}>
//                   {overview?.level?.experiencePoints || 0} / {overview?.level?.pointsToNextLevel || 100} XP to next level
//                 </p>
//               </div>
//             </>
//           )}

//           {activeTab === 'games' && (
//             <div className={styles.gamesTab}>
//               <h3 className={styles.sectionTitle}>Game Performance</h3>
//               {gameBreakdown?.length > 0 ? (
//                 <div className={styles.gamesList}>
//                   {gameBreakdown.map((game, index) => (
//                     <div key={index} className={styles.gameCard}>
//                       <div className={styles.gameCardHeader}>
//                         <h4>{game.gameName}</h4>
//                         <span className={styles.sessionCount}>{game.sessions} sessions</span>
//                       </div>
//                       <div className={styles.gameStats}>
//                         <div className={styles.gameStat}>
//                           <span className={styles.gameStatLabel}>High Score</span>
//                           <span className={styles.gameStatValue}>{game.highScore}</span>
//                         </div>
//                         <div className={styles.gameStat}>
//                           <span className={styles.gameStatLabel}>Avg Accuracy</span>
//                           <span className={styles.gameStatValue}>{game.averageAccuracy}%</span>
//                         </div>
//                         <div className={styles.gameStat}>
//                           <span className={styles.gameStatLabel}>Time Played</span>
//                           <span className={styles.gameStatValue}>{formatTime(game.totalTime)}</span>
//                         </div>
//                       </div>
//                       <button 
//                         className={styles.playAgainBtn}
//                         onClick={() => router.push(`/student/games/${game.gameId}`)}
//                       >
//                         Play Again →
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className={styles.emptyState}>
//                   <span className={styles.emptyIcon}>🎮</span>
//                   <p>No game data yet. Start playing to see your stats!</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {activeTab === 'skills' && (
//             <div className={styles.skillsTab}>
//               <h3 className={styles.sectionTitle}>Skill Development</h3>
//               <div className={styles.skillsGrid}>
//                 {skillBreakdown?.map((skill, index) => (
//                   <div key={index} className={styles.skillCard}>
//                     <div className={styles.skillCardHeader}>
//                       <span className={styles.skillIcon}>{getSkillIcon(skill.name)}</span>
//                       <div>
//                         <h4>{formatSkillName(skill.name)}</h4>
//                         <span className={styles.skillLevel}>Level {skill.level}/{skill.maxLevel}</span>
//                       </div>
//                     </div>
//                     <div className={styles.skillProgress}>
//                       <div 
//                         className={styles.skillFill}
//                         style={{ 
//                           width: `${skill.percentage}%`,
//                           background: getSkillColor(skill.name)
//                         }}
//                       ></div>
//                     </div>
//                     <p className={styles.skillPercentage}>{skill.percentage}% mastery</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {activeTab === 'achievements' && (
//             <div className={styles.achievementsTab}>
//               <BadgeGrid
//                 badges={badges || []}
//                 achievements={achievements || []}
//                 showAll={true}
//               />
//             </div>
//           )}
//         </div>

//         {/* Recent Activity Sidebar */}
//         <div className={styles.activitySidebar}>
//           <h3 className={styles.sidebarTitle}>Recent Activity</h3>
//           <div className={styles.activityList}>
//             {recentActivity?.length > 0 ? (
//               recentActivity.slice(0, 10).map((activity, index) => (
//                 <div key={index} className={styles.activityItem}>
//                   <span className={styles.activityIcon}>{getActivityIcon(activity.type)}</span>
//                   <div className={styles.activityContent}>
//                     <span className={styles.activityTitle}>{activity.title}</span>
//                     <span className={styles.activityDesc}>{activity.description}</span>
//                     <span className={styles.activityTime}>
//                       {formatTimeAgo(activity.timestamp)}
//                     </span>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className={styles.noActivity}>No recent activity</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </StudentLayout>
//   );
// }

// // Helper functions
// function formatSkillName(name) {
//   const nameMap = {
//     cognitive: 'Cognitive Skills',
//     language: 'Language',
//     math: 'Mathematics',
//     memory: 'Memory',
//     reading: 'Reading',
//     motorSkills: 'Motor Skills'
//   };
//   return nameMap[name] || name;
// }

// function getSkillIcon(name) {
//   const iconMap = {
//     cognitive: '🧠',
//     language: '📖',
//     math: '🔢',
//     memory: '💭',
//     reading: '📚',
//     motorSkills: '✋'
//   };
//   return iconMap[name] || '📌';
// }

// function getActivityIcon(type) {
//   const iconMap = {
//     'game_completed': '🎮',
//     'level_up': '⬆️',
//     'achievement': '🏆',
//     'badge': '🎖️',
//     'book_read': '📚',
//     'blog_read': '📝'
//   };
//   return iconMap[type] || '📌';
// }

// function formatTimeAgo(date) {
//   const seconds = Math.floor((new Date() - new Date(date)) / 1000);
//   if (seconds < 60) return 'Just now';
//   if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
//   if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
//   if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
//   return new Date(date).toLocaleDateString();
// }























// pages/student/progress.jsx
// Student Progress Page - REAL analytics from Express backend

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import StudentLayout from '../../components/student/StudentLayout';
import styles from '../../styles/StudentProgress.module.css';

// API Base URL - Express Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const timeRanges = [
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'all', label: 'All Time' }
];

export default function StudentProgress() {
  const router = useRouter();
  const { user } = useAuth();
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?._id || user?.id) {
      fetchProgressData();
    }
  }, [user, timeRange]);

  const fetchProgressData = async () => {
    const userId = user?._id || user?.id;
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch real data from all game APIs
      const [mathRes, phonemeRes, wordRes, letterRes] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/mathquest/analytics/${userId}`),
        fetch(`${API_BASE_URL}/phoneme-game/performance?userId=${userId}&timeRange=${timeRange}`),
        fetch(`${API_BASE_URL}/word-formation/performance?userId=${userId}&timeRange=${timeRange}`),
        fetch(`${API_BASE_URL}/letter-tracing/performance?userId=${userId}&timeRange=${timeRange}`)
      ]);

      const mathData = mathRes.status === 'fulfilled' ? await mathRes.value.json() : null;
      const phonemeData = phonemeRes.status === 'fulfilled' ? await phonemeRes.value.json() : null;
      const wordData = wordRes.status === 'fulfilled' ? await wordRes.value.json() : null;
      const letterData = letterRes.status === 'fulfilled' ? await letterRes.value.json() : null;

      const aggregatedData = buildProgressData(mathData, phonemeData, wordData, letterData);
      setProgressData(aggregatedData);

    } catch (error) {
      console.error('Failed to fetch progress:', error);
      setError('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const buildProgressData = (mathData, phonemeData, wordData, letterData) => {
    // Extract stats from each game
    const mathStats = mathData?.analytics || {};
    const phonemeStats = phonemeData?.stats || {};
    const wordStats = wordData?.stats || {};
    const letterStats = letterData?.stats || {};

    // Calculate totals
    const totalGames = (mathStats.totalSessions || 0) + 
                       (phonemeStats.totalGames || 0) + 
                       (wordStats.totalSessions || 0) + 
                       (letterStats.totalSessions || 0);

    const totalScore = (mathStats.totalScore || 0) + 
                       (phonemeStats.totalScore || 0) + 
                       (wordStats.highestScore || 0);

    // Calculate weighted average accuracy
    const accuracyData = [
      { accuracy: mathStats.accuracy || 0, weight: mathStats.totalSessions || 0 },
      { accuracy: phonemeStats.averageAccuracy || 0, weight: phonemeStats.totalGames || 0 },
      { accuracy: wordStats.averageAccuracy || 0, weight: wordStats.totalSessions || 0 },
      { accuracy: letterStats.averageAccuracy || 0, weight: letterStats.totalSessions || 0 }
    ].filter(d => d.weight > 0);

    const totalWeight = accuracyData.reduce((sum, d) => sum + d.weight, 0);
    const avgAccuracy = totalWeight > 0
      ? Math.round(accuracyData.reduce((sum, d) => sum + d.accuracy * d.weight, 0) / totalWeight)
      : 0;

    // Calculate level
    const level = Math.max(1, Math.floor((totalGames / 5) + (avgAccuracy / 20)));
    const xpProgress = (totalGames % 5) * 20 + (avgAccuracy % 20);

    // Game breakdown
    const gameBreakdown = [
      {
        gameName: 'Math Quest',
        gameId: 'mathquest',
        icon: '🔢',
        sessions: mathStats.totalSessions || 0,
        highScore: mathStats.highScore || 0,
        averageAccuracy: mathStats.accuracy || 0,
        totalTime: mathStats.totalTimeSpent || 0
      },
      {
        gameName: 'Phoneme Game',
        gameId: 'phoneme-game',
        icon: '🔊',
        sessions: phonemeStats.totalGames || 0,
        highScore: phonemeStats.totalScore || 0,
        averageAccuracy: phonemeStats.averageAccuracy || 0,
        levelsCompleted: phonemeStats.levelsCompleted || 0
      },
      {
        gameName: 'Word Formation',
        gameId: 'word-formation',
        icon: '📝',
        sessions: wordStats.totalSessions || 0,
        highScore: wordStats.highestScore || 0,
        averageAccuracy: wordStats.averageAccuracy || 0,
        totalWords: wordStats.totalWords || 0
      },
      {
        gameName: 'Letter Tracing',
        gameId: 'letter-tracing',
        icon: '✍️',
        sessions: letterStats.totalSessions || 0,
        lettersCompleted: letterStats.lettersCompleted || 0,
        averageAccuracy: letterStats.averageAccuracy || 0,
        totalAttempts: letterStats.totalAttempts || 0
      }
    ];

    // Skill breakdown
    const skillBreakdown = [
      {
        name: 'math',
        displayName: 'Mathematics',
        icon: '🔢',
        level: Math.min(10, Math.floor((mathStats.totalSessions || 0) / 3) + 1),
        maxLevel: 10,
        percentage: Math.min(100, (mathStats.accuracy || 0))
      },
      {
        name: 'phonics',
        displayName: 'Phonics & Sounds',
        icon: '🔊',
        level: Math.min(10, (phonemeStats.levelsCompleted || 0) * 2),
        maxLevel: 10,
        percentage: Math.min(100, phonemeStats.averageAccuracy || 0)
      },
      {
        name: 'vocabulary',
        displayName: 'Vocabulary',
        icon: '📝',
        level: Math.min(10, Math.floor((wordStats.totalWords || 0) / 5) + 1),
        maxLevel: 10,
        percentage: Math.min(100, wordStats.averageAccuracy || 0)
      },
      {
        name: 'writing',
        displayName: 'Writing & Tracing',
        icon: '✍️',
        level: Math.min(10, Math.floor((letterStats.lettersCompleted || 0) / 3) + 1),
        maxLevel: 10,
        percentage: Math.min(100, letterStats.averageAccuracy || 0)
      }
    ];

    // Build accuracy trend from all games' recent sessions
    const allSessions = [
      ...(phonemeData?.recentSessions || []).map(s => ({ ...s, game: 'Phoneme' })),
      ...(wordData?.recentSessions || []).map(s => ({ ...s, game: 'Word' })),
      ...(letterData?.recentSessions || []).map(s => ({ ...s, game: 'Letter' }))
    ].sort((a, b) => new Date(a.date) - new Date(b.date));

    const accuracyTrend = allSessions.slice(-10).map((session, index) => ({
      date: session.date,
      accuracy: session.accuracy || 0,
      game: session.game
    }));

    // Recent activity
    const recentActivity = allSessions.slice(-10).reverse().map(session => ({
      type: 'game_completed',
      title: `${session.game} Game`,
      description: `Score: ${session.score || 0}, Accuracy: ${session.accuracy}%`,
      timestamp: session.date
    }));

    return {
      overview: {
        totalGamesPlayed: totalGames,
        totalTimePlayed: (mathStats.totalTimeSpent || 0),
        averageAccuracy: avgAccuracy,
        totalScore: totalScore,
        currentStreak: 0, // Would need separate tracking
        longestStreak: 0,
        level: {
          current: level,
          experiencePoints: xpProgress,
          pointsToNextLevel: 100
        }
      },
      analytics: accuracyTrend,
      gameBreakdown,
      skillBreakdown,
      recentActivity,
      rawData: { mathStats, phonemeStats, wordStats, letterStats }
    };
  };

  const formatTime = (seconds) => {
    if (!seconds || seconds === 0) return '0s';
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  const getSkillColor = (name) => {
    const colorMap = {
      math: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
      phonics: 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)',
      vocabulary: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
      writing: 'linear-gradient(90deg, #fa709a 0%, #fee140 100%)'
    };
    return colorMap[name] || 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)';
  };

  if (loading) {
    return (
      <StudentLayout title="My Progress">
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading your progress...</p>
        </div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout title="My Progress">
        <div className={styles.errorState}>
          <p>❌ {error}</p>
          <button onClick={fetchProgressData} className={styles.retryBtn}>Retry</button>
        </div>
      </StudentLayout>
    );
  }

  const { overview, analytics, gameBreakdown, skillBreakdown, recentActivity } = progressData || {};

  return (
    <StudentLayout title="My Progress">
      <Head>
        <title>My Progress | LearnBridge</title>
      </Head>

      <div className={styles.progressPage}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>My Progress 📊</h1>
            <p className={styles.subtitle}>Real-time analytics from your game sessions</p>
          </div>
          <div className={styles.timeRangeSelector}>
            {timeRanges.map((range) => (
              <button
                key={range.id}
                className={`${styles.timeRangeBtn} ${timeRange === range.id ? styles.active : ''}`}
                onClick={() => setTimeRange(range.id)}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'games' ? styles.active : ''}`}
            onClick={() => setActiveTab('games')}
          >
            Games
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'skills' ? styles.active : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            Skills
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <span className={styles.statIcon}>🎮</span>
                  <span className={styles.statValue}>{overview?.totalGamesPlayed || 0}</span>
                  <span className={styles.statLabel}>Total Games</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statIcon}>⏱️</span>
                  <span className={styles.statValue}>{formatTime(overview?.totalTimePlayed || 0)}</span>
                  <span className={styles.statLabel}>Time Played</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statIcon}>🎯</span>
                  <span className={styles.statValue}>{overview?.averageAccuracy || 0}%</span>
                  <span className={styles.statLabel}>Avg Accuracy</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statIcon}>⭐</span>
                  <span className={styles.statValue}>{overview?.totalScore?.toLocaleString() || 0}</span>
                  <span className={styles.statLabel}>Total Score</span>
                </div>
              </div>

              {/* Level Progress */}
              <div className={styles.levelCard}>
                <div className={styles.levelHeader}>
                  <h3>Learning Level</h3>
                  <span className={styles.levelBadge}>Level {overview?.level?.current || 1}</span>
                </div>
                <div className={styles.levelProgress}>
                  <div 
                    className={styles.levelFill}
                    style={{ 
                      width: `${((overview?.level?.experiencePoints || 0) / (overview?.level?.pointsToNextLevel || 100)) * 100}%` 
                    }}
                  ></div>
                </div>
                <p className={styles.levelText}>
                  {overview?.level?.experiencePoints || 0} / {overview?.level?.pointsToNextLevel || 100} XP to next level
                </p>
              </div>

              {/* Accuracy Trend Chart */}
              {analytics && analytics.length > 0 && (
                <div className={styles.chartSection}>
                  <h3 className={styles.chartTitle}>Accuracy Trend</h3>
                  <div className={styles.chartContainer}>
                    <svg viewBox="0 0 800 200" className={styles.chart}>
                      {/* Grid lines */}
                      {[0, 25, 50, 75, 100].map((y) => (
                        <g key={y}>
                          <line x1="50" y1={180 - y * 1.6} x2="750" y2={180 - y * 1.6} stroke="#e5e7eb" strokeWidth="1" />
                          <text x="30" y={185 - y * 1.6} fill="#6b7280" fontSize="10">{y}%</text>
                        </g>
                      ))}
                      
                      {/* Data line */}
                      {analytics.length > 1 && (
                        <polyline
                          points={analytics.map((point, i) => {
                            const x = 50 + (i * 700) / (analytics.length - 1);
                            const y = 180 - (point.accuracy * 1.6);
                            return `${x},${y}`;
                          }).join(' ')}
                          stroke="#4f46e5"
                          strokeWidth="2"
                          fill="none"
                        />
                      )}
                      
                      {/* Data points */}
                      {analytics.map((point, i) => {
                        const x = 50 + (i * 700) / Math.max(analytics.length - 1, 1);
                        const y = 180 - (point.accuracy * 1.6);
                        return (
                          <circle key={i} cx={x} cy={y} r="4" fill="#4f46e5">
                            <title>{point.game}: {point.accuracy}%</title>
                          </circle>
                        );
                      })}
                    </svg>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'games' && (
            <div className={styles.gamesTab}>
              <h3 className={styles.sectionTitle}>Game Performance (Real Data)</h3>
              <div className={styles.gamesList}>
                {gameBreakdown?.map((game, index) => (
                  <div key={index} className={styles.gameCard}>
                    <div className={styles.gameCardHeader}>
                      <span className={styles.gameIcon}>{game.icon}</span>
                      <h4>{game.gameName}</h4>
                      <span className={styles.sessionCount}>{game.sessions} sessions</span>
                    </div>
                    <div className={styles.gameStats}>
                      <div className={styles.gameStat}>
                        <span className={styles.gameStatLabel}>
                          {game.gameId === 'letter-tracing' ? 'Letters Done' : 'High Score'}
                        </span>
                        <span className={styles.gameStatValue}>
                          {game.gameId === 'letter-tracing' ? game.lettersCompleted : game.highScore}
                        </span>
                      </div>
                      <div className={styles.gameStat}>
                        <span className={styles.gameStatLabel}>Avg Accuracy</span>
                        <span className={styles.gameStatValue}>{game.averageAccuracy}%</span>
                      </div>
                      {game.totalTime > 0 && (
                        <div className={styles.gameStat}>
                          <span className={styles.gameStatLabel}>Time Played</span>
                          <span className={styles.gameStatValue}>{formatTime(game.totalTime)}</span>
                        </div>
                      )}
                      {game.totalWords > 0 && (
                        <div className={styles.gameStat}>
                          <span className={styles.gameStatLabel}>Words Solved</span>
                          <span className={styles.gameStatValue}>{game.totalWords}</span>
                        </div>
                      )}
                      {game.levelsCompleted > 0 && (
                        <div className={styles.gameStat}>
                          <span className={styles.gameStatLabel}>Levels Done</span>
                          <span className={styles.gameStatValue}>{game.levelsCompleted}</span>
                        </div>
                      )}
                    </div>
                    <button 
                      className={styles.playAgainBtn}
                      onClick={() => router.push('/student/games')}
                    >
                      Play Again →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className={styles.skillsTab}>
              <h3 className={styles.sectionTitle}>Skill Development</h3>
              <div className={styles.skillsGrid}>
                {skillBreakdown?.map((skill, index) => (
                  <div key={index} className={styles.skillCard}>
                    <div className={styles.skillCardHeader}>
                      <span className={styles.skillIcon}>{skill.icon}</span>
                      <div>
                        <h4>{skill.displayName}</h4>
                        <span className={styles.skillLevel}>Level {skill.level}/{skill.maxLevel}</span>
                      </div>
                    </div>
                    <div className={styles.skillProgress}>
                      <div 
                        className={styles.skillFill}
                        style={{ 
                          width: `${skill.percentage}%`,
                          background: getSkillColor(skill.name)
                        }}
                      ></div>
                    </div>
                    <p className={styles.skillPercentage}>{skill.percentage}% mastery</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity Sidebar */}
        <div className={styles.activitySidebar}>
          <h3 className={styles.sidebarTitle}>Recent Activity</h3>
          <div className={styles.activityList}>
            {recentActivity?.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className={styles.activityItem}>
                  <span className={styles.activityIcon}>🎮</span>
                  <div className={styles.activityContent}>
                    <span className={styles.activityTitle}>{activity.title}</span>
                    <span className={styles.activityDesc}>{activity.description}</span>
                    <span className={styles.activityTime}>
                      {activity.timestamp ? new Date(activity.timestamp).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noActivity}>No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}



























