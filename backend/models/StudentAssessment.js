// models/StudentAssessment.js
// Student cognitive assessment model with game-based scoring

const mongoose = require('mongoose');

const cognitiveScoreSchema = new mongoose.Schema({
  memory: { type: Number, min: 0, max: 100, default: 0 },
  attention: { type: Number, min: 0, max: 100, default: 0 },
  problemSolving: { type: Number, min: 0, max: 100, default: 0 },
  processingSpeed: { type: Number, min: 0, max: 100, default: 0 },
  verbal: { type: Number, min: 0, max: 100, default: 0 }
}, { _id: false });

const gamePerformanceSchema = new mongoose.Schema({
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  },
  gameName: String,
  gameType: {
    type: String,
    enum: ['memory', 'attention', 'logic', 'speed', 'word', 'pattern', 'math', 'spatial']
  },
  score: Number,
  accuracy: Number,
  timeSpent: Number, // in seconds
  completedAt: Date,
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'adaptive']
  }
}, { _id: false });

const studentAssessmentSchema = new mongoose.Schema({
  // References
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  psychologist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Assessment Type
  assessmentType: {
    type: String,
    enum: ['initial', 'follow-up', 'periodic', 'custom'],
    default: 'periodic'
  },

  // Cognitive Scores
  cognitiveScores: cognitiveScoreSchema,

  // Previous Scores (for comparison)
  previousCognitiveScores: cognitiveScoreSchema,

  // Overall Score (weighted average)
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },

  // Risk Assessment
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },

  riskFactors: [{
    factor: String,
    severity: {
      type: String,
      enum: ['minor', 'moderate', 'significant']
    },
    notes: String
  }],

  // Game Performance Data
  gamePerformance: [gamePerformanceSchema],

  // Performance Summary
  performanceSummary: {
    totalGamesPlayed: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    averageAccuracy: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 }, // in seconds
    strongestArea: String,
    weakestArea: String,
    improvementAreas: [String],
    periodStart: Date,
    periodEnd: Date
  },

  // Progress Tracking
  progressIndicators: {
    memoryTrend: { type: String, enum: ['improving', 'stable', 'declining'], default: 'stable' },
    attentionTrend: { type: String, enum: ['improving', 'stable', 'declining'], default: 'stable' },
    problemSolvingTrend: { type: String, enum: ['improving', 'stable', 'declining'], default: 'stable' },
    processingSpeedTrend: { type: String, enum: ['improving', 'stable', 'declining'], default: 'stable' },
    verbalTrend: { type: String, enum: ['improving', 'stable', 'declining'], default: 'stable' },
    overallTrend: { type: String, enum: ['improving', 'stable', 'declining'], default: 'stable' }
  },

  // Psychologist Notes & Recommendations
  notes: {
    type: String,
    maxlength: 5000
  },

  recommendations: [{
    category: {
      type: String,
      enum: ['academic', 'behavioral', 'cognitive', 'social', 'emotional', 'other']
    },
    recommendation: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    followUpDate: Date
  }],

  // Flags & Alerts
  flags: [{
    type: {
      type: String,
      enum: ['attention_needed', 'significant_decline', 'breakthrough', 'intervention_required', 'parent_contact', 'other']
    },
    description: String,
    createdAt: { type: Date, default: Date.now },
    resolved: { type: Boolean, default: false },
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // Assessment Status
  status: {
    type: String,
    enum: ['draft', 'completed', 'reviewed', 'archived'],
    default: 'completed'
  },

  // Parent/Guardian Access
  sharedWithParent: {
    type: Boolean,
    default: false
  },

  parentViewedAt: Date,

  // Metadata
  dataSource: {
    type: String,
    enum: ['automatic', 'manual', 'hybrid'],
    default: 'automatic'
  },

  assessmentPeriod: {
    startDate: Date,
    endDate: Date
  }

}, {
  timestamps: true
});

// Compound indexes for efficient queries
studentAssessmentSchema.index({ student: 1, createdAt: -1 });
studentAssessmentSchema.index({ psychologist: 1, createdAt: -1 });
studentAssessmentSchema.index({ student: 1, psychologist: 1 });
studentAssessmentSchema.index({ riskLevel: 1 });
studentAssessmentSchema.index({ status: 1 });

// Virtual for assessment age
studentAssessmentSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Calculate overall score from cognitive scores
studentAssessmentSchema.methods.calculateOverallScore = function() {
  const scores = this.cognitiveScores;
  const weights = {
    memory: 0.2,
    attention: 0.2,
    problemSolving: 0.25,
    processingSpeed: 0.15,
    verbal: 0.2
  };

  let totalScore = 0;
  let totalWeight = 0;

  for (const [key, weight] of Object.entries(weights)) {
    if (scores[key] !== undefined && scores[key] !== null) {
      totalScore += scores[key] * weight;
      totalWeight += weight;
    }
  }

  this.overallScore = totalWeight > 0 ? Math.round(totalScore / totalWeight * 10) / 10 : 0;
  return this.overallScore;
};

