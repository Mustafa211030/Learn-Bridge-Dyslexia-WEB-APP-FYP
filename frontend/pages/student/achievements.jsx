// // pages/student/achievements.jsx
// // Student achievements and badges page

// import { useState, useEffect } from 'react';
// import Head from 'next/head';
// import StudentLayout from '../../components/student/StudentLayout';
// import BadgeGrid from '../../components/student/BadgeGrid';
// import { studentAPI } from '../../services/studentAPI';
// import styles from '../../styles/StudentAchievements.module.css';

// export default function StudentAchievements() {
//   const [progressData, setProgressData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchProgress();
//   }, []);

//   const fetchProgress = async () => {
//     try {
//       setLoading(true);
//       const response = await studentAPI.getProgress();
//       if (response.data?.success) {
//         setProgressData(response.data.data);
//       }
//     } catch (err) {
//       console.error('Failed to fetch progress:', err);
//       setError('Failed to load achievements');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Predefined achievements that can be unlocked
//   const allAchievements = [
//     { achievementId: 'first-game', name: 'First Steps', description: 'Complete your first game', icon: '🎮', category: 'games' },
//     { achievementId: 'ten-games', name: 'Getting Started', description: 'Play 10 games', icon: '🌟', category: 'games' },
//     { achievementId: 'fifty-games', name: 'Game Master', description: 'Play 50 games', icon: '🎯', category: 'games' },
//     { achievementId: 'hundred-games', name: 'Gaming Legend', description: 'Play 100 games', icon: '👑', category: 'games' },
//     { achievementId: 'accuracy-master', name: 'Accuracy Master', description: 'Achieve 90%+ accuracy', icon: '🎯', category: 'progress' },
//     { achievementId: 'perfect-score', name: 'Perfect Score', description: 'Get a perfect score in any game', icon: '💯', category: 'progress' },
//     { achievementId: 'streak-3', name: 'On Fire', description: 'Maintain a 3-day streak', icon: '🔥', category: 'streak' },
//     { achievementId: 'streak-7', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '⚡', category: 'streak' },
//     { achievementId: 'streak-30', name: 'Monthly Master', description: 'Maintain a 30-day streak', icon: '🏆', category: 'streak' },
//     { achievementId: 'first-book', name: 'Bookworm', description: 'Read your first book', icon: '📚', category: 'reading' },
//     { achievementId: 'five-books', name: 'Avid Reader', description: 'Read 5 books', icon: '📖', category: 'reading' },
//     { achievementId: 'level-5', name: 'Rising Star', description: 'Reach level 5', icon: '⭐', category: 'progress' },
//     { achievementId: 'level-10', name: 'Knowledge Seeker', description: 'Reach level 10', icon: '🌟', category: 'progress' },
//     { achievementId: 'all-games', name: 'Explorer', description: 'Try all available games', icon: '🗺️', category: 'special' },
//     { achievementId: 'phoneme-master', name: 'Sound Expert', description: 'Complete Phoneme Game 10 times', icon: '🔤', category: 'games' },
//     { achievementId: 'word-master', name: 'Word Wizard', description: 'Complete Word Formation 10 times', icon: '📝', category: 'games' },
//   ];

//   // Predefined badges
//   const allBadges = [
//     { badgeId: 'bronze-player', name: 'Bronze Player', description: 'Play 5 games', icon: '🥉', tier: 'bronze' },
//     { badgeId: 'silver-player', name: 'Silver Player', description: 'Play 25 games', icon: '🥈', tier: 'silver' },
//     { badgeId: 'gold-player', name: 'Gold Player', description: 'Play 50 games', icon: '🥇', tier: 'gold' },
//     { badgeId: 'platinum-player', name: 'Platinum Player', description: 'Play 100 games', icon: '💎', tier: 'platinum' },
//     { badgeId: 'bronze-reader', name: 'Bronze Reader', description: 'Read 2 books', icon: '📕', tier: 'bronze' },
//     { badgeId: 'silver-reader', name: 'Silver Reader', description: 'Read 5 books', icon: '📗', tier: 'silver' },
//     { badgeId: 'gold-reader', name: 'Gold Reader', description: 'Read 10 books', icon: '📘', tier: 'gold' },
//     { badgeId: 'bronze-streak', name: 'Consistent Learner', description: '3-day streak', icon: '🔥', tier: 'bronze' },
//     { badgeId: 'silver-streak', name: 'Dedicated Student', description: '7-day streak', icon: '⚡', tier: 'silver' },
//     { badgeId: 'gold-streak', name: 'Learning Champion', description: '14-day streak', icon: '🌟', tier: 'gold' },
//   ];

