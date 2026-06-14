const mongoose = require('mongoose');

const PhonemeAnswerSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PhonemeGameSession',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  phoneme: {
    type: String,
    required: true
  },
  correctWord: {
    type: String,
    required: true
  },
  selectedWord: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
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
PhonemeAnswerSchema.index({ userId: 1, timestamp: -1 });
PhonemeAnswerSchema.index({ sessionId: 1 });
PhonemeAnswerSchema.index({ userId: 1, level: 1 });
PhonemeAnswerSchema.index({ userId: 1, phoneme: 1 });

// Prevent model overwrite in development
module.exports = mongoose.models.PhonemeAnswer || mongoose.model('PhonemeAnswer', PhonemeAnswerSchema);