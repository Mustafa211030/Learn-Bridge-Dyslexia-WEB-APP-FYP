const mongoose = require('mongoose');

const WordFormationAttemptSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WordFormationSession',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  word: {
    type: String,
    required: true
  },
  scrambledWord: {
    type: String,
    required: true
  },
  hint: {
    type: String,
    required: true
  },
  userAnswer: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  isTimeout: {
    type: Boolean,
    default: false
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
WordFormationAttemptSchema.index({ userId: 1, timestamp: -1 });
WordFormationAttemptSchema.index({ sessionId: 1 });
WordFormationAttemptSchema.index({ userId: 1, word: 1 });
WordFormationAttemptSchema.index({ userId: 1, isCorrect: 1 });

// Prevent model overwrite in development
module.exports = mongoose.models.WordFormationAttempt || mongoose.model('WordFormationAttempt', WordFormationAttemptSchema);