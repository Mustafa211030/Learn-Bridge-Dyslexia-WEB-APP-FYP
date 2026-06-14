// // pages/student/dashboard.jsx
// // Student Dashboard - Main landing page for students

// import { useState, useEffect } from 'react';
// import Head from 'next/head';
// import Link from 'next/link';
// import { useAuth } from '../../contexts/AuthContext';
// import { studentAPI } from '../../services/api';
// import StudentLayout from '../../components/student/StudentLayout';
// import GameCard from '../../components/student/GameCard';
// import BlogCard from '../../components/student/BlogCard';
// import { StatCard, SkillProgressBar } from '../../components/student/ProgressChart';
// import styles from '../../styles/StudentDashboard.module.css';

// export default function StudentDashboard() {
//   const { user } = useAuth();
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const response = await studentAPI.getDashboard();
//       if (response.data?.success) {
//         setDashboardData(response.data.data);
//       }
//     } catch (err) {
//       console.error('Dashboard fetch error:', err);
//       setError('Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <StudentLayout title="Dashboard">
//         <div className={styles.loadingState}>
//           <div className={styles.spinner}></div>
//           <p>Loading your dashboard...</p>
//         </div>
//       </StudentLayout>
//     );
//   }

//   if (error) {
//     return (
//       <StudentLayout title="Dashboard">
//         <div className={styles.errorState}>
//           <span className={styles.errorIcon}>⚠️</span>
//           <p>{error}</p>
//           <button onClick={fetchDashboardData} className={styles.retryBtn}>
//             Try Again
//           </button>
//         </div>
//       </StudentLayout>
//     );
//   }

//   const { progress, recentGames, availableGames, recentBlogs, unreadNotifications, streak } = dashboardData || {};

//   return (
//     <StudentLayout title="Dashboard">
//       <Head>
//         <title>Student Dashboard | LearnBridge</title>
//       </Head>

//       <div className={styles.dashboard}>
//         {/* Welcome Section */}
//         <section className={styles.welcomeSection}>
//           <div className={styles.welcomeContent}>
//             <h1 className={styles.welcomeTitle}>
//               Welcome back, {user?.firstName || 'Student'}! 👋
//             </h1>
//             <p className={styles.welcomeSubtitle}>
//               Ready to continue your learning adventure? Let's see what you can achieve today!
//             </p>
//           </div>
//           <div className={styles.welcomeStats}>
//             <div className={styles.levelBadge}>
//               <span className={styles.levelIcon}>⭐</span>
//               <div className={styles.levelInfo}>
//                 <span className={styles.levelLabel}>Level</span>
//                 <span className={styles.levelValue}>{progress?.level?.current || 1}</span>
//               </div>
//             </div>
//             {streak?.current > 0 && (
//               <div className={styles.streakBadge}>
//                 <span className={styles.streakIcon}>🔥</span>
//                 <span className={styles.streakValue}>{streak.current} day streak!</span>
//               </div>
//             )}
//           </div>
//         </section>

//         {/* Quick Stats */}
//         <section className={styles.statsSection}>
//           <div className={styles.statsGrid}>
//             <StatCard
//               icon="🎮"
//               label="Games Played"
//               value={progress?.overallStats?.totalGamesPlayed || 0}
//             />
//             <StatCard
//               icon="⏱️"
//               label="Time Played"
//               value={formatTime(progress?.overallStats?.totalTimePlayed || 0)}
//             />
//             <StatCard
//               icon="🎯"
//               label="Avg Accuracy"
//               value={`${progress?.overallStats?.averageAccuracy || 0}%`}
//             />
//             <StatCard
//               icon="🏆"
//               label="Achievements"
//               value={progress?.achievementsCount || 0}
//             />
//           </div>
//         </section>

//         {/* Main Content Grid */}
//         <div className={styles.mainGrid}>
//           {/* Left Column */}
//           <div className={styles.leftColumn}>
//             {/* Quick Actions */}
//             <section className={styles.quickActions}>
//               <h2 className={styles.sectionTitle}>Quick Actions</h2>
//               <div className={styles.actionButtons}>
//                 <Link href="/student/games" className={styles.actionBtn}>
//                   <span className={styles.actionIcon}>🎮</span>
//                   <span className={styles.actionText}>Play Games</span>
//                 </Link>
//                 <Link href="/student/ebooks" className={styles.actionBtn}>
//                   <span className={styles.actionIcon}>📚</span>
//                   <span className={styles.actionText}>Read Books</span>
//                 </Link>
//                 <Link href="/student/progress" className={styles.actionBtn}>
//                   <span className={styles.actionIcon}>📊</span>
//                   <span className={styles.actionText}>View Progress</span>
//                 </Link>
//                 <Link href="/student/blogs" className={styles.actionBtn}>
//                   <span className={styles.actionIcon}>📝</span>
//                   <span className={styles.actionText}>Read Blogs</span>
//                 </Link>
//               </div>
//             </section>

