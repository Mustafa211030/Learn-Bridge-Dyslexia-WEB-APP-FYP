// controllers/admin.controller.js
// Admin Controller - Complete Admin Module Backend Logic
// Handles Dashboard, Users, Psychologists, Games, Content, Analytics, Settings, Audit Logs

const mongoose = require('mongoose');
const User = require('../models/User');
const Blog = require('../models/Blog');
const AdminLog = require('../models/AdminLog');
const GameConfig = require('../models/GameConfig');
const SystemSettings = require('../models/SystemSettings');
const PsychologistProfile = require('../models/PsychologistProfile');

// Try to load game session models
let GameSession, PhonemeGameSession, WordFormationSession, LetterTracingSession;
try { GameSession = require('../models/mathquest.model').GameSession || require('../models/GameSession'); } catch(e) {}
try { PhonemeGameSession = require('../models/PhonemeGameSession'); } catch(e) {}
try { WordFormationSession = require('../models/WordFormationSession'); } catch(e) {}
try { LetterTracingSession = require('../models/LetterTracingSession'); } catch(e) {}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Log admin action
 */
const logAdminAction = async (req, action, data = {}) => {
  try {
    await AdminLog.log({
      action,
      performedBy: req.user._id || req.user.userId,
      targetType: data.targetType || null,
      targetId: data.targetId || null,
      targetName: data.targetName || null,
      previousValue: data.previousValue || null,
      newValue: data.newValue || null,
      description: data.description || null,
      severity: data.severity || 'low',
      metadata: {
        ipAddress: req.ip || req.connection?.remoteAddress,
        userAgent: req.headers['user-agent'],
        additionalInfo: data.additionalInfo
      }
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
};

// ============================================
// DASHBOARD ENDPOINTS
// ============================================

/**
 * Get Admin Dashboard Summary
 * GET /api/admin/dashboard-summary
 */
exports.getDashboardSummary = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // User Statistics
    const [
      totalUsers,
      totalStudents,
      totalPsychologists,
      totalAdmins,
      activeUsers,
      inactiveUsers,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'Student' }),
      User.countDocuments({ role: 'Psychologist' }),
      User.countDocuments({ role: 'Admin' }),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
      User.countDocuments({ createdAt: { $gte: startOfToday } }),
      User.countDocuments({ createdAt: { $gte: startOfWeek } }),
      User.countDocuments({ createdAt: { $gte: startOfMonth } })
    ]);

    // Game Statistics
    const enabledGames = await GameConfig.countDocuments({ enabled: true });
    const totalGames = await GameConfig.countDocuments();

    let totalGamePlays = 0;
    let avgEngagementScore = 0;
    
    if (GameSession) {
      const mathStats = await GameSession.aggregate([
        { $group: { _id: null, count: { $sum: 1 }, avgScore: { $avg: '$score' } } }
      ]);
      if (mathStats[0]) {
        totalGamePlays += mathStats[0].count;
        avgEngagementScore += mathStats[0].avgScore || 0;
      }
    }

    if (PhonemeGameSession) {
      const phonemeStats = await PhonemeGameSession.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, count: { $sum: 1 }, avgScore: { $avg: '$accuracy' } } }
      ]);
      if (phonemeStats[0]) {
        totalGamePlays += phonemeStats[0].count;
        avgEngagementScore += phonemeStats[0].avgScore || 0;
      }
    }

    // Blog Statistics
    const [totalBlogs, publishedBlogs, pendingBlogs] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ status: 'published' }),
      Blog.countDocuments({ status: 'draft' })
    ]);

    // Recent Activity
    const recentActivity = await AdminLog.find()
      .populate('performedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // User Growth Chart Data
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Role Distribution
    const roleDistribution = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // System Status
    const systemStatus = {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      lastChecked: new Date()
    };

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalStudents,
          totalPsychologists,
          totalAdmins,
          activeUsers,
          inactiveUsers,
          enabledGames,
          totalGames,
          totalGamePlays,
          avgEngagementScore: Math.round(avgEngagementScore / 2),
          totalBlogs,
          publishedBlogs,
          pendingBlogs
        },
        newUsers: {
          today: newUsersToday,
          thisWeek: newUsersThisWeek,
          thisMonth: newUsersThisMonth
        },
        charts: {
          userGrowth,
          roleDistribution: roleDistribution.map(r => ({ role: r._id, count: r.count }))
        },
        recentActivity,
        systemStatus
      }
    });

  } catch (error) {
    console.error('Dashboard Summary Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard summary',
      error: error.message
    });
  }
};

