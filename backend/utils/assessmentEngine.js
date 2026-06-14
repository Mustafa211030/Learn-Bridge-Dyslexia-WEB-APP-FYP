const WordFormationSession = require('../models/WordFormationSession');
const WordFormationAttempt = require('../models/WordFormationAttempt');
const LetterTracingSession = require('../models/LetterTracingSession');
const LetterTracingAttempt = require('../models/LetterTracingAttempt');
const PhonemeGameSession = require('../models/PhonemeGameSession');
const PhonemeAnswer = require('../models/PhonemeAnswer');
const EbookSession = require('../models/EbookSession');
const EbookPageRead = require('../models/EbookPageRead');

/**
 * Assessment Engine
 * Calculates cognitive scores from game performance data
 */
class AssessmentEngine {
  
  /**
   * Generate complete assessment for a student
   */
  static async generateAssessment(studentId, startDate = null, endDate = null) {
    try {
      // Set date range
      const dateQuery = {};
      if (startDate && endDate) {
        dateQuery.startTime = { $gte: new Date(startDate), $lte: new Date(endDate) };
      } else {
        // Default: last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        dateQuery.startTime = { $gte: thirtyDaysAgo };
      }

      // Fetch all game data
      const wordFormationData = await this.getWordFormationData(studentId, dateQuery);
      const letterTracingData = await this.getLetterTracingData(studentId, dateQuery);
      const phonemeData = await this.getPhonemeData(studentId, dateQuery);
      const ebookData = await this.getEbookData(studentId, dateQuery);

      // Calculate game-specific scores
      const gameScores = {
        wordFormation: this.calculateWordFormationScore(wordFormationData),
        letterTracing: this.calculateLetterTracingScore(letterTracingData),
        phonemeGame: this.calculatePhonemeScore(phonemeData),
        ebook: this.calculateEbookScore(ebookData)
      };

      // Calculate cognitive domain scores
      const cognitiveScores = this.calculateCognitiveDomains(gameScores, {
        wordFormationData,
        letterTracingData,
        phonemeData,
        ebookData
      });

      // Calculate overall cognitive score
      const overallCognitiveScore = this.calculateOverallScore(cognitiveScores);

      // Detect trends
      const trends = await this.detectTrends(studentId);

      // Flag concerns
      const flaggedConcerns = this.detectConcerns(cognitiveScores, gameScores, trends);

      // Determine risk level
      const riskLevel = this.calculateRiskLevel(overallCognitiveScore, flaggedConcerns, trends);

      // Generate recommendations
      const recommendations = this.generateRecommendations(cognitiveScores, gameScores, flaggedConcerns);

      // Session summary
      const sessionsSummary = {
        totalSessions: 
          wordFormationData.sessions.length +
          letterTracingData.sessions.length +
          phonemeData.sessions.length +
          ebookData.sessions.length,
        activeGames: this.getActiveGames(gameScores),
        avgSessionDuration: this.calculateAvgSessionDuration({
          wordFormationData,
          letterTracingData,
          phonemeData,
          ebookData
        }),
        lastActivityDate: this.getLastActivityDate({
          wordFormationData,
          letterTracingData,
          phonemeData,
          ebookData
        })
      };

      return {
        overallCognitiveScore,
        cognitiveScores,
        gameScores,
        trends,
        flaggedConcerns,
        riskLevel,
        recommendations,
        sessionsSummary,
        assessmentPeriod: {
          startDate: dateQuery.startTime?.$gte || thirtyDaysAgo,
          endDate: dateQuery.startTime?.$lte || new Date()
        }
      };
    } catch (error) {
      console.error('Error generating assessment:', error);
      throw error;
    }
  }

  /**
   * Get Word Formation game data
   */
  static async getWordFormationData(studentId, dateQuery) {
    const sessions = await WordFormationSession.find({
      userId: studentId,
      status: 'completed',
      ...dateQuery
    }).sort({ startTime: -1 });

    const attempts = await WordFormationAttempt.find({
      userId: studentId,
      timestamp: dateQuery.startTime
    }).sort({ timestamp: -1 });

    return { sessions, attempts };
  }

