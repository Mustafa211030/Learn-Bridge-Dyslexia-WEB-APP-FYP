// components/student/StudentGamesHub.jsx
// Games Hub - Shows all games with inline playing (no separate routes needed)
// FIXED: Uses correct API URL for Express backend

'use client';
import { useState } from 'react';
import styles from '../../styles/StudentGamesHub.module.css';

// Import game components - all in components/games/
import MathQuest from '../games/MathQuest/MathQuest';
import PhonemeGame from '../games/PhonemeGame';
import WordFormationGame from '../games/WordFormationGame';
import LetterTracingGame from '../games/LetterTracingGame';

// Performance dashboards - also in components/games/
import PerformanceDashboard from '../games/PerformanceDashboard';
import WordFormationPerformance from '../games/WordFormationPerformance';
import LetterTracingPerformance from '../games/LetterTracingPerformance';

const games = [
  {
    id: 'math-quest',
    title: 'Math Quest',
    description: 'Master addition, subtraction, multiplication & division through fun challenges!',
    icon: '🧮',
    category: 'Math',
    difficulty: 'All Levels',
    color: '#6366F1',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    component: MathQuest,
    performanceComponent: null,
  },
  {
    id: 'phoneme-game',
    title: 'Phoneme Recognition',
    description: 'Learn letter sounds with pictures and audio. Perfect for early readers!',
    icon: '🔤',
    category: 'Reading',
    difficulty: 'Beginner',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    component: PhonemeGame,
    performanceComponent: PerformanceDashboard,
  },
  {
    id: 'word-formation',
    title: 'Word Formation',
    description: 'Unscramble letters to form words. Build vocabulary while having fun!',
    icon: '📝',
    category: 'Vocabulary',
    difficulty: 'Intermediate',
    color: '#10B981',
    gradient: 'linear-gradient(180deg, #43cea2 0%, #185a9d 100%)',
    component: WordFormationGame,
    performanceComponent: WordFormationPerformance,
  },
  {
    id: 'letter-tracing',
    title: 'Letter Tracing',
    description: 'Practice writing letters by tracing them on screen. Improve handwriting!',
    icon: '✍️',
    category: 'Writing',
    difficulty: 'Beginner',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    component: LetterTracingGame,
    performanceComponent: LetterTracingPerformance,
  },
];

const categories = ['All', 'Math', 'Reading', 'Vocabulary', 'Writing'];

// CRITICAL: Default to Express backend URL, NOT /api
export default function StudentGamesHub({ userId, apiBaseUrl = 'http://localhost:5000/api' }) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [showPerformance, setShowPerformance] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Ensure we're using the correct API URL
  const actualApiUrl = apiBaseUrl.startsWith('/api') 
    ? 'http://localhost:5000/api'  // Fix incorrect /api to point to Express
    : apiBaseUrl;

  const filteredGames = games.filter(game => {
    const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePlayGame = (game) => {
    setSelectedGame(game);
    setShowPerformance(false);
  };

  const handleViewStats = (game) => {
    if (game.performanceComponent) {
      setSelectedGame(game);
      setShowPerformance(true);
    }
  };

  const handleBackToHub = () => {
    setSelectedGame(null);
    setShowPerformance(false);
  };

  // Render selected game or performance dashboard
  if (selectedGame) {
    const GameComponent = showPerformance ? selectedGame.performanceComponent : selectedGame.component;
    
    if (!GameComponent) {
      return (
        <div className={styles.container}>
          <div className={styles.errorState}>
            <span className={styles.errorIcon}>⚠️</span>
            <h2>Component Not Available</h2>
            <p>This feature is coming soon!</p>
            <button onClick={handleBackToHub} className={styles.backButton}>
              ← Back to Games
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.gameContainer}>
        <div className={styles.gameHeader}>
          <button onClick={handleBackToHub} className={styles.backButton}>
            ← Back to Games
          </button>
          <div className={styles.gameHeaderInfo}>
            <span className={styles.gameHeaderIcon}>{selectedGame.icon}</span>
            <h2 className={styles.gameHeaderTitle}>
              {showPerformance ? `${selectedGame.title} - Stats` : selectedGame.title}
            </h2>
          </div>
          {selectedGame.performanceComponent && (
            <button 
              onClick={() => setShowPerformance(!showPerformance)} 
              className={styles.toggleButton}
            >
              {showPerformance ? '🎮 Play Game' : '📊 View Stats'}
            </button>
          )}
        </div>
        <div className={styles.gameContent}>
          {/* CRITICAL: Pass actualApiUrl to ensure correct backend URL */}
          <GameComponent 
            userId={userId} 
            odId={userId}
            odName="Student"
            apiBaseUrl={actualApiUrl} 
          />
        </div>
      </div>
    );
  }

  // Render games hub
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}>🎮</span>
            Games Hub
          </h1>
          <p className={styles.subtitle}>
            Learn through play! Choose a game to start your learning adventure.
          </p>
        </div>
      </div>

      {/* Debug API URL - Remove in production */}
      <div style={{ 
        padding: '8px 12px', 
        background: '#f0fdf4', 
        borderRadius: '6px', 
        marginBottom: '16px',
        fontSize: '11px',
        color: '#166534'
      }}>
        📡 API: {actualApiUrl} | User: {userId || 'Not logged in'}
      </div>

      {/* Search and Filter */}
      <div className={styles.filterSection}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            id="game-search"
            name="game-search"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.categories}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`${styles.categoryBtn} ${activeCategory === category ? styles.categoryActive : ''}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      <div className={styles.gamesGrid}>
        {filteredGames.map((game) => (
          <div 
            key={game.id} 
            className={styles.gameCard}
            style={{ '--card-color': game.color }}
          >
            <div 
              className={styles.cardHeader}
              style={{ background: game.gradient }}
            >
              <span className={styles.gameIcon}>{game.icon}</span>
              <div className={styles.cardBadges}>
                <span className={styles.categoryBadge}>{game.category}</span>
                <span className={styles.difficultyBadge}>{game.difficulty}</span>
              </div>
            </div>
            
            <div className={styles.cardBody}>
              <h3 className={styles.gameTitle}>{game.title}</h3>
              <p className={styles.gameDescription}>{game.description}</p>
              
              <div className={styles.cardActions}>
                <button 
                  onClick={() => handlePlayGame(game)}
                  className={styles.playButton}
                  style={{ background: game.gradient }}
                >
                  <span>▶</span> Play Now
                </button>
                {game.performanceComponent && (
                  <button 
                    onClick={() => handleViewStats(game)}
                    className={styles.statsButton}
                  >
                    📊 Stats
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredGames.length === 0 && (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🎯</span>
          <h3>No games found</h3>
          <p>Try adjusting your search or filter</p>
          <button 
            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
            className={styles.resetButton}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className={styles.quickStats}>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>🎮</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{games.length}</span>
            <span className={styles.statLabel}>Games Available</span>
          </div>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>📚</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>4</span>
            <span className={styles.statLabel}>Categories</span>
          </div>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>⭐</span>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>All</span>
            <span className={styles.statLabel}>Skill Levels</span>
          </div>
        </div>
      </div>
    </div>
  );
}