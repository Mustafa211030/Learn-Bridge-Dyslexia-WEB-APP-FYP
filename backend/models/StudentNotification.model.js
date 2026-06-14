// models/StudentNotification.model.js
// Student notification system for blogs, achievements, rewards, and updates

const mongoose = require('mongoose');

const studentNotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  type: {
    type: String,
    enum: [
      'achievement',      // New achievement unlocked
      'badge',           // New badge earned
      'level_up',        // Level increased
      'new_blog',        // New blog published
      'new_ebook',       // New ebook available
      'weekly_summary',  // Weekly progress summary
      'streak',          // Streak milestone
      'reward',          // Reward earned
      'reminder',        // Learning reminder
      'parent_message',  // Message from parent
      'system'           // System notification
    ],
    required: true,
    index: true
  },

  title: {
    type: String,
    required: true,
    maxlength: 200
  },

  message: {
    type: String,
    required: true,
    maxlength: 1000
  },

  icon: {
    type: String,
    default: '🔔'
  },

  // Priority level for ordering
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },

  // Associated content reference
  reference: {
    type: {
      type: String,
      enum: ['blog', 'game', 'ebook', 'achievement', 'badge', 'none']
    },
    id: mongoose.Schema.Types.ObjectId,
    url: String
  },

  // Read status
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },

  readAt: {
    type: Date
  },

  // For scheduled notifications
  scheduledFor: {
    type: Date
  },

  // Expiration (auto-delete after)
  expiresAt: {
    type: Date,
    index: true
  },

  // Additional metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }

}, {
  timestamps: true
});

// Compound indexes
studentNotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
studentNotificationSchema.index({ userId: 1, type: 1 });
studentNotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Instance method to mark as read
studentNotificationSchema.methods.markAsRead = async function() {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    await this.save();
  }
  return this;
};

// Static method to create notification
studentNotificationSchema.statics.createNotification = async function(data) {
  const notification = new this(data);
  await notification.save();
  return notification;
};

// Static method to get unread count
studentNotificationSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({ userId, isRead: false });
};

// Static method to get notifications for user
studentNotificationSchema.statics.getForUser = async function(userId, options = {}) {
  const { limit = 20, page = 1, unreadOnly = false, type = null } = options;

  const query = { userId };
  if (unreadOnly) query.isRead = false;
  if (type) query.type = type;

  const notifications = await this.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const total = await this.countDocuments(query);
  const unreadCount = await this.countDocuments({ userId, isRead: false });

  return {
    notifications,
    total,
    unreadCount,
    page,
    totalPages: Math.ceil(total / limit)
  };
};

// Static method to mark all as read
studentNotificationSchema.statics.markAllAsRead = async function(userId) {
  const result = await this.updateMany(
    { userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );
  return result.modifiedCount;
};

// Static method to delete old notifications
studentNotificationSchema.statics.cleanupOld = async function(daysOld = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const result = await this.deleteMany({
    isRead: true,
    createdAt: { $lt: cutoffDate }
  });
  return result.deletedCount;
};

// Static helper methods to create specific notification types
studentNotificationSchema.statics.notifyAchievement = async function(userId, achievement) {
  return this.createNotification({
    userId,
    type: 'achievement',
    title: '🏆 Achievement Unlocked!',
    message: `You've earned "${achievement.name}"! ${achievement.description}`,
    icon: achievement.icon || '🏆',
    priority: 'high',
    reference: {
      type: 'achievement',
      id: achievement._id
    },
    metadata: achievement
  });
};

studentNotificationSchema.statics.notifyBadge = async function(userId, badge) {
  return this.createNotification({
    userId,
    type: 'badge',
    title: '🎖️ New Badge Earned!',
    message: `Congratulations! You've earned the "${badge.name}" badge!`,
    icon: badge.icon || '🎖️',
    priority: 'high',
    reference: {
      type: 'badge',
      id: badge._id
    },
    metadata: badge
  });
};

studentNotificationSchema.statics.notifyLevelUp = async function(userId, newLevel) {
  return this.createNotification({
    userId,
    type: 'level_up',
    title: '⬆️ Level Up!',
    message: `Amazing! You've reached Level ${newLevel}! Keep up the great work!`,
    icon: '⬆️',
    priority: 'high',
    metadata: { level: newLevel }
  });
};

studentNotificationSchema.statics.notifyNewBlog = async function(userId, blog) {
  return this.createNotification({
    userId,
    type: 'new_blog',
    title: '📚 New Article Available!',
    message: `Check out "${blog.title}" - a new article just for you!`,
    icon: '📚',
    priority: 'medium',
    reference: {
      type: 'blog',
      id: blog._id,
      url: `/student/blogs/${blog._id}`
    },
    metadata: { blogId: blog._id, title: blog.title }
  });
};

studentNotificationSchema.statics.notifyWeeklySummary = async function(userId, summary) {
  return this.createNotification({
    userId,
    type: 'weekly_summary',
    title: '📊 Your Weekly Summary',
    message: `This week: ${summary.gamesPlayed} games played, ${summary.timePlayed} minutes of learning!`,
    icon: '📊',
    priority: 'medium',
    metadata: summary
  });
};

studentNotificationSchema.statics.notifyStreak = async function(userId, streakDays) {
  return this.createNotification({
    userId,
    type: 'streak',
    title: '🔥 Streak Milestone!',
    message: `Incredible! You've maintained a ${streakDays}-day learning streak!`,
    icon: '🔥',
    priority: 'high',
    metadata: { streakDays }
  });
};

const StudentNotification = mongoose.model('StudentNotification', studentNotificationSchema);

module.exports = StudentNotification;
