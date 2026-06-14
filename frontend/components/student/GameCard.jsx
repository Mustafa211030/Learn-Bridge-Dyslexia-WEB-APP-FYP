// components/student/GameCard.jsx
// Card component for displaying games in the games hub

import { useRouter } from 'next/router';
import styles from './GameCard.module.css';

const categoryIcons = {
  cognitive: '🧠',
  language: '📖',
  math: '🔢',
  memory: '💭',
  'motor-skills': '✋',
  reading: '📚',
  other: '🎯'
};

const categoryColors = {
  cognitive: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  language: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  math: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  memory: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'motor-skills': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  reading: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  other: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)'
};

export default function GameCard({ game, userProgress, onClick }) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick(game);
    } else {
      router.push(`/student/games/${game.gameId}`);
    }
  };

  const progress = userProgress?.progressPercentage || 0;
  const category = game.category || 'other';

  return (
    <div className={styles.card} onClick={handleClick}>
      {/* Card Header with gradient */}
      <div 
        className={styles.header}
        style={{ background: categoryColors[category] || categoryColors.other }}
      >
        <span className={styles.categoryIcon}>
          {categoryIcons[category] || '🎮'}
        </span>
        {game.isNew && <span className={styles.newBadge}>NEW</span>}
        {game.isFeatured && <span className={styles.featuredBadge}>⭐</span>}
      </div>

      {/* Card Content */}
      <div className={styles.content}>
        <h3 className={styles.title}>{game.displayName || game.name}</h3>
        <p className={styles.description}>
          {game.shortDescription || game.description?.substring(0, 80)}
        </p>

        {/* Progress Bar */}
        {userProgress && progress > 0 && (
          <div className={styles.progressWrapper}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className={styles.progressText}>{progress}%</span>
          </div>
        )}

        {/* Stats */}
        <div className={styles.stats}>
          {userProgress?.highScore > 0 && (
            <span className={styles.stat}>
              🏆 High: {userProgress.highScore}
            </span>
          )}
          {userProgress?.totalSessions > 0 && (
            <span className={styles.stat}>
              🎮 Played: {userProgress.totalSessions}x
            </span>
          )}
          {!userProgress?.totalSessions && (
            <span className={styles.stat}>
              ⏱️ {game.settings?.timeLimit?.defaultValue || 30}s per round
            </span>
          )}
        </div>

        {/* Play Button */}
        <button className={styles.playBtn}>
          {userProgress?.totalSessions > 0 ? 'Continue Playing' : 'Start Playing'}
          <span className={styles.playIcon}>▶</span>
        </button>
      </div>
    </div>
  );
}
