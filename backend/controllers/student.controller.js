// controllers/student.controller.js
// Student Module Controller - Handles all student-related operations

const User = require('../models/User');
const StudentProgress = require('../models/StudentProgress.model');
const StudentNotification = require('../models/StudentNotification.model');
const StudentPreferences = require('../models/StudentPreferences.model');
const Blog = require('../models/Blog');
const GameConfig = require('../models/GameConfig');
const EducationalResource = require('../models/EducationalResource');

// Game session models
const PhonemeGameSession = require('../models/PhonemeGameSession');
const WordFormationSession = require('../models/WordFormationSession');
const LetterTracingSession = require('../models/LetterTracingSession');
const EbookSession = require('../models/EbookSession');

// ============================================
// DASHBOARD
// ============================================

/**
 * Get student dashboard data
 * Aggregates all necessary data for the dashboard view
 */
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    // Get user data
    const user = await User.findById(userId).select('-password');
    if (!user || user.role !== 'Student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Student role required.'
      });
    }

    // Get or create progress
    const progress = await StudentProgress.getOrCreateProgress(userId);

    // Get recent games played (from various game sessions)
    const recentGames = await getRecentGamesPlayed(userId);

    // Get unread notifications count
    const unreadNotifications = await StudentNotification.getUnreadCount(userId);

    // Get enabled games
    const availableGames = await GameConfig.getEnabledGames();

    // Get recent blogs
    const recentBlogs = await Blog.getPublished({ limit: 3 });

    // Get preferences
    const preferences = await StudentPreferences.getOrCreatePreferences(userId);

    // Calculate streak
    const streak = await calculateStreak(userId);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email
        },
        progress: {
          level: progress.learningLevel,
          overallStats: progress.overallStats,
          skills: progress.skills,
          recentActivity: progress.recentActivity.slice(0, 5),
          achievementsCount: progress.achievementsEarned.length,
          badgesCount: progress.badges.length
        },
        recentGames,
        availableGames: availableGames.slice(0, 6),
        recentBlogs,
        unreadNotifications,
        streak,
        preferences: {
          theme: preferences.display?.theme,
          avatar: preferences.avatar
        }
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard',
      error: error.message
    });
  }
};

// ============================================
// PROFILE
// ============================================

/**
 * Get student profile
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    const user = await User.findById(userId).select('-password');
    if (!user || user.role !== 'Student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const progress = await StudentProgress.getOrCreateProgress(userId);
    const preferences = await StudentPreferences.getOrCreatePreferences(userId);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt
        },
        progress: {
          level: progress.learningLevel,
          totalGamesPlayed: progress.overallStats.totalGamesPlayed,
          totalScore: progress.overallStats.totalScore,
          averageAccuracy: progress.overallStats.averageAccuracy,
          achievements: progress.achievementsEarned,
          badges: progress.badges
        },
        preferences
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
};

/**
 * Update student profile (limited fields)
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { firstName, lastName } = req.body;

    // Only allow updating specific fields
    const allowedUpdates = {};
    if (firstName) allowedUpdates.firstName = firstName;
    if (lastName) allowedUpdates.lastName = lastName;

    const user = await User.findByIdAndUpdate(
      userId,
      allowedUpdates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// ============================================
// GAMES
// ============================================

/**
 * Get all available games for student
 */
exports.getGames = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { category, difficulty } = req.query;

    const filters = {};
    if (category) filters.category = category;

    const games = await GameConfig.getEnabledGames(filters);
    const progress = await StudentProgress.getOrCreateProgress(userId);

    // Merge game data with user's progress
    const gamesWithProgress = games.map(game => {
      const gameProgress = progress.gameProgress.find(g => g.gameId === game.gameId);
      return {
        ...game,
        userProgress: gameProgress || {
          totalSessions: 0,
          highScore: 0,
          lastPlayedAt: null
        }
      };
    });

    res.json({
      success: true,
      data: {
        games: gamesWithProgress,
        categories: ['cognitive', 'language', 'math', 'memory', 'motor-skills', 'reading']
      }
    });
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get games',
      error: error.message
    });
  }
};