//             {/* Available Games */}
//             <section className={styles.gamesSection}>
//               <div className={styles.sectionHeader}>
//                 <h2 className={styles.sectionTitle}>Games for You</h2>
//                 <Link href="/student/games" className={styles.viewAllLink}>
//                   View All →
//                 </Link>
//               </div>
//               <div className={styles.gamesGrid}>
//                 {availableGames?.slice(0, 4).map((game) => (
//                   <GameCard
//                     key={game.gameId}
//                     game={game}
//                     userProgress={game.userProgress}
//                   />
//                 ))}
//               </div>
//             </section>

//             {/* Recent Blogs */}
//             {recentBlogs?.length > 0 && (
//               <section className={styles.blogsSection}>
//                 <div className={styles.sectionHeader}>
//                   <h2 className={styles.sectionTitle}>Latest Articles</h2>
//                   <Link href="/student/blogs" className={styles.viewAllLink}>
//                     View All →
//                   </Link>
//                 </div>
//                 <div className={styles.blogsGrid}>
//                   {recentBlogs.map((blog) => (
//                     <BlogCard key={blog._id} blog={blog} variant="compact" />
//                   ))}
//                 </div>
//               </section>
//             )}
//           </div>

//           {/* Right Column - Sidebar */}
//           <div className={styles.rightColumn}>
//             {/* Skills Progress */}
//             <div className={styles.skillsCard}>
//               <h3 className={styles.cardTitle}>Your Skills</h3>
//               <div className={styles.skillsList}>
//                 {progress?.skills && Object.entries(progress.skills).map(([name, data]) => (
//                   <SkillProgressBar
//                     key={name}
//                     name={formatSkillName(name)}
//                     level={data?.currentLevel || 1}
//                     maxLevel={data?.maxLevel || 10}
//                     color={getSkillColor(name)}
//                   />
//                 ))}
//               </div>
//               <Link href="/student/progress" className={styles.viewProgressLink}>
//                 View Detailed Progress →
//               </Link>
//             </div>

//             {/* Recent Activity */}
//             <div className={styles.activityCard}>
//               <h3 className={styles.cardTitle}>Recent Activity</h3>
//               <div className={styles.activityList}>
//                 {progress?.recentActivity?.length > 0 ? (
//                   progress.recentActivity.slice(0, 5).map((activity, index) => (
//                     <div key={index} className={styles.activityItem}>
//                       <span className={styles.activityIcon}>
//                         {getActivityIcon(activity.type)}
//                       </span>
//                       <div className={styles.activityContent}>
//                         <span className={styles.activityTitle}>{activity.title}</span>
//                         <span className={styles.activityTime}>
//                           {formatTimeAgo(activity.timestamp)}
//                         </span>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p className={styles.noActivity}>No recent activity yet. Start playing!</p>
//                 )}
//               </div>
//             </div>

//             {/* Achievements Preview */}
//             {progress?.achievementsCount > 0 && (
//               <div className={styles.achievementsCard}>
//                 <h3 className={styles.cardTitle}>Recent Achievements</h3>
//                 <div className={styles.achievementsList}>
//                   {progress.recentActivity
//                     ?.filter(a => a.type === 'achievement')
//                     .slice(0, 3)
//                     .map((achievement, index) => (
//                       <div key={index} className={styles.achievementItem}>
//                         <span className={styles.achievementIcon}>
//                           {achievement.metadata?.icon || '🏆'}
//                         </span>
//                         <span className={styles.achievementName}>
//                           {achievement.metadata?.name || achievement.title}
//                         </span>
//                       </div>
//                     ))}
//                 </div>
//                 <Link href="/student/achievements" className={styles.viewAchievementsLink}>
//                   View All Achievements →
//                 </Link>
//               </div>
//             )}

//             {/* Notifications Preview */}
//             {unreadNotifications > 0 && (
//               <div className={styles.notificationsPreview}>
//                 <span className={styles.notifIcon}>🔔</span>
//                 <span className={styles.notifText}>
//                   You have {unreadNotifications} unread notification{unreadNotifications > 1 ? 's' : ''}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </StudentLayout>
//   );
// }