  /**
   * Get Letter Tracing game data
   */
  static async getLetterTracingData(studentId, dateQuery) {
    const sessions = await LetterTracingSession.find({
      userId: studentId,
      status: 'completed',
      ...dateQuery
    }).sort({ startTime: -1 });

    const attempts = await LetterTracingAttempt.find({
      userId: studentId,
      timestamp: dateQuery.startTime
    }).sort({ timestamp: -1 });

    return { sessions, attempts };
  }

  /**
   * Get Phoneme game data
   */
  static async getPhonemeData(studentId, dateQuery) {
    const sessions = await PhonemeGameSession.find({
      userId: studentId,
      status: 'completed',
      ...dateQuery
    }).sort({ startTime: -1 });

    const answers = await PhonemeAnswer.find({
      userId: studentId,
      timestamp: dateQuery.startTime
    }).sort({ timestamp: -1 });

    return { sessions, answers };
  }

  /**
   * Get eBook reading data
   */
  static async getEbookData(studentId, dateQuery) {
    const sessions = await EbookSession.find({
      userId: studentId,
      status: 'completed',
      ...dateQuery
    }).sort({ startTime: -1 });

    const pageReads = await EbookPageRead.find({
      userId: studentId,
      timestamp: dateQuery.startTime
    }).sort({ timestamp: -1 });

    return { sessions, pageReads };
  }

  /**
   * Calculate Word Formation score and metrics
   */
  static calculateWordFormationScore(data) {
    if (!data.sessions.length) return null;

    const avgScore = data.sessions.reduce((sum, s) => sum + s.finalScore, 0) / data.sessions.length;
    const avgAccuracy = data.sessions.reduce((sum, s) => sum + s.accuracy, 0) / data.sessions.length;
    
    const totalTimeSpent = data.attempts.reduce((sum, a) => sum + a.timeSpent, 0);
    const avgTimePerWord = data.attempts.length > 0 ? totalTimeSpent / data.attempts.length : 0;

    const trend = this.calculateTrend(data.sessions.map(s => s.finalScore));

    return {
      averageScore: Math.round(avgScore * 10) / 10,
      averageAccuracy: Math.round(avgAccuracy * 10) / 10,
      averageTimePerWord: Math.round(avgTimePerWord * 10) / 10,
      totalAttempts: data.attempts.length,
      trend
    };
  }

  /**
   * Calculate Letter Tracing score and metrics
   */
  static calculateLetterTracingScore(data) {
    if (!data.sessions.length) return null;

    const avgAccuracy = data.sessions.reduce((sum, s) => sum + s.accuracy, 0) / data.sessions.length;
    const totalLetters = data.sessions.reduce((sum, s) => sum + s.lettersCompleted, 0);
    
    const totalTimeSpent = data.attempts.reduce((sum, a) => sum + a.timeSpent, 0);
    const avgTimePerLetter = data.attempts.length > 0 ? totalTimeSpent / data.attempts.length : 0;

    const trend = this.calculateTrend(data.sessions.map(s => s.accuracy));

    return {
      averageAccuracy: Math.round(avgAccuracy * 10) / 10,
      lettersCompleted: totalLetters,
      averageTimePerLetter: Math.round(avgTimePerLetter * 10) / 10,
      totalSessions: data.sessions.length,
      trend
    };
  }

  /**
   * Calculate Phoneme game score and metrics
   */
  static calculatePhonemeScore(data) {
    if (!data.sessions.length) return null;

    const avgScore = data.sessions.reduce((sum, s) => sum + s.finalScore, 0) / data.sessions.length;
    const avgAccuracy = data.sessions.reduce((sum, s) => sum + s.accuracy, 0) / data.sessions.length;
    const totalLevels = data.sessions.reduce((sum, s) => sum + s.levelsCompleted, 0);

    const trend = this.calculateTrend(data.sessions.map(s => s.finalScore));

    return {
      averageScore: Math.round(avgScore * 10) / 10,
      averageAccuracy: Math.round(avgAccuracy * 10) / 10,
      levelsCompleted: totalLevels,
      totalSessions: data.sessions.length,
      trend
    };
  }

