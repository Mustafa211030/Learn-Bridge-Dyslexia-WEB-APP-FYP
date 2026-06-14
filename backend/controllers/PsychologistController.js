// controllers/PsychologistController.js
// Main controller for psychologist dashboard and student management
// Updated to work with LearnBridge's actual game models

const mongoose = require('mongoose');
const User = require('../models/User');
const StudentAssessment = require('../models/StudentAssessment');
const PsychologistProfile = require('../models/PsychologistProfile');
const Blog = require('../models/Blog');
const EducationalResource = require('../models/EducationalResource');

// ============================================
// LOAD YOUR EXISTING GAME MODELS
// ============================================
let GameSession, PhonemeGameSession, WordFormationSession, LetterTracingSession;
let modelsLoaded = {
  mathquest: false,
  phoneme: false,
  wordFormation: false,
  letterTracing: false
};

// MathQuest / GameSession
try {
  // Try loading from mathquest.model.js first
  const mathquestModels = require('../models/mathquest.model');
  GameSession = mathquestModels.GameSession;
  modelsLoaded.mathquest = true;
  console.log('✅ MathQuest GameSession model loaded');
} catch (e) {
  try {
    // Fallback to standalone GameSession
    GameSession = require('../models/GameSession');
    modelsLoaded.mathquest = true;
    console.log('✅ GameSession model loaded');
  } catch (e2) {
    console.log('⚠️ GameSession model not found');
  }
}

// Phoneme Game
try {
  PhonemeGameSession = require('../models/PhonemeGameSession');
  modelsLoaded.phoneme = true;
  console.log('✅ PhonemeGameSession model loaded');
} catch (e) {
  console.log('⚠️ PhonemeGameSession model not found');
}

// Word Formation
try {
  WordFormationSession = require('../models/WordFormationSession');
  modelsLoaded.wordFormation = true;
  console.log('✅ WordFormationSession model loaded');
} catch (e) {
  console.log('⚠️ WordFormationSession model not found');
}

// Letter Tracing
try {
  LetterTracingSession = require('../models/LetterTracingSession');
  modelsLoaded.letterTracing = true;
  console.log('✅ LetterTracingSession model loaded');
} catch (e) {
  console.log('⚠️ LetterTracingSession model not found');
}

// Game type to cognitive domain mapping
const GAME_COGNITIVE_MAPPING = {
  'math-quest': 'problemSolving',
  'mathquest': 'problemSolving',
  'addition': 'problemSolving',
  'subtraction': 'problemSolving',
  'multiplication': 'problemSolving',
  'division': 'problemSolving',
  'phoneme': 'verbal',
  'phoneme-game': 'verbal',
  'word-formation': 'verbal',
  'wordformation': 'verbal',
  'letter-tracing': 'memory',
  'lettertracing': 'memory',
  'memory': 'memory',
  'attention': 'attention',
  'speed': 'processingSpeed'
};

/**
 * Get aggregated game stats for a student from all game models
 */
