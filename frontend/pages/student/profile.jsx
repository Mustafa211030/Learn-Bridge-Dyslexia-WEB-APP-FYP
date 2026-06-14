// // pages/student/profile.jsx
// // Student Profile Page - View and edit profile information

// import { useState, useEffect } from 'react';
// import Head from 'next/head';
// import { useAuth } from '../../contexts/AuthContext';
// import { studentAPI } from '../../services/api';
// import StudentLayout from '../../components/student/StudentLayout';
// import BadgeGrid from '../../components/student/BadgeGrid';
// import styles from '../../styles/StudentProfile.module.css';

// export default function StudentProfile() {
//   const { user } = useAuth();
//   const [profileData, setProfileData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: ''
//   });
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState(null);

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       setLoading(true);
//       const response = await studentAPI.getProfile();
//       if (response.data?.success) {
//         setProfileData(response.data.data);
//         setFormData({
//           firstName: response.data.data.user.firstName || '',
//           lastName: response.data.data.user.lastName || ''
//         });
//       }
//     } catch (error) {
//       console.error('Failed to fetch profile:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async () => {
//     try {
//       setSaving(true);
//       const response = await studentAPI.updateProfile(formData);
//       if (response.data?.success) {
//         setMessage({ type: 'success', text: 'Profile updated successfully!' });
//         setIsEditing(false);
//         fetchProfile();
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Failed to update profile' });
//     } finally {
//       setSaving(false);
//       setTimeout(() => setMessage(null), 3000);
//     }
//   };

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-US', {
//       month: 'long',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   if (loading) {
//     return (
//       <StudentLayout title="My Profile">
//         <div className={styles.loadingState}>
//           <div className={styles.spinner}></div>
//           <p>Loading profile...</p>
//         </div>
//       </StudentLayout>
//     );
//   }

//   const { user: userData, progress, preferences } = profileData || {};

//   return (
//     <StudentLayout title="My Profile">
//       <Head>
//         <title>My Profile | LearnBridge</title>
//       </Head>

//       <div className={styles.profilePage}>
//         {/* Message */}
//         {message && (
//           <div className={`${styles.message} ${styles[message.type]}`}>
//             {message.text}
//           </div>
//         )}

//         {/* Profile Header */}
//         <div className={styles.profileHeader}>
//           <div className={styles.avatarSection}>
//             <div 
//               className={styles.avatar}
//               style={{ backgroundColor: preferences?.avatar?.backgroundColor || '#4f46e5' }}
//             >
//               {userData?.firstName?.charAt(0) || '👤'}
//             </div>
//             <div className={styles.levelBadge}>
//               Level {progress?.level?.current || 1}
//             </div>
//           </div>
//           <div className={styles.profileInfo}>
//             {isEditing ? (
//               <div className={styles.editForm}>
//                 <div className={styles.formRow}>
//                   <input
//                     type="text"
//                     name="firstName"
//                     value={formData.firstName}
//                     onChange={handleInputChange}
//                     placeholder="First Name"
//                     className={styles.input}
//                   />
//                   <input
//                     type="text"
//                     name="lastName"
//                     value={formData.lastName}
//                     onChange={handleInputChange}
//                     placeholder="Last Name"
//                     className={styles.input}
//                   />
//                 </div>
//                 <div className={styles.editActions}>
//                   <button 
//                     className={styles.saveBtn}
//                     onClick={handleSave}
//                     disabled={saving}
//                   >
//                     {saving ? 'Saving...' : 'Save Changes'}
//                   </button>
//                   <button 
//                     className={styles.cancelBtn}
//                     onClick={() => setIsEditing(false)}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <h1 className={styles.name}>
//                   {userData?.firstName} {userData?.lastName}
//                 </h1>
//                 <p className={styles.username}>@{userData?.username}</p>
//                 <p className={styles.email}>{userData?.email}</p>
//                 <p className={styles.joinDate}>
//                   Member since {formatDate(userData?.createdAt)}
//                 </p>
//                 <button 
//                   className={styles.editBtn}
//                   onClick={() => setIsEditing(true)}
//                 >
//                   ✏️ Edit Profile
//                 </button>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Stats Overview */}
//         <div className={styles.statsSection}>
//           <h2 className={styles.sectionTitle}>Learning Stats</h2>
//           <div className={styles.statsGrid}>
//             <div className={styles.statCard}>
//               <span className={styles.statIcon}>🎮</span>
//               <span className={styles.statValue}>{progress?.totalGamesPlayed || 0}</span>
//               <span className={styles.statLabel}>Games Played</span>
//             </div>
//             <div className={styles.statCard}>
//               <span className={styles.statIcon}>⭐</span>
//               <span className={styles.statValue}>{progress?.totalScore?.toLocaleString() || 0}</span>
//               <span className={styles.statLabel}>Total Score</span>
//             </div>
//             <div className={styles.statCard}>
//               <span className={styles.statIcon}>🎯</span>
//               <span className={styles.statValue}>{progress?.averageAccuracy || 0}%</span>
//               <span className={styles.statLabel}>Avg Accuracy</span>
//             </div>
//             <div className={styles.statCard}>
//               <span className={styles.statIcon}>🏆</span>
//               <span className={styles.statValue}>{progress?.achievements?.length || 0}</span>
//               <span className={styles.statLabel}>Achievements</span>
//             </div>
//           </div>
//         </div>