  /**
   * Calculate eBook reading score and metrics
   */
  static calculateEbookScore(data) {
    if (!data.sessions.length) return null;

    const totalPages = data.pageReads.length;
    const storiesCompleted = data.sessions.filter(s => s.completed).length;
    
    const totalTimeSpent = data.pageReads.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
    const avgTimePerPage = totalPages > 0 ? totalTimeSpent / totalPages : 0;
    
    const readAloudCount = data.pageReads.filter(p => p.wasReadAloud).length;
    const readAloudUsage = totalPages > 0 ? (readAloudCount / totalPages) * 100 : 0;

    const trend = this.calculateTrend(data.sessions.map(s => s.pagesRead));

    return {
      pagesRead: totalPages,
      storiesCompleted,
      averageTimePerPage: Math.round(avgTimePerPage * 10) / 10,
      readAloudUsage: Math.round(readAloudUsage),
      trend
    };
  }

  /**
   * Calculate cognitive domain scores
   */
  static calculateCognitiveDomains(gameScores, rawData) {
    // Memory Score (based on phoneme game and ebook retention)
    const memoryScore = this.calculateMemoryScore(gameScores, rawData);
    
    // Attention Score (based on consistency and completion rates)
    const attentionScore = this.calculateAttentionScore(gameScores, rawData);
    
    // Reasoning Score (based on word formation and problem-solving)
    const reasoningScore = this.calculateReasoningScore(gameScores, rawData);
    
    // Accuracy Score (based on correctness across all games)
    const accuracyScore = this.calculateAccuracyScore(gameScores);
    
    // Speed Score (based on reaction times)
    const speedScore = this.calculateSpeedScore(gameScores);

    return {
      memory: this.scoreToGrade(memoryScore),
      attention: this.scoreToGrade(attentionScore),
      reasoning: this.scoreToGrade(reasoningScore),
      accuracy: this.scoreToGrade(accuracyScore),
      speed: this.scoreToGrade(speedScore)
    };
  }