// ============================================
// USER MANAGEMENT ENDPOINTS
// ============================================

/**
 * Get All Users with Filters
 * GET /api/admin/users
 */
exports.getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    if (role && ['Student', 'Psychologist', 'Admin'].includes(role)) {
      query.role = role;
    }

    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(query)
    ]);

    const [studentCount, psychologistCount, adminCount] = await Promise.all([
      User.countDocuments({ role: 'Student' }),
      User.countDocuments({ role: 'Psychologist' }),
      User.countDocuments({ role: 'Admin' })
    ]);

    res.json({
      success: true,
      data: {
        users,
        counts: {
          all: total,
          students: studentCount,
          psychologists: psychologistCount,
          admins: adminCount
        },
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
          hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

/**
 * Get Single User Details
 * GET /api/admin/users/:id
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password').lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let additionalData = {};

    if (user.role === 'Psychologist') {
      additionalData.profile = await PsychologistProfile.findOne({ user: id }).lean();
      additionalData.blogsCount = await Blog.countDocuments({ author: id });
    }

    if (user.role === 'Student' && GameSession) {
      const gameStats = await GameSession.aggregate([
        { $match: { odId: new mongoose.Types.ObjectId(id) } },
        { $group: { _id: null, count: { $sum: 1 }, avgScore: { $avg: '$score' } } }
      ]);
      additionalData.gameStats = gameStats[0] || { count: 0, avgScore: 0 };
    }

    res.json({
      success: true,
      data: { user, ...additionalData }
    });

  } catch (error) {
    console.error('Get User By ID Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

/**
 * Update User
 * PUT /api/admin/users/:id
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, username, email, role } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const previousValue = {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role
    };

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email, _id: { $ne: id } });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      user.email = email;
    }

    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username, _id: { $ne: id } });
      if (existingUsername) {
        return res.status(400).json({ success: false, message: 'Username already in use' });
      }
      user.username = username;
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (role && ['Student', 'Psychologist', 'Admin'].includes(role)) {
      user.role = role;
    }

    await user.save();

    await logAdminAction(req, 'USER_UPDATED', {
      targetType: 'User',
      targetId: id,
      targetName: `${user.firstName} ${user.lastName}`,
      previousValue,
      newValue: { firstName, lastName, username, email, role },
      description: `Updated user ${user.email}`,
      severity: role !== previousValue.role ? 'high' : 'low'
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user: user.toJSON() }
    });

  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

/**
 * Update User Status (Activate/Deactivate)
 * PATCH /api/admin/users/:id/status
 */
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isActive must be a boolean' });
    }

    if (id === req.user._id?.toString() || id === req.user.userId?.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot change your own status' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const previousStatus = user.isActive;
    user.isActive = isActive;
    await user.save();

    await logAdminAction(req, isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED', {
      targetType: 'User',
      targetId: id,
      targetName: `${user.firstName} ${user.lastName}`,
      previousValue: { isActive: previousStatus },
      newValue: { isActive },
      description: `${isActive ? 'Activated' : 'Deactivated'} user ${user.email}`,
      severity: 'medium'
    });

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user: user.toJSON() }
    });

  } catch (error) {
    console.error('Update User Status Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update user status', error: error.message });
  }
};

/**
 * Change User Role
 * PATCH /api/admin/users/:id/role
 */
exports.changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['Student', 'Psychologist', 'Admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified' });
    }

    if (id === req.user._id?.toString() || id === req.user.userId?.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot change your own role' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const previousRole = user.role;
    user.role = role;
    await user.save();

    if (role === 'Psychologist' && previousRole !== 'Psychologist') {
      await PsychologistProfile.getOrCreate(id);
    }

    await logAdminAction(req, 'USER_ROLE_CHANGED', {
      targetType: 'User',
      targetId: id,
      targetName: `${user.firstName} ${user.lastName}`,
      previousValue: { role: previousRole },
      newValue: { role },
      description: `Changed role from ${previousRole} to ${role} for ${user.email}`,
      severity: 'high'
    });

    res.json({
      success: true,
      message: `User role changed to ${role} successfully`,
      data: { user: user.toJSON() }
    });

  } catch (error) {
    console.error('Change User Role Error:', error);
    res.status(500).json({ success: false, message: 'Failed to change user role', error: error.message });
  }
};

