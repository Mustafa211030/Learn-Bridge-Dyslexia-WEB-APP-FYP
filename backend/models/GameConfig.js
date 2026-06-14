// models/GameConfig.js
// Game Configuration Model for Admin Game Management

const mongoose = require('mongoose');

const gameConfigSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  displayName: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    maxlength: 1000
  },

  shortDescription: {
    type: String,
    maxlength: 200
  },

  category: {
    type: String,
    enum: ['cognitive', 'language', 'math', 'memory', 'motor-skills', 'reading', 'other'],
    default: 'cognitive'
  },

  icon: {
    type: String,
    default: 'gamepad'
  },

  thumbnail: {
    type: String,
    default: null
  },

  enabled: {
    type: Boolean,
    default: true,
    index: true
  },

  supportedLanguages: [{
    type: String,
    enum: ['en', 'ur', 'ar', 'es', 'fr', 'de', 'zh'],
    default: ['en']
  }],

  defaultLanguage: {
    type: String,
    enum: ['en', 'ur', 'ar', 'es', 'fr', 'de', 'zh'],
    default: 'en'
  },

  difficultyLevels: {
    easy: {
      enabled: { type: Boolean, default: true },
      label: { type: String, default: 'Easy' },
      description: String,
      settings: mongoose.Schema.Types.Mixed
    },
    medium: {
      enabled: { type: Boolean, default: true },
      label: { type: String, default: 'Medium' },
      description: String,
      settings: mongoose.Schema.Types.Mixed
    },
    hard: {
      enabled: { type: Boolean, default: true },
      label: { type: String, default: 'Hard' },
      description: String,
      settings: mongoose.Schema.Types.Mixed
    }
  },

  ageGroups: [{
    type: String,
    enum: ['4-6', '7-9', '10-12', '13-15', '16-18', '18+'],
    default: ['7-9', '10-12']
  }],

  targetAudience: {
    type: String,
    enum: ['students', 'all', 'therapists'],
    default: 'students'
  },

  cognitiveAreas: [{
    type: String,
    enum: ['memory', 'attention', 'problem-solving', 'processing-speed', 'verbal', 'visual', 'motor']
  }],

  settings: {
    timeLimit: {
      enabled: { type: Boolean, default: false },
      defaultValue: { type: Number, default: 60 },
      minValue: { type: Number, default: 30 },
      maxValue: { type: Number, default: 300 }
    },
    soundEffects: {
      enabled: { type: Boolean, default: true }
    },
    textToSpeech: {
      enabled: { type: Boolean, default: true }
    },
    hints: {
      enabled: { type: Boolean, default: true },
      maxPerSession: { type: Number, default: 3 }
    },
    dyslexiaMode: {
      enabled: { type: Boolean, default: true },
      fontFamily: { type: String, default: 'OpenDyslexic' }
    }
  },

  analytics: {
    totalPlays: { type: Number, default: 0 },
    completions: { type: Number, default: 0 },
    avgSessionDuration: { type: Number, default: 0 },
    avgScore: { type: Number, default: 0 },
    lastPlayedAt: Date
  },

  metadata: {
    version: { type: String, default: '1.0.0' },
    author: String,
    releaseDate: Date,
    lastUpdated: Date,
    tags: [String]
  },

  order: {
    type: Number,
    default: 0
  },

  isFeatured: {
    type: Boolean,
    default: false
  },

  isNew: {
    type: Boolean,
    default: true
  },

  routePath: {
    type: String,
    required: true
  },

  apiEndpoint: {
    type: String
  }

}, {
  timestamps: true
});

// Indexes
gameConfigSchema.index({ enabled: 1, order: 1 });
gameConfigSchema.index({ category: 1, enabled: 1 });
gameConfigSchema.index({ ageGroups: 1, enabled: 1 });

// Virtual for completion rate
gameConfigSchema.virtual('completionRate').get(function() {
  if (this.analytics.totalPlays === 0) return 0;
  return Math.round((this.analytics.completions / this.analytics.totalPlays) * 100);
});

// Method to update analytics
gameConfigSchema.methods.updateAnalytics = async function(sessionData) {
  this.analytics.totalPlays += 1;
  if (sessionData.completed) {
    this.analytics.completions += 1;
  }
  
  // Update running averages
  const n = this.analytics.totalPlays;
  if (sessionData.duration) {
    this.analytics.avgSessionDuration = 
      ((this.analytics.avgSessionDuration * (n - 1)) + sessionData.duration) / n;
  }
  if (sessionData.score !== undefined) {
    this.analytics.avgScore = 
      ((this.analytics.avgScore * (n - 1)) + sessionData.score) / n;
  }
  
  this.analytics.lastPlayedAt = new Date();
  await this.save();
};

// Static method to get enabled games
gameConfigSchema.statics.getEnabledGames = async function(filters = {}) {
  const query = { enabled: true };
  
  if (filters.category) query.category = filters.category;
  if (filters.ageGroup) query.ageGroups = filters.ageGroup;
  if (filters.language) query.supportedLanguages = filters.language;
  
  return this.find(query).sort({ order: 1 }).lean();
};

// Static method to get all games for admin
gameConfigSchema.statics.getAllForAdmin = async function() {
  return this.find().sort({ order: 1 }).lean();
};

// Pre-save middleware
gameConfigSchema.pre('save', function(next) {
  this.metadata.lastUpdated = new Date();
  
  // Ensure at least one language
  if (!this.supportedLanguages || this.supportedLanguages.length === 0) {
    this.supportedLanguages = ['en'];
  }
  
  // Ensure default language is supported
  if (!this.supportedLanguages.includes(this.defaultLanguage)) {
    this.defaultLanguage = this.supportedLanguages[0];
  }
  
  next();
});

const GameConfig = mongoose.model('GameConfig', gameConfigSchema);

module.exports = GameConfig;
