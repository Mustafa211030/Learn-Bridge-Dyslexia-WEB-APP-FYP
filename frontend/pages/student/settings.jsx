// pages/student/settings.jsx
// Student Settings Page - Manage preferences and accessibility options

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { studentAPI } from '../../services/api';
import StudentLayout from '../../components/student/StudentLayout';
import styles from '../../styles/StudentSettings.module.css';

export default function StudentSettings() {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('display');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getPreferences();
      if (response.data?.success) {
        setPreferences(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (category, field, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await studentAPI.updatePreferences(preferences);
      if (response.data?.success) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      try {
        setSaving(true);
        const response = await studentAPI.resetPreferences();
        if (response.data?.success) {
          setPreferences(response.data.data);
          setMessage({ type: 'success', text: 'Settings reset to default!' });
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to reset settings' });
      } finally {
        setSaving(false);
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };

  if (loading) {
    return (
      <StudentLayout title="Settings">
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading settings...</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="Settings">
      <Head>
        <title>Settings | LearnBridge</title>
      </Head>

      <div className={styles.settingsPage}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Settings ⚙️</h1>
          <p className={styles.subtitle}>Customize your learning experience</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <div className={styles.settingsContainer}>
          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'display' ? styles.active : ''}`}
              onClick={() => setActiveTab('display')}
            >
              🎨 Display
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'audio' ? styles.active : ''}`}
              onClick={() => setActiveTab('audio')}
            >
              🔊 Audio
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'games' ? styles.active : ''}`}
              onClick={() => setActiveTab('games')}
            >
              🎮 Games
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'reading' ? styles.active : ''}`}
              onClick={() => setActiveTab('reading')}
            >
              📚 Reading
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'notifications' ? styles.active : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              🔔 Notifications
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'privacy' ? styles.active : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              🔒 Privacy
            </button>
          </div>

          {/* Content */}
          <div className={styles.content}>
            {activeTab === 'display' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Display Settings</h2>
                
                <div className={styles.setting}>
                  <label className={styles.label}>Theme</label>
                  <select
                    className={styles.select}
                    value={preferences?.display?.theme || 'colorful'}
                    onChange={(e) => handleChange('display', 'theme', e.target.value)}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="colorful">Colorful (Kids)</option>
                    <option value="high-contrast">High Contrast</option>
                  </select>
                </div>

                <div className={styles.setting}>
                  <label className={styles.label}>Font Size</label>
                  <select
                    className={styles.select}
                    value={preferences?.display?.fontSize || 'medium'}
                    onChange={(e) => handleChange('display', 'fontSize', e.target.value)}
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="extra-large">Extra Large</option>
                  </select>
                </div>

                <div className={styles.setting}>
                  <label className={styles.label}>Font Family</label>
                  <select
                    className={styles.select}
                    value={preferences?.display?.fontFamily || 'default'}
                    onChange={(e) => handleChange('display', 'fontFamily', e.target.value)}
                  >
                    <option value="default">Default</option>
                    <option value="dyslexia-friendly">Dyslexia Friendly</option>
                    <option value="comic-sans">Comic Sans</option>
                    <option value="open-sans">Open Sans</option>
                  </select>
                </div>

                <div className={styles.setting}>
                  <label className={styles.label}>Line Spacing</label>
                  <select
                    className={styles.select}
                    value={preferences?.display?.lineSpacing || 'normal'}
                    onChange={(e) => handleChange('display', 'lineSpacing', e.target.value)}
                  >
                    <option value="normal">Normal</option>
                    <option value="relaxed">Relaxed</option>
                    <option value="loose">Loose</option>
                  </select>
                </div>

                <div className={styles.toggleSetting}>
                  <label className={styles.toggleLabel}>
                    <span>Reduced Motion</span>
                    <span className={styles.toggleHint}>Minimize animations</span>
                  </label>
                  <input
                    type="checkbox"
                    className={styles.toggle}
                    checked={preferences?.display?.reducedMotion || false}
                    onChange={(e) => handleChange('display', 'reducedMotion', e.target.checked)}
                  />
                </div>
              </div>
            )}

            {activeTab === 'audio' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Audio Settings</h2>
                
                <div className={styles.toggleSetting}>
                  <label className={styles.toggleLabel}>
                    <span>Sound Effects</span>
                    <span className={styles.toggleHint}>Game sounds and feedback</span>
                  </label>
                  <input
                    type="checkbox"
                    className={styles.toggle}
                    checked={preferences?.audio?.soundEffects !== false}
                    onChange={(e) => handleChange('audio', 'soundEffects', e.target.checked)}
                  />
                </div>

                <div className={styles.setting}>
                  <label className={styles.label}>Sound Volume</label>
                  <input
                    type="range"
                    className={styles.range}
                    min="0"
                    max="100"
                    value={preferences?.audio?.soundVolume || 70}
                    onChange={(e) => handleChange('audio', 'soundVolume', parseInt(e.target.value))}
                  />
                  <span className={styles.rangeValue}>{preferences?.audio?.soundVolume || 70}%</span>
                </div>

                <div className={styles.toggleSetting}>
                  <label className={styles.toggleLabel}>
                    <span>Text-to-Speech</span>
                    <span className={styles.toggleHint}>Read content aloud</span>
                  </label>
                  <input
                    type="checkbox"
                    className={styles.toggle}
                    checked={preferences?.audio?.textToSpeech !== false}
                    onChange={(e) => handleChange('audio', 'textToSpeech', e.target.checked)}
                  />
                </div>

                <div className={styles.setting}>
                  <label className={styles.label}>Speech Speed</label>
                  <select
                    className={styles.select}
                    value={preferences?.audio?.ttsSpeed || 'normal'}
                    onChange={(e) => handleChange('audio', 'ttsSpeed', e.target.value)}
                  >
                    <option value="slow">Slow</option>
                    <option value="normal">Normal</option>
                    <option value="fast">Fast</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'games' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Game Settings</h2>
                
                <div className={styles.setting}>
                  <label className={styles.label}>Difficulty</label>
                  <select
                    className={styles.select}
                    value={preferences?.games?.difficulty || 'adaptive'}
                    onChange={(e) => handleChange('games', 'difficulty', e.target.value)}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="adaptive">Adaptive (Recommended)</option>
                  </select>
                </div>

                <div className={styles.toggleSetting}>
                  <label className={styles.toggleLabel}>
                    <span>Show Hints</span>
                    <span className={styles.toggleHint}>Display helpful hints during games</span>
                  </label>
                  <input
                    type="checkbox"
                    className={styles.toggle}
                    checked={preferences?.games?.showHints !== false}
                    onChange={(e) => handleChange('games', 'showHints', e.target.checked)}
                  />
                </div>

                <div className={styles.toggleSetting}>
                  <label className={styles.toggleLabel}>
                    <span>Timer Enabled</span>
                    <span className={styles.toggleHint}>Show countdown timer in games</span>
                  </label>
                  <input
                    type="checkbox"
                    className={styles.toggle}
                    checked={preferences?.games?.timerEnabled !== false}
                    onChange={(e) => handleChange('games', 'timerEnabled', e.target.checked)}
                  />
                </div>

                <div className={styles.toggleSetting}>
                  <label className={styles.toggleLabel}>
                    <span>Celebration Effects</span>
                    <span className={styles.toggleHint}>Confetti and animations on success</span>
                  </label>
                  <input
                    type="checkbox"
                    className={styles.toggle}
                    checked={preferences?.games?.celebrationEffects !== false}
                    onChange={(e) => handleChange('games', 'celebrationEffects', e.target.checked)}
                  />
                </div>
              </div>
            )}

            {activeTab === 'reading' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Reading Settings</h2>
                
                <div className={styles.setting}>
                  <label className={styles.label}>Preferred Language</label>
                  <select
                    className={styles.select}
                    value={preferences?.reading?.preferredLanguage || 'en'}
                    onChange={(e) => handleChange('reading', 'preferredLanguage', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="ur">Urdu</option>
                  </select>
                </div>

                <div className={styles.setting}>
                  <label className={styles.label}>Background Color</label>
                  <select
                    className={styles.select}
                    value={preferences?.reading?.backgroundColor || 'cream'}
                    onChange={(e) => handleChange('reading', 'backgroundColor', e.target.value)}
                  >
                    <option value="white">White</option>
                    <option value="cream">Cream</option>
                    <option value="light-blue">Light Blue</option>
                    <option value="light-green">Light Green</option>
                  </select>
                </div>

                <div className={styles.toggleSetting}>
                  <label className={styles.toggleLabel}>
                    <span>Auto Read Aloud</span>
                    <span className={styles.toggleHint}>Automatically read pages aloud</span>
                  </label>
                  <input
                    type="checkbox"
                    className={styles.toggle}
                    checked={preferences?.reading?.autoReadAloud || false}
                    onChange={(e) => handleChange('reading', 'autoReadAloud', e.target.checked)}
                  />
                </div>

                <div className={styles.toggleSetting}>
                  <label className={styles.toggleLabel}>
                    <span>Highlight Words</span>
                    <span className={styles.toggleHint}>Highlight words as they're read</span>
                  </label>
                  <input
                    type="checkbox"
                    className={styles.toggle}
                    checked={preferences?.reading?.highlightWords !== false}
                    onChange={(e) => handleChange('reading', 'highlightWords', e.target.checked)}
                  />
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Notification Settings</h2>
                
                <div className={styles.toggleSetting}>
                  <label className={styles.toggleLabel}>
                    <span>Achievement Notifications</span>
                    <span className={styles.toggleHint}>When you earn achievements</span>
                  </label>
                  <input
                    type="checkbox"
                    className={styles.toggle}
                    checked={preferences?.notifications?.achievements !== false}
                    onChange={(e) => handleChange('notifications', 'achievements', e.target.checked)}
                  />
                </div>

                <div className={styles.toggleSetting}>
                  <label className={styles.toggleLabel}>
                    <span>New Content</span>
                    <span className={styles.toggleHint}>New blogs and resources</span>
                  </label>
                  <input
                    type="checkbox"
                    className={styles.toggle}
                    checked={preferences?.notifications?.newContent !== false}
                    onChange={(e) => handleChange('notifications', 'newContent', e.target.checked)}
                  />
                </div>

                <div className={styles.toggleSetting}>
                  <label className={styles.toggleLabel}>
                    <span>Learning Reminders</span>
                    <span className={styles.toggleHint}>Daily reminders to learn</span>
                  </label>
                  <input
                    type="checkbox"
                    className={styles.toggle}
                    checked={preferences?.notifications?.reminders !== false}
                    onChange={(e) => handleChange('notifications', 'reminders', e.target.checked)}
                  />
                </div>

                <div className={styles.toggleSetting}>
                  <label className={styles.toggleLabel}>
                    <span>Weekly Summary</span>
                    <span className={styles.toggleHint}>Weekly progress reports</span>
                  </label>
                  <input
                    type="checkbox"
                    className={styles.toggle}
                    checked={preferences?.notifications?.weeklySummary !== false}
                    onChange={(e) => handleChange('notifications', 'weeklySummary', e.target.checked)}
                  />
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Privacy Settings</h2>
                
                <div className={styles.toggleSetting}>
                  <label className={styles.toggleLabel}>
                    <span>Show on Leaderboard</span>
                    <span className={styles.toggleHint}>Display your name on game leaderboards</span>
                  </label>
                  <input
                    type="checkbox"
                    className={styles.toggle}
                    checked={preferences?.privacy?.showOnLeaderboard !== false}
                    onChange={(e) => handleChange('privacy', 'showOnLeaderboard', e.target.checked)}
                  />
                </div>

                <div className={styles.toggleSetting}>
                  <label className={styles.toggleLabel}>
                    <span>Share Progress with Parent</span>
                    <span className={styles.toggleHint}>Allow parents to view your progress</span>
                  </label>
                  <input
                    type="checkbox"
                    className={styles.toggle}
                    checked={preferences?.privacy?.shareProgressWithParent !== false}
                    onChange={(e) => handleChange('privacy', 'shareProgressWithParent', e.target.checked)}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className={styles.actions}>
              <button
                className={styles.saveBtn}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : '💾 Save Settings'}
              </button>
              <button
                className={styles.resetBtn}
                onClick={handleReset}
                disabled={saving}
              >
                🔄 Reset to Default
              </button>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