/**
 * Reset User Password
 * POST /api/admin/users/:id/reset-password
 */
exports.resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    await logAdminAction(req, 'PASSWORD_RESET', {
      targetType: 'User',
      targetId: id,
      targetName: `${user.firstName} ${user.lastName}`,
      description: `Reset password for user ${user.email}`,
      severity: 'high'
    });

    res.json({ success: true, message: 'Password reset successfully' });

  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password', error: error.message });
  }
};

/**
 * Delete User
 * DELETE /api/admin/users/:id
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user._id?.toString() || id === req.user.userId?.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userData = { firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role };
    await User.findByIdAndDelete(id);

    if (user.role === 'Psychologist') {
      await PsychologistProfile.deleteOne({ user: id });
    }

    await logAdminAction(req, 'USER_DELETED', {
      targetType: 'User',
      targetId: id,
      targetName: `${userData.firstName} ${userData.lastName}`,
      previousValue: userData,
      description: `Deleted user ${userData.email}`,
      severity: 'critical'
    });

    res.json({ success: true, message: 'User deleted successfully' });

  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
  }
};

// ============================================
// PSYCHOLOGIST MANAGEMENT
// ============================================

/**
 * Get All Psychologists
 * GET /api/admin/psychologists
 */
exports.getPsychologists = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, verified } = req.query;

    const userQuery = { role: 'Psychologist' };
    
    if (status === 'active') userQuery.isActive = true;
    if (status === 'inactive') userQuery.isActive = false;

    if (search) {
      userQuery.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const psychologists = await User.find(userQuery)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const psychologistIds = psychologists.map(p => p._id);
    const profiles = await PsychologistProfile.find({ user: { $in: psychologistIds } }).lean();
    const profileMap = {};
    profiles.forEach(p => { profileMap[p.user.toString()] = p; });

    let result = psychologists.map(p => ({ ...p, profile: profileMap[p._id.toString()] || null }));

    if (verified === 'true') {
      result = result.filter(p => p.profile?.isVerified);
    } else if (verified === 'false') {
      result = result.filter(p => !p.profile?.isVerified);
    }

    const total = await User.countDocuments(userQuery);

    res.json({
      success: true,
      data: {
        psychologists: result,
        pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) }
      }
    });

  } catch (error) {
    console.error('Get Psychologists Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch psychologists', error: error.message });
  }
};

/**
 * Verify Psychologist
 * PATCH /api/admin/psychologists/:id/verify
 */
exports.verifyPsychologist = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    const profile = await PsychologistProfile.findOne({ user: id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Psychologist profile not found' });
    }

    profile.isVerified = isVerified;
    if (isVerified) profile.verificationDate = new Date();
    await profile.save();

    const user = await User.findById(id).select('firstName lastName email');

    await logAdminAction(req, isVerified ? 'PSYCHOLOGIST_VERIFIED' : 'PSYCHOLOGIST_UNVERIFIED', {
      targetType: 'User',
      targetId: id,
      targetName: `${user.firstName} ${user.lastName}`,
      description: `${isVerified ? 'Verified' : 'Unverified'} psychologist ${user.email}`,
      severity: 'medium'
    });

    res.json({ success: true, message: `Psychologist ${isVerified ? 'verified' : 'unverified'} successfully` });

  } catch (error) {
    console.error('Verify Psychologist Error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify psychologist', error: error.message });
  }
};

// ============================================
// GAME MANAGEMENT ENDPOINTS
// ============================================

/**
 * Get All Games
 * GET /api/admin/games
 */
