// models/StudentPreferences.model.js
// Student preferences for accessibility, UI customization, and settings

const mongoose = require('mongoose');

const studentPreferencesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },

  // Display Preferences
  display: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'colorful', 'high-contrast'],
      default: 'colorful'
    },
    fontSize: {
      type: String,
      enum: ['small', 'medium', 'large', 'extra-large'],
      default: 'medium'
    },
    fontFamily: {
      type: String,
      enum: ['default', 'dyslexia-friendly', 'comic-sans', 'open-sans'],
      default: 'default'
    },
    lineSpacing: {
      type: String,
      enum: ['normal', 'relaxed', 'loose'],
      default: 'normal'
    },
    letterSpacing: {
      type: String,
      enum: ['normal', 'wide', 'wider'],
      default: 'normal'
    },
    reducedMotion: {
      type: Boolean,
      default: false
    },
    highContrast: {
      type: Boolean,
      default: false
    }
  },

  // Audio Preferences
  audio: {
    soundEffects: {
      type: Boolean,
      default: true
    },
    soundVolume: {
      type: Number,
      min: 0,
      max: 100,
      default: 70
    },
    textToSpeech: {
      type: Boolean,
      default: true
    },
    ttsSpeed: {
      type: String,
      enum: ['slow', 'normal', 'fast'],
      default: 'normal'
    },
    ttsVoice: {
      type: String,
      default: 'default'
    },
    backgroundMusic: {
      type: Boolean,
      default: false
    }
  },

  // Game Preferences
  games: {
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'adaptive'],
      default: 'adaptive'
    },
    showHints: {
      type: Boolean,
      default: true
    },
    timerEnabled: {
      type: Boolean,
      default: true
    },
    autoAdvance: {
      type: Boolean,
      default: false
    },
    celebrationEffects: {
      type: Boolean,
      default: true
    }
  },

  // Reading Preferences (E-books)
  reading: {
    preferredLanguage: {
      type: String,
      enum: ['en', 'ur', 'ar', 'es', 'fr'],
      default: 'en'
    },
    autoReadAloud: {
      type: Boolean,
      default: false
    },
    highlightWords: {
      type: Boolean,
      default: true
    },
    showImages: {
      type: Boolean,
      default: true
    },
    pageFlipAnimation: {
      type: Boolean,
      default: true
    },
    backgroundColor: {
      type: String,
      enum: ['white', 'cream', 'light-blue', 'light-green'],
      default: 'cream'
    }
  },

  // Notification Preferences
  notifications: {
    achievements: {
      type: Boolean,
      default: true
    },
    newContent: {
      type: Boolean,
      default: true
    },
    reminders: {
      type: Boolean,
      default: true
    },
    weeklySummary: {
      type: Boolean,
      default: true
    },
    parentMessages: {
      type: Boolean,
      default: true
    }
  },

  // Privacy Preferences
  privacy: {
    showOnLeaderboard: {
      type: Boolean,
      default: true
    },
    shareProgressWithParent: {
      type: Boolean,
      default: true
    },
    allowAnonymousStats: {
      type: Boolean,
      default: true
    }
  },

  // Dashboard Customization
  dashboard: {
    showRecentGames: {
      type: Boolean,
      default: true
    },
    showProgress: {
      type: Boolean,
      default: true
    },
    showAchievements: {
      type: Boolean,
      default: true
    },
    showNotifications: {
      type: Boolean,
      default: true
    },
    favoriteGames: [{
      type: String
    }]
  },

  // Avatar & Personalization
  avatar: {
    type: {
      type: String,
      enum: ['default', 'custom', 'animal', 'character'],
      default: 'default'
    },
    imageUrl: String,
    backgroundColor: {
      type: String,
      default: '#6366f1'
    },
    selectedAvatar: String
  }

}, {
  timestamps: true
});

// Pre-save middleware to ensure defaults
studentPreferencesSchema.pre('save', function(next) {
  // Ensure nested objects exist
  if (!this.display) this.display = {};
  if (!this.audio) this.audio = {};
  if (!this.games) this.games = {};
  if (!this.reading) this.reading = {};
  if (!this.notifications) this.notifications = {};
  if (!this.privacy) this.privacy = {};
  if (!this.dashboard) this.dashboard = {};
  if (!this.avatar) this.avatar = {};
  next();
});

// Static method to get or create preferences
studentPreferencesSchema.statics.getOrCreatePreferences = async function(userId) {
  let preferences = await this.findOne({ userId });
  if (!preferences) {
    preferences = new this({ userId });
    await preferences.save();
  }
  return preferences;
};

// Instance method to update specific category
studentPreferencesSchema.methods.updateCategory = async function(category, updates) {
  if (this[category]) {
    Object.assign(this[category], updates);
    await this.save();
  }
  return this;
};

// Instance method to reset to defaults
studentPreferencesSchema.methods.resetToDefaults = async function() {
  this.display = {
    theme: 'colorful',
    fontSize: 'medium',
    fontFamily: 'default',
    lineSpacing: 'normal',
    letterSpacing: 'normal',
    reducedMotion: false,
    highContrast: false
  };
  this.audio = {
    soundEffects: true,
    soundVolume: 70,
    textToSpeech: true,
    ttsSpeed: 'normal',
    ttsVoice: 'default',
    backgroundMusic: false
  };
  this.games = {
    difficulty: 'adaptive',
    showHints: true,
    timerEnabled: true,
    autoAdvance: false,
    celebrationEffects: true
  };
  this.reading = {
    preferredLanguage: 'en',
    autoReadAloud: false,
    highlightWords: true,
    showImages: true,
    pageFlipAnimation: true,
    backgroundColor: 'cream'
  };
  this.notifications = {
    achievements: true,
    newContent: true,
    reminders: true,
    weeklySummary: true,
    parentMessages: true
  };
  await this.save();
  return this;
};

// Virtual for CSS custom properties
studentPreferencesSchema.virtual('cssVariables').get(function() {
  const fontSizeMap = {
    small: '14px',
    medium: '16px',
    large: '18px',
    'extra-large': '20px'
  };

  const lineSpacingMap = {
    normal: '1.5',
    relaxed: '1.75',
    loose: '2'
  };

  const letterSpacingMap = {
    normal: 'normal',
    wide: '0.05em',
    wider: '0.1em'
  };

  const fontFamilyMap = {
    default: "'Nunito', 'Segoe UI', sans-serif",
    'dyslexia-friendly': "'OpenDyslexic', 'Comic Sans MS', sans-serif",
    'comic-sans': "'Comic Sans MS', cursive, sans-serif",
    'open-sans': "'Open Sans', sans-serif"
  };

  return {
    '--font-size-base': fontSizeMap[this.display?.fontSize] || '16px',
    '--line-height': lineSpacingMap[this.display?.lineSpacing] || '1.5',
    '--letter-spacing': letterSpacingMap[this.display?.letterSpacing] || 'normal',
    '--font-family': fontFamilyMap[this.display?.fontFamily] || fontFamilyMap.default
  };
});

const StudentPreferences = mongoose.model('StudentPreferences', studentPreferencesSchema);

module.exports = StudentPreferences;