//   if (loading) {
//     return (
//       <StudentLayout title="Achievements">
//         <div className={styles.loading}>
//           <div className={styles.spinner}></div>
//           <p>Loading achievements...</p>
//         </div>
//       </StudentLayout>
//     );
//   }

//   if (error) {
//     return (
//       <StudentLayout title="Achievements">
//         <div className={styles.error}>
//           <span className={styles.errorIcon}>😕</span>
//           <p>{error}</p>
//           <button onClick={fetchProgress} className={styles.retryBtn}>
//             Try Again
//           </button>
//         </div>
//       </StudentLayout>
//     );
//   }

//   const earnedAchievements = progressData?.achievements || [];
//   const earnedBadges = progressData?.badges || [];
//   const earnedIds = new Set(earnedAchievements.map(a => a.achievementId));
//   const earnedBadgeIds = new Set(earnedBadges.map(b => b.badgeId));

//   return (
//     <StudentLayout title="Achievements">
//       <Head>
//         <title>Achievements | LearnBridge Student</title>
//       </Head>

//       <div className={styles.container}>
//         {/* Header */}
//         <div className={styles.header}>
//           <h1 className={styles.title}>🏆 Achievements & Badges</h1>
//           <p className={styles.subtitle}>
//             Track your progress and collect rewards for your learning journey!
//           </p>
//         </div>

//         {/* Stats */}
//         <div className={styles.stats}>
//           <div className={styles.statCard}>
//             <span className={styles.statIcon}>🏆</span>
//             <div className={styles.statInfo}>
//               <span className={styles.statValue}>
//                 {earnedAchievements.length}/{allAchievements.length}
//               </span>
//               <span className={styles.statLabel}>Achievements</span>
//             </div>
//           </div>
//           <div className={styles.statCard}>
//             <span className={styles.statIcon}>🎖️</span>
//             <div className={styles.statInfo}>
//               <span className={styles.statValue}>
//                 {earnedBadges.length}/{allBadges.length}
//               </span>
//               <span className={styles.statLabel}>Badges</span>
//             </div>
//           </div>
//           <div className={styles.statCard}>
//             <span className={styles.statIcon}>⭐</span>
//             <div className={styles.statInfo}>
//               <span className={styles.statValue}>
//                 Level {progressData?.overview?.level?.current || 1}
//               </span>
//               <span className={styles.statLabel}>Current Level</span>
//             </div>
//           </div>
//         </div>

//         {/* Earned Section */}
//         <section className={styles.section}>
//           <h2 className={styles.sectionTitle}>🌟 Your Collection</h2>
//           <BadgeGrid 
//             badges={earnedBadges}
//             achievements={earnedAchievements}
//             showAll={true}
//           />
//         </section>

//         {/* Locked Achievements */}
//         <section className={styles.section}>
//           <h2 className={styles.sectionTitle}>🔒 Achievements to Unlock</h2>
//           <div className={styles.lockedGrid}>
//             {allAchievements.filter(a => !earnedIds.has(a.achievementId)).map((achievement) => (
//               <div key={achievement.achievementId} className={styles.lockedCard}>
//                 <div className={styles.lockedIcon}>
//                   <span className={styles.lockedEmoji}>{achievement.icon}</span>
//                   <div className={styles.lockOverlay}>🔒</div>
//                 </div>
//                 <div className={styles.lockedInfo}>
//                   <span className={styles.lockedName}>{achievement.name}</span>
//                   <span className={styles.lockedDesc}>{achievement.description}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Locked Badges */}
//         <section className={styles.section}>
//           <h2 className={styles.sectionTitle}>🎖️ Badges to Earn</h2>
//           <div className={styles.lockedGrid}>
//             {allBadges.filter(b => !earnedBadgeIds.has(b.badgeId)).map((badge) => (
//               <div key={badge.badgeId} className={`${styles.lockedCard} ${styles[badge.tier]}`}>
//                 <div className={styles.lockedIcon}>
//                   <span className={styles.lockedEmoji}>{badge.icon}</span>
//                   <div className={styles.lockOverlay}>🔒</div>
//                 </div>
//                 <div className={styles.lockedInfo}>
//                   <span className={styles.lockedName}>{badge.name}</span>
//                   <span className={styles.lockedDesc}>{badge.description}</span>
//                   <span className={`${styles.tierBadge} ${styles[badge.tier]}`}>
//                     {badge.tier}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </div>
//     </StudentLayout>
//   );
// }
































