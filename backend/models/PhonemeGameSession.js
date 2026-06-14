const mongoose = require('mongoose');

const PhonemeGameSessionSchema = new mongoose.Schema({
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
  levelsCompleted: {
    type: Number,
    default: 0
  },
  totalCorrect: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PhonemeAnswer'
  }],
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
PhonemeGameSessionSchema.index({ userId: 1, startTime: -1 });
PhonemeGameSessionSchema.index({ userId: 1, status: 1 });

// Prevent model overwrite in development
module.exports = mongoose.models.PhonemeGameSession || mongoose.model('PhonemeGameSession', PhonemeGameSessionSchema);