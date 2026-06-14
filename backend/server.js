// server.js
// LearnBridge Dyslexia Platform - Main Server File
// Updated with Psychologist Module Integration, File Uploads, Admin Module & Student Module

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

// ============================================
// IMPORT EXISTING ROUTES
// ============================================
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const mathquestRoutes = require('./routes/mathquest');
const phonemeGameRoutes = require('./routes/phoneme-game');
const letterTracingRoutes = require('./routes/letter-tracing');
const wordFormationRoutes = require('./routes/word-formation');
const ebookRoutes = require('./routes/ebook');

// ============================================
// IMPORT PSYCHOLOGIST MODULE ROUTES
// ============================================
const psychologistRoutes = require('./routes/psychologist');
const assessmentRoutes = require('./routes/assessment');
const blogRoutes = require('./routes/blog');
const resourceRoutes = require('./routes/resource');

// ============================================
// IMPORT ADMIN MODULE ROUTES
// ============================================
const adminRoutes = require('./routes/admin.routes');

// ============================================
// IMPORT STUDENT MODULE ROUTES (NEW)
// ============================================
const studentRoutes = require('./routes/student.routes');

const app = express();

// ============================================
// CREATE UPLOAD DIRECTORIES
// ============================================
const uploadDirs = [
  'public/uploads',
  'public/uploads/blogs',
  'public/uploads/resources',
  'public/uploads/profiles',
  'public/uploads/temp',
  'public/uploads/admin'
];

uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// ============================================
// MULTER CONFIGURATION FOR FILE UPLOADS
// ============================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'public/uploads/temp';
    
    // Determine upload path based on route
    if (req.baseUrl.includes('blogs')) {
      uploadPath = 'public/uploads/blogs';
    } else if (req.baseUrl.includes('resources')) {
      uploadPath = 'public/uploads/resources';
    } else if (req.baseUrl.includes('profile') || req.baseUrl.includes('psychologist')) {
      uploadPath = 'public/uploads/profiles';
    } else if (req.baseUrl.includes('admin')) {
      uploadPath = 'public/uploads/admin';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '-');
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
  
  const allAllowed = [...allowedImageTypes, ...allowedDocTypes, ...allowedVideoTypes, ...allowedAudioTypes];
  
  if (allAllowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

// Create multer upload instances
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
    files: 5 // Max 5 files
  }
});

// Export upload middleware for routes
app.locals.upload = upload;

// ============================================
// SECURITY MIDDLEWARE
// ============================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
    },
  },
}));

