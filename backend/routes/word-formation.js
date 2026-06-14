const express = require('express');
const router = express.Router();
const WordFormationController = require('../controllers/WordFormationController');

/**
 * @route   POST /api/word-formation/start-session
 * @desc    Start a new word formation game session
 * @access  Private (add your auth middleware if needed)
 */
router.post('/start-session', WordFormationController.startSession);

/**
 * @route   POST /api/word-formation/save-attempt
 * @desc    Save a word attempt
 * @access  Private (add your auth middleware if needed)
 */
router.post('/save-attempt', WordFormationController.saveAttempt);

/**
 * @route   POST /api/word-formation/end-session
 * @desc    End a word formation game session
 * @access  Private (add your auth middleware if needed)
 */
router.post('/end-session', WordFormationController.endSession);

/**
 * @route   GET /api/word-formation/performance
 * @desc    Get performance data for a user
 * @query   userId, timeRange (week, month, all)
 * @access  Private (add your auth middleware if needed)
 */
router.get('/performance', WordFormationController.getPerformance);

module.exports = router;