// // Helper functions
// function formatTime(seconds) {
//   if (seconds < 60) return `${seconds}s`;
//   if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
//   const hours = Math.floor(seconds / 3600);
//   const mins = Math.floor((seconds % 3600) / 60);
//   return `${hours}h ${mins}m`;
// }

// function formatSkillName(name) {
//   const nameMap = {
//     cognitive: 'Cognitive',
//     language: 'Language',
//     math: 'Math',
//     memory: 'Memory',
//     reading: 'Reading',
//     motorSkills: 'Motor Skills'
//   };
//   return nameMap[name] || name;
// }

// function getSkillColor(name) {
//   const colorMap = {
//     cognitive: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
//     language: 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)',
//     math: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
//     memory: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
//     reading: 'linear-gradient(90deg, #fa709a 0%, #fee140 100%)',
//     motorSkills: 'linear-gradient(90deg, #a8edea 0%, #fed6e3 100%)'
//   };
//   return colorMap[name] || 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)';
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




















// pages/student/dashboard.jsx
// Student Dashboard - Main landing page with REAL game data from Express backend

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import StudentLayout from '../../components/student/StudentLayout';
import styles from '../../styles/StudentDashboard.module.css';

// API Base URL - Express Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?._id || user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    const userId = user?._id || user?.id;
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch real data from all game APIs in parallel
      const [mathRes, phonemeRes, wordRes, letterRes] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/mathquest/analytics/${userId}`),
        fetch(`${API_BASE_URL}/phoneme-game/performance?userId=${userId}&timeRange=all`),
        fetch(`${API_BASE_URL}/word-formation/performance?userId=${userId}&timeRange=all`),
        fetch(`${API_BASE_URL}/letter-tracing/performance?userId=${userId}&timeRange=all`)
      ]);

      // Parse responses
      const mathData = mathRes.status === 'fulfilled' ? await mathRes.value.json() : null;
      const phonemeData = phonemeRes.status === 'fulfilled' ? await phonemeRes.value.json() : null;
      const wordData = wordRes.status === 'fulfilled' ? await wordRes.value.json() : null;
      const letterData = letterRes.status === 'fulfilled' ? await letterRes.value.json() : null;

      // Aggregate statistics
      const aggregatedData = aggregateGameStats(mathData, phonemeData, wordData, letterData);
      setDashboardData(aggregatedData);

    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const aggregateGameStats = (mathData, phonemeData, wordData, letterData) => {
    // Math Quest stats
    const mathStats = mathData?.analytics || {};
    const mathSessions = mathStats.totalSessions || 0;
    const mathScore = mathStats.totalScore || 0;
    const mathAccuracy = mathStats.accuracy || 0;

    // Phoneme Game stats
    const phonemeStats = phonemeData?.stats || {};
    const phonemeSessions = phonemeStats.totalGames || 0;
    const phonemeScore = phonemeStats.totalScore || 0;
    const phonemeAccuracy = phonemeStats.averageAccuracy || 0;

    // Word Formation stats
    const wordStats = wordData?.stats || {};
    const wordSessions = wordStats.totalSessions || 0;
    const wordScore = wordStats.highestScore || 0;
    const wordAccuracy = wordStats.averageAccuracy || 0;

    // Letter Tracing stats
    const letterStats = letterData?.stats || {};
    const letterSessions = letterStats.totalSessions || 0;
    const letterAccuracy = letterStats.averageAccuracy || 0;
    const lettersCompleted = letterStats.lettersCompleted || 0;

    // Calculate totals
    const totalGames = mathSessions + phonemeSessions + wordSessions + letterSessions;
    const totalScore = mathScore + phonemeScore + wordScore;
    
    // Calculate weighted average accuracy
    const accuracies = [
      { value: mathAccuracy, weight: mathSessions },
      { value: phonemeAccuracy, weight: phonemeSessions },
      { value: wordAccuracy, weight: wordSessions },
      { value: letterAccuracy, weight: letterSessions }
    ].filter(a => a.weight > 0);
    
    const totalWeight = accuracies.reduce((sum, a) => sum + a.weight, 0);
    const avgAccuracy = totalWeight > 0 
      ? Math.round(accuracies.reduce((sum, a) => sum + (a.value * a.weight), 0) / totalWeight)
      : 0;

    // Calculate level based on total games and accuracy
    const level = Math.max(1, Math.floor((totalGames / 5) + (avgAccuracy / 20)));

    // Build game breakdown for display
    const gameBreakdown = [
      {
        gameId: 'mathquest',
        gameName: 'Math Quest',
        icon: '🔢',
        sessions: mathSessions,
        highScore: mathStats.highScore || 0,
        accuracy: mathAccuracy
      },
      {
        gameId: 'phoneme-game',
        gameName: 'Phoneme Game',
        icon: '🔊',
        sessions: phonemeSessions,
        highScore: phonemeScore,
        accuracy: phonemeAccuracy,
        levelsCompleted: phonemeStats.levelsCompleted || 0
      },
      {
        gameId: 'word-formation',
        gameName: 'Word Formation',
        icon: '📝',
        sessions: wordSessions,
        highScore: wordScore,
        accuracy: wordAccuracy,
        totalWords: wordStats.totalWords || 0
      },
      {
        gameId: 'letter-tracing',
        gameName: 'Letter Tracing',
        icon: '✍️',
        sessions: letterSessions,
        lettersCompleted: lettersCompleted,
        accuracy: letterAccuracy
      }
    ];

    // Recent sessions from all games
    const recentSessions = [
      ...(phonemeData?.recentSessions || []).map(s => ({ ...s, game: 'Phoneme Game', icon: '🔊' })),
      ...(wordData?.recentSessions || []).map(s => ({ ...s, game: 'Word Formation', icon: '📝' })),
      ...(letterData?.recentSessions || []).map(s => ({ ...s, game: 'Letter Tracing', icon: '✍️' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    return {
      overview: {
        totalGamesPlayed: totalGames,
        totalScore: totalScore,
        averageAccuracy: avgAccuracy,
        level: level,
        lettersLearned: lettersCompleted,
        wordsFormed: wordStats.totalWords || 0
      },
      gameBreakdown,
      recentSessions,
      mathData: mathStats,
      phonemeData: phonemeStats,
      wordData: wordStats,
      letterData: letterStats
    };
  };

  if (loading) {
    return (
      <StudentLayout title="Dashboard">
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading your dashboard...</p>
        </div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout title="Dashboard">
        <div className={styles.errorState}>
          <span className={styles.errorIcon}>⚠️</span>
          <p>{error}</p>
          <button onClick={fetchDashboardData} className={styles.retryBtn}>
            Try Again
          </button>
        </div>
      </StudentLayout>
    );
  }

  const { overview, gameBreakdown, recentSessions } = dashboardData || {};

  return (
    <StudentLayout title="Dashboard">
      <Head>
        <title>Student Dashboard | LearnBridge</title>
      </Head>

      <div className={styles.dashboard}>
        {/* Welcome Section */}
        <section className={styles.welcomeSection}>
          <div className={styles.welcomeContent}>
            <h1 className={styles.welcomeTitle}>
              Welcome back, {user?.firstName || user?.name || 'Student'}! 👋
            </h1>
            <p className={styles.welcomeSubtitle}>
              Ready to continue your learning adventure? Let's see what you can achieve today!
            </p>
          </div>
          <div className={styles.welcomeStats}>
            <div className={styles.levelBadge}>
              <span className={styles.levelIcon}>⭐</span>
              <div className={styles.levelInfo}>
                <span className={styles.levelLabel}>Level</span>
                <span className={styles.levelValue}>{overview?.level || 1}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats - REAL DATA */}
        <section className={styles.statsSection}>
          <h2 className={styles.sectionTitle}>📊 Your Progress (Real Data)</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>🎮</span>
              <span className={styles.statValue}>{overview?.totalGamesPlayed || 0}</span>
              <span className={styles.statLabel}>Games Played</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>🏆</span>
              <span className={styles.statValue}>{overview?.totalScore?.toLocaleString() || 0}</span>
              <span className={styles.statLabel}>Total Score</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>🎯</span>
              <span className={styles.statValue}>{overview?.averageAccuracy || 0}%</span>
              <span className={styles.statLabel}>Avg Accuracy</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>🔤</span>
              <span className={styles.statValue}>{overview?.lettersLearned || 0}</span>
              <span className={styles.statLabel}>Letters Traced</span>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className={styles.mainGrid}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Quick Actions */}
            <section className={styles.quickActions}>
              <h2 className={styles.sectionTitle}>Quick Actions</h2>
              <div className={styles.actionButtons}>
                <Link href="/student/games" className={styles.actionBtn}>
                  <span className={styles.actionIcon}>🎮</span>
                  <span className={styles.actionText}>Play Games</span>
                </Link>
                <Link href="/student/ebooks" className={styles.actionBtn}>
                  <span className={styles.actionIcon}>📚</span>
                  <span className={styles.actionText}>Read Books</span>
                </Link>
                <Link href="/student/progress" className={styles.actionBtn}>
                  <span className={styles.actionIcon}>📊</span>
                  <span className={styles.actionText}>View Progress</span>
                </Link>
                <Link href="/student/parent-view" className={styles.actionBtn}>
                  <span className={styles.actionIcon}>👨‍👩‍👧</span>
                  <span className={styles.actionText}>Parent View</span>
                </Link>
              </div>
            </section>

            {/* Game Performance - REAL DATA */}
            <section className={styles.gamesSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>🎮 Game Performance</h2>
                <Link href="/student/games" className={styles.viewAllLink}>
                  Play Games →
                </Link>
              </div>
              <div className={styles.gamesGrid}>
                {gameBreakdown?.map((game) => (
                  <div key={game.gameId} className={styles.gameCard}>
                    <div className={styles.gameCardHeader}>
                      <span className={styles.gameIcon}>{game.icon}</span>
                      <h4>{game.gameName}</h4>
                    </div>
                    <div className={styles.gameStats}>
                      <div className={styles.gameStat}>
                        <span className={styles.gameStatLabel}>Sessions</span>
                        <span className={styles.gameStatValue}>{game.sessions}</span>
                      </div>
                      <div className={styles.gameStat}>
                        <span className={styles.gameStatLabel}>
                          {game.gameId === 'letter-tracing' ? 'Letters' : 'High Score'}
                        </span>
                        <span className={styles.gameStatValue}>
                          {game.gameId === 'letter-tracing' ? game.lettersCompleted : game.highScore}
                        </span>
                      </div>
                      <div className={styles.gameStat}>
                        <span className={styles.gameStatLabel}>Accuracy</span>
                        <span className={styles.gameStatValue}>{game.accuracy}%</span>
                      </div>
                    </div>
                    <Link href="/student/games" className={styles.playAgainBtn}>
                      Play Now →
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className={styles.rightColumn}>
            {/* Recent Activity - REAL DATA */}
            <div className={styles.activityCard}>
              <h3 className={styles.cardTitle}>Recent Sessions</h3>
              <div className={styles.activityList}>
                {recentSessions?.length > 0 ? (
                  recentSessions.map((session, index) => (
                    <div key={index} className={styles.activityItem}>
                      <span className={styles.activityIcon}>{session.icon}</span>
                      <div className={styles.activityContent}>
                        <span className={styles.activityTitle}>{session.game}</span>
                        <span className={styles.activityDesc}>
                          Score: {session.score || 0} | Accuracy: {session.accuracy}%
                        </span>
                        <span className={styles.activityTime}>
                          {session.date ? new Date(session.date).toLocaleDateString() : 'Recently'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={styles.noActivity}>No recent activity yet. Start playing!</p>
                )}
              </div>
            </div>

            {/* Skills Summary */}
            <div className={styles.skillsCard}>
              <h3 className={styles.cardTitle}>Skills Developed</h3>
              <div className={styles.skillsList}>
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>🔢 Math Skills</span>
                  <div className={styles.skillBar}>
                    <div 
                      className={styles.skillFill} 
                      style={{ width: `${Math.min(100, (dashboardData?.mathData?.totalSessions || 0) * 10)}%` }}
                    ></div>
                  </div>
                </div>
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>🔊 Phonics</span>
                  <div className={styles.skillBar}>
                    <div 
                      className={styles.skillFill} 
                      style={{ width: `${Math.min(100, (dashboardData?.phonemeData?.levelsCompleted || 0) * 20)}%` }}
                    ></div>
                  </div>
                </div>
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>📝 Vocabulary</span>
                  <div className={styles.skillBar}>
                    <div 
                      className={styles.skillFill} 
                      style={{ width: `${Math.min(100, (dashboardData?.wordData?.totalWords || 0) * 5)}%` }}
                    ></div>
                  </div>
                </div>
                <div className={styles.skillItem}>
                  <span className={styles.skillName}>✍️ Writing</span>
                  <div className={styles.skillBar}>
                    <div 
                      className={styles.skillFill} 
                      style={{ width: `${Math.min(100, (dashboardData?.letterData?.lettersCompleted || 0) * 4)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <Link href="/student/progress" className={styles.viewProgressLink}>
                View Detailed Progress →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}