/**
 * Get single game details
 */
exports.getGameById = async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.userId || req.user._id;

    const game = await GameConfig.findOne({ gameId, enabled: true });
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    const progress = await StudentProgress.getOrCreateProgress(userId);
    const gameProgress = progress.gameProgress.find(g => g.gameId === gameId);

    // Get recent sessions for this game
    const recentSessions = await getGameSessions(userId, gameId, 5);

    res.json({
      success: true,
      data: {
        game,
        userProgress: gameProgress || null,
        recentSessions
      }
    });
  } catch (error) {
    console.error('Get game error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get game',
      error: error.message
    });
  }
};

/**
 * Record game session completion
 */
exports.recordGameSession = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { gameId } = req.params;
    const { score, accuracy, timePlayed, completed, level, details } = req.body;

    const game = await GameConfig.findOne({ gameId });
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    // Update game analytics
    await game.updateAnalytics({
      completed,
      duration: timePlayed,
      score
    });

    // Update student progress
    const progress = await StudentProgress.getOrCreateProgress(userId);
    await progress.recordGameSession({
      gameId,
      gameName: game.displayName,
      score,
      accuracy,
      timePlayed,
      completed,
      skillType: game.category
    });

    // Check for achievements
    const newAchievements = await checkAndAwardAchievements(userId, progress);

    res.json({
      success: true,
      message: 'Game session recorded',
      data: {
        newLevel: progress.learningLevel,
        newAchievements,
        totalScore: progress.overallStats.totalScore
      }
    });
  } catch (error) {
    console.error('Record session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record session',
      error: error.message
    });
  }
};

// ============================================
// PROGRESS & ANALYTICS
// ============================================

/**
 * Get detailed progress and analytics
 */
exports.getProgress = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { timeRange = 'month' } = req.query;

    const progress = await StudentProgress.getOrCreateProgress(userId);

    // Get time-based analytics
    const analytics = await getProgressAnalytics(userId, timeRange);

    // Get game-wise breakdown
    const gameBreakdown = progress.gameProgress.map(game => ({
      gameId: game.gameId,
      gameName: game.gameName,
      sessions: game.totalSessions,
      highScore: game.highScore,
      averageAccuracy: game.averageAccuracy,
      totalTime: game.totalTimePlayed
    }));

    // Get skill breakdown
    const skillBreakdown = Object.entries(progress.skills).map(([name, data]) => ({
      name,
      level: data.currentLevel,
      experience: data.experiencePoints,
      maxLevel: data.maxLevel,
      percentage: Math.round((data.currentLevel / data.maxLevel) * 100)
    }));

    res.json({
      success: true,
      data: {
        overview: {
          level: progress.learningLevel,
          totalGamesPlayed: progress.overallStats.totalGamesPlayed,
          totalTimePlayed: progress.overallStats.totalTimePlayed,
          totalScore: progress.overallStats.totalScore,
          averageAccuracy: progress.overallStats.averageAccuracy,
          currentStreak: progress.overallStats.currentStreak,
          longestStreak: progress.overallStats.longestStreak
        },
        analytics,
        gameBreakdown,
        skillBreakdown,
        achievements: progress.achievementsEarned,
        badges: progress.badges,
        recentActivity: progress.recentActivity
      }
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get progress',
      error: error.message
    });
  }
};

// ============================================
// BLOGS
// ============================================

/**
 * Get published blogs for students
 */
