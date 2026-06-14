const mongoose = require('mongoose');

const TherapyGameSessionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  psychologistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  gameType: {
    type: String,
    enum: ['logical_maze', 'spelling_bee', 'memory_match', 'pattern_recognition', 'reaction_time'],
    required: true,
    index: true
  },
  sessionDate: {
    type: Date,
    required: true,
    default: Date.now,
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
  duration: {
    type: Number, // in seconds
    default: 0
  },
  
  // Game Performance Metrics
  score: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number, // percentage
    default: 0
  },
  completionStatus: {
    type: String,
    enum: ['completed', 'incomplete', 'abandoned'],
    default: 'incomplete'
  },
  
  // Logical Maze specific
  mazeData: {
    gridSize: String, // e.g., "10x10"
    stepsUsed: Number,
    optimalSteps: Number,
    hintsUsed: Number,
    timeTaken: Number, // seconds
    difficulty: String // 'easy', 'medium', 'hard'
  },
  
  // Spelling Bee specific
  spellingData: {
    totalWords: Number,
    correctWords: Number,
    incorrectWords: Number,
    averageTimePerWord: Number,
    difficulty: String, // 'easy', 'medium', 'hard'
    wordList: [String]
  },
  
  // Memory Match specific
  memoryData: {
    totalPairs: Number,
    matchedPairs: Number,
    attempts: Number,
    averageMatchTime: Number
  },
  
  // Pattern Recognition specific
  patternData: {
    patternsShown: Number,
    correctIdentifications: Number,
    complexity: String // 'simple', 'moderate', 'complex'
  },
  
  // Reaction Time specific
  reactionData: {
    totalTrials: Number,
    averageReactionTime: Number, // milliseconds
    fastestReaction: Number,
    slowestReaction: Number
  },
  
  // Session Notes
  notes: {
    type: String,
    maxlength: 2000
  },
  psychologistObservations: {
    type: String,
    maxlength: 5000
  },
  
  // Flags and Concerns
  flaggedIssues: [{
    issue: String,
    severity: {
      type: String,
      enum: ['low', 'moderate', 'high']
    },
    timestamp: Date
  }],
  
  // Session Type
  sessionType: {
    type: String,
    enum: ['assessment', 'therapy', 'practice', 'evaluation'],
    default: 'therapy'
  },
  
  // Is this part of a formal assessment?
  isAssessment: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
TherapyGameSessionSchema.index({ studentId: 1, sessionDate: -1 });
TherapyGameSessionSchema.index({ psychologistId: 1, sessionDate: -1 });
TherapyGameSessionSchema.index({ studentId: 1, gameType: 1 });
TherapyGameSessionSchema.index({ gameType: 1, sessionDate: -1 });

module.exports = mongoose.models.TherapyGameSession || mongoose.model('TherapyGameSession', TherapyGameSessionSchema);
