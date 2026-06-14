// models/StudentProgress.model.js
// Aggregated student progress tracking across all games and activities

const mongoose = require('mongoose');

const gameProgressSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true
  },
  gameName: {
    type: String,
    required: true
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  totalTimePlayed: {
    type: Number, // in seconds
    default: 0
  },
  highScore: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  averageAccuracy: {
    type: Number,
    default: 0
  },
  levelsCompleted: {
    type: Number,
    default: 0
  },
  lastPlayedAt: {
    type: Date
  },
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
});

const skillProgressSchema = new mongoose.Schema({
  skillName: {
    type: String,
    required: true
  },
  currentLevel: {
    type: Number,
    default: 1
  },
  experiencePoints: {
    type: Number,
    default: 0
  },
  maxLevel: {
    type: Number,
    default: 10
  }
});

const weeklyStatsSchema = new mongoose.Schema({
  weekStart: {
    type: Date,
    required: true
  },
  totalTimeSpent: {
    type: Number,
    default: 0
  },
  gamesPlayed: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  averageAccuracy: {
    type: Number,
    default: 0
  },
  booksRead: {
    type: Number,
    default: 0
  }
});

const studentProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },

  // Overall Stats
  overallStats: {
    totalGamesPlayed: { type: Number, default: 0 },
    totalTimePlayed: { type: Number, default: 0 }, // in seconds
    totalScore: { type: Number, default: 0 },
    averageAccuracy: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveAt: { type: Date },
    totalBooksRead: { type: Number, default: 0 },
    totalPagesRead: { type: Number, default: 0 },
    totalBlogsRead: { type: Number, default: 0 }
  },

  // Per-Game Progress
  gameProgress: [gameProgressSchema],

  // Skill-wise Progress
  skills: {
    cognitive: skillProgressSchema,
    language: skillProgressSchema,
    math: skillProgressSchema,
    memory: skillProgressSchema,
    reading: skillProgressSchema,
    motorSkills: skillProgressSchema
  },

  // Learning Level
  learningLevel: {
    current: { type: Number, default: 1, min: 1, max: 50 },
    experiencePoints: { type: Number, default: 0 },
    pointsToNextLevel: { type: Number, default: 100 }
  },

  // Weekly Statistics (last 12 weeks)
  weeklyStats: [weeklyStatsSchema],

  // Achievements Earned
  achievementsEarned: [{
    achievementId: String,
    name: String,
    description: String,
    icon: String,
    earnedAt: { type: Date, default: Date.now },
    category: {
      type: String,
      enum: ['games', 'reading', 'streak', 'progress', 'special']
    }
  }],

  // Badges Earned
  badges: [{
    badgeId: String,
    name: String,
    description: String,
    icon: String,
    tier: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum']
    },
    earnedAt: { type: Date, default: Date.now }
  }],

  // Recent Activity (last 50 activities)
  recentActivity: [{
    type: {
      type: String,
      enum: ['game_completed', 'level_up', 'achievement', 'badge', 'book_read', 'blog_read']
    },
    title: String,
    description: String,
    metadata: mongoose.Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now }
  }]

}, {
  timestamps: true
});

// Indexes
studentProgressSchema.index({ 'overallStats.totalScore': -1 });
studentProgressSchema.index({ 'learningLevel.current': -1 });
studentProgressSchema.index({ 'overallStats.lastActiveAt': -1 });

// Initialize skills with default values
studentProgressSchema.pre('save', function(next) {
  const defaultSkill = {
    currentLevel: 1,
    experiencePoints: 0,
    maxLevel: 10
  };

  const skillTypes = ['cognitive', 'language', 'math', 'memory', 'reading', 'motorSkills'];
  skillTypes.forEach(skill => {
    if (!this.skills[skill]) {
      this.skills[skill] = { ...defaultSkill, skillName: skill };
    }
    if (!this.skills[skill].skillName) {
      this.skills[skill].skillName = skill;
    }
  });

  next();
});

