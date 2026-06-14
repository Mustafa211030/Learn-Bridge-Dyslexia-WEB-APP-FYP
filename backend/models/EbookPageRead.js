const mongoose = require('mongoose');

const EbookPageReadSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EbookSession',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  storyId: {
    type: Number,
    required: true
  },
  pageIndex: {
    type: Number,
    required: true
  },
  language: {
    type: String,
    enum: ['en', 'ur'],
    required: true
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  wasReadAloud: {
    type: Boolean,
    default: false
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
EbookPageReadSchema.index({ userId: 1, storyId: 1, pageIndex: 1 });
EbookPageReadSchema.index({ sessionId: 1 });
EbookPageReadSchema.index({ userId: 1, timestamp: -1 });

// Prevent model overwrite in development
module.exports = mongoose.models.EbookPageRead || mongoose.model('EbookPageRead', EbookPageReadSchema);