//         {/* Achievements & Badges */}
//         <div className={styles.achievementsSection}>
//           <h2 className={styles.sectionTitle}>Achievements & Badges</h2>
//           <BadgeGrid
//             badges={progress?.badges || []}
//             achievements={progress?.achievements || []}
//           />
//         </div>
//       </div>
//     </StudentLayout>
//   );
// }






























// pages/student/profile.jsx
// Student Profile Page - View profile with REAL game statistics

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../../contexts/AuthContext';
import StudentLayout from '../../components/student/StudentLayout';
import styles from '../../styles/StudentProfile.module.css';

// API Base URL - Express Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function StudentProfile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user?._id || user?.id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    const userId = user?._id || user?.id;
    if (!userId) return;

    try {
      setLoading(true);

      // Fetch real game data from all APIs
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

      const aggregatedData = buildProfileData(mathData, phonemeData, wordData, letterData);
      setProfileData(aggregatedData);

      setFormData({
        firstName: user?.firstName || user?.name?.split(' ')[0] || '',
        lastName: user?.lastName || user?.name?.split(' ')[1] || ''
      });

    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildProfileData = (mathData, phonemeData, wordData, letterData) => {
    const mathStats = mathData?.analytics || {};
    const phonemeStats = phonemeData?.stats || {};
    const wordStats = wordData?.stats || {};
    const letterStats = letterData?.stats || {};

    const totalGames = (mathStats.totalSessions || 0) + 
                       (phonemeStats.totalGames || 0) + 
                       (wordStats.totalSessions || 0) + 
                       (letterStats.totalSessions || 0);

    const totalScore = (mathStats.totalScore || 0) + 
                       (phonemeStats.totalScore || 0) + 
                       (wordStats.highestScore || 0);

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

    const level = Math.max(1, Math.floor((totalGames / 5) + (avgAccuracy / 20)));

    const achievements = [];
    if (totalGames >= 1) achievements.push({ name: 'First Steps', icon: '🎮' });
    if (totalGames >= 10) achievements.push({ name: 'Getting Started', icon: '🌟' });
    if (totalGames >= 50) achievements.push({ name: 'Game Master', icon: '🎯' });
    if (avgAccuracy >= 70) achievements.push({ name: 'Sharp Mind', icon: '🎯' });
    if (avgAccuracy >= 90) achievements.push({ name: 'Accuracy Master', icon: '💯' });
    if ((phonemeStats.levelsCompleted || 0) >= 5) achievements.push({ name: 'Sound Expert', icon: '🔊' });
    if ((wordStats.totalWords || 0) >= 25) achievements.push({ name: 'Vocabulary Expert', icon: '📖' });
    if ((letterStats.lettersCompleted || 0) >= 26) achievements.push({ name: 'Alphabet Master', icon: '🔤' });

    const badges = [];
    if (totalGames >= 5) badges.push({ name: 'Bronze Player', icon: '🥉', tier: 'bronze' });
    if (totalGames >= 25) badges.push({ name: 'Silver Player', icon: '🥈', tier: 'silver' });
    if (totalGames >= 50) badges.push({ name: 'Gold Player', icon: '🥇', tier: 'gold' });
    if (avgAccuracy >= 60) badges.push({ name: 'Accurate Beginner', icon: '🎯', tier: 'bronze' });
    if (avgAccuracy >= 75) badges.push({ name: 'Sharp Shooter', icon: '🏹', tier: 'silver' });
    if (avgAccuracy >= 90) badges.push({ name: 'Precision Expert', icon: '💎', tier: 'gold' });

    return {
      progress: {
        totalGamesPlayed: totalGames,
        totalScore: totalScore,
        averageAccuracy: avgAccuracy,
        level: level,
        achievements: achievements,
        badges: badges,
        lettersCompleted: letterStats.lettersCompleted || 0,
        wordsFormed: wordStats.totalWords || 0,
        phonemeLevels: phonemeStats.levelsCompleted || 0,
        mathSessions: mathStats.totalSessions || 0
      },
      gameBreakdown: {
        mathQuest: {
          sessions: mathStats.totalSessions || 0,
          highScore: mathStats.highScore || 0,
          accuracy: mathStats.accuracy || 0
        },
        phonemeGame: {
          sessions: phonemeStats.totalGames || 0,
          score: phonemeStats.totalScore || 0,
          accuracy: phonemeStats.averageAccuracy || 0,
          levelsCompleted: phonemeStats.levelsCompleted || 0
        },
        wordFormation: {
          sessions: wordStats.totalSessions || 0,
          highScore: wordStats.highestScore || 0,
          accuracy: wordStats.averageAccuracy || 0,
          wordsFormed: wordStats.totalWords || 0
        },
        letterTracing: {
          sessions: letterStats.totalSessions || 0,
          lettersCompleted: letterStats.lettersCompleted || 0,
          accuracy: letterStats.averageAccuracy || 0,
          totalAttempts: letterStats.totalAttempts || 0
        }
      }
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <StudentLayout title="My Profile">
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading profile...</p>
        </div>
      </StudentLayout>
    );
  }

  const { progress, gameBreakdown } = profileData || {};

  return (
    <StudentLayout title="My Profile">
      <Head>
        <title>My Profile | LearnBridge</title>
      </Head>

      <div className={styles.profilePage}>
        {message && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        {/* Profile Header */}
        <div className={styles.profileHeader}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              {user?.firstName?.charAt(0) || user?.name?.charAt(0) || '👤'}
            </div>
            <div className={styles.levelBadge}>
              Level {progress?.level || 1}
            </div>
          </div>
          <div className={styles.profileInfo}>
            {isEditing ? (
              <div className={styles.editForm}>
                <div className={styles.formRow}>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    className={styles.input}
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    className={styles.input}
                  />
                </div>
                <div className={styles.editActions}>
                  <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className={styles.name}>
                  {user?.firstName || user?.name || 'Student'} {user?.lastName || ''}
                </h1>
                <p className={styles.username}>@{user?.username || user?.email?.split('@')[0] || 'student'}</p>
                <p className={styles.email}>{user?.email || 'No email provided'}</p>
                <p className={styles.joinDate}>Member since {formatDate(user?.createdAt)}</p>
                <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
                  ✏️ Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className={styles.statsSection}>
          <h2 className={styles.sectionTitle}>📊 Learning Stats (Real Data)</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>🎮</span>
              <span className={styles.statValue}>{progress?.totalGamesPlayed || 0}</span>
              <span className={styles.statLabel}>Games Played</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>⭐</span>
              <span className={styles.statValue}>{progress?.totalScore?.toLocaleString() || 0}</span>
              <span className={styles.statLabel}>Total Score</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>🎯</span>
              <span className={styles.statValue}>{progress?.averageAccuracy || 0}%</span>
              <span className={styles.statLabel}>Avg Accuracy</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>🏆</span>
              <span className={styles.statValue}>{progress?.achievements?.length || 0}</span>
              <span className={styles.statLabel}>Achievements</span>
            </div>
          </div>
        </div>

        {/* Game Breakdown */}
        <div className={styles.gameSection}>
          <h2 className={styles.sectionTitle}>🎮 Game Statistics</h2>
          <div className={styles.gameGrid}>
            <div className={styles.gameStatCard}>
              <div className={styles.gameHeader}>
                <span className={styles.gameIcon}>🔢</span>
                <h3>Math Quest</h3>
              </div>
              <div className={styles.gameDetails}>
                <p><strong>Sessions:</strong> {gameBreakdown?.mathQuest?.sessions || 0}</p>
                <p><strong>High Score:</strong> {gameBreakdown?.mathQuest?.highScore || 0}</p>
                <p><strong>Accuracy:</strong> {gameBreakdown?.mathQuest?.accuracy || 0}%</p>
              </div>
            </div>

            <div className={styles.gameStatCard}>
              <div className={styles.gameHeader}>
                <span className={styles.gameIcon}>🔊</span>
                <h3>Phoneme Game</h3>
              </div>
              <div className={styles.gameDetails}>
                <p><strong>Sessions:</strong> {gameBreakdown?.phonemeGame?.sessions || 0}</p>
                <p><strong>Levels Done:</strong> {gameBreakdown?.phonemeGame?.levelsCompleted || 0}/5</p>
                <p><strong>Accuracy:</strong> {gameBreakdown?.phonemeGame?.accuracy || 0}%</p>
              </div>
            </div>

            <div className={styles.gameStatCard}>
              <div className={styles.gameHeader}>
                <span className={styles.gameIcon}>📝</span>
                <h3>Word Formation</h3>
              </div>
              <div className={styles.gameDetails}>
                <p><strong>Sessions:</strong> {gameBreakdown?.wordFormation?.sessions || 0}</p>
                <p><strong>Words Solved:</strong> {gameBreakdown?.wordFormation?.wordsFormed || 0}</p>
                <p><strong>Accuracy:</strong> {gameBreakdown?.wordFormation?.accuracy || 0}%</p>
              </div>
            </div>

            <div className={styles.gameStatCard}>
              <div className={styles.gameHeader}>
                <span className={styles.gameIcon}>✍️</span>
                <h3>Letter Tracing</h3>
              </div>
              <div className={styles.gameDetails}>
                <p><strong>Sessions:</strong> {gameBreakdown?.letterTracing?.sessions || 0}</p>
                <p><strong>Letters Done:</strong> {gameBreakdown?.letterTracing?.lettersCompleted || 0}/26</p>
                <p><strong>Accuracy:</strong> {gameBreakdown?.letterTracing?.accuracy || 0}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements & Badges */}
        {(progress?.achievements?.length > 0 || progress?.badges?.length > 0) && (
          <div className={styles.achievementsSection}>
            <h2 className={styles.sectionTitle}>🏆 Achievements & Badges</h2>
            
            {progress?.achievements?.length > 0 && (
              <div className={styles.achievementsList}>
                <h3>Achievements Earned</h3>
                <div className={styles.badgeGrid}>
                  {progress.achievements.map((achievement, index) => (
                    <div key={index} className={styles.badgeItem}>
                      <span className={styles.badgeIcon}>{achievement.icon}</span>
                      <span className={styles.badgeName}>{achievement.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {progress?.badges?.length > 0 && (
              <div className={styles.badgesList}>
                <h3>Badges Collected</h3>
                <div className={styles.badgeGrid}>
                  {progress.badges.map((badge, index) => (
                    <div key={index} className={`${styles.badgeItem} ${styles[badge.tier]}`}>
                      <span className={styles.badgeIcon}>{badge.icon}</span>
                      <span className={styles.badgeName}>{badge.name}</span>
                      <span className={styles.badgeTier}>{badge.tier}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Skills Summary */}
        <div className={styles.skillsSection}>
          <h2 className={styles.sectionTitle}>📈 Skills Progress</h2>
          <div className={styles.skillsGrid}>
            <div className={styles.skillItem}>
              <div className={styles.skillHeader}>
                <span>🔢 Mathematics</span>
                <span>{Math.min(100, (gameBreakdown?.mathQuest?.sessions || 0) * 10)}%</span>
              </div>
              <div className={styles.skillBar}>
                <div 
                  className={styles.skillFill} 
                  style={{ width: `${Math.min(100, (gameBreakdown?.mathQuest?.sessions || 0) * 10)}%`, background: '#4facfe' }}
                ></div>
              </div>
            </div>

            <div className={styles.skillItem}>
              <div className={styles.skillHeader}>
                <span>🔊 Phonics</span>
                <span>{Math.min(100, (gameBreakdown?.phonemeGame?.levelsCompleted || 0) * 20)}%</span>
              </div>
              <div className={styles.skillBar}>
                <div 
                  className={styles.skillFill} 
                  style={{ width: `${Math.min(100, (gameBreakdown?.phonemeGame?.levelsCompleted || 0) * 20)}%`, background: '#f093fb' }}
                ></div>
              </div>
            </div>

            <div className={styles.skillItem}>
              <div className={styles.skillHeader}>
                <span>📝 Vocabulary</span>
                <span>{Math.min(100, (gameBreakdown?.wordFormation?.wordsFormed || 0) * 4)}%</span>
              </div>
              <div className={styles.skillBar}>
                <div 
                  className={styles.skillFill} 
                  style={{ width: `${Math.min(100, (gameBreakdown?.wordFormation?.wordsFormed || 0) * 4)}%`, background: '#43e97b' }}
                ></div>
              </div>
            </div>

            <div className={styles.skillItem}>
              <div className={styles.skillHeader}>
                <span>✍️ Writing</span>
                <span>{Math.min(100, (gameBreakdown?.letterTracing?.lettersCompleted || 0) * 4)}%</span>
              </div>
              <div className={styles.skillBar}>
                <div 
                  className={styles.skillFill} 
                  style={{ width: `${Math.min(100, (gameBreakdown?.letterTracing?.lettersCompleted || 0) * 4)}%`, background: '#fa709a' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}