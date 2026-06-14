// controllers/AssessmentController.js
// Controller for generating and managing student assessments
// Updated to work with LearnBridge's actual game models

const mongoose = require('mongoose');
const User = require('../models/User');
const StudentAssessment = require('../models/StudentAssessment');

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
  const mathquestModels = require('../models/mathquest.model');
  GameSession = mathquestModels.GameSession;
  modelsLoaded.mathquest = true;
} catch (e) {
  try {
    GameSession = require('../models/GameSession');
    modelsLoaded.mathquest = true;
  } catch (e2) {}
}

// Phoneme Game
try {
  PhonemeGameSession = require('../models/PhonemeGameSession');
  modelsLoaded.phoneme = true;
} catch (e) {}

// Word Formation
try {
  WordFormationSession = require('../models/WordFormationSession');
  modelsLoaded.wordFormation = true;
} catch (e) {}

// Letter Tracing
try {
  LetterTracingSession = require('../models/LetterTracingSession');
  modelsLoaded.letterTracing = true;
} catch (e) {}

// Game type to cognitive domain mapping
const GAME_COGNITIVE_MAPPING = {
  'math-quest': 'problemSolving',
  'mathquest': 'problemSolving',
  'phoneme-game': 'verbal',
  'word-formation': 'verbal',
  'letter-tracing': 'memory'
};

/**
 * Get all games for a student within a period
 */
async function getStudentGamesInPeriod(studentId, periodStart, periodEnd) {
  const allGames = [];

  try {
    // MathQuest games
    if (modelsLoaded.mathquest && GameSession) {
      const mathGames = await GameSession.find({ 
        odId: studentId,
        completedAt: { $gte: periodStart, $lte: periodEnd }
      }).sort({ completedAt: -1 }).lean();

      mathGames.forEach(g => {
        allGames.push({
          gameType: 'math-quest',
          score: g.score || 0,
          accuracy: g.accuracy || 0,
          createdAt: g.completedAt || g.createdAt,
          timeSpent: g.totalTime || 0,
          details: {
            operation: g.operation,
            correctAnswers: g.correctAnswers,
            wrongAnswers: g.wrongAnswers,
            totalQuestions: g.totalQuestions
          }
        });
      });
    }

    // Phoneme games
    if (modelsLoaded.phoneme && PhonemeGameSession) {
      const phonemeGames = await PhonemeGameSession.find({ 
        userId: studentId,
        status: 'completed',
        endTime: { $gte: periodStart, $lte: periodEnd }
      }).sort({ endTime: -1 }).lean();

      phonemeGames.forEach(g => {
        allGames.push({
          gameType: 'phoneme-game',
          score: g.finalScore || 0,
          accuracy: g.accuracy || 0,
          createdAt: g.endTime || g.createdAt,
          timeSpent: g.duration || 0,
          details: {
            levelsCompleted: g.levelsCompleted,
            totalCorrect: g.totalCorrect,
            totalQuestions: g.totalQuestions
          }
        });
      });
    }

    // Word Formation games
    if (modelsLoaded.wordFormation && WordFormationSession) {
      const wordGames = await WordFormationSession.find({ 
        userId: studentId,
        status: 'completed',
        endTime: { $gte: periodStart, $lte: periodEnd }
      }).sort({ endTime: -1 }).lean();

      wordGames.forEach(g => {
        allGames.push({
          gameType: 'word-formation',
          score: g.finalScore || 0,
          accuracy: g.accuracy || 0,
          createdAt: g.endTime || g.createdAt,
          timeSpent: 0,
          details: {
            finalLevel: g.finalLevel,
            correctAttempts: g.correctAttempts,
            totalAttempts: g.totalAttempts
          }
        });
      });
    }

    // Letter Tracing games
    if (modelsLoaded.letterTracing && LetterTracingSession) {
      const letterGames = await LetterTracingSession.find({ 
        userId: studentId,
        status: 'completed',
        endTime: { $gte: periodStart, $lte: periodEnd }
      }).sort({ endTime: -1 }).lean();

      letterGames.forEach(g => {
        allGames.push({
          gameType: 'letter-tracing',
          score: g.accuracy || 0,
          accuracy: g.accuracy || 0,
          createdAt: g.endTime || g.createdAt,
          timeSpent: 0,
          details: {
            lettersCompleted: g.lettersCompleted,
            correctAttempts: g.correctAttempts,
            totalAttempts: g.totalAttempts
          }
        });
      });
    }

    // Sort by date
    allGames.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  } catch (error) {
    console.error('Error fetching games in period:', error.message);
  }

  return allGames;
}

