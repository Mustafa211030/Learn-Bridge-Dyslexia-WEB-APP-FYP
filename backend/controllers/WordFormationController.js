const WordFormationSession = require('../models/WordFormationSession');
const WordFormationAttempt = require('../models/WordFormationAttempt');

/**
 * Controller for Word Formation Game operations
 */
class WordFormationController {
  
  /**
   * Start a new game session
   */
  static async startSession(req, res) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const session = await WordFormationSession.create({
        userId,
        startTime: new Date(),
        status: 'active',
        attempts: []
      });

      res.status(201).json({
        success: true,
        sessionId: session._id,
        message: 'Game session started successfully'
      });
    } catch (error) {
      console.error('Error starting game session:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start game session',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Save a word attempt
   */
  static async saveAttempt(req, res) {
    try {
      const { 
        sessionId, 
        userId, 
        word, 
        scrambledWord, 
        hint, 
        userAnswer, 
        isCorrect, 
        isTimeout,
        timeSpent, 
        level,
        timestamp 
      } = req.body;

      if (!sessionId || !userId || !word) {
        return res.status(400).json({
          success: false,
          message: 'Session ID, User ID, and word are required'
        });
      }

      const attempt = await WordFormationAttempt.create({
        sessionId,
        userId,
        word,
        scrambledWord,
        hint,
        userAnswer,
        isCorrect,
        isTimeout: isTimeout || false,
        timeSpent: timeSpent || 0,
        level: level || 1,
        timestamp: timestamp || new Date()
      });

      // Update the session with the new attempt
      await WordFormationSession.findByIdAndUpdate(
        sessionId,
        {
          $push: { attempts: attempt._id },
          $inc: { 
            totalAttempts: 1,
            correctAttempts: isCorrect ? 1 : 0
          },
          $set: { lastActivity: new Date() }
        }
      );

      res.status(201).json({
        success: true,
        attemptId: attempt._id,
        message: 'Attempt saved successfully'
      });
    } catch (error) {
      console.error('Error saving attempt:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save attempt',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * End a game session
   */
  static async endSession(req, res) {
    try {
      const { sessionId, userId, finalScore, finalLevel, totalAttempts, correctAttempts, accuracy } = req.body;

      if (!sessionId || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID and User ID are required'
        });
      }

      const session = await WordFormationSession.findById(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      const updatedSession = await WordFormationSession.findByIdAndUpdate(
        sessionId,
        {
          $set: {
            status: 'completed',
            endTime: new Date(),
            finalScore: finalScore || session.finalScore,
            finalLevel: finalLevel || session.finalLevel,
            totalAttempts: totalAttempts || session.totalAttempts,
            correctAttempts: correctAttempts || session.correctAttempts,
            accuracy: accuracy || (totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0)
          }
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        session: updatedSession,
        message: 'Game session ended successfully'
      });
    } catch (error) {
      console.error('Error ending game session:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to end game session',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get performance data for a user
   */
  static async getPerformance(req, res) {
    try {
      const { userId, timeRange = 'all' } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      // Calculate date filter
      let dateFilter = {};
      const now = new Date();
      
      if (timeRange === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = { startTime: { $gte: weekAgo } };
      } else if (timeRange === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFilter = { startTime: { $gte: monthAgo } };
      }

      // Fetch sessions and attempts
      const sessions = await WordFormationSession.find({
        userId,
        status: 'completed',
        ...dateFilter
      }).sort({ startTime: -1 });

      const attempts = await WordFormationAttempt.find({
        userId,
        timestamp: dateFilter.startTime ? { $gte: dateFilter.startTime.$gte } : { $exists: true }
      });

      // Calculate statistics
      const stats = WordFormationController.calculateStats(sessions, attempts);
      const scoreProgress = WordFormationController.calculateScoreProgress(sessions);
      const accuracyTrend = WordFormationController.calculateAccuracyTrend(sessions);
      const recentSessions = WordFormationController.formatRecentSessions(sessions, attempts);
      const wordDifficulty = WordFormationController.calculateWordDifficulty(attempts);

      res.status(200).json({
        success: true,
        stats,
        scoreProgress,
        accuracyTrend,
        recentSessions,
        wordDifficulty
      });
    } catch (error) {
      console.error('Error fetching performance data:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch performance data',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Calculate overall statistics
   * @private
   */
  static calculateStats(sessions, attempts) {
    const totalSessions = sessions.length;
    const highestScore = sessions.length > 0 
      ? Math.max(...sessions.map(s => s.finalScore || 0))
      : 0;
    const totalWords = attempts.filter(a => a.isCorrect).length;
    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter(a => a.isCorrect).length;
    const averageAccuracy = totalAttempts > 0 
      ? Math.round((correctAttempts / totalAttempts) * 100) 
      : 0;

    return {
      totalSessions,
      highestScore,
      averageAccuracy,
      totalWords
    };
  }

  /**
   * Calculate score progress over sessions
   * @private
   */
  static calculateScoreProgress(sessions) {
    return sessions.slice(0, 10).reverse().map(session => ({
      sessionId: session._id,
      date: session.startTime,
      score: session.finalScore || 0,
      level: session.finalLevel || 1
    }));
  }

  /**
   * Calculate accuracy trend over sessions
   * @private
   */
  static calculateAccuracyTrend(sessions) {
    return sessions.slice(0, 10).reverse().map(session => ({
      sessionId: session._id,
      date: session.startTime,
      accuracy: session.accuracy || 0
    }));
  }

  /**
   * Format recent sessions with details
   * @private
   */
  static formatRecentSessions(sessions, attempts) {
    return sessions.slice(0, 10).map(session => {
      const sessionAttempts = attempts.filter(a => 
        a.sessionId.toString() === session._id.toString()
      );
      
      const avgTime = sessionAttempts.length > 0
        ? Math.round(sessionAttempts.reduce((sum, a) => sum + (a.timeSpent || 0), 0) / sessionAttempts.length)
        : 0;

      return {
        date: session.startTime,
        score: session.finalScore || 0,
        level: session.finalLevel || 1,
        accuracy: session.accuracy || 0,
        avgTime
      };
    });
  }

  /**
   * Calculate word difficulty
   * @private
   */
  static calculateWordDifficulty(attempts) {
    const wordStats = {};
    
    attempts.forEach(attempt => {
      if (!wordStats[attempt.word]) {
        wordStats[attempt.word] = {
          word: attempt.word,
          hint: attempt.hint,
          correct: 0,
          total: 0
        };
      }
      
      wordStats[attempt.word].total++;
      if (attempt.isCorrect) {
        wordStats[attempt.word].correct++;
      }
    });

    const wordDifficulty = Object.values(wordStats)
      .map(item => ({
        ...item,
        accuracy: item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0,
        attempts: item.total
      }))
      .sort((a, b) => a.accuracy - b.accuracy);

    return wordDifficulty;
  }
}

module.exports = WordFormationController;