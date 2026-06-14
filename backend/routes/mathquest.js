const express = require('express');
const router = express.Router();
const mathquestController = require('../controllers/mathquest.controller');

// Save game session (called when game ends)
// POST /api/mathquest/session
router.post('/session', mathquestController.saveGameSession);

// Get user statistics
// GET /api/mathquest/stats/:odId
router.get('/stats/:odId', mathquestController.getUserStats);

// Get performance analytics (for charts)
// GET /api/mathquest/analytics/:odId?days=30
router.get('/analytics/:odId', mathquestController.getPerformanceAnalytics);

// Get game history (paginated)
// GET /api/mathquest/history/:odId?page=1&limit=10&operation=addition
router.get('/history/:odId', mathquestController.getGameHistory);

// Get leaderboard
// GET /api/mathquest/leaderboard?operation=overall&period=allTime&limit=10
router.get('/leaderboard', mathquestController.getLeaderboard);

// Get single session details
// GET /api/mathquest/session/:sessionId
router.get('/session/:sessionId', mathquestController.getSessionDetails);

module.exports = router;