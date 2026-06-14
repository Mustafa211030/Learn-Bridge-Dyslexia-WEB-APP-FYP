// components/student/BadgeGrid.jsx
// Grid component for displaying student achievements and badges

import { useState } from 'react';
import styles from './BadgeGrid.module.css';

const tierColors = {
  bronze: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
  silver: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)',
  gold: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)',
  platinum: 'linear-gradient(135deg, #0ea5e9 0%, #7dd3fc 100%)'
};

export default function BadgeGrid({ badges = [], achievements = [], showAll = false }) {
  const [activeTab, setActiveTab] = useState('badges');
  const [selectedItem, setSelectedItem] = useState(null);

  const displayBadges = showAll ? badges : badges.slice(0, 6);
  const displayAchievements = showAll ? achievements : achievements.slice(0, 6);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.container}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'badges' ? styles.active : ''}`}
          onClick={() => setActiveTab('badges')}
        >
          🎖️ Badges ({badges.length})
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'achievements' ? styles.active : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          🏆 Achievements ({achievements.length})
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'badges' ? (
          <div className={styles.grid}>
            {displayBadges.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>🎖️</span>
                <p>No badges earned yet</p>
                <span className={styles.emptyHint}>Keep playing to earn badges!</span>
              </div>
            ) : (
              displayBadges.map((badge, index) => (
                <div 
                  key={badge.badgeId || index}
                  className={styles.badge}
                  onClick={() => setSelectedItem(badge)}
                >
                  <div 
                    className={styles.badgeIcon}
                    style={{ background: tierColors[badge.tier] || tierColors.bronze }}
                  >
                    {badge.icon || '🎖️'}
                  </div>
                  <div className={styles.badgeInfo}>
                    <span className={styles.badgeName}>{badge.name}</span>
                    <span className={`${styles.badgeTier} ${styles[badge.tier]}`}>
                      {badge.tier}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className={styles.grid}>
            {displayAchievements.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>🏆</span>
                <p>No achievements unlocked yet</p>
                <span className={styles.emptyHint}>Complete challenges to unlock!</span>
              </div>
            ) : (
              displayAchievements.map((achievement, index) => (
                <div 
                  key={achievement.achievementId || index}
                  className={styles.achievement}
                  onClick={() => setSelectedItem(achievement)}
                >
                  <div className={styles.achievementIcon}>
                    {achievement.icon || '🏆'}
                  </div>
                  <div className={styles.achievementInfo}>
                    <span className={styles.achievementName}>{achievement.name}</span>
                    <span className={styles.achievementDate}>
                      {formatDate(achievement.earnedAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal for selected item */}
      {selectedItem && (
        <div className={styles.modal} onClick={() => setSelectedItem(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.modalClose}
              onClick={() => setSelectedItem(null)}
            >
              ✕
            </button>
            <div 
              className={styles.modalIcon}
              style={selectedItem.tier ? { background: tierColors[selectedItem.tier] } : undefined}
            >
              {selectedItem.icon || (activeTab === 'badges' ? '🎖️' : '🏆')}
            </div>
            <h3 className={styles.modalTitle}>{selectedItem.name}</h3>
            <p className={styles.modalDescription}>{selectedItem.description}</p>
            <div className={styles.modalMeta}>
              {selectedItem.tier && (
                <span className={`${styles.modalTier} ${styles[selectedItem.tier]}`}>
                  {selectedItem.tier} tier
                </span>
              )}
              <span className={styles.modalDate}>
                Earned on {formatDate(selectedItem.earnedAt)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Single badge display component
export function BadgeDisplay({ badge, size = 'medium' }) {
  return (
    <div className={`${styles.singleBadge} ${styles[size]}`}>
      <div 
        className={styles.singleBadgeIcon}
        style={{ background: tierColors[badge.tier] || tierColors.bronze }}
      >
        {badge.icon || '🎖️'}
      </div>
      <span className={styles.singleBadgeName}>{badge.name}</span>
    </div>
  );
}

// Achievement display component
export function AchievementDisplay({ achievement, size = 'medium' }) {
  return (
    <div className={`${styles.singleAchievement} ${styles[size]}`}>
      <div className={styles.singleAchievementIcon}>
        {achievement.icon || '🏆'}
      </div>
      <span className={styles.singleAchievementName}>{achievement.name}</span>
    </div>
  );
}
