const mongoose = require('mongoose');

const EbookSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  storyId: {
    type: Number,
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
  pagesRead: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  totalTimeSpent: {
    type: Number, // in seconds
    default: 0
  },
  pageReads: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EbookPageRead'
  }],
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
EbookSessionSchema.index({ userId: 1, storyId: 1 });
EbookSessionSchema.index({ userId: 1, startTime: -1 });
EbookSessionSchema.index({ userId: 1, status: 1 });

// Prevent model overwrite in development
module.exports = mongoose.models.EbookSession || mongoose.model('EbookSession', EbookSessionSchema);