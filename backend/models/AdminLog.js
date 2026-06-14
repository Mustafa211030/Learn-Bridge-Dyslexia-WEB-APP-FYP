// models/AdminLog.js
// Admin Audit Log Model for tracking all admin actions

const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      // User Management
      'USER_CREATED',
      'USER_UPDATED',
      'USER_DELETED',
      'USER_ACTIVATED',
      'USER_DEACTIVATED',
      'USER_ROLE_CHANGED',
      'PASSWORD_RESET',
      
      // Game Management
      'GAME_ENABLED',
      'GAME_DISABLED',
      'GAME_CREATED',
      'GAME_UPDATED',
      'GAME_DELETED',
      
      // Content Moderation
      'BLOG_APPROVED',
      'BLOG_REJECTED',
      'BLOG_HIDDEN',
      'BLOG_ARCHIVED',
      'COMMENT_MODERATED',
      'COMMENT_DELETED',
      
      // System Settings
      'SETTINGS_UPDATED',
      'LANGUAGE_ENABLED',
      'LANGUAGE_DISABLED',
      'ACCESSIBILITY_UPDATED',
      
      // Reports & Exports
      'REPORT_GENERATED',
      'DATA_EXPORTED',
      
      // Authentication
      'ADMIN_LOGIN',
      'ADMIN_LOGOUT',
      'LOGIN_FAILED',
      
      // Other
      'OTHER'
    ],
    index: true
  },

  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  targetType: {
    type: String,
    enum: ['User', 'Game', 'Blog', 'Comment', 'Settings', 'Report', 'System', null],
    default: null
  },

  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },

  targetName: {
    type: String,
    default: null
  },

  previousValue: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },

  newValue: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },

  metadata: {
    ipAddress: String,
    userAgent: String,
    sessionId: String,
    additionalInfo: mongoose.Schema.Types.Mixed
  },

  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'success'
  },

  description: {
    type: String,
    maxlength: 500
  },

  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  }

}, {
  timestamps: true
});

// Compound indexes for efficient queries
adminLogSchema.index({ createdAt: -1 });
adminLogSchema.index({ action: 1, createdAt: -1 });
adminLogSchema.index({ performedBy: 1, createdAt: -1 });
adminLogSchema.index({ targetType: 1, targetId: 1 });
adminLogSchema.index({ severity: 1, createdAt: -1 });

// Static method to create log entry
adminLogSchema.statics.log = async function(logData) {
  try {
    const log = new this(logData);
    await log.save();
    return log;
  } catch (error) {
    console.error('Failed to create admin log:', error);
    return null;
  }
};

// Static method to get logs with filters
adminLogSchema.statics.getLogs = async function(filters = {}, options = {}) {
  const {
    action,
    performedBy,
    targetType,
    severity,
    startDate,
    endDate,
    search
  } = filters;

  const {
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    sortOrder = -1
  } = options;

  const query = {};

  if (action) query.action = action;
  if (performedBy) query.performedBy = performedBy;
  if (targetType) query.targetType = targetType;
  if (severity) query.severity = severity;

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  if (search) {
    query.$or = [
      { description: { $regex: search, $options: 'i' } },
      { targetName: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    this.find(query)
      .populate('performedBy', 'firstName lastName email role')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),
    this.countDocuments(query)
  ]);

  return {
    logs,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
};

// Static method to get activity summary
adminLogSchema.statics.getActivitySummary = async function(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const summary = await this.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          action: '$action'
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.date',
        actions: {
          $push: {
            action: '$_id.action',
            count: '$count'
          }
        },
        totalActions: { $sum: '$count' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return summary;
};

const AdminLog = mongoose.model('AdminLog', adminLogSchema);

module.exports = AdminLog;
