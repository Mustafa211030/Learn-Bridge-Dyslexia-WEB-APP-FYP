const mongoose = require('mongoose');

const LetterTracingSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active',
    index: true
  },
  lettersCompleted: {
    type: Number,
    default: 0
  },
  totalAttempts: {
    type: Number,
    default: 0
  },
  correctAttempts: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0
  },
  attempts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LetterTracingAttempt'
  }],
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
LetterTracingSessionSchema.index({ userId: 1, startTime: -1 });
LetterTracingSessionSchema.index({ userId: 1, status: 1 });

// Prevent model overwrite in development
module.exports = mongoose.models.LetterTracingSession || mongoose.model('LetterTracingSession', LetterTracingSessionSchema);