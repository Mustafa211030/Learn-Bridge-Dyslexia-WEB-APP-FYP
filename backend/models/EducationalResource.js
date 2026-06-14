// models/EducationalResource.js
// Educational resource model for psychologist-uploaded materials

const mongoose = require('mongoose');

const educationalResourceSchema = new mongoose.Schema({
  // Uploader Reference
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Resource Information
  title: {
    type: String,
    required: [true, 'Resource title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },

  description: {
    type: String,
    maxlength: 2000
  },

  // File Information
  file: {
    url: {
      type: String,
      required: [true, 'File URL is required']
    },
    originalName: String,
    mimeType: String,
    size: Number, // in bytes
    extension: String
  },

  // Thumbnail (for images/videos/PDFs)
  thumbnail: {
    url: String,
    alt: String
  },

  // Resource Type
  resourceType: {
    type: String,
    enum: [
      'document',    // PDF, DOC, etc.
      'worksheet',   // Printable worksheets
      'video',       // Video content
      'audio',       // Audio content
      'presentation',// PPT, Slides
      'infographic', // Visual guides
      'template',    // Templates
      'guide',       // How-to guides
      'assessment',  // Assessment tools
      'activity',    // Activities & exercises
      'game',        // Educational games
      'other'
    ],
    default: 'document'
  },

  // Categorization
  category: {
    type: String,
    enum: [
      'Cognitive Development',
      'Emotional Regulation',
      'Social Skills',
      'Learning Strategies',
      'Behavioral Management',
      'Parent Resources',
      'Teacher Resources',
      'Assessment Tools',
      'Therapy Activities',
      'Mindfulness & Relaxation',
      'Communication Skills',
      'Study Skills',
      'ADHD Resources',
      'Anxiety Management',
      'Self-Esteem',
      'Coping Strategies',
      'Other'
    ],
    default: 'Other'
  },

  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],

  // Target Audience
  targetAudience: {
    type: String,
    enum: ['students', 'parents', 'teachers', 'therapists', 'general'],
    default: 'general'
  },

  ageRange: {
    min: { type: Number, min: 0, max: 100, default: 0 },
    max: { type: Number, min: 0, max: 100, default: 18 }
  },

  gradeLevel: [{
    type: String,
    enum: ['preschool', 'elementary', 'middle_school', 'high_school', 'college', 'adult', 'all']
  }],

  // Visibility & Status
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },

  visibility: {
    type: String,
    enum: ['public', 'students_only', 'parents_only', 'private'],
    default: 'public'
  },

  // Access Control
  requiresApproval: {
    type: Boolean,
    default: false
  },

  approvedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Metrics
  metrics: {
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 }
  },

  // User Interactions
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    createdAt: { type: Date, default: Date.now }
  }],

  // Download History
  downloadHistory: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    downloadedAt: { type: Date, default: Date.now },
    ipAddress: String
  }],

  // Features
  isFeatured: {
    type: Boolean,
    default: false
  },

  isPremium: {
    type: Boolean,
    default: false
  },

  // Related Resources
  relatedResources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EducationalResource'
  }],

  // Additional Metadata
  language: {
    type: String,
    default: 'English'
  },

  duration: Number, // For video/audio in seconds

  pageCount: Number, // For documents

  // Usage Instructions
  instructions: String,

  // Learning Objectives
  learningObjectives: [String],

  // Prerequisites
  prerequisites: [String]

}, {
  timestamps: true
});

// Indexes
educationalResourceSchema.index({ uploadedBy: 1, status: 1 });
educationalResourceSchema.index({ category: 1, status: 1 });
educationalResourceSchema.index({ resourceType: 1 });
educationalResourceSchema.index({ tags: 1 });
educationalResourceSchema.index({ 'metrics.downloads': -1 });
educationalResourceSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for file size in human readable format
educationalResourceSchema.virtual('fileSizeFormatted').get(function() {
  const bytes = this.file?.size;
  if (!bytes) return 'Unknown';
  
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
});

// Pre-save middleware
educationalResourceSchema.pre('save', function(next) {
  // Extract file extension if not set
  if (this.file?.originalName && !this.file.extension) {
    const parts = this.file.originalName.split('.');
    this.file.extension = parts.length > 1 ? parts.pop().toLowerCase() : '';
  }

  // Ensure unique tags
  if (this.tags) {
    this.tags = [...new Set(this.tags)];
  }

  next();
});

// Instance Methods
educationalResourceSchema.methods.incrementViews = async function() {
  this.metrics.views += 1;
  await this.save();
};

educationalResourceSchema.methods.recordDownload = async function(userId, ipAddress = null) {
  this.metrics.downloads += 1;
  this.downloadHistory.push({
    user: userId,
    ipAddress,
    downloadedAt: new Date()
  });
  
  // Keep only last 1000 downloads
  if (this.downloadHistory.length > 1000) {
    this.downloadHistory = this.downloadHistory.slice(-1000);
  }
  
  await this.save();
};

educationalResourceSchema.methods.toggleLike = async function(userId) {
  const likeIndex = this.likedBy.findIndex(id => id.equals(userId));
  
  if (likeIndex === -1) {
    this.likedBy.push(userId);
    this.metrics.likes += 1;
  } else {
    this.likedBy.splice(likeIndex, 1);
    this.metrics.likes = Math.max(0, this.metrics.likes - 1);
  }
  
  await this.save();
  return likeIndex === -1;
};

educationalResourceSchema.methods.addRating = async function(userId, rating, review = '') {
  // Check if user already rated
  const existingRatingIndex = this.ratings.findIndex(r => r.user.equals(userId));
  
  if (existingRatingIndex !== -1) {
    // Update existing rating
    this.ratings[existingRatingIndex].rating = rating;
    this.ratings[existingRatingIndex].review = review;
    this.ratings[existingRatingIndex].createdAt = new Date();
  } else {
    // Add new rating
    this.ratings.push({ user: userId, rating, review });
    this.metrics.totalRatings += 1;
  }
  
  // Recalculate average rating
  const totalRating = this.ratings.reduce((sum, r) => sum + r.rating, 0);
  this.metrics.avgRating = Math.round((totalRating / this.ratings.length) * 10) / 10;
  
  await this.save();
};

// Static Methods
educationalResourceSchema.statics.getPublished = function(options = {}) {
  const { category, resourceType, targetAudience, limit = 20, page = 1 } = options;
  
  const query = { status: 'published' };
  
  if (category) query.category = category;
  if (resourceType) query.resourceType = resourceType;
  if (targetAudience) query.targetAudience = targetAudience;

  return this.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('uploadedBy', 'firstName lastName');
};

educationalResourceSchema.statics.getPopular = function(limit = 10) {
  return this.find({ status: 'published' })
    .sort({ 'metrics.downloads': -1, 'metrics.views': -1 })
    .limit(limit)
    .populate('uploadedBy', 'firstName lastName');
};

educationalResourceSchema.statics.getByPsychologist = function(psychologistId, options = {}) {
  const { status, limit = 50, page = 1 } = options;
  
  const query = { uploadedBy: psychologistId };
  if (status) query.status = status;

  return this.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

educationalResourceSchema.statics.search = function(searchTerm, options = {}) {
  const { limit = 20, page = 1 } = options;

  return this.find(
    { 
      $text: { $search: searchTerm },
      status: 'published'
    },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('uploadedBy', 'firstName lastName');
};

const EducationalResource = mongoose.model('EducationalResource', educationalResourceSchema);

module.exports = EducationalResource;