/**
 * Calculate cognitive scores from games
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
    const domain = GAME_COGNITIVE_MAPPING[game.gameType];
    if (domain && scores[domain]) {
      const gameScore = game.accuracy || game.score || 0;
      scores[domain].push({
        score: gameScore,
        weight: Math.pow(0.95, index)
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
      result[domain] = 50; // Default if no data
    }
  }

  return result;
}

/**
 * Summarize game performance by type
 */
function summarizeGamePerformance(games) {
  const byType = {};
  
  games.forEach(game => {
    const type = game.gameType;
    if (!byType[type]) {
      byType[type] = {
        gameType: type,
        totalSessions: 0,
        scores: [],
        totalTime: 0
      };
    }
    byType[type].totalSessions++;
    byType[type].scores.push(game.accuracy || game.score || 0);
    byType[type].totalTime += game.timeSpent || 0;
  });

  return Object.values(byType).map(data => ({
    gameType: data.gameType,
    totalSessions: data.totalSessions,
    averageScore: data.scores.length > 0 
      ? Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length) 
      : 0,
    highestScore: data.scores.length > 0 ? Math.max(...data.scores) : 0,
    lowestScore: data.scores.length > 0 ? Math.min(...data.scores) : 0,
    totalTimeMinutes: Math.round(data.totalTime / 60)
  }));
}

/**
 * Determine risk level
 */
function determineRiskLevel(scores, overallScore) {
  const minScore = Math.min(...Object.values(scores));
  if (overallScore < 40 || minScore < 25) return 'high';
  if (overallScore < 60 || minScore < 40) return 'medium';
  return 'low';
}

/**
 * Determine trends compared to previous assessment
 */
function determineTrends(currentScores, previousAssessment) {
  const trends = {};
  
  if (!previousAssessment) {
    for (const domain of Object.keys(currentScores)) {
      trends[domain] = 'stable';
    }
    return trends;
  }

  const prevScores = previousAssessment.cognitiveScores || {};
  
  for (const [domain, currentScore] of Object.entries(currentScores)) {
    const prevScore = prevScores[domain] || 50;
    const diff = currentScore - prevScore;
    
    if (diff > 5) trends[domain] = 'improving';
    else if (diff < -5) trends[domain] = 'declining';
    else trends[domain] = 'stable';
  }

  return trends;
}

/**
 * Format domain name for display
 */
function formatDomainName(domain) {
  const names = {
    memory: 'Memory',
    attention: 'Attention',
    problemSolving: 'Problem Solving',
    processingSpeed: 'Processing Speed',
    verbal: 'Verbal Skills'
  };
  return names[domain] || domain;
}

/**
 * Identify strengths
 */
function identifyStrengths(scores) {
  const strengths = [];
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  
  for (const [domain, score] of sorted.slice(0, 2)) {
    if (score >= 60) strengths.push(formatDomainName(domain));
  }
  
  return strengths.length > 0 ? strengths : ['Developing across all areas'];
}

/**
 * Identify weaknesses
 */
