const GameSession = require('../models/GameSession');
const UserStats = require('../models/UserStats');
const Leaderboard = require('../models/Leaderboard');

// Save game session
exports.saveGameSession = async (req, res) => {
  try {
    const {
      odId,
      odName,
      operation,
      score,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      totalTime,
      hintsUsed,
      maxStreak,
      questionDetails,
      difficulty
    } = req.body;

    // Calculate derived values
    const accuracy = totalQuestions > 0 
      ? Math.round((correctAnswers / totalQuestions) * 100) 
      : 0;
    const avgTimePerQuestion = totalQuestions > 0 
      ? Math.round(totalTime / totalQuestions) 
      : 0;

    // Create game session
    const gameSession = await GameSession.create({
      odId,
      odName,
      operation,
      score,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      accuracy,
      totalTime,
      avgTimePerQuestion,
      hintsUsed,
      maxStreak,
      questionDetails,
      difficulty: difficulty || 'medium'
    });

    // Update user stats
    await updateUserStats(odId, odName, gameSession);

    // Update leaderboard
    await updateLeaderboard(odId, odName, operation, score, accuracy);

    // Check for achievements
    const newAchievements = await checkAchievements(odId, gameSession);

    return res.status(201).json({
      success: true,
      message: 'Game session saved successfully',
      data: {
        sessionId: gameSession._id,
        score,
        accuracy,
        newAchievements
      }
    });

  } catch (error) {
    console.error('Error saving game session:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save game session',
      error: error.message
    });
  }
};

// Get user stats
exports.getUserStats = async (req, res) => {
  try {
    const { odId } = req.params;

    const userStats = await UserStats.findOne({ odId });

    if (!userStats) {
      return res.status(404).json({
        success: false,
        message: 'No stats found for this user'
      });
    }

    return res.status(200).json({
      success: true,
      data: userStats
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user stats',
      error: error.message
    });
  }
};

