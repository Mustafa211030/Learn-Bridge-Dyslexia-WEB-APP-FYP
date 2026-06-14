// pages/admin/games.jsx
// Premium Games Management Page

import { useState, useEffect } from 'react';
import AdminProtectedRoute from '../../components/admin/AdminProtectedRoute';
import AdminLayout from '../../components/admin/AdminLayout';
import { gamesAPI } from '../../services/adminApi';
import styles from '../../styles/admin/Games.module.css';

// Icons
const Icons = {
  Play: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  ),
  Pause: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Edit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  BarChart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  ),
  Globe: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Target: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

// Game icons mapping
const gameIcons = {
  'math-quest': '🧮',
  'phoneme-game': '🔊',
  'letter-tracing': '✍️',
  'word-formation': '📝',
  'memory-match': '🧠',
  'default': '🎮'
};

// Category colors
const categoryColors = {
  'cognitive': { primary: '#6366f1', secondary: '#818cf8' },
  'language': { primary: '#8b5cf6', secondary: '#a78bfa' },
  'math': { primary: '#3b82f6', secondary: '#60a5fa' },
  'memory': { primary: '#10b981', secondary: '#34d399' },
  'motor-skills': { primary: '#f59e0b', secondary: '#fbbf24' },
  'reading': { primary: '#ec4899', secondary: '#f472b6' },
};

