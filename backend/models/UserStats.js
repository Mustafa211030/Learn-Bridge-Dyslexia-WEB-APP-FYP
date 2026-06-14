const mongoose = require('mongoose');

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
    type: Number,
    default: 0
  },
  totalPlayTime: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
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
  dailyPerformance: [{
    date: Date,
    gamesPlayed: Number,
    totalScore: Number,
    accuracy: Number,
    avgTimePerQuestion: Number
  }],
  achievements: [{
    name: String,
    description: String,
    earnedAt: Date,
    icon: String
  }],
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

module.exports = mongoose.model('UserStats', userStatsSchema);