// Get performance analytics
exports.getPerformanceAnalytics = async (req, res) => {
  try {
    const { odId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const sessions = await GameSession.find({
      odId,
      completedAt: { $gte: startDate }
    }).sort({ completedAt: 1 });

    if (sessions.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          hasData: false,
          message: 'No games played in this period'
        }
      });
    }

    // Score trend
    const scoreTrend = sessions.map(s => ({
      date: s.completedAt.toISOString().split('T')[0],
      score: s.score,
      operation: s.operation
    }));

    // Accuracy by operation
    const operationAccuracy = {};
    const operationCounts = {};
    
    sessions.forEach(s => {
      if (!operationAccuracy[s.operation]) {
        operationAccuracy[s.operation] = 0;
        operationCounts[s.operation] = 0;
      }
      operationAccuracy[s.operation] += s.accuracy;
      operationCounts[s.operation]++;
    });

    const accuracyByOperation = Object.keys(operationAccuracy).map(op => ({
      operation: op,
      accuracy: Math.round(operationAccuracy[op] / operationCounts[op]),
      gamesPlayed: operationCounts[op]
    }));

    // Daily performance
    const dailyMap = {};
    sessions.forEach(s => {
      const date = s.completedAt.toISOString().split('T')[0];
      if (!dailyMap[date]) {
        dailyMap[date] = {
          date,
          gamesPlayed: 0,
          totalScore: 0,
          totalAccuracy: 0,
          totalTime: 0
        };
      }
      dailyMap[date].gamesPlayed++;
      dailyMap[date].totalScore += s.score;
      dailyMap[date].totalAccuracy += s.accuracy;
      dailyMap[date].totalTime += s.totalTime;
    });

    const dailyPerformance = Object.values(dailyMap).map(d => ({
      date: d.date,
      gamesPlayed: d.gamesPlayed,
      avgScore: Math.round(d.totalScore / d.gamesPlayed),
      avgAccuracy: Math.round(d.totalAccuracy / d.gamesPlayed),
      totalPlayTime: Math.round(d.totalTime / 60)
    }));

    // Questions breakdown
    const totalCorrect = sessions.reduce((sum, s) => sum + s.correctAnswers, 0);
    const totalWrong = sessions.reduce((sum, s) => sum + s.wrongAnswers, 0);
    const questionsBreakdown = [
      { name: 'Correct', value: totalCorrect, color: '#4CAF50' },
      { name: 'Wrong', value: totalWrong, color: '#f44336' }
    ];

    // Time analysis
    const timeByOperation = {};
    sessions.forEach(s => {
      if (!timeByOperation[s.operation]) {
        timeByOperation[s.operation] = { total: 0, count: 0 };
      }
      timeByOperation[s.operation].total += s.avgTimePerQuestion;
      timeByOperation[s.operation].count++;
    });

    const avgTimeByOperation = Object.keys(timeByOperation).map(op => ({
      operation: op,
      avgTime: Math.round(timeByOperation[op].total / timeByOperation[op].count)
    }));

    // Streak history
    const streakHistory = sessions.map(s => ({
      date: s.completedAt.toISOString().split('T')[0],
      streak: s.maxStreak,
      operation: s.operation
    }));

    // Summary stats
    const summary = {
      totalGames: sessions.length,
      totalScore: sessions.reduce((sum, s) => sum + s.score, 0),
      avgScore: Math.round(sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length),
      highestScore: Math.max(...sessions.map(s => s.score)),
      avgAccuracy: Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length),
      totalPlayTime: Math.round(sessions.reduce((sum, s) => sum + s.totalTime, 0) / 60),
      bestStreak: Math.max(...sessions.map(s => s.maxStreak)),
      favoriteOperation: getMostFrequent(sessions.map(s => s.operation)),
      improvementRate: calculateImprovementRate(sessions)
    };

    return res.status(200).json({
      success: true,
      data: {
        hasData: true,
        summary,
        scoreTrend,
        accuracyByOperation,
        dailyPerformance,
        questionsBreakdown,
        avgTimeByOperation,
        streakHistory,
        recentGames: sessions.slice(-10).reverse().map(s => ({
          id: s._id,
          date: s.completedAt,
          operation: s.operation,
          score: s.score,
          accuracy: s.accuracy,
          totalQuestions: s.totalQuestions,
          maxStreak: s.maxStreak
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching performance analytics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch performance analytics',
      error: error.message
    });
  }
};

// Get game history
exports.getGameHistory = async (req, res) => {
  try {
    const { odId } = req.params;
    const { page = 1, limit = 10, operation } = req.query;

    const query = { odId };
    if (operation) query.operation = operation;

    const sessions = await GameSession.find(query)
      .sort({ completedAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await GameSession.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: {
        sessions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalGames: total,
          hasMore: parseInt(page) * parseInt(limit) < total
        }
      }
    });

  } catch (error) {
    console.error('Error fetching game history:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch game history',
      error: error.message
    });
  }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const { operation = 'overall', period = 'allTime', limit = 10 } = req.query;

    const leaderboard = await Leaderboard.find({ operation, period })
      .sort({ score: -1 })
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      data: leaderboard
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard',
      error: error.message
    });
  }
};

// Get session details
exports.getSessionDetails = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await GameSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: session
    });

  } catch (error) {
    console.error('Error fetching session details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch session details',
      error: error.message
    });
  }
};

// Helper functions
async function updateUserStats(odId, odName, session) {
  let stats = await UserStats.findOne({ odId });

  if (!stats) {
    stats = new UserStats({ odId, odName });
  }

  stats.totalGamesPlayed = (stats.totalGamesPlayed || 0) + 1;
  stats.totalScore = (stats.totalScore || 0) + session.score;
  stats.highestScore = Math.max(stats.highestScore || 0, session.score);
  stats.averageScore = Math.round(stats.totalScore / stats.totalGamesPlayed);
  stats.totalQuestionsAnswered = (stats.totalQuestionsAnswered || 0) + session.totalQuestions;
  stats.totalCorrectAnswers = (stats.totalCorrectAnswers || 0) + session.correctAnswers;
  stats.overallAccuracy = stats.totalQuestionsAnswered > 0
    ? Math.round((stats.totalCorrectAnswers / stats.totalQuestionsAnswered) * 100)
    : 0;
  stats.totalPlayTime = (stats.totalPlayTime || 0) + session.totalTime;
  stats.longestStreak = Math.max(stats.longestStreak || 0, session.maxStreak);
  stats.lastPlayedAt = new Date();

  if (!stats.operationStats) {
    stats.operationStats = {};
  }
  
  if (!stats.operationStats[session.operation]) {
    stats.operationStats[session.operation] = {
      gamesPlayed: 0,
      totalScore: 0,
      highestScore: 0,
      averageScore: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      accuracy: 0
    };
  }

  const opStats = stats.operationStats[session.operation];
  opStats.gamesPlayed++;
  opStats.totalScore += session.score;
  opStats.highestScore = Math.max(opStats.highestScore, session.score);
  opStats.averageScore = Math.round(opStats.totalScore / opStats.gamesPlayed);
  opStats.totalQuestions += session.totalQuestions;
  opStats.correctAnswers += session.correctAnswers;
  opStats.accuracy = opStats.totalQuestions > 0
    ? Math.round((opStats.correctAnswers / opStats.totalQuestions) * 100)
    : 0;

  stats.markModified('operationStats');
  await stats.save();
}

