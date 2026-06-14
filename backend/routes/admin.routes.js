// routes/admin.routes.js
// Admin Module Routes - All Admin API Endpoints
// Uses existing auth middleware with admin-only access

const express = require('express');
const router = express.Router();

// Import auth middleware (from your existing setup)
const { authenticateToken, adminOnly } = require('../middleware/auth');

// Import admin controller
const adminController = require('../controllers/admin.controller');

// ============================================
// MIDDLEWARE - All routes require Admin access
// ============================================
router.use(authenticateToken);
router.use(adminOnly);

// ============================================
// DASHBOARD ROUTES
// ============================================

// GET /api/admin/dashboard-summary - Get dashboard overview
router.get('/dashboard-summary', adminController.getDashboardSummary);

// ============================================
// USER MANAGEMENT ROUTES
// ============================================

// GET /api/admin/users - Get all users with filters
router.get('/users', adminController.getUsers);

// GET /api/admin/users/:id - Get single user details
router.get('/users/:id', adminController.getUserById);

// PUT /api/admin/users/:id - Update user
router.put('/users/:id', adminController.updateUser);

// PATCH /api/admin/users/:id/status - Activate/Deactivate user
router.patch('/users/:id/status', adminController.updateUserStatus);

// PATCH /api/admin/users/:id/role - Change user role
router.patch('/users/:id/role', adminController.changeUserRole);

// POST /api/admin/users/:id/reset-password - Reset user password
router.post('/users/:id/reset-password', adminController.resetUserPassword);

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', adminController.deleteUser);

// ============================================
// PSYCHOLOGIST MANAGEMENT ROUTES
// ============================================

// GET /api/admin/psychologists - Get all psychologists with profiles
router.get('/psychologists', adminController.getPsychologists);

// PATCH /api/admin/psychologists/:id/verify - Verify/Unverify psychologist
router.patch('/psychologists/:id/verify', adminController.verifyPsychologist);

// ============================================
// GAME MANAGEMENT ROUTES
// ============================================

// GET /api/admin/games - Get all games
router.get('/games', adminController.getGames);

// GET /api/admin/games/:id - Get single game
router.get('/games/:id', adminController.getGameById);

// POST /api/admin/games - Create new game
router.post('/games', adminController.createGame);

// PUT /api/admin/games/:id - Update game
router.put('/games/:id', adminController.updateGame);

// PATCH /api/admin/games/:id/toggle - Toggle game enabled/disabled
router.patch('/games/:id/toggle', adminController.toggleGameStatus);

// DELETE /api/admin/games/:id - Delete game
router.delete('/games/:id', adminController.deleteGame);

// ============================================
// CONTENT MODERATION ROUTES
// ============================================

// GET /api/admin/content/blogs - Get all blogs for moderation
router.get('/content/blogs', adminController.getBlogs);

// POST /api/admin/content/approve - Approve blog
router.post('/content/approve', adminController.approveBlog);

// POST /api/admin/content/reject - Reject blog
router.post('/content/reject', adminController.rejectBlog);

// PATCH /api/admin/content/blogs/:id/hide - Hide/Archive blog
router.patch('/content/blogs/:id/hide', adminController.hideBlog);

// PATCH /api/admin/content/blogs/:id/comments - Toggle comments on blog
router.patch('/content/blogs/:id/comments', adminController.toggleBlogComments);

// DELETE /api/admin/content/blogs/:blogId/comments/:commentId - Delete comment
router.delete('/content/blogs/:blogId/comments/:commentId', adminController.deleteComment);

// ============================================
// ANALYTICS ROUTES
// ============================================

// GET /api/admin/analytics - Get analytics overview
router.get('/analytics', adminController.getAnalytics);

// ============================================
// SYSTEM SETTINGS ROUTES
// ============================================

// GET /api/admin/settings - Get system settings
router.get('/settings', adminController.getSettings);

// PUT /api/admin/settings - Update system settings
router.put('/settings', adminController.updateSettings);

// ============================================
// AUDIT LOGS ROUTES
// ============================================

// GET /api/admin/audit-logs - Get audit logs
router.get('/audit-logs', adminController.getAuditLogs);

// GET /api/admin/audit-logs/summary - Get activity summary
router.get('/audit-logs/summary', adminController.getActivitySummary);

// ============================================
// REPORTS & EXPORT ROUTES
// ============================================

// GET /api/admin/reports - Get report data
router.get('/reports', adminController.getReports);

// GET /api/admin/reports/export - Export data
router.get('/reports/export', adminController.exportData);

module.exports = router;
