const mongoose = require('mongoose');

// ============================================
// GAME SESSION SCHEMA - Stores each game played
// ============================================
const gameSessionSchema = new mongoose.Schema({
  odId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  odName: {
    type: String,
    required: true
  },
  gameType: {
    type: String,
    default: 'math-quest'
  },
  operation: {
    type: String,
    enum: ['addition', 'subtraction', 'multiplication', 'division', 'mixed'],
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  wrongAnswers: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,  // Percentage 0-100
    required: true
  },
  totalTime: {
    type: Number,  // Total time in seconds
    required: true
  },
  avgTimePerQuestion: {
    type: Number,  // Average time per question in seconds
    required: true
  },
  hintsUsed: {
    type: Number,
    default: 0
  },
  maxStreak: {
    type: Number,
    default: 0
  },
  // Individual question performance
  questionDetails: [{
    question: String,
    correctAnswer: Number,
    userAnswer: Number,
    isCorrect: Boolean,
    timeTaken: Number,  // seconds
    hintUsed: Boolean
  }],
  // Difficulty tracking
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// ============================================
// USER STATS SCHEMA - Aggregated user statistics
// ============================================
const userStatsSchema = new mongoose.Schema({
  odId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  odName: {
    type: String,
    required: true
  },
  // Overall Stats
  totalGamesPlayed: {
    type: Number,
    default: 0
  },
  totalScore: {
    type: Number,
    default: 0
  },
  highestScore: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  totalQuestionsAnswered: {
    type: Number,
    default: 0
  },
  totalCorrectAnswers: {
    type: Number,
    default: 0
  },
  overallAccuracy: {
    type: Number,  // Percentage
    default: 0
  },
  totalPlayTime: {
    type: Number,  // Total seconds played
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  // Per-Operation Stats
  operationStats: {
    addition: {
      gamesPlayed: { type: Number, default: 0 },
      totalScore: { type: Number, default: 0 },
      highestScore: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      totalQuestions: { type: Number, default: 0 },
      correctAnswers: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 }
    },
    subtraction: {
      gamesPlayed: { type: Number, default: 0 },
      totalScore: { type: Number, default: 0 },
      highestScore: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      totalQuestions: { type: Number, default: 0 },
      correctAnswers: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 }
    },
    multiplication: {
      gamesPlayed: { type: Number, default: 0 },
      totalScore: { type: Number, default: 0 },
      highestScore: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      totalQuestions: { type: Number, default: 0 },
      correctAnswers: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 }
    },
    division: {
      gamesPlayed: { type: Number, default: 0 },
      totalScore: { type: Number, default: 0 },
      highestScore: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      totalQuestions: { type: Number, default: 0 },
      correctAnswers: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 }
    }
  },
  // Performance over time (last 30 days aggregated)
  dailyPerformance: [{
    date: Date,
    gamesPlayed: Number,
    totalScore: Number,
    accuracy: Number,
    avgTimePerQuestion: Number
  }],
  // Achievements/Badges
  achievements: [{
    name: String,
    description: String,
    earnedAt: Date,
    icon: String
  }],
  // Ranking
  rank: {
    type: Number,
    default: 0
  },
  lastPlayedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// ============================================
// LEADERBOARD SCHEMA - Global rankings
// ============================================
const leaderboardSchema = new mongoose.Schema({
  odId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  odName: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  operation: {
    type: String,
    enum: ['addition', 'subtraction', 'multiplication', 'division', 'overall'],
    default: 'overall'
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'allTime'],
    default: 'allTime'
  },
  rank: {
    type: Number
  },
  accuracy: {
    type: Number
  },
  gamesPlayed: {
    type: Number
  }
}, {
  timestamps: true
});

// Indexes for faster queries
gameSessionSchema.index({ odId: 1, completedAt: -1 });
gameSessionSchema.index({ operation: 1, score: -1 });
leaderboardSchema.index({ period: 1, operation: 1, score: -1 });

const GameSession = mongoose.model('GameSession', gameSessionSchema);
const UserStats = mongoose.model('UserStats', userStatsSchema);
const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

module.exports = {
  GameSession,
  UserStats,
  Leaderboard
};