async function updateLeaderboard(odId, odName, operation, score, accuracy) {
  await Leaderboard.findOneAndUpdate(
    { odId, operation, period: 'allTime' },
    {
      odName,
      score,
      accuracy,
      $inc: { gamesPlayed: 1 }
    },
    { upsert: true, new: true }
  );

  const userStats = await UserStats.findOne({ odId });
  if (userStats) {
    await Leaderboard.findOneAndUpdate(
      { odId, operation: 'overall', period: 'allTime' },
      {
        odName,
        score: userStats.totalScore,
        accuracy: userStats.overallAccuracy,
        gamesPlayed: userStats.totalGamesPlayed
      },
      { upsert: true, new: true }
    );
  }

  const allEntries = await Leaderboard.find({ 
    operation: 'overall', 
    period: 'allTime' 
  }).sort({ score: -1 });

  for (let i = 0; i < allEntries.length; i++) {
    allEntries[i].rank = i + 1;
    await allEntries[i].save();
  }
}

async function checkAchievements(odId, session) {
  const newAchievements = [];
  const stats = await UserStats.findOne({ odId });

  if (!stats) return newAchievements;

  if (!stats.achievements) {
    stats.achievements = [];
  }

  const achievements = [
    {
      check: () => stats.totalGamesPlayed === 1,
      name: 'First Steps',
      description: 'Complete your first game!',
      icon: 'trophy'
    },
    {
      check: () => stats.totalGamesPlayed === 10,
      name: 'Getting Started',
      description: 'Play 10 games',
      icon: 'star'
    },
    {
      check: () => stats.totalGamesPlayed === 50,
      name: 'Dedicated Learner',
      description: 'Play 50 games',
      icon: 'book'
    },
    {
      check: () => session.accuracy === 100,
      name: 'Perfect Score',
      description: 'Get 100% accuracy in a game',
      icon: 'perfect'
    },
    {
      check: () => session.maxStreak >= 5,
      name: 'On Fire',
      description: 'Get a 5 answer streak',
      icon: 'fire'
    },
    {
      check: () => session.maxStreak >= 10,
      name: 'Unstoppable',
      description: 'Get a 10 answer streak',
      icon: 'lightning'
    },
    {
      check: () => stats.highestScore >= 100,
      name: 'Century',
      description: 'Score 100+ points in a single game',
      icon: 'medal'
    },
    {
      check: () => stats.highestScore >= 200,
      name: 'Math Wizard',
      description: 'Score 200+ points in a single game',
      icon: 'wizard'
    }
  ];

  for (const achievement of achievements) {
    const alreadyEarned = stats.achievements.some(a => a.name === achievement.name);
    if (!alreadyEarned && achievement.check()) {
      const newAch = {
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        earnedAt: new Date()
      };
      stats.achievements.push(newAch);
      newAchievements.push(newAch);
    }
  }

  if (newAchievements.length > 0) {
    await stats.save();
  }

  return newAchievements;
}

function getMostFrequent(arr) {
  if (!arr || arr.length === 0) return null;
  const counts = {};
  arr.forEach(item => {
    counts[item] = (counts[item] || 0) + 1;
  });
  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
}

function calculateImprovementRate(sessions) {
  if (sessions.length < 2) return 0;
  
  const half = Math.floor(sessions.length / 2);
  const firstHalf = sessions.slice(0, half);
  const secondHalf = sessions.slice(half);
  
  const firstAvg = firstHalf.reduce((sum, s) => sum + s.score, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, s) => sum + s.score, 0) / secondHalf.length;
  
  if (firstAvg === 0) return 0;
  return Math.round(((secondAvg - firstAvg) / firstAvg) * 100);
} 