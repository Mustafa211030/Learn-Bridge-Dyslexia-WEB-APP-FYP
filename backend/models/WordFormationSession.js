const mongoose = require('mongoose');

const WordFormationSessionSchema = new mongoose.Schema({
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
  finalScore: {
    type: Number,
    default: 0
  },
  finalLevel: {
    type: Number,
    default: 1
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
    ref: 'WordFormationAttempt'
  }],
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
WordFormationSessionSchema.index({ userId: 1, startTime: -1 });
WordFormationSessionSchema.index({ userId: 1, status: 1 });
WordFormationSessionSchema.index({ userId: 1, finalScore: -1 });

// Prevent model overwrite in development
module.exports = mongoose.models.WordFormationSession || mongoose.model('WordFormationSession', WordFormationSessionSchema);