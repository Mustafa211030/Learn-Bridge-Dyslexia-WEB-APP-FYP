const express = require('express');
const router = express.Router();
const EbookController = require('../controllers/EbookController');

/**
 * @route   POST /api/ebook/start-session
 * @desc    Start a new reading session
 * @access  Private (add your auth middleware if needed)
 */
router.post('/start-session', EbookController.startSession);

/**
 * @route   POST /api/ebook/save-page
 * @desc    Save a page read
 * @access  Private (add your auth middleware if needed)
 */
router.post('/save-page', EbookController.savePage);

/**
 * @route   POST /api/ebook/end-session
 * @desc    End a reading session
 * @access  Private (add your auth middleware if needed)
 */
router.post('/end-session', EbookController.endSession);

/**
 * @route   GET /api/ebook/progress
 * @desc    Get reading progress for all stories
 * @query   userId
 * @access  Private (add your auth middleware if needed)
 */
router.get('/progress', EbookController.getProgress);

/**
 * @route   GET /api/ebook/analytics
 * @desc    Get reading analytics
 * @query   userId, timeRange (week, month, all)
 * @access  Private (add your auth middleware if needed)
 */
router.get('/analytics', EbookController.getAnalytics);

module.exports = router;