// Determine risk level based on scores
studentAssessmentSchema.methods.calculateRiskLevel = function() {
  const scores = this.cognitiveScores;
  const scoreValues = Object.values(scores).filter(v => v !== undefined && v !== null);
  
  if (scoreValues.length === 0) {
    this.riskLevel = 'low';
    return this.riskLevel;
  }

  const avgScore = scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length;
  const minScore = Math.min(...scoreValues);

  if (avgScore < 40 || minScore < 25) {
    this.riskLevel = 'high';
  } else if (avgScore < 60 || minScore < 40) {
    this.riskLevel = 'medium';
  } else {
    this.riskLevel = 'low';
  }

  return this.riskLevel;
};

// Calculate trends from previous assessment
studentAssessmentSchema.methods.calculateTrends = function() {
  if (!this.previousCognitiveScores) return;

  const threshold = 5; // 5 point change threshold
  const areas = ['memory', 'attention', 'problemSolving', 'processingSpeed', 'verbal'];

  for (const area of areas) {
    const current = this.cognitiveScores[area] || 0;
    const previous = this.previousCognitiveScores[area] || 0;
    const diff = current - previous;

    const trendKey = `${area}Trend`;
    if (diff > threshold) {
      this.progressIndicators[trendKey] = 'improving';
    } else if (diff < -threshold) {
      this.progressIndicators[trendKey] = 'declining';
    } else {
      this.progressIndicators[trendKey] = 'stable';
    }
  }

  // Calculate overall trend
  const currentOverall = this.overallScore;
  const previousOverall = this.previousCognitiveScores 
    ? Object.values(this.previousCognitiveScores).reduce((a, b) => a + b, 0) / 5
    : 0;
  
  const overallDiff = currentOverall - previousOverall;
  
  if (overallDiff > threshold) {
    this.progressIndicators.overallTrend = 'improving';
  } else if (overallDiff < -threshold) {
    this.progressIndicators.overallTrend = 'declining';
  } else {
    this.progressIndicators.overallTrend = 'stable';
  }
};

// Find strongest and weakest areas
studentAssessmentSchema.methods.analyzeStrengthsWeaknesses = function() {
  const scores = this.cognitiveScores;
  const areaNames = {
    memory: 'Memory',
    attention: 'Attention',
    problemSolving: 'Problem Solving',
    processingSpeed: 'Processing Speed',
    verbal: 'Verbal Skills'
  };

  let maxScore = -1;
  let minScore = 101;
  let strongest = '';
  let weakest = '';

  for (const [key, value] of Object.entries(scores)) {
    if (value !== undefined && value !== null) {
      if (value > maxScore) {
        maxScore = value;
        strongest = areaNames[key];
      }
      if (value < minScore) {
        minScore = value;
        weakest = areaNames[key];
      }
    }
  }

  this.performanceSummary.strongestArea = strongest;
  this.performanceSummary.weakestArea = weakest;

  // Identify improvement areas (below 60)
  this.performanceSummary.improvementAreas = Object.entries(scores)
    .filter(([_, value]) => value !== undefined && value < 60)
    .map(([key, _]) => areaNames[key]);
};

// Pre-save middleware
studentAssessmentSchema.pre('save', function(next) {
  this.calculateOverallScore();
  this.calculateRiskLevel();
  this.calculateTrends();
  this.analyzeStrengthsWeaknesses();
  next();
});

// Static method to get latest assessment for a student
studentAssessmentSchema.statics.getLatestForStudent = async function(studentId) {
  return this.findOne({ student: studentId })
    .sort({ createdAt: -1 })
    .populate('psychologist', 'firstName lastName email');
};

// Static method to get assessment history
studentAssessmentSchema.statics.getHistoryForStudent = async function(studentId, limit = 10) {
  return this.find({ student: studentId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('psychologist', 'firstName lastName');
};

// Static method to get high-risk students for a psychologist
studentAssessmentSchema.statics.getHighRiskStudents = async function(psychologistId) {
  return this.aggregate([
    { $match: { psychologist: mongoose.Types.ObjectId(psychologistId) } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$student',
        latestAssessment: { $first: '$$ROOT' }
      }
    },
    { $match: { 'latestAssessment.riskLevel': 'high' } },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'studentInfo'
      }
    },
    { $unwind: '$studentInfo' },
    {
      $project: {
        student: '$studentInfo',
        assessment: '$latestAssessment'
      }
    }
  ]);
};

const StudentAssessment = mongoose.model('StudentAssessment', studentAssessmentSchema);

module.exports = StudentAssessment;