function identifyWeaknesses(scores) {
  const weaknesses = [];
  const sorted = Object.entries(scores).sort((a, b) => a[1] - b[1]);
  
  for (const [domain, score] of sorted.slice(0, 2)) {
    if (score < 50) weaknesses.push(formatDomainName(domain));
  }
  
  return weaknesses;
}

/**
 * Generate observations
 */
function generateObservations(scores, gameCount, trends) {
  const observations = [];

  if (gameCount === 0) {
    observations.push('No game activity recorded during this assessment period.');
  } else if (gameCount < 5) {
    observations.push(`Limited game engagement with only ${gameCount} sessions recorded.`);
  } else if (gameCount > 20) {
    observations.push(`Strong engagement with ${gameCount} game sessions completed.`);
  }

  const avgScore = Object.values(scores).reduce((a, b) => a + b, 0) / 5;
  if (avgScore >= 70) {
    observations.push('Overall cognitive performance is above average.');
  } else if (avgScore < 40) {
    observations.push('Cognitive scores indicate areas requiring additional support.');
  }

  const improvingCount = Object.values(trends).filter(t => t === 'improving').length;
  const decliningCount = Object.values(trends).filter(t => t === 'declining').length;

  if (improvingCount >= 3) {
    observations.push('Showing positive improvement trends across multiple domains.');
  } else if (decliningCount >= 3) {
    observations.push('Performance has declined in several areas since last assessment.');
  }

  return observations;
}

/**
 * Generate recommendations
 */
function generateRecommendations(scores, riskLevel, trends) {
  const recommendations = [];

  if (riskLevel === 'high') {
    recommendations.push({
      priority: 'high',
      category: 'intervention',
      title: 'Schedule Immediate Follow-up',
      description: 'Consider scheduling a one-on-one session to assess underlying issues.'
    });
  }

  const sorted = Object.entries(scores).sort((a, b) => a[1] - b[1]);
  
  for (const [domain, score] of sorted.slice(0, 2)) {
    if (score < 50) {
      recommendations.push({
        priority: score < 35 ? 'high' : 'medium',
        category: 'practice',
        title: `Focus on ${formatDomainName(domain)}`,
        description: `Recommend targeted ${domain} exercises and activities.`
      });
    }
  }

  for (const [domain, trend] of Object.entries(trends)) {
    if (trend === 'declining' && scores[domain] < 60) {
      recommendations.push({
        priority: 'medium',
        category: 'monitor',
        title: `Monitor ${formatDomainName(domain)} Progress`,
        description: `${formatDomainName(domain)} shows declining trend. Monitor closely.`
      });
    }
  }

  return recommendations.slice(0, 5);
}

/**
 * Generate a new assessment for a student
 */
exports.generateAssessment = async (req, res) => {
  try {
    const psychologistId = req.user._id;
    const { studentId } = req.params;
    const { notes, assessmentType = 'periodic', periodDays = 30 } = req.body;

    // Verify student
    const student = await User.findOne({
      _id: studentId,
      assignedPsychologist: psychologistId,
      role: 'Student'
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found or not assigned to you'
      });
    }

    // Get assessment period
    const periodEnd = new Date();
    const periodStart = new Date();
    periodStart.setDate(periodStart.getDate() - periodDays);

    // Get previous assessment
    const previousAssessment = await StudentAssessment.findOne({
      student: studentId,
      psychologist: psychologistId
    }).sort({ createdAt: -1 });

    // Get games in period
    const gamesInPeriod = await getStudentGamesInPeriod(studentId, periodStart, periodEnd);

    // Calculate scores
    const cognitiveScores = calculateCognitiveScores(gamesInPeriod);
    const gamePerformance = summarizeGamePerformance(gamesInPeriod);

    // Calculate overall score
    const weights = {
      memory: 0.20,
      attention: 0.20,
      problemSolving: 0.25,
      processingSpeed: 0.15,
      verbal: 0.20
    };

    const overallScore = Math.round(
      Object.entries(cognitiveScores).reduce((sum, [domain, score]) => {
        return sum + (score * weights[domain]);
      }, 0)
    );

    // Determine risk level and trends
    const riskLevel = determineRiskLevel(cognitiveScores, overallScore);
    const trends = determineTrends(cognitiveScores, previousAssessment);
    const recommendations = generateRecommendations(cognitiveScores, riskLevel, trends);

    // Create assessment
    const assessment = new StudentAssessment({
      student: studentId,
      psychologist: psychologistId,
      assessmentType,
      assessmentPeriod: { start: periodStart, end: periodEnd },
      cognitiveScores,
      overallScore,
      riskLevel,
      trends,
      gamePerformance,
      analysis: {
        strengths: identifyStrengths(cognitiveScores),
        areasForImprovement: identifyWeaknesses(cognitiveScores),
        observations: generateObservations(cognitiveScores, gamesInPeriod.length, trends)
      },
      recommendations,
      notes: notes || '',
      previousAssessment: previousAssessment?._id || null
    });

    await assessment.save();

    res.status(201).json({
      success: true,
      message: 'Assessment generated successfully',
      assessment
    });
  } catch (error) {
    console.error('Generate Assessment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate assessment',
      error: error.message
    });
  }
};