exports.getGames = async (req, res) => {
  try {
    const games = await GameConfig.find().sort({ order: 1 }).lean();

    const gamesWithAnalytics = await Promise.all(games.map(async (game) => {
      let totalPlays = 0, completions = 0, avgScore = 0;

      if (game.gameId === 'math-quest' && GameSession) {
        const stats = await GameSession.aggregate([
          { $group: { _id: null, count: { $sum: 1 }, avgScore: { $avg: '$score' } } }
        ]);
        if (stats[0]) { totalPlays = stats[0].count; avgScore = stats[0].avgScore; completions = totalPlays; }
      } else if (game.gameId === 'phoneme-game' && PhonemeGameSession) {
        const stats = await PhonemeGameSession.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 }, avgScore: { $avg: '$accuracy' } } }
        ]);
        stats.forEach(s => { totalPlays += s.count; if (s._id === 'completed') { completions = s.count; avgScore = s.avgScore; } });
      } else if (game.gameId === 'word-formation' && WordFormationSession) {
        const stats = await WordFormationSession.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 }, avgScore: { $avg: '$accuracy' } } }
        ]);
        stats.forEach(s => { totalPlays += s.count; if (s._id === 'completed') { completions = s.count; avgScore = s.avgScore; } });
      } else if (game.gameId === 'letter-tracing' && LetterTracingSession) {
        const stats = await LetterTracingSession.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 }, avgScore: { $avg: '$accuracy' } } }
        ]);
        stats.forEach(s => { totalPlays += s.count; if (s._id === 'completed') { completions = s.count; avgScore = s.avgScore; } });
      }

      return {
        ...game,
        analytics: {
          totalPlays,
          completions,
          completionRate: totalPlays > 0 ? Math.round((completions / totalPlays) * 100) : 0,
          avgScore: Math.round(avgScore || 0)
        }
      };
    }));

    res.json({
      success: true,
      data: {
        games: gamesWithAnalytics,
        summary: { total: games.length, enabled: games.filter(g => g.enabled).length, disabled: games.filter(g => !g.enabled).length }
      }
    });

  } catch (error) {
    console.error('Get Games Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch games', error: error.message });
  }
};

/**
 * Get Single Game
 * GET /api/admin/games/:id
 */
exports.getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await GameConfig.findById(id).lean();

    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }

    res.json({ success: true, data: { game } });
  } catch (error) {
    console.error('Get Game Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch game', error: error.message });
  }
};

/**
 * Create New Game
 * POST /api/admin/games
 */
exports.createGame = async (req, res) => {
  try {
    const gameData = req.body;

    const existing = await GameConfig.findOne({ gameId: gameData.gameId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Game with this ID already exists' });
    }

    const game = new GameConfig(gameData);
    await game.save();

    await logAdminAction(req, 'GAME_CREATED', {
      targetType: 'Game',
      targetId: game._id,
      targetName: game.name,
      description: `Created game: ${game.name}`,
      severity: 'medium'
    });

    res.status(201).json({ success: true, message: 'Game created successfully', data: { game } });

  } catch (error) {
    console.error('Create Game Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create game', error: error.message });
  }
};

/**
 * Update Game
 * PUT /api/admin/games/:id
 */
exports.updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const game = await GameConfig.findById(id);
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }

    const previousValue = game.toObject();

    const allowedUpdates = [
      'name', 'displayName', 'description', 'shortDescription', 'category',
      'icon', 'thumbnail', 'enabled', 'supportedLanguages', 'defaultLanguage',
      'difficultyLevels', 'ageGroups', 'targetAudience', 'cognitiveAreas',
      'settings', 'order', 'isFeatured', 'isNew', 'routePath', 'apiEndpoint'
    ];

    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) game[field] = updates[field];
    });

    await game.save();

    await logAdminAction(req, 'GAME_UPDATED', {
      targetType: 'Game',
      targetId: id,
      targetName: game.name,
      previousValue,
      newValue: updates,
      description: `Updated game: ${game.name}`,
      severity: 'low'
    });

    res.json({ success: true, message: 'Game updated successfully', data: { game } });

  } catch (error) {
    console.error('Update Game Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update game', error: error.message });
  }
};

/**
 * Toggle Game Status
 * PATCH /api/admin/games/:id/toggle
 */