exports.getBlogs = async (req, res) => {
  try {
    const { category, page = 1, limit = 10, search } = req.query;

    let query = { status: 'published', visibility: 'public' };
    if (category) query.category = category;

    let blogs;
    if (search) {
      blogs = await Blog.find({
        ...query,
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ]
      })
        .sort({ publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('author', 'firstName lastName');
    } else {
      blogs = await Blog.getPublished({ category, page, limit });
    }

    const total = await Blog.countDocuments(query);
    const categories = await Blog.distinct('category', { status: 'published' });

    res.json({
      success: true,
      data: {
        blogs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        },
        categories
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get blogs',
      error: error.message
    });
  }
};

/**
 * Get single blog by ID or slug
 */
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user._id;

    let blog;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findOne({ _id: id, status: 'published' })
        .populate('author', 'firstName lastName profilePhoto');
    } else {
      blog = await Blog.findOne({ slug: id, status: 'published' })
        .populate('author', 'firstName lastName profilePhoto');
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Increment views
    await blog.incrementViews();

    // Update student progress
    const progress = await StudentProgress.getOrCreateProgress(userId);
    progress.overallStats.totalBlogsRead += 1;
    await progress.save();

    // Get related blogs
    const relatedBlogs = await Blog.getRelated(blog._id, 4);

    // Check if user liked
    const isLiked = blog.likedBy.includes(userId);

    res.json({
      success: true,
      data: {
        blog: {
          ...blog.toObject(),
          isLiked
        },
        relatedBlogs
      }
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get blog',
      error: error.message
    });
  }
};

/**
 * Like/unlike a blog
 */
exports.toggleBlogLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user._id;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const isLiked = await blog.toggleLike(userId);

    res.json({
      success: true,
      data: {
        isLiked,
        likesCount: blog.metrics.likes
      }
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle like',
      error: error.message
    });
  }
};

// ============================================
// E-BOOKS
// ============================================

/**
 * Get available e-books
 */
exports.getEbooks = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { category, page = 1, limit = 12 } = req.query;

    const query = { 
      status: 'published',
      resourceType: { $in: ['document', 'guide'] },
      $or: [
        { visibility: 'public' },
        { visibility: 'students_only' }
      ]
    };
    if (category) query.category = category;

    const ebooks = await EducationalResource.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('uploadedBy', 'firstName lastName');

    const total = await EducationalResource.countDocuments(query);

    // Get user's reading progress
    const sessions = await EbookSession.find({ userId })
      .select('storyId pagesRead completed');

    const ebooksWithProgress = ebooks.map(ebook => ({
      ...ebook.toObject(),
      readingProgress: sessions.find(s => s.storyId === ebook._id)
    }));

    res.json({
      success: true,
      data: {
        ebooks: ebooksWithProgress,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get ebooks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get ebooks',
      error: error.message
    });
  }
};

// ============================================
// NOTIFICATIONS
// ============================================

/**
 * Get student notifications
 */
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const result = await StudentNotification.getForUser(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      unreadOnly: unreadOnly === 'true'
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notifications',
      error: error.message
    });
  }
};

/**
 * Mark notification as read
 */
exports.markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user._id;

    const notification = await StudentNotification.findOne({ _id: id, userId });
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.markAsRead();

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification',
      error: error.message
    });
  }
};

/**
 * Mark all notifications as read
 */
exports.markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const count = await StudentNotification.markAllAsRead(userId);

    res.json({
      success: true,
      message: `${count} notifications marked as read`
    });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notifications',
      error: error.message
    });
  }
};

// ============================================
// PREFERENCES / SETTINGS
// ============================================

/**
 * Get student preferences
 */
exports.getPreferences = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const preferences = await StudentPreferences.getOrCreatePreferences(userId);

    res.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get preferences',
      error: error.message
    });
  }
};

/**
 * Update student preferences
 */
exports.updatePreferences = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const updates = req.body;

    const preferences = await StudentPreferences.getOrCreatePreferences(userId);

    // Update each category if provided
    const categories = ['display', 'audio', 'games', 'reading', 'notifications', 'privacy', 'dashboard', 'avatar'];
    
    categories.forEach(category => {
      if (updates[category]) {
        Object.assign(preferences[category], updates[category]);
      }
    });

    await preferences.save();

    res.json({
      success: true,
      message: 'Preferences updated',
      data: preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences',
      error: error.message
    });
  }
};

/**
 * Reset preferences to defaults
 */