async function getStudentGameStats(studentId) {
  const stats = {
    totalGames: 0,
    totalScore: 0,
    avgScore: 0,
    lastPlayed: null,
    byType: []
  };

  try {
    // MathQuest / GameSession stats
    if (modelsLoaded.mathquest && GameSession) {
      const mathStats = await GameSession.aggregate([
        { $match: { odId: new mongoose.Types.ObjectId(studentId) } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            totalScore: { $sum: '$score' },
            avgScore: { $avg: '$score' },
            lastPlayed: { $max: '$completedAt' }
          }
        }
      ]);

      if (mathStats.length > 0) {
        stats.totalGames += mathStats[0].count;
        stats.totalScore += mathStats[0].totalScore;
        if (!stats.lastPlayed || mathStats[0].lastPlayed > stats.lastPlayed) {
          stats.lastPlayed = mathStats[0].lastPlayed;
        }
        stats.byType.push({
          type: 'math-quest',
          count: mathStats[0].count,
          avgScore: Math.round(mathStats[0].avgScore || 0)
        });
      }
    }

    // Phoneme Game stats
    if (modelsLoaded.phoneme && PhonemeGameSession) {
      const phonemeStats = await PhonemeGameSession.aggregate([
        { 
          $match: { 
            userId: new mongoose.Types.ObjectId(studentId),
            status: 'completed'
          } 
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            totalScore: { $sum: '$finalScore' },
            avgScore: { $avg: '$accuracy' },
            lastPlayed: { $max: '$endTime' }
          }
        }
      ]);

      if (phonemeStats.length > 0) {
        stats.totalGames += phonemeStats[0].count;
        stats.totalScore += phonemeStats[0].totalScore;
        if (!stats.lastPlayed || phonemeStats[0].lastPlayed > stats.lastPlayed) {
          stats.lastPlayed = phonemeStats[0].lastPlayed;
        }
        stats.byType.push({
          type: 'phoneme-game',
          count: phonemeStats[0].count,
          avgScore: Math.round(phonemeStats[0].avgScore || 0)
        });
      }
    }

    // Word Formation stats
    if (modelsLoaded.wordFormation && WordFormationSession) {
      const wordStats = await WordFormationSession.aggregate([
        { 
          $match: { 
            userId: new mongoose.Types.ObjectId(studentId),
            status: 'completed'
          } 
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            totalScore: { $sum: '$finalScore' },
            avgScore: { $avg: '$accuracy' },
            lastPlayed: { $max: '$endTime' }
          }
        }
      ]);

      if (wordStats.length > 0) {
        stats.totalGames += wordStats[0].count;
        stats.totalScore += wordStats[0].totalScore;
        if (!stats.lastPlayed || wordStats[0].lastPlayed > stats.lastPlayed) {
          stats.lastPlayed = wordStats[0].lastPlayed;
        }
        stats.byType.push({
          type: 'word-formation',
          count: wordStats[0].count,
          avgScore: Math.round(wordStats[0].avgScore || 0)
        });
      }
    }

    // Letter Tracing stats
    if (modelsLoaded.letterTracing && LetterTracingSession) {
      const letterStats = await LetterTracingSession.aggregate([
        { 
          $match: { 
            userId: new mongoose.Types.ObjectId(studentId),
            status: 'completed'
          } 
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            avgScore: { $avg: '$accuracy' },
            lastPlayed: { $max: '$endTime' }
          }
        }
      ]);

      if (letterStats.length > 0) {
        stats.totalGames += letterStats[0].count;
        if (!stats.lastPlayed || letterStats[0].lastPlayed > stats.lastPlayed) {
          stats.lastPlayed = letterStats[0].lastPlayed;
        }
        stats.byType.push({
          type: 'letter-tracing',
          count: letterStats[0].count,
          avgScore: Math.round(letterStats[0].avgScore || 0)
        });
      }
    }

    // Calculate overall average
    if (stats.totalGames > 0) {
      const totalWeightedScore = stats.byType.reduce((sum, t) => sum + (t.avgScore * t.count), 0);
      stats.avgScore = Math.round(totalWeightedScore / stats.totalGames);
    }

  } catch (error) {
    console.error('Error fetching game stats:', error.message);
  }

  return stats;
}

/**
 * Get all games for a student (for cognitive score calculation)
 */
async function getAllStudentGames(studentId, limit = 50) {
  const allGames = [];

  try {
    // MathQuest games
    if (modelsLoaded.mathquest && GameSession) {
      const mathGames = await GameSession.find({ odId: studentId })
        .sort({ completedAt: -1 })
        .limit(limit)
        .lean();

      mathGames.forEach(g => {
        allGames.push({
          gameType: 'math-quest',
          score: g.score || 0,
          accuracy: g.accuracy || 0,
          createdAt: g.completedAt || g.createdAt,
          timeSpent: g.totalTime || 0
        });
      });
    }

    // Phoneme games
    if (modelsLoaded.phoneme && PhonemeGameSession) {
      const phonemeGames = await PhonemeGameSession.find({ 
        userId: studentId,
        status: 'completed'
      })
        .sort({ endTime: -1 })
        .limit(limit)
        .lean();

      phonemeGames.forEach(g => {
        allGames.push({
          gameType: 'phoneme-game',
          score: g.finalScore || 0,
          accuracy: g.accuracy || 0,
          createdAt: g.endTime || g.createdAt,
          timeSpent: g.duration || 0
        });
      });
    }

    // Word Formation games
    if (modelsLoaded.wordFormation && WordFormationSession) {
      const wordGames = await WordFormationSession.find({ 
        userId: studentId,
        status: 'completed'
      })
        .sort({ endTime: -1 })
        .limit(limit)
        .lean();

      wordGames.forEach(g => {
        allGames.push({
          gameType: 'word-formation',
          score: g.finalScore || 0,
          accuracy: g.accuracy || 0,
          createdAt: g.endTime || g.createdAt,
          timeSpent: 0
        });
      });
    }

    // Letter Tracing games
    if (modelsLoaded.letterTracing && LetterTracingSession) {
      const letterGames = await LetterTracingSession.find({ 
        userId: studentId,
        status: 'completed'
      })
        .sort({ endTime: -1 })
        .limit(limit)
        .lean();

      letterGames.forEach(g => {
        allGames.push({
          gameType: 'letter-tracing',
          score: g.accuracy || 0,
          accuracy: g.accuracy || 0,
          createdAt: g.endTime || g.createdAt,
          timeSpent: 0
        });
      });
    }

    // Sort by date (most recent first)
    allGames.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  } catch (error) {
    console.error('Error fetching all games:', error.message);
  }

  return allGames.slice(0, limit);
}