// Rate limiting - General API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: { 
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Rate limiting - Stricter for Admin Routes
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { 
    success: false,
    message: 'Too many admin requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Serve static files from public directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ============================================
// DATABASE CONNECTION
// ============================================
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/learnbridge', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
    console.log(`📦 Database: ${conn.connection.name}`);
    console.log(`🔗 Host: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

connectDB();

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

// ============================================
// HEALTH CHECK ROUTES
// ============================================
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime()
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true,
    status: 'OK',
    message: 'LearnBridge API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    features: {
      fileUpload: true,
      maxFileSize: '50MB',
      adminModule: true,
      studentModule: true
    },
    routes: {
      core: ['/api/auth/*', '/api/user/*'],
      games: ['/api/mathquest/*', '/api/phoneme-game/*', '/api/letter-tracing/*', '/api/word-formation/*'],
      content: ['/api/ebook/*'],
      psychologist: ['/api/psychologist/*', '/api/assessments/*', '/api/blogs/*', '/api/resources/*'],
      admin: ['/api/admin/*'],
      student: ['/api/student/*']
    }
  });
});

// ============================================
// EXISTING ROUTES
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Game Routes
app.use('/api/mathquest', mathquestRoutes);
app.use('/api/phoneme-game', phonemeGameRoutes);
app.use('/api/letter-tracing', letterTracingRoutes);
app.use('/api/word-formation', wordFormationRoutes);

// eBook Routes
app.use('/api/ebook', ebookRoutes);

// ============================================
// PSYCHOLOGIST MODULE ROUTES
// ============================================
// Psychologist Dashboard, Students & Profile
app.use('/api/psychologist', psychologistRoutes);

// Student Assessments
app.use('/api/assessments', assessmentRoutes);

// Blog CMS (for psychologists)
app.use('/api/blogs', blogRoutes);

// Educational Resources
app.use('/api/resources', resourceRoutes);

// ============================================
// ADMIN MODULE ROUTES
// ============================================
// Admin Dashboard, User Management, Game Control, Content Moderation, Analytics, Settings, Audit Logs
app.use('/api/admin', adminLimiter, adminRoutes);

// ============================================
// STUDENT MODULE ROUTES (NEW)
// ============================================
// Student Dashboard, Profile, Games Hub, Progress, Blogs, E-books, Notifications, Preferences, Parent View
app.use('/api/student', studentRoutes);

// ============================================
// FILE UPLOAD ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 50MB.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 5 files.'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
  }
  next(err);
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `Duplicate value for field: ${field}`
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }
  
  // Default error response
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ============================================
// 404 HANDLER
// ============================================
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.originalUrl} not found`,
    suggestion: 'Check /api/health for available routes'
  });
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(false, () => {
    console.log('📦 MongoDB connection closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  mongoose.connection.close(false, () => {
    console.log('📦 MongoDB connection closed.');
    process.exit(0);
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n--- LearnBridge Server Started ---');
  console.log(`Port: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`URL: http://localhost:${PORT}`);

  console.log('\nAvailable Routes:');

  console.log('\nAuthentication:');
  console.log('  /api/auth/*');

  console.log('\nUser Management:');
  console.log('  /api/user/*');

  console.log('\nGames:');
  console.log('  /api/mathquest/*');
  console.log('  /api/phoneme-game/*');
  console.log('  /api/letter-tracing/*');
  console.log('  /api/word-formation/*');

  console.log('\neBook:');
  console.log('  /api/ebook/*');

  console.log('\nPsychologist Module:');
  console.log('  /api/psychologist/*');
  console.log('  /api/assessments/*');
  console.log('  /api/blogs/*');
  console.log('  /api/resources/*');

  console.log('\nAdmin Module (/api/admin):');
  console.log('  GET    /dashboard/summary');
  console.log('  GET    /users');
  console.log('  POST   /users');
  console.log('  GET    /users/:id');
  console.log('  PUT    /users/:id');
  console.log('  DELETE /users/:id');
  console.log('  PATCH  /users/:id/status');
  console.log('  PATCH  /users/:id/role');
  console.log('  GET    /psychologists/pending');
  console.log('  POST   /psychologists/:id/verify');
  console.log('  GET    /games');
  console.log('  PUT    /games/:id');
  console.log('  PATCH  /games/:id/toggle');
  console.log('  DELETE /games/:id');
  console.log('  GET    /blogs');
  console.log('  PATCH  /blogs/:id/status');
  console.log('  GET    /analytics/overview');
  console.log('  GET    /settings');
  console.log('  PUT    /settings');
  console.log('  GET    /logs');

  console.log('\n🎓 Student Module (/api/student):');
  console.log('  GET    /dashboard              - Get student dashboard data');
  console.log('  GET    /profile                - Get student profile');
  console.log('  PUT    /profile                - Update student profile');
  console.log('  GET    /games                  - Get all available games');
  console.log('  GET    /games/:gameId          - Get single game details');
  console.log('  POST   /games/:gameId/session  - Record game session');
  console.log('  GET    /progress               - Get progress & analytics');
  console.log('  GET    /blogs                  - Get published blogs');
  console.log('  GET    /blogs/:id              - Get single blog');
  console.log('  POST   /blogs/:id/like         - Like/unlike a blog');
  console.log('  GET    /ebooks                 - Get available e-books');
  console.log('  GET    /notifications          - Get notifications');
  console.log('  PUT    /notifications/:id/read - Mark notification read');
  console.log('  PUT    /notifications/read-all - Mark all notifications read');
  console.log('  GET    /preferences            - Get student preferences');
  console.log('  PUT    /preferences            - Update preferences');
  console.log('  POST   /preferences/reset      - Reset to defaults');
  console.log('  GET    /parent-view            - Get parent dashboard data');

  console.log('\nFile Uploads: Enabled (50MB max)');
  console.log('----------------------------------\n');
});

module.exports = app;