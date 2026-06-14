// scripts/seedGames.js
// Run this script to seed initial game configurations
// Usage: node scripts/seedGames.js

const mongoose = require('mongoose');
require('dotenv').config();

// Define schema inline for standalone script
const gameConfigSchema = new mongoose.Schema({
  gameId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  displayName: { type: String, required: true },
  description: String,
  shortDescription: String,
  category: { type: String, default: 'cognitive' },
  icon: { type: String, default: 'gamepad' },
  enabled: { type: Boolean, default: true },
  supportedLanguages: [{ type: String, default: ['en'] }],
  defaultLanguage: { type: String, default: 'en' },
  difficultyLevels: {
    easy: { enabled: { type: Boolean, default: true } },
    medium: { enabled: { type: Boolean, default: true } },
    hard: { enabled: { type: Boolean, default: true } }
  },
  ageGroups: [{ type: String }],
  cognitiveAreas: [String],
  settings: mongoose.Schema.Types.Mixed,
  analytics: {
    totalPlays: { type: Number, default: 0 },
    completions: { type: Number, default: 0 },
    avgSessionDuration: { type: Number, default: 0 },
    avgScore: { type: Number, default: 0 }
  },
  order: { type: Number, default: 0 },
  routePath: { type: String, required: true },
  apiEndpoint: String
}, { timestamps: true });

const GameConfig = mongoose.model('GameConfig', gameConfigSchema);

// Games to seed
const games = [
  {
    gameId: 'math-quest',
    name: 'MathQuest',
    displayName: 'Math Quest',
    description: 'An engaging math game designed to help students practice arithmetic operations including addition, subtraction, multiplication, and division.',
    shortDescription: 'Practice arithmetic with fun challenges',
    category: 'math',
    icon: 'calculator',
    enabled: true,
    supportedLanguages: ['en', 'ur'],
    ageGroups: ['7-9', '10-12', '13-15'],
    cognitiveAreas: ['problem-solving', 'attention'],
    order: 1,
    routePath: '/games/mathquest',
    apiEndpoint: '/api/mathquest'
  },
  {
    gameId: 'phoneme-game',
    name: 'PhonemeGame',
    displayName: 'Phoneme Game',
    description: 'A phonics-based game to help students recognize and distinguish between different sounds in words, improving reading skills.',
    shortDescription: 'Learn phonics through sound recognition',
    category: 'language',
    icon: 'volume-2',
    enabled: true,
    supportedLanguages: ['en'],
    ageGroups: ['4-6', '7-9'],
    cognitiveAreas: ['verbal', 'memory'],
    order: 2,
    routePath: '/games/phoneme',
    apiEndpoint: '/api/phoneme-game'
  },
  {
    gameId: 'letter-tracing',
    name: 'LetterTracing',
    displayName: 'Letter Tracing',
    description: 'An interactive letter tracing game designed to help students learn letter formation and improve handwriting skills.',
    shortDescription: 'Practice letter formation and handwriting',
    category: 'motor-skills',
    icon: 'edit-2',
    enabled: true,
    supportedLanguages: ['en', 'ur'],
    ageGroups: ['4-6', '7-9'],
    cognitiveAreas: ['motor', 'visual', 'memory'],
    order: 3,
    routePath: '/games/letter-tracing',
    apiEndpoint: '/api/letter-tracing'
  },
  {
    gameId: 'word-formation',
    name: 'WordFormation',
    displayName: 'Word Formation',
    description: 'A vocabulary building game where students unscramble letters to form words, enhancing spelling and word recognition skills.',
    shortDescription: 'Build vocabulary by forming words',
    category: 'language',
    icon: 'type',
    enabled: true,
    supportedLanguages: ['en'],
    ageGroups: ['7-9', '10-12'],
    cognitiveAreas: ['verbal', 'problem-solving'],
    order: 4,
    routePath: '/games/word-formation',
    apiEndpoint: '/api/word-formation'
  }
];

async function seedGames() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/learnbridge');
    console.log('Connected successfully!');

    console.log('\nSeeding games...');
    
    for (const game of games) {
      const existingGame = await GameConfig.findOne({ gameId: game.gameId });
      
      if (existingGame) {
        console.log(`  ⚠️  Game "${game.displayName}" already exists, skipping...`);
      } else {
        await GameConfig.create(game);
        console.log(`  ✅ Created game: ${game.displayName}`);
      }
    }

    console.log('\n✅ Seeding complete!');
    
    const count = await GameConfig.countDocuments();
    console.log(`Total games in database: ${count}`);

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    
  } catch (error) {
    console.error('Error seeding games:', error);
    process.exit(1);
  }
}

seedGames();