exports.toggleGameStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await GameConfig.findById(id);

    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }

    game.enabled = !game.enabled;
    await game.save();

    await logAdminAction(req, game.enabled ? 'GAME_ENABLED' : 'GAME_DISABLED', {
      targetType: 'Game',
      targetId: id,
      targetName: game.name,
      description: `${game.enabled ? 'Enabled' : 'Disabled'} game: ${game.name}`,
      severity: 'medium'
    });

    res.json({ success: true, message: `Game ${game.enabled ? 'enabled' : 'disabled'} successfully`, data: { game } });

  } catch (error) {
    console.error('Toggle Game Error:', error);
    res.status(500).json({ success: false, message: 'Failed to toggle game status', error: error.message });
  }
};

/**
 * Delete Game
 * DELETE /api/admin/games/:id
 */
exports.deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await GameConfig.findById(id);

    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }

    const gameData = { name: game.name, gameId: game.gameId };
    await GameConfig.findByIdAndDelete(id);

    await logAdminAction(req, 'GAME_DELETED', {
      targetType: 'Game',
      targetId: id,
      targetName: game.name,
      previousValue: gameData,
      description: `Deleted game: ${game.name}`,
      severity: 'high'
    });

    res.json({ success: true, message: 'Game deleted successfully' });

  } catch (error) {
    console.error('Delete Game Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete game', error: error.message });
  }
};

// ============================================
// CONTENT MODERATION ENDPOINTS
// ============================================

/**
 * Get All Blogs for Moderation
 * GET /api/admin/content/blogs
 */
exports.getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search, category } = req.query;

    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .populate('author', 'firstName lastName email profilePhoto')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Blog.countDocuments(query)
    ]);

    const [allCount, draftCount, publishedCount, archivedCount] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ status: 'draft' }),
      Blog.countDocuments({ status: 'published' }),
      Blog.countDocuments({ status: 'archived' })
    ]);

    res.json({
      success: true,
      data: {
        blogs,
        counts: { all: allCount, draft: draftCount, published: publishedCount, archived: archivedCount },
        pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) }
      }
    });

  } catch (error) {
    console.error('Get Blogs Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch blogs', error: error.message });
  }
};

/**
 * Approve Blog
 * POST /api/admin/content/approve
 */
exports.approveBlog = async (req, res) => {
  try {
    const { blogId } = req.body;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    blog.status = 'published';
    blog.publishedAt = new Date();
    await blog.save();

    await logAdminAction(req, 'BLOG_APPROVED', {
      targetType: 'Blog',
      targetId: blogId,
      targetName: blog.title,
      description: `Approved blog: ${blog.title}`,
      severity: 'low'
    });

    res.json({ success: true, message: 'Blog approved and published successfully' });

  } catch (error) {
    console.error('Approve Blog Error:', error);
    res.status(500).json({ success: false, message: 'Failed to approve blog', error: error.message });
  }
};

/**
 * Reject Blog
 * POST /api/admin/content/reject
 */
exports.rejectBlog = async (req, res) => {
  try {
    const { blogId, reason } = req.body;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    blog.status = 'archived';
    await blog.save();

    await logAdminAction(req, 'BLOG_REJECTED', {
      targetType: 'Blog',
      targetId: blogId,
      targetName: blog.title,
      description: `Rejected blog: ${blog.title}. Reason: ${reason || 'Not specified'}`,
      severity: 'medium'
    });

    res.json({ success: true, message: 'Blog rejected successfully' });

  } catch (error) {
    console.error('Reject Blog Error:', error);
    res.status(500).json({ success: false, message: 'Failed to reject blog', error: error.message });
  }
};

/**
 * Hide/Archive Blog
 * PATCH /api/admin/content/blogs/:id/hide
 */
exports.hideBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    blog.status = 'archived';
    if (blog.visibility) blog.visibility = 'private';
    await blog.save();

    await logAdminAction(req, 'BLOG_HIDDEN', {
      targetType: 'Blog',
      targetId: id,
      targetName: blog.title,
      description: `Hidden blog: ${blog.title}`,
      severity: 'medium'
    });

    res.json({ success: true, message: 'Blog hidden successfully' });

  } catch (error) {
    console.error('Hide Blog Error:', error);
    res.status(500).json({ success: false, message: 'Failed to hide blog', error: error.message });
  }
};

/**
 * Toggle Comments on Blog
 * PATCH /api/admin/content/blogs/:id/comments
 */
