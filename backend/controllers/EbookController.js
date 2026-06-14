const EbookSession = require('../models/EbookSession');
const EbookPageRead = require('../models/EbookPageRead');

/**
 * Controller for eBook Reader operations
 */
class EbookController {
  
  /**
   * Start a new reading session
   */
  static async startSession(req, res) {
    try {
      const { userId, storyId } = req.body;

      if (!userId || storyId === undefined) {
        return res.status(400).json({
          success: false,
          message: 'User ID and Story ID are required'
        });
      }

      const session = await EbookSession.create({
        userId,
        storyId,
        startTime: new Date(),
        status: 'active',
        pageReads: []
      });

      res.status(201).json({
        success: true,
        sessionId: session._id,
        message: 'Reading session started successfully'
      });
    } catch (error) {
      console.error('Error starting reading session:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start reading session',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Save a page read
   */
  static async savePage(req, res) {
    try {
      const { sessionId, userId, storyId, pageIndex, language, timeSpent, wasReadAloud, timestamp } = req.body;

      if (!sessionId || !userId || storyId === undefined || pageIndex === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Required fields are missing'
        });
      }

      const pageRead = await EbookPageRead.create({
        sessionId,
        userId,
        storyId,
        pageIndex,
        language: language || 'en',
        timeSpent: timeSpent || 0,
        wasReadAloud: wasReadAloud || false,
        timestamp: timestamp || new Date()
      });

      // Update session with new page read
      await EbookSession.findByIdAndUpdate(
        sessionId,
        {
          $push: { pageReads: pageRead._id },
          $inc: { totalTimeSpent: timeSpent || 0 },
          $set: { 
            lastActivity: new Date(),
            pagesRead: pageIndex + 1
          }
        }
      );

      res.status(201).json({
        success: true,
        pageReadId: pageRead._id,
        message: 'Page read saved successfully'
      });
    } catch (error) {
      console.error('Error saving page read:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save page read',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * End a reading session
   */
  static async endSession(req, res) {
    try {
      const { sessionId, userId, storyId, pagesRead, completed } = req.body;

      if (!sessionId || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Session ID and User ID are required'
        });
      }

      const session = await EbookSession.findById(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      const updatedSession = await EbookSession.findByIdAndUpdate(
        sessionId,
        {
          $set: {
            status: 'completed',
            endTime: new Date(),
            pagesRead: pagesRead || session.pagesRead,
            completed: completed || false
          }
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        session: updatedSession,
        message: 'Reading session ended successfully'
      });
    } catch (error) {
      console.error('Error ending reading session:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to end reading session',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get reading progress for all stories
   */
  static async getProgress(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      // Get all sessions for user
      const sessions = await EbookSession.find({ userId }).sort({ startTime: -1 });

      // Calculate progress per story
      const progressByStory = {};
      sessions.forEach(session => {
        if (!progressByStory[session.storyId] || 
            session.pagesRead > progressByStory[session.storyId].pagesRead) {
          progressByStory[session.storyId] = {
            storyId: session.storyId,
            pagesRead: session.pagesRead,
            completed: session.completed,
            lastRead: session.lastActivity
          };
        }
      });

      const progress = Object.values(progressByStory);

      res.status(200).json({
        success: true,
        progress
      });
    } catch (error) {
      console.error('Error fetching progress:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch progress',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get reading analytics
   */
  static async getAnalytics(req, res) {
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

      // Fetch sessions and page reads
      const sessions = await EbookSession.find({
        userId,
        ...dateFilter
      }).sort({ startTime: -1 });

      const pageReads = await EbookPageRead.find({
        userId,
        timestamp: dateFilter.startTime ? { $gte: dateFilter.startTime.$gte } : { $exists: true }
      });

      // Calculate statistics
      const stats = EbookController.calculateStats(sessions, pageReads);
      const storiesProgress = EbookController.calculateStoriesProgress(sessions);
      const readingTrend = EbookController.calculateReadingTrend(sessions);
      const languagePreference = EbookController.calculateLanguagePreference(pageReads);
      const recentSessions = EbookController.formatRecentSessions(sessions);

      res.status(200).json({
        success: true,
        stats,
        storiesProgress,
        readingTrend,
        languagePreference,
        recentSessions
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch analytics',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Calculate overall statistics
   * @private
   */
  static calculateStats(sessions, pageReads) {
    const totalSessions = sessions.length;
    const completedStories = sessions.filter(s => s.completed).length;
    const totalPagesRead = pageReads.length;
    const totalTimeSpent = sessions.reduce((sum, s) => sum + (s.totalTimeSpent || 0), 0);
    const readAloudCount = pageReads.filter(p => p.wasReadAloud).length;
    const avgTimePerPage = totalPagesRead > 0 ? Math.round(totalTimeSpent / totalPagesRead) : 0;

    // Calculate unique stories read
    const uniqueStories = new Set(sessions.map(s => s.storyId)).size;

    return {
      totalSessions,
      completedStories,
      totalPagesRead,
      totalTimeSpent: Math.round(totalTimeSpent / 60), // in minutes
      readAloudCount,
      avgTimePerPage,
      uniqueStories
    };
  }

  /**
   * Calculate progress per story
   * @private
   */
  static calculateStoriesProgress(sessions) {
    const storyProgress = {};

    sessions.forEach(session => {
      if (!storyProgress[session.storyId] || 
          session.pagesRead > storyProgress[session.storyId].pagesRead) {
        storyProgress[session.storyId] = {
          storyId: session.storyId,
          pagesRead: session.pagesRead,
          completed: session.completed,
          totalTime: session.totalTimeSpent || 0
        };
      }
    });

    return Object.values(storyProgress);
  }

  /**
   * Calculate reading trend over time
   * @private
   */
  static calculateReadingTrend(sessions) {
    return sessions.slice(0, 10).reverse().map(session => ({
      sessionId: session._id,
      date: session.startTime,
      pagesRead: session.pagesRead,
      timeSpent: Math.round((session.totalTimeSpent || 0) / 60) // in minutes
    }));
  }

  /**
   * Calculate language preference
   * @private
   */
  static calculateLanguagePreference(pageReads) {
    const languageCounts = { en: 0, ur: 0 };

    pageReads.forEach(page => {
      languageCounts[page.language]++;
    });

    const total = languageCounts.en + languageCounts.ur;
    
    return {
      english: total > 0 ? Math.round((languageCounts.en / total) * 100) : 0,
      urdu: total > 0 ? Math.round((languageCounts.ur / total) * 100) : 0
    };
  }

  /**
   * Format recent sessions
   * @private
   */
  static formatRecentSessions(sessions) {
    return sessions.slice(0, 10).map(session => ({
      date: session.startTime,
      storyId: session.storyId,
      pagesRead: session.pagesRead,
      completed: session.completed,
      timeSpent: Math.round((session.totalTimeSpent || 0) / 60) // in minutes
    }));
  }
}

module.exports = EbookController;