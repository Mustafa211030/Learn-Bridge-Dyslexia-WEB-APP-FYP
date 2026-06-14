const mongoose = require('mongoose');

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
    type: Number,
    required: true
  },
  totalTime: {
    type: Number,
    required: true
  },
  avgTimePerQuestion: {
    type: Number,
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
  questionDetails: [{
    question: String,
    correctAnswer: Number,
    userAnswer: Number,
    isCorrect: Boolean,
    timeTaken: Number,
    hintUsed: Boolean
  }],
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

gameSessionSchema.index({ odId: 1, completedAt: -1 });
gameSessionSchema.index({ operation: 1, score: -1 });

module.exports = mongoose.model('GameSession', gameSessionSchema);