exports.resetPreferences = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;
    const preferences = await StudentPreferences.getOrCreatePreferences(userId);
    await preferences.resetToDefaults();

    res.json({
      success: true,
      message: 'Preferences reset to defaults',
      data: preferences
    });
  } catch (error) {
    console.error('Reset preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset preferences',
      error: error.message
    });
  }
};

// ============================================
// PARENT DASHBOARD VIEW
// ============================================

/**
 * Get data for parent dashboard view (read-only)
 */
exports.getParentView = async (req, res) => {
  try {
    const userId = req.user.userId || req.user._id;

    const user = await User.findById(userId).select('firstName lastName');
    const progress = await StudentProgress.getOrCreateProgress(userId);
    const preferences = await StudentPreferences.getOrCreatePreferences(userId);

    // Check if sharing with parent is enabled
    if (!preferences.privacy?.shareProgressWithParent) {
      return res.status(403).json({
        success: false,
        message: 'Progress sharing is disabled'
      });
    }

    // Get weekly stats
    const weeklyData = await getWeeklyProgressData(userId);

    res.json({
      success: true,
      data: {
        student: {
          name: `${user.firstName} ${user.lastName}`,
          level: progress.learningLevel.current
        },
        summary: {
          totalGamesPlayed: progress.overallStats.totalGamesPlayed,
          totalTimePlayed: formatTime(progress.overallStats.totalTimePlayed),
          averageAccuracy: progress.overallStats.averageAccuracy,
          currentStreak: progress.overallStats.currentStreak,
          booksRead: progress.overallStats.totalBooksRead
        },
        skills: Object.entries(progress.skills).map(([name, data]) => ({
          name: formatSkillName(name),
          level: data.currentLevel,
          maxLevel: data.maxLevel
        })),
        achievements: progress.achievementsEarned.slice(0, 10),
        weeklyProgress: weeklyData,
        recentActivity: progress.recentActivity.slice(0, 10)
      }
    });
  } catch (error) {
    console.error('Get parent view error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get parent view',
      error: error.message
    });
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

async function getRecentGamesPlayed(userId) {
  const [phoneme, wordFormation, letterTracing, ebook] = await Promise.all([
    PhonemeGameSession.find({ userId }).sort({ startTime: -1 }).limit(3).lean(),
    WordFormationSession.find({ userId }).sort({ startTime: -1 }).limit(3).lean(),
    LetterTracingSession.find({ userId }).sort({ startTime: -1 }).limit(3).lean(),
    EbookSession.find({ userId }).sort({ startTime: -1 }).limit(3).lean()
  ]);

  const allSessions = [
    ...phoneme.map(s => ({ ...s, gameType: 'phoneme-game', gameName: 'Phoneme Game' })),
    ...wordFormation.map(s => ({ ...s, gameType: 'word-formation', gameName: 'Word Formation' })),
    ...letterTracing.map(s => ({ ...s, gameType: 'letter-tracing', gameName: 'Letter Tracing' })),
    ...ebook.map(s => ({ ...s, gameType: 'ebook', gameName: 'E-Book Reading' }))
  ];

  return allSessions
    .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
    .slice(0, 6);
}

async function getGameSessions(userId, gameId, limit = 5) {
  const sessionModels = {
    'phoneme-game': PhonemeGameSession,
    'word-formation': WordFormationSession,
    'letter-tracing': LetterTracingSession,
    'mathquest': null // Add if you have MathQuest session model
  };

  const Model = sessionModels[gameId];
  if (!Model) return [];

  return Model.find({ userId })
    .sort({ startTime: -1 })
    .limit(limit)
    .lean();
}

async function calculateStreak(userId) {
  const progress = await StudentProgress.findOne({ userId });
  if (!progress) return { current: 0, longest: 0 };

  return {
    current: progress.overallStats.currentStreak || 0,
    longest: progress.overallStats.longestStreak || 0
  };
}

async function getProgressAnalytics(userId, timeRange) {
  const now = new Date();
  let startDate;

  switch (timeRange) {
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setMonth(now.getMonth() - 1));
  }

  // Aggregate data from all game sessions
  const [phoneme, wordFormation, letterTracing] = await Promise.all([
    PhonemeGameSession.find({ 
      userId, 
      startTime: { $gte: startDate } 
    }).lean(),
    WordFormationSession.find({ 
      userId, 
      startTime: { $gte: startDate } 
    }).lean(),
    LetterTracingSession.find({ 
      userId, 
      startTime: { $gte: startDate } 
    }).lean()
  ]);

  // Group by date for chart data
  const dailyData = {};
  
  [...phoneme, ...wordFormation, ...letterTracing].forEach(session => {
    const date = new Date(session.startTime).toISOString().split('T')[0];
    if (!dailyData[date]) {
      dailyData[date] = { date, sessions: 0, totalScore: 0, totalAccuracy: 0 };
    }
    dailyData[date].sessions += 1;
    dailyData[date].totalScore += session.finalScore || 0;
    dailyData[date].totalAccuracy += session.accuracy || 0;
  });

  // Convert to array and calculate averages
  const chartData = Object.values(dailyData)
    .map(day => ({
      date: day.date,
      sessions: day.sessions,
      avgScore: Math.round(day.totalScore / day.sessions) || 0,
      avgAccuracy: Math.round(day.totalAccuracy / day.sessions) || 0
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return chartData;
}

async function checkAndAwardAchievements(userId, progress) {
  const newAchievements = [];

  // First game achievement
  if (progress.overallStats.totalGamesPlayed === 1) {
    const achievement = {
      achievementId: 'first-game',
      name: 'First Steps',
      description: 'Completed your first game!',
      icon: '🎮',
      category: 'games'
    };
    await progress.addAchievement(achievement);
    await StudentNotification.notifyAchievement(userId, achievement);
    newAchievements.push(achievement);
  }

  // 10 games achievement
  if (progress.overallStats.totalGamesPlayed === 10) {
    const achievement = {
      achievementId: 'ten-games',
      name: 'Getting Started',
      description: 'Played 10 games!',
      icon: '🌟',
      category: 'games'
    };
    await progress.addAchievement(achievement);
    await StudentNotification.notifyAchievement(userId, achievement);
    newAchievements.push(achievement);
  }

  // High accuracy achievement
  if (progress.overallStats.averageAccuracy >= 90) {
    const exists = progress.achievementsEarned.find(a => a.achievementId === 'accuracy-master');
    if (!exists) {
      const achievement = {
        achievementId: 'accuracy-master',
        name: 'Accuracy Master',
        description: 'Maintained 90%+ accuracy!',
        icon: '🎯',
        category: 'progress'
      };
      await progress.addAchievement(achievement);
      await StudentNotification.notifyAchievement(userId, achievement);
      newAchievements.push(achievement);
    }
  }

  return newAchievements;
}

async function getWeeklyProgressData(userId) {
  const weeks = [];
  const now = new Date();

  for (let i = 0; i < 4; i++) {
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() - (i * 7));
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 7);

    const sessions = await Promise.all([
      PhonemeGameSession.countDocuments({ 
        userId, 
        startTime: { $gte: weekStart, $lt: weekEnd } 
      }),
      WordFormationSession.countDocuments({ 
        userId, 
        startTime: { $gte: weekStart, $lt: weekEnd } 
      }),
      LetterTracingSession.countDocuments({ 
        userId, 
        startTime: { $gte: weekStart, $lt: weekEnd } 
      })
    ]);

    weeks.unshift({
      weekStart: weekStart.toISOString().split('T')[0],
      gamesPlayed: sessions.reduce((a, b) => a + b, 0)
    });
  }

  return weeks;
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function formatSkillName(name) {
  const nameMap = {
    cognitive: 'Cognitive Skills',
    language: 'Language',
    math: 'Mathematics',
    memory: 'Memory',
    reading: 'Reading',
    motorSkills: 'Motor Skills'
  };
  return nameMap[name] || name;
}