  /**
   * Calculate memory score
   */
  static calculateMemoryScore(gameScores, rawData) {
    let score = 50; // Base score

    if (gameScores.phonemeGame) {
      score += (gameScores.phonemeGame.averageAccuracy / 100) * 30;
    }

    if (gameScores.letterTracing) {
      score += (gameScores.letterTracing.averageAccuracy / 100) * 20;
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate attention score
   */
  static calculateAttentionScore(gameScores, rawData) {
    let score = 50; // Base score

    // Completion rate boost
    const games = Object.values(gameScores).filter(g => g !== null);
    const activeGames = games.length;
    score += activeGames * 10;

    // Consistency boost
    if (gameScores.letterTracing && gameScores.letterTracing.averageAccuracy > 70) {
      score += 15;
    }

    if (gameScores.wordFormation && gameScores.wordFormation.averageAccuracy > 70) {
      score += 15;
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate reasoning score
   */
  static calculateReasoningScore(gameScores, rawData) {
    let score = 50; // Base score

    if (gameScores.wordFormation) {
      score += (gameScores.wordFormation.averageScore / 100) * 50;
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate accuracy score
   */
  static calculateAccuracyScore(gameScores) {
    const accuracies = [];
    
    if (gameScores.wordFormation) accuracies.push(gameScores.wordFormation.averageAccuracy);
    if (gameScores.letterTracing) accuracies.push(gameScores.letterTracing.averageAccuracy);
    if (gameScores.phonemeGame) accuracies.push(gameScores.phonemeGame.averageAccuracy);

    if (accuracies.length === 0) return 50;

    return accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
  }

  /**
   * Calculate speed score
   */
  static calculateSpeedScore(gameScores) {
    let score = 50; // Base score

    // Faster = higher score (inversely proportional)
    if (gameScores.wordFormation && gameScores.wordFormation.averageTimePerWord < 20) {
      score += 25;
    } else if (gameScores.wordFormation && gameScores.wordFormation.averageTimePerWord < 30) {
      score += 15;
    }

    if (gameScores.letterTracing && gameScores.letterTracing.averageTimePerLetter < 20) {
      score += 25;
    } else if (gameScores.letterTracing && gameScores.letterTracing.averageTimePerLetter < 30) {
      score += 15;
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Convert score to grade object
   */
  static scoreToGrade(score) {
    let interpretation = '';
    let percentile = 50;

    if (score >= 90) {
      interpretation = 'Excellent';
      percentile = 95;
    } else if (score >= 80) {
      interpretation = 'Very Good';
      percentile = 85;
    } else if (score >= 70) {
      interpretation = 'Good';
      percentile = 70;
    } else if (score >= 60) {
      interpretation = 'Fair';
      percentile = 55;
    } else if (score >= 50) {
      interpretation = 'Below Average';
      percentile = 40;
    } else {
      interpretation = 'Needs Support';
      percentile = 25;
    }

    return {
      score: Math.round(score * 10) / 10,
      percentile,
      interpretation
    };
  }

  /**
   * Calculate overall cognitive score
   */
  static calculateOverallScore(cognitiveScores) {
    const scores = [
      cognitiveScores.memory.score,
      cognitiveScores.attention.score,
      cognitiveScores.reasoning.score,
      cognitiveScores.accuracy.score,
      cognitiveScores.speed.score
    ];

    const average = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    return Math.round(average * 10) / 10;
  }

  /**
   * Calculate trend from array of values
   */
  static calculateTrend(values) {
    if (values.length < 2) return 'stable';

    const recent = values.slice(0, Math.ceil(values.length / 2));
    const older = values.slice(Math.ceil(values.length / 2));

    const recentAvg = recent.reduce((sum, v) => sum + v, 0) / recent.length;
    const olderAvg = older.reduce((sum, v) => sum + v, 0) / older.length;

    const change = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (change > 10) return 'improving';
    if (change < -10) return 'declining';
    return 'stable';
  }

  /**
   * Detect trends over time
   */
  static async detectTrends(studentId) {
    // Get recent assessments to compare
    const StudentAssessment = require('../models/StudentAssessment');
    
    const recentAssessments = await StudentAssessment.find({ studentId })
      .sort({ assessmentDate: -1 })
      .limit(5);

    if (recentAssessments.length < 2) {
      return {
        overall: 'stable',
        recentChange: 0,
        consistencyScore: 50
      };
    }

    const scores = recentAssessments.map(a => a.overallCognitiveScore);
    const trend = this.calculateTrend(scores);
    
    const latestScore = scores[0];
    const previousScore = scores[1];
    const recentChange = previousScore ? ((latestScore - previousScore) / previousScore) * 100 : 0;

    // Calculate consistency (lower variance = higher consistency)
    const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / scores.length;
    const consistencyScore = Math.max(0, 100 - variance);

    return {
      overall: trend,
      recentChange: Math.round(recentChange * 10) / 10,
      consistencyScore: Math.round(consistencyScore)
    };
  }

  /**
   * Detect concerns based on scores and trends
   */
  static detectConcerns(cognitiveScores, gameScores, trends) {
    const concerns = [];

    // Check cognitive domains
    Object.entries(cognitiveScores).forEach(([domain, data]) => {
      if (data.score < 50) {
        concerns.push({
          area: domain,
          description: `${domain.charAt(0).toUpperCase() + domain.slice(1)} score is below average`,
          severity: data.score < 30 ? 'high' : 'moderate',
          detectedAt: new Date()
        });
      }
    });

    // Check declining trends
    if (trends.overall === 'declining') {
      concerns.push({
        area: 'overall performance',
        description: 'Overall performance shows declining trend',
        severity: Math.abs(trends.recentChange) > 20 ? 'high' : 'moderate',
        detectedAt: new Date()
      });
    }

    // Check game-specific issues
    Object.entries(gameScores).forEach(([game, data]) => {
      if (data && data.trend === 'declining') {
        concerns.push({
          area: game,
          description: `${game} performance is declining`,
          severity: 'moderate',
          detectedAt: new Date()
        });
      }
    });

    return concerns;
  }

  /**
   * Calculate risk level
   */
  static calculateRiskLevel(overallScore, concerns, trends) {
    let riskScore = 0;

    // Score-based risk
    if (overallScore < 40) riskScore += 3;
    else if (overallScore < 60) riskScore += 2;
    else if (overallScore < 75) riskScore += 1;

    // Concerns-based risk
    const highSeverityConcerns = concerns.filter(c => c.severity === 'high').length;
    riskScore += highSeverityConcerns * 2;
    riskScore += concerns.length;

    // Trend-based risk
    if (trends.overall === 'declining') riskScore += 2;

    // Determine risk level
    if (riskScore >= 7) return 'critical';
    if (riskScore >= 5) return 'high';
    if (riskScore >= 3) return 'moderate';
    return 'low';
  }

  /**
   * Generate recommendations
   */
  static generateRecommendations(cognitiveScores, gameScores, concerns) {
    const recommendations = [];

    // Memory recommendations
    if (cognitiveScores.memory.score < 70) {
      recommendations.push({
        category: 'Memory Enhancement',
        recommendation: 'Increase phoneme game practice and memory-based exercises',
        priority: cognitiveScores.memory.score < 50 ? 'high' : 'medium'
      });
    }

    // Attention recommendations
    if (cognitiveScores.attention.score < 70) {
      recommendations.push({
        category: 'Attention Development',
        recommendation: 'Focus on completing full game sessions without breaks',
        priority: cognitiveScores.attention.score < 50 ? 'high' : 'medium'
      });
    }

    // Reasoning recommendations
    if (cognitiveScores.reasoning.score < 70) {
      recommendations.push({
        category: 'Problem Solving',
        recommendation: 'Practice word formation game at higher difficulty levels',
        priority: cognitiveScores.reasoning.score < 50 ? 'high' : 'medium'
      });
    }

    // Reading recommendations
    if (gameScores.ebook && gameScores.ebook.pagesRead < 10) {
      recommendations.push({
        category: 'Reading Practice',
        recommendation: 'Increase daily reading time with eBook reader',
        priority: 'medium'
      });
    }

    // High-priority concerns
    const highConcerns = concerns.filter(c => c.severity === 'high');
    if (highConcerns.length > 0) {
      recommendations.push({
        category: 'Immediate Intervention',
        recommendation: 'Schedule one-on-one session to address identified concerns',
        priority: 'urgent'
      });
    }

    return recommendations;
  }

  /**
   * Get active games
   */
  static getActiveGames(gameScores) {
    return Object.keys(gameScores).filter(game => gameScores[game] !== null);
  }

  /**
   * Calculate average session duration
   */
  static calculateAvgSessionDuration(data) {
    let totalDuration = 0;
    let count = 0;

    // Word Formation
    if (data.wordFormationData.sessions.length > 0) {
      data.wordFormationData.sessions.forEach(session => {
        if (session.endTime && session.startTime) {
          totalDuration += (new Date(session.endTime) - new Date(session.startTime)) / 1000 / 60; // minutes
          count++;
        }
      });
    }

    // Letter Tracing
    if (data.letterTracingData.sessions.length > 0) {
      data.letterTracingData.sessions.forEach(session => {
        if (session.endTime && session.startTime) {
          totalDuration += (new Date(session.endTime) - new Date(session.startTime)) / 1000 / 60;
          count++;
        }
      });
    }

    // Phoneme
    if (data.phonemeData.sessions.length > 0) {
      data.phonemeData.sessions.forEach(session => {
        if (session.duration) {
          totalDuration += session.duration / 60;
          count++;
        }
      });
    }

    // Ebook
    if (data.ebookData.sessions.length > 0) {
      data.ebookData.sessions.forEach(session => {
        if (session.totalTimeSpent) {
          totalDuration += session.totalTimeSpent / 60;
          count++;
        }
      });
    }

    return count > 0 ? Math.round((totalDuration / count) * 10) / 10 : 0;
  }

  /**
   * Get last activity date
   */
  static getLastActivityDate(data) {
    const dates = [];

    data.wordFormationData.sessions.forEach(s => dates.push(new Date(s.startTime)));
    data.letterTracingData.sessions.forEach(s => dates.push(new Date(s.startTime)));
    data.phonemeData.sessions.forEach(s => dates.push(new Date(s.startTime)));
    data.ebookData.sessions.forEach(s => dates.push(new Date(s.startTime)));

    return dates.length > 0 ? new Date(Math.max(...dates)) : null;
  }
}

module.exports = AssessmentEngine;
