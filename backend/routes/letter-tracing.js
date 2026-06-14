const express = require('express');
const router = express.Router();
const LetterTracingController = require('../controllers/LetterTracingController');

/**
 * @route   POST /api/letter-tracing/start-session
 * @desc    Start a new tracing session
 * @access  Private (add your auth middleware if needed)
 */
router.post('/start-session', LetterTracingController.startSession);

/**
 * @route   POST /api/letter-tracing/save-attempt
 * @desc    Save a letter tracing attempt
 * @access  Private (add your auth middleware if needed)
 */
router.post('/save-attempt', LetterTracingController.saveAttempt);

/**
 * @route   POST /api/letter-tracing/end-session
 * @desc    End a tracing session
 * @access  Private (add your auth middleware if needed)
 */
router.post('/end-session', LetterTracingController.endSession);

/**
 * @route   GET /api/letter-tracing/performance
 * @desc    Get performance data for a user
 * @query   userId, timeRange (week, month, all)
 * @access  Private (add your auth middleware if needed)
 */
router.get('/performance', LetterTracingController.getPerformance);

module.exports = router;