// Method to add XP and handle level ups
studentProgressSchema.methods.addExperience = async function(xp, skillName = null) {
  this.learningLevel.experiencePoints += xp;
  
  // Check for level up
  while (this.learningLevel.experiencePoints >= this.learningLevel.pointsToNextLevel) {
    this.learningLevel.experiencePoints -= this.learningLevel.pointsToNextLevel;
    this.learningLevel.current += 1;
    this.learningLevel.pointsToNextLevel = Math.floor(this.learningLevel.pointsToNextLevel * 1.2);
    
    // Add level up activity
    this.recentActivity.unshift({
      type: 'level_up',
      title: 'Level Up!',
      description: `Reached level ${this.learningLevel.current}`,
      timestamp: new Date()
    });
  }

  // Update skill if specified
  if (skillName && this.skills[skillName]) {
    this.skills[skillName].experiencePoints += xp;
    const skillXpNeeded = this.skills[skillName].currentLevel * 100;
    
    if (this.skills[skillName].experiencePoints >= skillXpNeeded && 
        this.skills[skillName].currentLevel < this.skills[skillName].maxLevel) {
      this.skills[skillName].experiencePoints -= skillXpNeeded;
      this.skills[skillName].currentLevel += 1;
    }
  }

  // Keep only last 50 activities
  if (this.recentActivity.length > 50) {
    this.recentActivity = this.recentActivity.slice(0, 50);
  }

  await this.save();
  return this;
};

// Method to record game session
studentProgressSchema.methods.recordGameSession = async function(gameData) {
  const { gameId, gameName, score, accuracy, timePlayed, completed, skillType } = gameData;

  // Update overall stats
  this.overallStats.totalGamesPlayed += 1;
  this.overallStats.totalTimePlayed += timePlayed || 0;
  this.overallStats.totalScore += score || 0;
  this.overallStats.lastActiveAt = new Date();

  // Calculate running average accuracy
  const totalGames = this.overallStats.totalGamesPlayed;
  this.overallStats.averageAccuracy = Math.round(
    ((this.overallStats.averageAccuracy * (totalGames - 1)) + (accuracy || 0)) / totalGames
  );

  // Update game-specific progress
  let gameProgress = this.gameProgress.find(g => g.gameId === gameId);
  if (!gameProgress) {
    gameProgress = {
      gameId,
      gameName,
      totalSessions: 0,
      totalTimePlayed: 0,
      highScore: 0,
      averageScore: 0,
      averageAccuracy: 0,
      levelsCompleted: 0
    };
    this.gameProgress.push(gameProgress);
    gameProgress = this.gameProgress[this.gameProgress.length - 1];
  }

  gameProgress.totalSessions += 1;
  gameProgress.totalTimePlayed += timePlayed || 0;
  gameProgress.lastPlayedAt = new Date();
  
  if (score > gameProgress.highScore) {
    gameProgress.highScore = score;
  }
  
  gameProgress.averageScore = Math.round(
    ((gameProgress.averageScore * (gameProgress.totalSessions - 1)) + score) / gameProgress.totalSessions
  );
  
  gameProgress.averageAccuracy = Math.round(
    ((gameProgress.averageAccuracy * (gameProgress.totalSessions - 1)) + (accuracy || 0)) / gameProgress.totalSessions
  );

  if (completed) {
    gameProgress.levelsCompleted += 1;
  }

  // Add activity
  this.recentActivity.unshift({
    type: 'game_completed',
    title: `Played ${gameName}`,
    description: `Score: ${score}, Accuracy: ${accuracy}%`,
    metadata: { gameId, score, accuracy },
    timestamp: new Date()
  });

  // Add XP based on performance
  const xpEarned = Math.floor((score / 10) + (accuracy / 2));
  await this.addExperience(xpEarned, skillType);

  return this;
};

// Method to add achievement
studentProgressSchema.methods.addAchievement = async function(achievement) {
  const exists = this.achievementsEarned.find(a => a.achievementId === achievement.achievementId);
  if (!exists) {
    this.achievementsEarned.push({
      ...achievement,
      earnedAt: new Date()
    });

    this.recentActivity.unshift({
      type: 'achievement',
      title: 'Achievement Unlocked!',
      description: achievement.name,
      metadata: achievement,
      timestamp: new Date()
    });

    await this.save();
  }
  return this;
};

// Static method to get or create progress
studentProgressSchema.statics.getOrCreateProgress = async function(userId) {
  let progress = await this.findOne({ userId });
  if (!progress) {
    progress = new this({ userId });
    await progress.save();
  }
  return progress;
};

// Static method to get leaderboard
studentProgressSchema.statics.getLeaderboard = async function(limit = 10) {
  return this.find()
    .sort({ 'overallStats.totalScore': -1 })
    .limit(limit)
    .populate('userId', 'firstName lastName username')
    .lean();
};

const StudentProgress = mongoose.model('StudentProgress', studentProgressSchema);

module.exports = StudentProgress;
