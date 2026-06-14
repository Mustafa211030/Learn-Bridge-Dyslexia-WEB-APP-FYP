const mongoose = require('mongoose');

const LetterTracingAttemptSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LetterTracingSession',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  letter: {
    type: String,
    required: true,
    maxlength: 1
  },
  letterIndex: {
    type: Number,
    required: true,
    min: 0,
    max: 25
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  strokeCount: {
    type: Number,
    default: 0
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
LetterTracingAttemptSchema.index({ userId: 1, timestamp: -1 });
LetterTracingAttemptSchema.index({ sessionId: 1 });
LetterTracingAttemptSchema.index({ userId: 1, letter: 1 });

// Prevent model overwrite in development
module.exports = mongoose.models.LetterTracingAttempt || mongoose.model('LetterTracingAttempt', LetterTracingAttemptSchema);