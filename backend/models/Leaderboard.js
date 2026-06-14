const mongoose = require('mongoose');

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

leaderboardSchema.index({ period: 1, operation: 1, score: -1 });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);