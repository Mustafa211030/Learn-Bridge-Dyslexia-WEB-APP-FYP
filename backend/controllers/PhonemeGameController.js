const PhonemeGameSession = require('../models/PhonemeGameSession');
const PhonemeAnswer = require('../models/PhonemeAnswer');

/**
 * Controller for Phoneme Game operations
 */
class PhonemeGameController {
  
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

      const session = await PhonemeGameSession.create({
        userId,
        startTime: new Date(),
        status: 'active',
        answers: []
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
        error: error.message
      });
    }
  }

  /**
   * Save an answer for a phoneme question
   */
  static async saveAnswer(req, res) {
    try {
      const { sessionId, userId, level, phoneme, word, selectedWord, isCorrect, timestamp } = req.body;

      if (!sessionId || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID and User ID are required'
        });
      }

      const answer = await PhonemeAnswer.create({
        sessionId,
        userId,
        level,
        phoneme,
        correctWord: word,
        selectedWord,
        isCorrect,
        timestamp: timestamp || new Date()
      });

      // Update the session with the new answer
      await PhonemeGameSession.findByIdAndUpdate(
        sessionId,
        {
          $push: { answers: answer._id },
          $set: { lastActivity: new Date() }
        }
      );

      res.status(201).json({
        success: true,
        answerId: answer._id,
        message: 'Answer saved successfully'
      });
    } catch (error) {
      console.error('Error saving answer:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save answer',
        error: error.message
      });
    }
  }

  /**
   * End a game session
   */
  static async endSession(req, res) {
    try {
      const { sessionId, userId, finalScore, levelsCompleted, totalCorrect, totalQuestions } = req.body;

      if (!sessionId || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID and User ID are required'
        });
      }

      const session = await PhonemeGameSession.findById(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      const duration = Math.floor((new Date() - session.startTime) / 1000);

      const updatedSession = await PhonemeGameSession.findByIdAndUpdate(
        sessionId,
        {
          $set: {
            status: 'completed',
            endTime: new Date(),
            finalScore,
            levelsCompleted,
            totalCorrect,
            totalQuestions,
            accuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
            duration
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
        error: error.message
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

      // Fetch sessions and answers
      const sessions = await PhonemeGameSession.find({
        userId,
        status: 'completed',
        ...dateFilter
      }).sort({ startTime: -1 });

      const answers = await PhonemeAnswer.find({
        userId,
        timestamp: dateFilter.startTime ? { $gte: dateFilter.startTime.$gte } : { $exists: true }
      });

      // Calculate statistics
      const stats = PhonemeGameController.calculateStats(sessions, answers);
      const levelProgress = PhonemeGameController.calculateLevelProgress(answers);
      const accuracyTrend = PhonemeGameController.calculateAccuracyTrend(sessions);
      const recentSessions = PhonemeGameController.formatRecentSessions(sessions);

      res.status(200).json({
        success: true,
        stats,
        levelProgress,
        accuracyTrend,
        recentSessions
      });
    } catch (error) {
      console.error('Error fetching performance data:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch performance data',
        error: error.message
      });
    }
  }

  /**
   * Calculate overall statistics
   * @private
   */
  static calculateStats(sessions, answers) {
    const totalGames = sessions.length;
    const totalScore = sessions.reduce((sum, session) => sum + (session.finalScore || 0), 0);
    const totalCorrect = sessions.reduce((sum, session) => sum + (session.totalCorrect || 0), 0);
    const totalQuestions = sessions.reduce((sum, session) => sum + (session.totalQuestions || 0), 0);
    const averageAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const levelsCompleted = sessions.reduce((sum, session) => sum + (session.levelsCompleted || 0), 0);

    // Calculate phoneme difficulty
    const phonemeDifficulty = {};
    answers.forEach(answer => {
      if (!phonemeDifficulty[answer.phoneme]) {
        phonemeDifficulty[answer.phoneme] = {
          sound: answer.phoneme,
          word: answer.correctWord,
          correct: 0,
          total: 0
        };
      }
      
      phonemeDifficulty[answer.phoneme].total++;
      if (answer.isCorrect) {
        phonemeDifficulty[answer.phoneme].correct++;
      }
    });

    const phonemeDifficultyArray = Object.values(phonemeDifficulty)
      .map(item => ({
        ...item,
        accuracy: item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0,
        attempts: item.total
      }))
      .sort((a, b) => a.accuracy - b.accuracy);

    return {
      totalGames,
      averageAccuracy,
      totalScore,
      levelsCompleted,
      phonemeDifficulty: phonemeDifficultyArray
    };
  }

  /**
   * Calculate level progress
   * @private
   */
  static calculateLevelProgress(answers) {
    const levelProgress = [];
    
    for (let level = 1; level <= 5; level++) {
      const levelAnswers = answers.filter(a => a.level === level);
      const levelCorrect = levelAnswers.filter(a => a.isCorrect).length;
      const levelTotal = levelAnswers.length;
      
      levelProgress.push({
        level,
        accuracy: levelTotal > 0 ? Math.round((levelCorrect / levelTotal) * 100) : 0,
        attempts: levelTotal,
        correct: levelCorrect
      });
    }

    return levelProgress;
  }

  /**
   * Calculate accuracy trend
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
   * Format recent sessions
   * @private
   */
  static formatRecentSessions(sessions) {
    return sessions.slice(0, 10).map(session => ({
      date: session.startTime,
      score: session.finalScore || 0,
      accuracy: session.accuracy || 0,
      levelsCompleted: session.levelsCompleted || 0,
      duration: PhonemeGameController.formatDuration(session.duration || 0)
    }));
  }

  /**
   * Format duration
   * @private
   */
  static formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  }
}

module.exports = PhonemeGameController;