// Game Card Component
const GameCard = ({ game, onToggle, onEdit }) => {
  const [isToggling, setIsToggling] = useState(false);
  const colors = categoryColors[game.category] || categoryColors['cognitive'];
  const icon = gameIcons[game.gameId] || gameIcons['default'];

  const handleToggle = async () => {
    setIsToggling(true);
    await onToggle(game._id);
    setIsToggling(false);
  };

  return (
    <div className={`${styles.gameCard} ${!game.enabled ? styles.disabled : ''}`}>
      {/* Glow Effect */}
      <div 
        className={styles.cardGlow}
        style={{ background: `radial-gradient(circle at 50% 0%, ${colors.primary}30 0%, transparent 50%)` }}
      />

      {/* Header */}
      <div className={styles.cardHeader}>
        <div 
          className={styles.gameIcon}
          style={{ 
            background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}10)`,
            borderColor: colors.primary 
          }}
        >
          <span>{icon}</span>
        </div>
        <div className={styles.headerInfo}>
          <span 
            className={styles.categoryBadge}
            style={{ background: `${colors.primary}20`, color: colors.secondary }}
          >
            {game.category?.replace('-', ' ')}
          </span>
          <span className={`${styles.statusBadge} ${game.enabled ? styles.active : styles.inactive}`}>
            {game.enabled ? '● Active' : '○ Disabled'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className={styles.cardBody}>
        <h3 className={styles.gameName}>{game.displayName || game.name}</h3>
        <p className={styles.gameDescription}>
          {game.shortDescription || game.description || 'No description available'}
        </p>

        {/* Meta Info */}
        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <Icons.Globe />
            <span>{game.supportedLanguages?.join(', ').toUpperCase() || 'EN'}</span>
          </div>
          <div className={styles.metaItem}>
            <Icons.Users />
            <span>{game.ageGroups?.join(', ') || 'All ages'}</span>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {game.analytics?.totalPlays?.toLocaleString() || 0}
            </span>
            <span className={styles.statLabel}>Total Plays</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {game.analytics?.completionRate || 0}%
            </span>
            <span className={styles.statLabel}>Completion</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {game.analytics?.avgScore || 0}
            </span>
            <span className={styles.statLabel}>Avg Score</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.cardFooter}>
        <button
          className={`${styles.toggleBtn} ${game.enabled ? styles.disableBtn : styles.enableBtn}`}
          onClick={handleToggle}
          disabled={isToggling}
        >
          {isToggling ? (
            <span className={styles.spinner}></span>
          ) : game.enabled ? (
            <><Icons.Pause /> Disable</>
          ) : (
            <><Icons.Play /> Enable</>
          )}
        </button>
        <button className={styles.editBtn} onClick={() => onEdit(game)}>
          <Icons.Settings />
        </button>
      </div>
    </div>
  );
};

// Edit Modal Component
const EditModal = ({ game, onClose, onSave }) => {
  const [form, setForm] = useState({
    displayName: game?.displayName || '',
    shortDescription: game?.shortDescription || '',
    category: game?.category || 'cognitive',
    supportedLanguages: game?.supportedLanguages || ['en'],
    ageGroups: game?.ageGroups || [],
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(game._id, form);
    setSaving(false);
  };

  const toggleLanguage = (lang) => {
    setForm(prev => ({
      ...prev,
      supportedLanguages: prev.supportedLanguages.includes(lang)
        ? prev.supportedLanguages.filter(l => l !== lang)
        : [...prev.supportedLanguages, lang]
    }));
  };

  const toggleAgeGroup = (age) => {
    setForm(prev => ({
      ...prev,
      ageGroups: prev.ageGroups.includes(age)
        ? prev.ageGroups.filter(a => a !== age)
        : [...prev.ageGroups, age]
    }));
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Edit Game Settings</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <Icons.X />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label>Display Name</label>
            <input
              type="text"
              value={form.displayName}
              onChange={e => setForm({ ...form, displayName: e.target.value })}
              placeholder="Enter game name"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Short Description</label>
            <textarea
              value={form.shortDescription}
              onChange={e => setForm({ ...form, shortDescription: e.target.value })}
              placeholder="Brief description"
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Category</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              <option value="cognitive">Cognitive</option>
              <option value="language">Language</option>
              <option value="math">Math</option>
              <option value="memory">Memory</option>
              <option value="motor-skills">Motor Skills</option>
              <option value="reading">Reading</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Languages</label>
            <div className={styles.chipGroup}>
              {['en', 'ur', 'ar', 'es'].map(lang => (
                <button
                  key={lang}
                  type="button"
                  className={`${styles.chip} ${form.supportedLanguages.includes(lang) ? styles.chipActive : ''}`}
                  onClick={() => toggleLanguage(lang)}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Age Groups</label>
            <div className={styles.chipGroup}>
              {['4-6', '7-9', '10-12', '13-15', '16-18'].map(age => (
                <button
                  key={age}
                  type="button"
                  className={`${styles.chip} ${form.ageGroups.includes(age) ? styles.chipActive : ''}`}
                  onClick={() => toggleAgeGroup(age)}
                >
                  {age} yrs
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Page Component
const GamesPage = () => {
  const [games, setGames] = useState([]);
  const [summary, setSummary] = useState({ total: 0, enabled: 0, disabled: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editingGame, setEditingGame] = useState(null);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await gamesAPI.getAll();
      setGames(response.data.data.games);
      setSummary(response.data.data.summary);
    } catch (err) {
      console.error('Failed to fetch games:', err);
      // Mock data
      setGames([
        {
          _id: '1',
          gameId: 'math-quest',
          name: 'MathQuest',
          displayName: 'Math Quest',
          shortDescription: 'Practice arithmetic with fun challenges',
          category: 'math',
          enabled: true,
          supportedLanguages: ['en', 'ur'],
          ageGroups: ['7-9', '10-12'],
          analytics: { totalPlays: 5420, completionRate: 78, avgScore: 85 }
        },
        {
          _id: '2',
          gameId: 'phoneme-game',
          name: 'PhonemeGame',
          displayName: 'Phoneme Game',
          shortDescription: 'Learn phonics through sound recognition',
          category: 'language',
          enabled: true,
          supportedLanguages: ['en'],
          ageGroups: ['4-6', '7-9'],
          analytics: { totalPlays: 3210, completionRate: 82, avgScore: 88 }
        },
        {
          _id: '3',
          gameId: 'letter-tracing',
          name: 'LetterTracing',
          displayName: 'Letter Tracing',
          shortDescription: 'Practice letter formation and handwriting',
          category: 'motor-skills',
          enabled: true,
          supportedLanguages: ['en', 'ur'],
          ageGroups: ['4-6'],
          analytics: { totalPlays: 2890, completionRate: 91, avgScore: 92 }
        },
        {
          _id: '4',
          gameId: 'word-formation',
          name: 'WordFormation',
          displayName: 'Word Formation',
          shortDescription: 'Build vocabulary by forming words',
          category: 'language',
          enabled: false,
          supportedLanguages: ['en'],
          ageGroups: ['7-9', '10-12'],
          analytics: { totalPlays: 1540, completionRate: 75, avgScore: 80 }
        },
      ]);
      setSummary({ total: 4, enabled: 3, disabled: 1 });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (gameId) => {
    try {
      await gamesAPI.toggle(gameId);
      fetchGames();
    } catch (err) {
      // Toggle locally for demo
      setGames(prev => prev.map(g => 
        g._id === gameId ? { ...g, enabled: !g.enabled } : g
      ));
      setSummary(prev => {
        const game = games.find(g => g._id === gameId);
        if (game?.enabled) {
          return { ...prev, enabled: prev.enabled - 1, disabled: prev.disabled + 1 };
        }
        return { ...prev, enabled: prev.enabled + 1, disabled: prev.disabled - 1 };
      });
    }
  };

  const handleSave = async (gameId, data) => {
    try {
      await gamesAPI.update(gameId, data);
      setEditingGame(null);
      fetchGames();
    } catch (err) {
      // Update locally for demo
      setGames(prev => prev.map(g => 
        g._id === gameId ? { ...g, ...data } : g
      ));
      setEditingGame(null);
    }
  };

  const filteredGames = games.filter(game => {
    if (filter === 'enabled') return game.enabled;
    if (filter === 'disabled') return !game.enabled;
    return true;
  });

  const totalPlays = games.reduce((sum, g) => sum + (g.analytics?.totalPlays || 0), 0);

  return (
    <AdminProtectedRoute>
      <AdminLayout title="Game Management" breadcrumbs={['Games']}>
        {/* Stats Overview */}
        <div className={styles.statsOverview}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🎮</div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{summary.total}</span>
              <span className={styles.statLabel}>Total Games</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{summary.enabled}</span>
              <span className={styles.statLabel}>Active</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>⏸️</div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{summary.disabled}</span>
              <span className={styles.statLabel}>Disabled</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{totalPlays.toLocaleString()}</span>
              <span className={styles.statLabel}>Total Plays</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className={styles.filterBar}>
          <div className={styles.filterTabs}>
            {[
              { key: 'all', label: 'All Games', count: summary.total },
              { key: 'enabled', label: 'Active', count: summary.enabled },
              { key: 'disabled', label: 'Disabled', count: summary.disabled },
            ].map(tab => (
              <button
                key={tab.key}
                className={`${styles.filterTab} ${filter === tab.key ? styles.active : ''}`}
                onClick={() => setFilter(tab.key)}
              >
                {tab.label}
                <span className={styles.tabCount}>{tab.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading games...</p>
          </div>
        ) : (
          <div className={styles.gamesGrid}>
            {filteredGames.map(game => (
              <GameCard
                key={game._id}
                game={game}
                onToggle={handleToggle}
                onEdit={setEditingGame}
              />
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingGame && (
          <EditModal
            game={editingGame}
            onClose={() => setEditingGame(null)}
            onSave={handleSave}
          />
        )}
      </AdminLayout>
    </AdminProtectedRoute>
  );
};

export default GamesPage;
