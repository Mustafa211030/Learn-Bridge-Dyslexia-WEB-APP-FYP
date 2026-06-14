const mongoose = require('mongoose');

const AssessmentReportSchema = new mongoose.Schema({
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
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentAssessment',
    required: true
  },
  reportTitle: {
    type: String,
    required: true
  },
  reportType: {
    type: String,
    enum: ['comprehensive', 'progress', 'diagnostic', 'summary'],
    default: 'comprehensive'
  },
  generatedAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  reportPeriod: {
    startDate: Date,
    endDate: Date
  },
  
  // Report Content (stored for reference)
  reportData: {
    studentInfo: {
      name: String,
      age: Number,
      grade: String
    },
    summaryText: String,
    cognitiveScores: mongoose.Schema.Types.Mixed,
    gamePerformance: mongoose.Schema.Types.Mixed,
    trends: mongoose.Schema.Types.Mixed,
    recommendations: [String],
    psychologistNotes: String,
    charts: [{
      type: String,
      imageUrl: String
    }]
  },
  
  // PDF File Information
  pdfUrl: {
    type: String,
    required: true
  },
  pdfFileName: {
    type: String,
    required: true
  },
  pdfFileSize: {
    type: Number // in bytes
  },
  
  // Psychologist Signature
  psychologistSignature: {
    name: String,
    credentials: String,
    licenseNumber: String,
    signatureDate: Date
  },
  
  // Access Control
  isSharedWithStudent: {
    type: Boolean,
    default: false
  },
  isSharedWithParent: {
    type: Boolean,
    default: false
  },
  sharedAt: {
    type: Date
  },
  
  // Status
  status: {
    type: String,
    enum: ['generated', 'reviewed', 'approved', 'archived'],
    default: 'generated'
  },
  
  // Version Control
  version: {
    type: Number,
    default: 1
  },
  previousVersionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssessmentReport'
  },
  
  // Download tracking
  downloadCount: {
    type: Number,
    default: 0
  },
  lastDownloadedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
AssessmentReportSchema.index({ studentId: 1, generatedAt: -1 });
AssessmentReportSchema.index({ psychologistId: 1, generatedAt: -1 });
AssessmentReportSchema.index({ assessmentId: 1 });
AssessmentReportSchema.index({ status: 1 });

module.exports = mongoose.models.AssessmentReport || mongoose.model('AssessmentReport', AssessmentReportSchema);