exports.toggleBlogComments = async (req, res) => {
  try {
    const { id } = req.params;
    const { allowComments } = req.body;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    blog.allowComments = allowComments;
    await blog.save();

    await logAdminAction(req, 'COMMENT_MODERATED', {
      targetType: 'Blog',
      targetId: id,
      targetName: blog.title,
      description: `${allowComments ? 'Enabled' : 'Disabled'} comments on: ${blog.title}`,
      severity: 'low'
    });

    res.json({ success: true, message: `Comments ${allowComments ? 'enabled' : 'disabled'} successfully` });

  } catch (error) {
    console.error('Toggle Comments Error:', error);
    res.status(500).json({ success: false, message: 'Failed to toggle comments', error: error.message });
  }
};

/**
 * Delete Comment
 * DELETE /api/admin/content/blogs/:blogId/comments/:commentId
 */
exports.deleteComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    if (blog.comments) {
      blog.comments = blog.comments.filter(c => c._id.toString() !== commentId);
      if (blog.metrics) blog.metrics.comments = blog.comments.length;
      await blog.save();
    }

    await logAdminAction(req, 'COMMENT_DELETED', {
      targetType: 'Blog',
      targetId: blogId,
      description: `Deleted comment from blog: ${blog.title}`,
      severity: 'low'
    });

    res.json({ success: true, message: 'Comment deleted successfully' });

  } catch (error) {
    console.error('Delete Comment Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete comment', error: error.message });
  }
};

// ============================================
// ANALYTICS ENDPOINTS
// ============================================

/**
 * Get Analytics Overview
 * GET /api/admin/analytics
 */
exports.getAnalytics = async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    const startDate = new Date();
    if (period === 'week') startDate.setDate(startDate.getDate() - 7);
    else if (period === 'month') startDate.setMonth(startDate.getMonth() - 1);
    else if (period === 'quarter') startDate.setMonth(startDate.getMonth() - 3);
    else if (period === 'year') startDate.setFullYear(startDate.getFullYear() - 1);

    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          newUsers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const gameUsage = [];
    
    if (GameSession) {
      const mathUsage = await GameSession.aggregate([
        { $match: { completedAt: { $gte: startDate } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } }, plays: { $sum: 1 }, avgScore: { $avg: '$score' } } },
        { $sort: { _id: 1 } }
      ]);
      gameUsage.push({ game: 'Math Quest', data: mathUsage });
    }

    if (PhonemeGameSession) {
      const phonemeUsage = await PhonemeGameSession.aggregate([
        { $match: { createdAt: { $gte: startDate }, status: 'completed' } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, plays: { $sum: 1 }, avgScore: { $avg: '$accuracy' } } },
        { $sort: { _id: 1 } }
      ]);
      gameUsage.push({ game: 'Phoneme Game', data: phonemeUsage });
    }

    const roleDistribution = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const blogStats = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: null, totalViews: { $sum: '$metrics.views' }, totalLikes: { $sum: '$metrics.likes' }, totalComments: { $sum: '$metrics.comments' }, totalBlogs: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        period,
        userGrowth,
        gameUsage,
        roleDistribution: roleDistribution.map(r => ({ role: r._id, count: r.count })),
        blogStats: blogStats[0] || { totalViews: 0, totalLikes: 0, totalComments: 0, totalBlogs: 0 }
      }
    });

  } catch (error) {
    console.error('Get Analytics Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics', error: error.message });
  }
};

// ============================================
// SYSTEM SETTINGS ENDPOINTS
// ============================================

/**
 * Get System Settings
 * GET /api/admin/settings
 */
exports.getSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    res.json({ success: true, data: { settings } });
  } catch (error) {
    console.error('Get Settings Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch settings', error: error.message });
  }
};

/**
 * Update System Settings
 * PUT /api/admin/settings
 */
exports.updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    const adminId = req.user._id || req.user.userId;

    const previousSettings = await SystemSettings.getSettings();
    const settings = await SystemSettings.updateSettings(updates, adminId);

    await logAdminAction(req, 'SETTINGS_UPDATED', {
      targetType: 'Settings',
      previousValue: previousSettings.toObject(),
      newValue: updates,
      description: 'Updated system settings',
      severity: 'high'
    });

    res.json({ success: true, message: 'Settings updated successfully', data: { settings } });

  } catch (error) {
    console.error('Update Settings Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update settings', error: error.message });
  }
};

