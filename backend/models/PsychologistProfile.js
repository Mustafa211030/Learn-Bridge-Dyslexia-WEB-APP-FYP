// models/PsychologistProfile.js
// Psychologist professional profile with credentials and statistics

const mongoose = require('mongoose');

const psychologistProfileSchema = new mongoose.Schema({
  // Reference to User model
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  // Professional Credentials
  credentials: {
    degree: {
      type: String,
      enum: ['PhD', 'PsyD', 'EdD', 'MA', 'MS', 'MD', 'Other'],
      default: 'PhD'
    },
    licenseNumber: {
      type: String,
      trim: true
    },
    licenseState: {
      type: String,
      trim: true
    },
    licenseExpiry: Date,
    certifications: [{
      name: String,
      issuingOrganization: String,
      issueDate: Date,
      expiryDate: Date
    }]
  },

  // Professional Information
  yearsOfExperience: {
    type: Number,
    min: 0,
    default: 0
  },

  specializations: [{
    type: String,
    enum: [
      'Child Psychology',
      'Adolescent Psychology',
      'Educational Psychology',
      'Cognitive Behavioral Therapy',
      'Play Therapy',
      'Learning Disabilities',
      'ADHD',
      'Autism Spectrum',
      'Anxiety Disorders',
      'Depression',
      'Behavioral Issues',
      'Developmental Psychology',
      'Neuropsychology',
      'School Psychology',
      'Family Therapy',
      'Other'
    ]
  }],

  languages: [{
    type: String,
    default: ['English']
  }],

  // Biography & Description
  biography: {
    type: String,
    maxlength: 2000
  },

  shortBio: {
    type: String,
    maxlength: 300
  },

  // Contact Information
  contact: {
    officePhone: String,
    mobilePhone: String,
    officeAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'USA' }
    },
    availableHours: {
      monday: { start: String, end: String, available: Boolean },
      tuesday: { start: String, end: String, available: Boolean },
      wednesday: { start: String, end: String, available: Boolean },
      thursday: { start: String, end: String, available: Boolean },
      friday: { start: String, end: String, available: Boolean },
      saturday: { start: String, end: String, available: Boolean },
      sunday: { start: String, end: String, available: Boolean }
    }
  },

  // Profile Media
  profilePhoto: {
    type: String,
    default: null
  },

  headerImage: {
    type: String,
    default: null
  },

  // Statistics (Auto-calculated)
  statistics: {
    totalStudents: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
    totalAssessments: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    blogsPublished: { type: Number, default: 0 },
    resourcesUploaded: { type: Number, default: 0 }
  },

  // Settings & Preferences
  settings: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    dashboardLayout: {
      type: String,
      enum: ['default', 'compact', 'expanded'],
      default: 'default'
    },
    defaultAssessmentTemplate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AssessmentTemplate'
    }
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  verificationDate: Date,

  // Timestamps
  lastLoginAt: Date

}, {
  timestamps: true
});

// Indexes for efficient queries
psychologistProfileSchema.index({ user: 1 });
psychologistProfileSchema.index({ 'specializations': 1 });
psychologistProfileSchema.index({ isActive: 1, isVerified: 1 });

// Virtual for full name (populated from User)
psychologistProfileSchema.virtual('fullName').get(function() {
  return this.populated('user') 
    ? `${this.user.firstName} ${this.user.lastName}`
    : null;
});

// Method to update statistics
psychologistProfileSchema.methods.updateStatistics = async function() {
  const User = mongoose.model('User');
  const StudentAssessment = mongoose.model('StudentAssessment');
  const Blog = mongoose.model('Blog');
  const EducationalResource = mongoose.model('EducationalResource');

  // Count assigned students
  const studentCount = await User.countDocuments({ 
    assignedPsychologist: this.user,
    role: 'Student'
  });

  // Count assessments
  const assessmentCount = await StudentAssessment.countDocuments({
    psychologist: this.user
  });

  // Count published blogs
  const blogCount = await Blog.countDocuments({
    author: this.user,
    status: 'published'
  });

  // Count resources
  const resourceCount = await EducationalResource.countDocuments({
    uploadedBy: this.user
  });

  this.statistics.totalStudents = studentCount;
  this.statistics.totalAssessments = assessmentCount;
  this.statistics.blogsPublished = blogCount;
  this.statistics.resourcesUploaded = resourceCount;

  await this.save();
};

// Static method to get or create profile
psychologistProfileSchema.statics.getOrCreate = async function(userId) {
  let profile = await this.findOne({ user: userId });
  
  if (!profile) {
    profile = await this.create({ user: userId });
  }
  
  return profile;
};

// Pre-save middleware
psychologistProfileSchema.pre('save', function(next) {
  // Ensure specializations are unique
  if (this.specializations) {
    this.specializations = [...new Set(this.specializations)];
  }
  
  // Ensure languages are unique
  if (this.languages) {
    this.languages = [...new Set(this.languages)];
  }
  
  next();
});

const PsychologistProfile = mongoose.model('PsychologistProfile', psychologistProfileSchema);

module.exports = PsychologistProfile;