/**
 * Get all assessments for the psychologist
 */
exports.getAllAssessments = async (req, res) => {
  try {
    const psychologistId = req.user._id;
    const { riskLevel, sortBy = 'createdAt', sortOrder = -1, page = 1, limit = 20 } = req.query;

    const query = { psychologist: psychologistId };
    if (riskLevel) query.riskLevel = riskLevel;

    const total = await StudentAssessment.countDocuments(query);

    const assessments = await StudentAssessment.find(query)
      .sort({ [sortBy]: parseInt(sortOrder) })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('student', 'firstName lastName email profilePhoto')
      .lean();

    res.json({
      success: true,
      assessments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get All Assessments Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assessments',
      error: error.message
    });
  }
};

/**
 * Get assessments for a specific student
 */
exports.getStudentAssessments = async (req, res) => {
  try {
    const psychologistId = req.user._id;
    const { studentId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const student = await User.findOne({
      _id: studentId,
      assignedPsychologist: psychologistId,
      role: 'Student'
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found or not assigned to you'
      });
    }

    const query = { student: studentId, psychologist: psychologistId };
    const total = await StudentAssessment.countDocuments(query);

    const assessments = await StudentAssessment.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      student: {
        _id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email
      },
      assessments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get Student Assessments Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student assessments',
      error: error.message
    });
  }
};

/**
 * Get single assessment detail
 */
exports.getAssessmentDetail = async (req, res) => {
  try {
    const psychologistId = req.user._id;
    const { assessmentId } = req.params;

    const assessment = await StudentAssessment.findOne({
      _id: assessmentId,
      psychologist: psychologistId
    })
      .populate('student', 'firstName lastName email profilePhoto')
      .populate('previousAssessment', 'cognitiveScores overallScore riskLevel createdAt');

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    res.json({ success: true, assessment });
  } catch (error) {
    console.error('Get Assessment Detail Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assessment',
      error: error.message
    });
  }
};

/**
 * Update assessment notes/recommendations
 */
exports.updateAssessment = async (req, res) => {
  try {
    const psychologistId = req.user._id;
    const { assessmentId } = req.params;
    const { notes, recommendations, status } = req.body;

    const assessment = await StudentAssessment.findOne({
      _id: assessmentId,
      psychologist: psychologistId
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    if (notes !== undefined) assessment.notes = notes;
    if (recommendations !== undefined) assessment.recommendations = recommendations;
    if (status !== undefined) assessment.status = status;

    await assessment.save();

    res.json({
      success: true,
      message: 'Assessment updated successfully',
      assessment
    });
  } catch (error) {
    console.error('Update Assessment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update assessment',
      error: error.message
    });
  }
};

module.exports = exports;