// ============================================
// AUDIT LOGS ENDPOINTS
// ============================================

/**
 * Get Audit Logs
 * GET /api/admin/audit-logs
 */
exports.getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action, performedBy, targetType, severity, startDate, endDate, search } = req.query;

    const result = await AdminLog.getLogs(
      { action, performedBy, targetType, severity, startDate, endDate, search },
      { page: parseInt(page), limit: parseInt(limit) }
    );

    res.json({ success: true, data: result });

  } catch (error) {
    console.error('Get Audit Logs Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch audit logs', error: error.message });
  }
};

/**
 * Get Activity Summary
 * GET /api/admin/audit-logs/summary
 */
exports.getActivitySummary = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const summary = await AdminLog.getActivitySummary(parseInt(days));
    res.json({ success: true, data: { summary } });
  } catch (error) {
    console.error('Get Activity Summary Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch activity summary', error: error.message });
  }
};

// ============================================
// REPORTS ENDPOINTS
// ============================================

/**
 * Get Reports Data
 * GET /api/admin/reports
 */
exports.getReports = async (req, res) => {
  try {
    const { type = 'user-activity', startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    let reportData = {};

    switch (type) {
      case 'user-activity':
        reportData = await User.aggregate([
          { $match: { createdAt: { $gte: start, $lte: end } } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              newUsers: { $sum: 1 },
              students: { $sum: { $cond: [{ $eq: ['$role', 'Student'] }, 1, 0] } },
              psychologists: { $sum: { $cond: [{ $eq: ['$role', 'Psychologist'] }, 1, 0] } }
            }
          },
          { $sort: { _id: 1 } }
        ]);
        break;

      case 'game-usage':
        if (GameSession) {
          reportData.mathQuest = await GameSession.aggregate([
            { $match: { completedAt: { $gte: start, $lte: end } } },
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } }, plays: { $sum: 1 }, avgScore: { $avg: '$score' } } },
            { $sort: { _id: 1 } }
          ]);
        }
        break;

      case 'content':
        reportData = await Blog.aggregate([
          { $match: { createdAt: { $gte: start, $lte: end } } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              blogs: { $sum: 1 },
              published: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
              views: { $sum: '$metrics.views' }
            }
          },
          { $sort: { _id: 1 } }
        ]);
        break;

      case 'system-audit':
        reportData = await AdminLog.aggregate([
          { $match: { createdAt: { $gte: start, $lte: end } } },
          { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, actions: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ]);
        break;

      default:
        return res.status(400).json({ success: false, message: 'Invalid report type' });
    }

    await logAdminAction(req, 'REPORT_GENERATED', {
      targetType: 'Report',
      description: `Generated ${type} report from ${start.toISOString()} to ${end.toISOString()}`,
      severity: 'low'
    });

    res.json({ success: true, data: { type, period: { start, end }, reportData } });

  } catch (error) {
    console.error('Get Reports Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate report', error: error.message });
  }
};

/**
 * Export Data
 * GET /api/admin/reports/export
 */
exports.exportData = async (req, res) => {
  try {
    const { type, format = 'csv' } = req.query;

    let data = [];
    let filename = '';

    switch (type) {
      case 'users':
        data = await User.find().select('-password').lean();
        filename = 'users-export';
        break;
      case 'blogs':
        data = await Blog.find().populate('author', 'firstName lastName email').lean();
        filename = 'blogs-export';
        break;
      case 'audit-logs':
        data = await AdminLog.find().populate('performedBy', 'firstName lastName email').lean();
        filename = 'audit-logs-export';
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid export type' });
    }

    await logAdminAction(req, 'DATA_EXPORTED', {
      targetType: 'Report',
      description: `Exported ${type} data in ${format} format`,
      severity: 'medium'
    });

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}.json`);
      return res.json(data);
    }

    if (format === 'csv' && data.length > 0) {
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(item => 
        Object.values(item).map(v => typeof v === 'object' ? JSON.stringify(v) : v).join(',')
      );
      const csv = [headers, ...rows].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}.csv`);
      return res.send(csv);
    }

    res.json({ success: true, data });

  } catch (error) {
    console.error('Export Data Error:', error);
    res.status(500).json({ success: false, message: 'Failed to export data', error: error.message });
  }
};