// pages/student/achievements.jsx
// Student achievements and badges page with REAL data from Express backend

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../../contexts/AuthContext';
import StudentLayout from '../../components/student/StudentLayout';
import styles from '../../styles/StudentAchievements.module.css';

// API Base URL - Express Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function StudentAchievements() {
  const { user } = useAuth();
  const [achievementData, setAchievementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?._id || user?.id) {
      fetchAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    const userId = user?._id || user?.id;
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch real data from all game APIs
      const [mathRes, phonemeRes, wordRes, letterRes] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/mathquest/analytics/${userId}`),
        fetch(`${API_BASE_URL}/phoneme-game/performance?userId=${userId}&timeRange=all`),
        fetch(`${API_BASE_URL}/word-formation/performance?userId=${userId}&timeRange=all`),
        fetch(`${API_BASE_URL}/letter-tracing/performance?userId=${userId}&timeRange=all`)
      ]);

      const mathData = mathRes.status === 'fulfilled' ? await mathRes.value.json() : null;
      const phonemeData = phonemeRes.status === 'fulfilled' ? await phonemeRes.value.json() : null;
      const wordData = wordRes.status === 'fulfilled' ? await wordRes.value.json() : null;
      const letterData = letterRes.status === 'fulfilled' ? await letterRes.value.json() : null;

      const processedData = calculateAchievements(mathData, phonemeData, wordData, letterData);
      setAchievementData(processedData);

    } catch (err) {
      console.error('Failed to fetch achievements:', err);
      setError('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const calculateAchievements = (mathData, phonemeData, wordData, letterData) => {
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

    // Calculate average accuracy
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

    // Define all achievements with unlock conditions
    const allAchievements = [
      // Game milestones
      { 
        achievementId: 'first-game', 
        name: 'First Steps', 
        description: 'Complete your first game', 
        icon: '🎮', 
        category: 'games',
        condition: totalGames >= 1,
        progress: Math.min(100, (totalGames / 1) * 100)
      },
      { 
        achievementId: 'ten-games', 
        name: 'Getting Started', 
        description: 'Play 10 games', 
        icon: '🌟', 
        category: 'games',
        condition: totalGames >= 10,
        progress: Math.min(100, (totalGames / 10) * 100)
      },
      { 
        achievementId: 'fifty-games', 
        name: 'Game Master', 
        description: 'Play 50 games', 
        icon: '🎯', 
        category: 'games',
        condition: totalGames >= 50,
        progress: Math.min(100, (totalGames / 50) * 100)
      },
      { 
        achievementId: 'hundred-games', 
        name: 'Gaming Legend', 
        description: 'Play 100 games', 
        icon: '👑', 
        category: 'games',
        condition: totalGames >= 100,
        progress: Math.min(100, (totalGames / 100) * 100)
      },
      
      // Accuracy achievements
      { 
        achievementId: 'accuracy-70', 
        name: 'Sharp Mind', 
        description: 'Achieve 70%+ average accuracy', 
        icon: '🎯', 
        category: 'progress',
        condition: avgAccuracy >= 70,
        progress: Math.min(100, (avgAccuracy / 70) * 100)
      },
      { 
        achievementId: 'accuracy-90', 
        name: 'Accuracy Master', 
        description: 'Achieve 90%+ average accuracy', 
        icon: '💯', 
        category: 'progress',
        condition: avgAccuracy >= 90,
        progress: Math.min(100, (avgAccuracy / 90) * 100)
      },
      
      // Phoneme achievements
      { 
        achievementId: 'phoneme-starter', 
        name: 'Sound Learner', 
        description: 'Complete 1 level in Phoneme Game', 
        icon: '🔊', 
        category: 'phonics',
        condition: (phonemeStats.levelsCompleted || 0) >= 1,
        progress: Math.min(100, ((phonemeStats.levelsCompleted || 0) / 1) * 100)
      },
      { 
        achievementId: 'phoneme-master', 
        name: 'Sound Expert', 
        description: 'Complete all 5 levels in Phoneme Game', 
        icon: '🔤', 
        category: 'phonics',
        condition: (phonemeStats.levelsCompleted || 0) >= 5,
        progress: Math.min(100, ((phonemeStats.levelsCompleted || 0) / 5) * 100)
      },
      
      // Word Formation achievements
      { 
        achievementId: 'word-beginner', 
        name: 'Word Builder', 
        description: 'Solve 5 words in Word Formation', 
        icon: '📝', 
        category: 'vocabulary',
        condition: (wordStats.totalWords || 0) >= 5,
        progress: Math.min(100, ((wordStats.totalWords || 0) / 5) * 100)
      },
      { 
        achievementId: 'word-expert', 
        name: 'Vocabulary Expert', 
        description: 'Solve 25 words in Word Formation', 
        icon: '📖', 
        category: 'vocabulary',
        condition: (wordStats.totalWords || 0) >= 25,
        progress: Math.min(100, ((wordStats.totalWords || 0) / 25) * 100)
      },
      
      // Letter Tracing achievements
      { 
        achievementId: 'letter-starter', 
        name: 'Letter Learner', 
        description: 'Trace 5 letters', 
        icon: '✍️', 
        category: 'writing',
        condition: (letterStats.lettersCompleted || 0) >= 5,
        progress: Math.min(100, ((letterStats.lettersCompleted || 0) / 5) * 100)
      },
      { 
        achievementId: 'alphabet-master', 
        name: 'Alphabet Master', 
        description: 'Trace all 26 letters', 
        icon: '🔤', 
        category: 'writing',
        condition: (letterStats.lettersCompleted || 0) >= 26,
        progress: Math.min(100, ((letterStats.lettersCompleted || 0) / 26) * 100)
      },
      
      // Math achievements
      { 
        achievementId: 'math-starter', 
        name: 'Math Explorer', 
        description: 'Complete 3 Math Quest sessions', 
        icon: '🔢', 
        category: 'math',
        condition: (mathStats.totalSessions || 0) >= 3,
        progress: Math.min(100, ((mathStats.totalSessions || 0) / 3) * 100)
      },
      { 
        achievementId: 'math-whiz', 
        name: 'Math Whiz', 
        description: 'Score 500+ points in Math Quest', 
        icon: '🧮', 
        category: 'math',
        condition: (mathStats.totalScore || 0) >= 500,
        progress: Math.min(100, ((mathStats.totalScore || 0) / 500) * 100)
      },
      
      // Level achievements
      { 
        achievementId: 'level-5', 
        name: 'Rising Star', 
        description: 'Reach level 5', 
        icon: '⭐', 
        category: 'progress',
        condition: level >= 5,
        progress: Math.min(100, (level / 5) * 100)
      },
      { 
        achievementId: 'level-10', 
        name: 'Knowledge Seeker', 
        description: 'Reach level 10', 
        icon: '🌟', 
        category: 'progress',
        condition: level >= 10,
        progress: Math.min(100, (level / 10) * 100)
      }
    ];

    // Define badges
    const allBadges = [
      { 
        badgeId: 'bronze-player', 
        name: 'Bronze Player', 
        description: 'Play 5 games', 
        icon: '🥉', 
        tier: 'bronze',
        condition: totalGames >= 5,
        progress: Math.min(100, (totalGames / 5) * 100)
      },
      { 
        badgeId: 'silver-player', 
        name: 'Silver Player', 
        description: 'Play 25 games', 
        icon: '🥈', 
        tier: 'silver',
        condition: totalGames >= 25,
        progress: Math.min(100, (totalGames / 25) * 100)
      },
      { 
        badgeId: 'gold-player', 
        name: 'Gold Player', 
        description: 'Play 50 games', 
        icon: '🥇', 
        tier: 'gold',
        condition: totalGames >= 50,
        progress: Math.min(100, (totalGames / 50) * 100)
      },
      { 
        badgeId: 'bronze-accuracy', 
        name: 'Accurate Beginner', 
        description: '60%+ accuracy', 
        icon: '🎯', 
        tier: 'bronze',
        condition: avgAccuracy >= 60,
        progress: Math.min(100, (avgAccuracy / 60) * 100)
      },
      { 
        badgeId: 'silver-accuracy', 
        name: 'Sharp Shooter', 
        description: '75%+ accuracy', 
        icon: '🏹', 
        tier: 'silver',
        condition: avgAccuracy >= 75,
        progress: Math.min(100, (avgAccuracy / 75) * 100)
      },
      { 
        badgeId: 'gold-accuracy', 
        name: 'Precision Expert', 
        description: '90%+ accuracy', 
        icon: '💎', 
        tier: 'gold',
        condition: avgAccuracy >= 90,
        progress: Math.min(100, (avgAccuracy / 90) * 100)
      }
    ];

    const earnedAchievements = allAchievements.filter(a => a.condition);
    const lockedAchievements = allAchievements.filter(a => !a.condition);
    const earnedBadges = allBadges.filter(b => b.condition);
    const lockedBadges = allBadges.filter(b => !b.condition);

    return {
      overview: {
        totalGames,
        totalScore,
        avgAccuracy,
        level
      },
      allAchievements,
      allBadges,
      earnedAchievements,
      lockedAchievements,
      earnedBadges,
      lockedBadges,
      stats: { mathStats, phonemeStats, wordStats, letterStats }
    };
  };

  if (loading) {
    return (
      <StudentLayout title="Achievements">
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading achievements...</p>
        </div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout title="Achievements">
        <div className={styles.error}>
          <span className={styles.errorIcon}>😕</span>
          <p>{error}</p>
          <button onClick={fetchAchievements} className={styles.retryBtn}>Try Again</button>
        </div>
      </StudentLayout>
    );
  }

  const { overview, earnedAchievements, lockedAchievements, earnedBadges, lockedBadges, allAchievements, allBadges } = achievementData || {};

  return (
    <StudentLayout title="Achievements">
      <Head>
        <title>Achievements | LearnBridge Student</title>
      </Head>

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>🏆 Achievements & Badges</h1>
          <p className={styles.subtitle}>
            Track your progress and collect rewards for your learning journey!
          </p>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>🏆</span>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>
                {earnedAchievements?.length || 0}/{allAchievements?.length || 0}
              </span>
              <span className={styles.statLabel}>Achievements</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>🎖️</span>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>
                {earnedBadges?.length || 0}/{allBadges?.length || 0}
              </span>
              <span className={styles.statLabel}>Badges</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>⭐</span>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>Level {overview?.level || 1}</span>
              <span className={styles.statLabel}>Current Level</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>🎮</span>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{overview?.totalGames || 0}</span>
              <span className={styles.statLabel}>Games Played</span>
            </div>
          </div>
        </div>

        {/* Earned Achievements */}
        {earnedAchievements?.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>🌟 Unlocked Achievements</h2>
            <div className={styles.earnedGrid}>
              {earnedAchievements.map((achievement) => (
                <div key={achievement.achievementId} className={styles.earnedCard}>
                  <div className={styles.earnedIcon}>
                    <span>{achievement.icon}</span>
                  </div>
                  <div className={styles.earnedInfo}>
                    <span className={styles.earnedName}>{achievement.name}</span>
                    <span className={styles.earnedDesc}>{achievement.description}</span>
                    <span className={styles.earnedCategory}>{achievement.category}</span>
                  </div>
                  <span className={styles.checkmark}>✓</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Earned Badges */}
        {earnedBadges?.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>🎖️ Earned Badges</h2>
            <div className={styles.earnedGrid}>
              {earnedBadges.map((badge) => (
                <div key={badge.badgeId} className={`${styles.earnedCard} ${styles[badge.tier]}`}>
                  <div className={styles.earnedIcon}>
                    <span>{badge.icon}</span>
                  </div>
                  <div className={styles.earnedInfo}>
                    <span className={styles.earnedName}>{badge.name}</span>
                    <span className={styles.earnedDesc}>{badge.description}</span>
                    <span className={`${styles.tierBadge} ${styles[badge.tier]}`}>{badge.tier}</span>
                  </div>
                  <span className={styles.checkmark}>✓</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Locked Achievements */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🔒 Achievements to Unlock</h2>
          <div className={styles.lockedGrid}>
            {lockedAchievements?.map((achievement) => (
              <div key={achievement.achievementId} className={styles.lockedCard}>
                <div className={styles.lockedIcon}>
                  <span className={styles.lockedEmoji}>{achievement.icon}</span>
                  <div className={styles.lockOverlay}>🔒</div>
                </div>
                <div className={styles.lockedInfo}>
                  <span className={styles.lockedName}>{achievement.name}</span>
                  <span className={styles.lockedDesc}>{achievement.description}</span>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill} 
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                  <span className={styles.progressText}>{Math.round(achievement.progress)}% complete</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Locked Badges */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🎖️ Badges to Earn</h2>
          <div className={styles.lockedGrid}>
            {lockedBadges?.map((badge) => (
              <div key={badge.badgeId} className={`${styles.lockedCard} ${styles[badge.tier]}`}>
                <div className={styles.lockedIcon}>
                  <span className={styles.lockedEmoji}>{badge.icon}</span>
                  <div className={styles.lockOverlay}>🔒</div>
                </div>
                <div className={styles.lockedInfo}>
                  <span className={styles.lockedName}>{badge.name}</span>
                  <span className={styles.lockedDesc}>{badge.description}</span>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill} 
                      style={{ width: `${badge.progress}%` }}
                    ></div>
                  </div>
                  <span className={styles.progressText}>{Math.round(badge.progress)}% complete</span>
                  <span className={`${styles.tierBadge} ${styles[badge.tier]}`}>{badge.tier}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </StudentLayout>
  );
}