/**
 * Calculate cognitive scores from game data
 */
function calculateCognitiveScores(games) {
  const scores = {
    memory: [],
    attention: [],
    problemSolving: [],
    processingSpeed: [],
    verbal: []
  };

  games.forEach((game, index) => {
    const domain = GAME_COGNITIVE_MAPPING[game.gameType] || 'problemSolving';
    if (scores[domain]) {
      // Use accuracy if available, otherwise use score
      const gameScore = game.accuracy || game.score || 0;
      scores[domain].push({
        score: gameScore,
        weight: Math.pow(0.95, index) // Recency weighting
      });
    }
  });

  const result = {};
  for (const [domain, domainScores] of Object.entries(scores)) {
    if (domainScores.length > 0) {
      const weightedSum = domainScores.reduce((sum, s) => sum + (s.score * s.weight), 0);
      const totalWeight = domainScores.reduce((sum, s) => sum + s.weight, 0);
      result[domain] = Math.round(weightedSum / totalWeight);
    } else {
      result[domain] = 0;
    }
  }

  return result;
}

/**
 * Get dashboard data for psychologist
 */
exports.getDashboard = async (req, res) => {
  try {
    const psychologistId = req.user._id;

    // Get assigned students count
    const totalStudents = await User.countDocuments({
      assignedPsychologist: psychologistId,
      role: 'Student'
    });

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get assessments created today
    const todaySessions = await StudentAssessment.countDocuments({
      psychologist: psychologistId,
      createdAt: { $gte: today, $lt: tomorrow }
    });

    // Get pending assessments
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const studentsWithRecentAssessment = await StudentAssessment.distinct('student', {
      psychologist: psychologistId,
      createdAt: { $gte: thirtyDaysAgo }
    });

    const pendingAssessments = totalStudents - studentsWithRecentAssessment.length;

    // Get high risk students count
    const highRiskStudents = await StudentAssessment.aggregate([
      { $match: { psychologist: psychologistId } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$student', latestAssessment: { $first: '$$ROOT' } } },
      { $match: { 'latestAssessment.riskLevel': 'high' } },
      { $count: 'count' }
    ]);

    // Get recent assessments
    const recentAssessments = await StudentAssessment.find({
      psychologist: psychologistId
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('student', 'firstName lastName email profilePhoto');

    // Get high risk alerts
    const highRiskAlerts = await StudentAssessment.aggregate([
      { $match: { psychologist: psychologistId } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$student', latestAssessment: { $first: '$$ROOT' } } },
      { $match: { 'latestAssessment.riskLevel': { $in: ['high', 'medium'] } } },
      { $sort: { 'latestAssessment.createdAt': -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      { $unwind: '$studentInfo' }
    ]);

    // Get recent students
    const recentStudents = await User.find({
      assignedPsychologist: psychologistId,
      role: 'Student'
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email profilePhoto');

    res.json({
      success: true,
      dashboard: {
        quickStats: {
          totalStudents,
          todaySessions,
          pendingAssessments: Math.max(0, pendingAssessments),
          highRiskStudents: highRiskStudents[0]?.count || 0
        },
        recentActivities: recentAssessments.map(assessment => ({
          id: assessment._id,
          type: 'assessment',
          student: assessment.student,
          riskLevel: assessment.riskLevel,
          overallScore: assessment.overallScore,
          createdAt: assessment.createdAt
        })),
        highRiskAlerts: highRiskAlerts.map(alert => ({
          studentId: alert._id,
          student: {
            firstName: alert.studentInfo.firstName,
            lastName: alert.studentInfo.lastName,
            email: alert.studentInfo.email,
            profilePhoto: alert.studentInfo.profilePhoto
          },
          riskLevel: alert.latestAssessment.riskLevel,
          overallScore: alert.latestAssessment.overallScore,
          assessmentDate: alert.latestAssessment.createdAt
        })),
        recentStudents
      }
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

/**
 * Get all assigned students
 */
exports.getStudents = async (req, res) => {
  try {
    const psychologistId = req.user._id;
    const { search, riskLevel, sortBy = 'name', page = 1, limit = 20 } = req.query;

    // Build query
    const query = {
      assignedPsychologist: psychologistId,
      role: 'Student'
    };

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Get students
    let students = await User.find(query)
      .select('firstName lastName email profilePhoto createdAt lastLoginAt')
      .lean();

    // Get latest assessment for each student
    const studentIds = students.map(s => s._id);
    const latestAssessments = await StudentAssessment.aggregate([
      { $match: { student: { $in: studentIds } } },
      { $sort: { createdAt: -1 } },
      { $group: {
        _id: '$student',
        latestAssessment: { $first: '$$ROOT' }
      }}
    ]);

    const assessmentMap = {};
    latestAssessments.forEach(a => {
      assessmentMap[a._id.toString()] = a.latestAssessment;
    });

    // Get game stats for each student
    const studentStatsPromises = students.map(s => getStudentGameStats(s._id));
    const studentStats = await Promise.all(studentStatsPromises);

    // Combine data
    students = students.map((student, index) => {
      const assessment = assessmentMap[student._id.toString()];
      const gameStats = studentStats[index];

      return {
        ...student,
        latestAssessment: assessment ? {
          overallScore: assessment.overallScore,
          riskLevel: assessment.riskLevel,
          createdAt: assessment.createdAt
        } : null,
        gameStats: {
          totalGames: gameStats.totalGames,
          avgScore: gameStats.avgScore,
          lastPlayed: gameStats.lastPlayed
        }
      };
    });

    // Filter by risk level
    if (riskLevel) {
      students = students.filter(s => s.latestAssessment?.riskLevel === riskLevel);
    }

    // Sort
    if (sortBy === 'name') {
      students.sort((a, b) => a.firstName.localeCompare(b.firstName));
    } else if (sortBy === 'score') {
      students.sort((a, b) => (b.latestAssessment?.overallScore || 0) - (a.latestAssessment?.overallScore || 0));
    } else if (sortBy === 'risk') {
      const riskOrder = { high: 0, medium: 1, low: 2 };
      students.sort((a, b) => 
        (riskOrder[a.latestAssessment?.riskLevel] ?? 3) - (riskOrder[b.latestAssessment?.riskLevel] ?? 3)
      );
    }

    // Pagination
    const total = students.length;
    const startIndex = (page - 1) * limit;
    const paginatedStudents = students.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      success: true,
      students: paginatedStudents,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get Students Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    });
  }
};

/**
 * Get single student details with game data
 */
exports.getStudentDetail = async (req, res) => {
  try {
    const psychologistId = req.user._id;
    const { id: studentId } = req.params;

    // Verify student is assigned to this psychologist
    const student = await User.findOne({
      _id: studentId,
      assignedPsychologist: psychologistId,
      role: 'Student'
    }).select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found or not assigned to you'
      });
    }

    // Get all assessments
    const assessments = await StudentAssessment.find({
      student: studentId,
      psychologist: psychologistId
    }).sort({ createdAt: -1 }).limit(20);

    // Get all games and calculate cognitive scores
    const games = await getAllStudentGames(studentId, 50);
    const cognitiveScores = calculateCognitiveScores(games);

    // Get game stats
    const gameStats = await getStudentGameStats(studentId);

    // Build charts data
    const cognitiveHistory = assessments.map(a => ({
      date: a.createdAt,
      ...a.cognitiveScores,
      overall: a.overallScore
    })).reverse();

    const riskHistory = assessments.map(a => ({
      date: a.createdAt,
      riskLevel: a.riskLevel,
      score: a.overallScore
    })).reverse();

    res.json({
      success: true,
      student: {
        ...student.toObject(),
        currentCognitiveScores: cognitiveScores,
        latestAssessment: assessments[0] || null
      },
      assessments,
      gameData: {
        recentGames: games.slice(0, 20),
        statsByType: gameStats.byType,
        totalGames: gameStats.totalGames,
        avgScore: gameStats.avgScore
      },
      charts: {
        cognitiveHistory,
        riskHistory,
        gamePerformanceByType: gameStats.byType.map(stat => ({
          type: stat.type,
          count: stat.count,
          avgScore: stat.avgScore
        })),
        weeklyActivity: [] // TODO: Implement if needed
      }
    });
  } catch (error) {
    console.error('Get Student Detail Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student details',
      error: error.message
    });
  }
};

/**
 * Get psychologist profile
 */
exports.getProfile = async (req, res) => {
  try {
    const profile = await PsychologistProfile.getOrCreate(req.user._id);
    await profile.updateStatistics();

    const user = await User.findById(req.user._id).select('-password');

    res.json({
      success: true,
      profile: {
        user,
        ...profile.toObject()
      }
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

/**
 * Update psychologist profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    
    const allowedUpdates = [
      'credentials', 'yearsOfExperience', 'specializations', 'languages',
      'biography', 'shortBio', 'contact', 'profilePhoto', 'headerImage', 'settings'
    ];

    const filteredUpdates = {};
    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    const profile = await PsychologistProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: filteredUpdates },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

module.exports = exports;
