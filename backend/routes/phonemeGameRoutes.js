const express = require('express');
const router = express.Router();
const PhonemeGameController = require('../controllers/PhonemeGameController');

/**
 * @route   POST /api/phoneme-game/start-session
 * @desc    Start a new game session
 * @access  Private (requires authentication)
 */
router.post('/start-session', PhonemeGameController.startSession);

/**
 * @route   POST /api/phoneme-game/save-answer
 * @desc    Save a player's answer
 * @access  Private (requires authentication)
 */
router.post('/save-answer', PhonemeGameController.saveAnswer);

/**
 * @route   POST /api/phoneme-game/end-session
 * @desc    End a game session
 * @access  Private (requires authentication)
 */
router.post('/end-session', PhonemeGameController.endSession);

/**
 * @route   GET /api/phoneme-game/performance
 * @desc    Get performance data for a user
 * @query   userId, timeRange (week, month, all)
 * @access  Private (requires authentication)
 */
router.get('/performance', PhonemeGameController.getPerformance);

module.exports = router;