const LetterTracingSession = require('../models/LetterTracingSession');
const LetterTracingAttempt = require('../models/LetterTracingAttempt');

/**
 * Controller for Letter Tracing Game operations
 */
class LetterTracingController {
  
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

      const session = await LetterTracingSession.create({
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
   * Save a tracing attempt
   */
  static async saveAttempt(req, res) {
    try {
      const { sessionId, userId, letter, letterIndex, isCorrect, timeSpent, strokeCount, timestamp } = req.body;

      if (!sessionId || !userId || !letter) {
        return res.status(400).json({
          success: false,
          message: 'Session ID, User ID, and letter are required'
        });
      }

      const attempt = await LetterTracingAttempt.create({
        sessionId,
        userId,
        letter,
        letterIndex,
        isCorrect,
        timeSpent: timeSpent || 0,
        strokeCount: strokeCount || 0,
        timestamp: timestamp || new Date()
      });

      // Update the session with the new attempt
      await LetterTracingSession.findByIdAndUpdate(
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
      const { sessionId, userId, lettersCompleted, totalAttempts, correctAttempts, accuracy } = req.body;

      if (!sessionId || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID and User ID are required'
        });
      }

      const session = await LetterTracingSession.findById(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      const updatedSession = await LetterTracingSession.findByIdAndUpdate(
        sessionId,
        {
          $set: {
            status: 'completed',
            endTime: new Date(),
            lettersCompleted: lettersCompleted || session.lettersCompleted,
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
      const sessions = await LetterTracingSession.find({
        userId,
        status: 'completed',
        ...dateFilter
      }).sort({ startTime: -1 });

      const attempts = await LetterTracingAttempt.find({
        userId,
        timestamp: dateFilter.startTime ? { $gte: dateFilter.startTime.$gte } : { $exists: true }
      });

      // Calculate statistics
      const stats = LetterTracingController.calculateStats(sessions, attempts);
      const letterProgress = LetterTracingController.calculateLetterProgress(attempts);
      const accuracyTrend = LetterTracingController.calculateAccuracyTrend(sessions);
      const recentSessions = LetterTracingController.formatRecentSessions(sessions, attempts);

      res.status(200).json({
        success: true,
        stats,
        letterProgress,
        accuracyTrend,
        recentSessions
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
    const lettersCompleted = sessions.reduce((sum, session) => sum + (session.lettersCompleted || 0), 0);
    const totalAttempts = sessions.reduce((sum, session) => sum + (session.totalAttempts || 0), 0);
    const correctAttempts = sessions.reduce((sum, session) => sum + (session.correctAttempts || 0), 0);
    const averageAccuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

    // Calculate letter difficulty
    const letterDifficulty = {};
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    attempts.forEach(attempt => {
      if (!letterDifficulty[attempt.letter]) {
        letterDifficulty[attempt.letter] = {
          letter: attempt.letter,
          correct: 0,
          total: 0
        };
      }
      
      letterDifficulty[attempt.letter].total++;
      if (attempt.isCorrect) {
        letterDifficulty[attempt.letter].correct++;
      }
    });

    const difficultLetters = Object.values(letterDifficulty)
      .map(item => ({
        ...item,
        accuracy: item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0,
        attempts: item.total
      }))
      .sort((a, b) => a.accuracy - b.accuracy);

    return {
      totalSessions,
      averageAccuracy,
      lettersCompleted,
      totalAttempts,
      difficultLetters
    };
  }

  /**
   * Calculate progress for each letter
   * @private
   */
  static calculateLetterProgress(attempts) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const letterProgress = [];
    
    alphabet.forEach(letter => {
      const letterAttempts = attempts.filter(a => a.letter === letter);
      const letterCorrect = letterAttempts.filter(a => a.isCorrect).length;
      const letterTotal = letterAttempts.length;
      
      if (letterTotal > 0) {
        letterProgress.push({
          letter,
          accuracy: Math.round((letterCorrect / letterTotal) * 100),
          attempts: letterTotal,
          correct: letterCorrect
        });
      }
    });

    return letterProgress;
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
        lettersCompleted: session.lettersCompleted || 0,
        totalAttempts: session.totalAttempts || 0,
        accuracy: session.accuracy || 0,
        avgTimePerLetter: avgTime
      };
    });
  }
}

module.exports = LetterTracingController;