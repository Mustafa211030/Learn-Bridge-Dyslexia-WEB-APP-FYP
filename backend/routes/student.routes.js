// // routes/student.routes.js
// // Student Module API Routes
// // All routes require authentication and Student role

// const express = require('express');
// const router = express.Router();
// const studentController = require('../controllers/student.controller');

// // ═══════════════════════════════════════════════════════════
// // AUTH MIDDLEWARE - Using your project's auth.middleware.js
// // ═══════════════════════════════════════════════════════════
// const { protect, authorize } = require('../middleware/auth.middleware');

// // Apply authentication and student role check to all routes
// router.use(protect);
// router.use(authorize('Student'));

// // ============================================
// // DASHBOARD
// // ============================================

// /**
//  * @route   GET /api/student/dashboard
//  * @desc    Get student dashboard data
//  * @access  Private (Student only)
//  */
// router.get('/dashboard', studentController.getDashboard);

// // ============================================
// // PROFILE
// // ============================================

// /**
//  * @route   GET /api/student/profile
//  * @desc    Get student profile
//  * @access  Private (Student only)
//  */
// router.get('/profile', studentController.getProfile);

// /**
//  * @route   PUT /api/student/profile
//  * @desc    Update student profile (limited fields)
//  * @access  Private (Student only)
//  */
// router.put('/profile', studentController.updateProfile);

// // ============================================
// // GAMES
// // ============================================

// /**
//  * @route   GET /api/student/games
//  * @desc    Get all available games for student
//  * @access  Private (Student only)
//  */
// router.get('/games', studentController.getGames);

// /**
//  * @route   GET /api/student/games/:gameId
//  * @desc    Get single game details with user progress
//  * @access  Private (Student only)
//  */
// router.get('/games/:gameId', studentController.getGameById);

// /**
//  * @route   POST /api/student/games/:gameId/session
//  * @desc    Record a game session completion
//  * @access  Private (Student only)
//  */
// router.post('/games/:gameId/session', studentController.recordGameSession);

// // ============================================
// // PROGRESS & ANALYTICS
// // ============================================

// /**
//  * @route   GET /api/student/progress
//  * @desc    Get detailed progress and analytics
//  * @query   timeRange: 'week' | 'month' | 'year'
//  * @access  Private (Student only)
//  */
// router.get('/progress', studentController.getProgress);

// // ============================================
// // BLOGS
// // ============================================

// /**
//  * @route   GET /api/student/blogs
//  * @desc    Get published blogs for students
//  * @query   category, page, limit, search
//  * @access  Private (Student only)
//  */
// router.get('/blogs', studentController.getBlogs);

// /**
//  * @route   GET /api/student/blogs/:id
//  * @desc    Get single blog by ID or slug
//  * @access  Private (Student only)
//  */
// router.get('/blogs/:id', studentController.getBlogById);

// /**
//  * @route   POST /api/student/blogs/:id/like
//  * @desc    Like or unlike a blog
//  * @access  Private (Student only)
//  */
// router.post('/blogs/:id/like', studentController.toggleBlogLike);

// // ============================================
// // E-BOOKS
// // ============================================

// /**
//  * @route   GET /api/student/ebooks
//  * @desc    Get available e-books
//  * @query   category, page, limit
//  * @access  Private (Student only)
//  */
// router.get('/ebooks', studentController.getEbooks);

// // ============================================
// // NOTIFICATIONS
// // ============================================

// /**
//  * @route   GET /api/student/notifications
//  * @desc    Get student notifications
//  * @query   page, limit, unreadOnly
//  * @access  Private (Student only)
//  */
// router.get('/notifications', studentController.getNotifications);

// /**
//  * @route   PUT /api/student/notifications/:id/read
//  * @desc    Mark single notification as read
//  * @access  Private (Student only)
//  */
// router.put('/notifications/:id/read', studentController.markNotificationRead);

// /**
//  * @route   PUT /api/student/notifications/read-all
//  * @desc    Mark all notifications as read
//  * @access  Private (Student only)
//  */
// router.put('/notifications/read-all', studentController.markAllNotificationsRead);

// // ============================================
// // PREFERENCES / SETTINGS
// // ============================================

// /**
//  * @route   GET /api/student/preferences
//  * @desc    Get student preferences
//  * @access  Private (Student only)
//  */
// router.get('/preferences', studentController.getPreferences);

// /**
//  * @route   PUT /api/student/preferences
//  * @desc    Update student preferences
//  * @access  Private (Student only)
//  */
// router.put('/preferences', studentController.updatePreferences);

// /**
//  * @route   POST /api/student/preferences/reset
//  * @desc    Reset preferences to defaults
//  * @access  Private (Student only)
//  */
// router.post('/preferences/reset', studentController.resetPreferences);

// // ============================================
// // PARENT DASHBOARD VIEW
// // ============================================

// /**
//  * @route   GET /api/student/parent-view
//  * @desc    Get data for parent dashboard view (read-only summary)
//  * @access  Private (Student only)
//  */
// router.get('/parent-view', studentController.getParentView);

// module.exports = router;

























// routes/student.routes.js
// Student Module API Routes
// All routes require authentication and Student role

const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');

// ═══════════════════════════════════════════════════════════
// AUTH MIDDLEWARE - Using your project's auth.js
// ═══════════════════════════════════════════════════════════
const { protect, authorize } = require('../middleware/auth');

// Apply authentication and student role check to all routes
router.use(protect);
router.use(authorize('Student'));

// ============================================
// DASHBOARD
// ============================================
router.get('/dashboard', studentController.getDashboard);

// ============================================
// PROFILE
// ============================================
router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.updateProfile);

// ============================================
// GAMES
// ============================================
router.get('/games', studentController.getGames);
router.get('/games/:gameId', studentController.getGameById);
router.post('/games/:gameId/session', studentController.recordGameSession);

// ============================================
// PROGRESS & ANALYTICS
// ============================================
router.get('/progress', studentController.getProgress);

// ============================================
// BLOGS
// ============================================
router.get('/blogs', studentController.getBlogs);
router.get('/blogs/:id', studentController.getBlogById);
router.post('/blogs/:id/like', studentController.toggleBlogLike);

// ============================================
// E-BOOKS
// ============================================
router.get('/ebooks', studentController.getEbooks);

// ============================================
// NOTIFICATIONS
// ============================================
router.get('/notifications', studentController.getNotifications);
router.put('/notifications/:id/read', studentController.markNotificationRead);
router.put('/notifications/read-all', studentController.markAllNotificationsRead);

// ============================================
// PREFERENCES / SETTINGS
// ============================================
router.get('/preferences', studentController.getPreferences);
router.put('/preferences', studentController.updatePreferences);
router.post('/preferences/reset', studentController.resetPreferences);

// ============================================
// PARENT DASHBOARD VIEW
// ============================================
router.get('/parent-view', studentController.getParentView);

module.exports = router;