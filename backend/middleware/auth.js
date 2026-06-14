// // import jwt from 'jsonwebtoken';
// // import asyncHandler from 'express-async-handler';
// // import User from '../models/User.js';
// // import Psychologist from '../models/Psychologist.js';

// // // Enhanced protect middleware with token refresh checking
// // const protect = asyncHandler(async (req, res, next) => {
// //   let token;
  
// //   // 1. Check for token in headers
// //   if (req.headers.authorization?.startsWith('Bearer')) {
// //     token = req.headers.authorization.split(' ')[1];
// //   } else if (req.cookies?.jwt) {
// //     token = req.cookies.jwt;
// //   }

// //   if (!token) {
// //     res.status(401);
// //     throw new Error('Not authorized, no token provided');
// //   }

// //   try {
// //     // 2. Verify token
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
// //     // 3. Get user and check if still exists
// //     const currentUser = await User.findById(decoded.id).select('-password');
// //     if (!currentUser) {
// //       res.status(401);
// //       throw new Error('User belonging to this token no longer exists');
// //     }

// //     // 4. Check if user changed password after token was issued
// //     if (currentUser.changedPasswordAfter(decoded.iat)) {
// //       res.status(401);
// //       throw new Error('Password was changed recently. Please log in again.');
// //     }

// //     // 5. Attach user to request
// //     req.user = currentUser;
    
// //     // 6. For psychologists, attach profile data
// //     if (currentUser.role === 'psychologist') {
// //       const psychologistProfile = await Psychologist.findOne({ user: currentUser._id });
// //       req.psychologist = psychologistProfile;
// //     }

// //     next();
// //   } catch (error) {
// //     console.error('Authentication Error:', error.message);
    
// //     // Handle specific JWT errors
// //     if (error.name === 'TokenExpiredError') {
// //       res.status(401).json({
// //         success: false,
// //         message: 'Session expired. Please log in again.',
// //         code: 'TOKEN_EXPIRED'
// //       });
// //     } else if (error.name === 'JsonWebTokenError') {
// //       res.status(401).json({
// //         success: false,
// //         message: 'Invalid token. Please log in again.',
// //         code: 'INVALID_TOKEN'
// //       });
// //     } else {
// //       res.status(401).json({
// //         success: false,
// //         message: 'Not authorized',
// //         code: 'AUTH_ERROR'
// //       });
// //     }
// //   }
// // });

// // // Enhanced role-based middleware with additional checks
// // const psychologist = asyncHandler(async (req, res, next) => {
// //   if (!req.user || req.user.role !== 'psychologist') {
// //     res.status(403);
// //     throw new Error('Not authorized as a psychologist');
// //   }

// //   // Additional verification for psychologist-specific routes
// //   if (!req.psychologist) {
// //     const psychologistProfile = await Psychologist.findOne({ user: req.user._id });
// //     if (!psychologistProfile) {
// //       res.status(403);
// //       throw new Error('Complete your psychologist profile to access this resource');
// //     }
// //     req.psychologist = psychologistProfile;
// //   }

// //   next();
// // });

// // // Admin middleware with additional privileges check
// // const admin = asyncHandler(async (req, res, next) => {
// //   if (!req.user || req.user.role !== 'admin') {
// //     res.status(403);
// //     throw new Error('Not authorized as an admin');
// //   }

// //   // Verify admin privileges are still active
// //   if (req.user.isSuspended) {
// //     res.status(403);
// //     throw new Error('Admin account suspended');
// //   }

// //   next();
// // });

// // // New: Resource ownership middleware
// // const checkOwnership = (model) => asyncHandler(async (req, res, next) => {
// //   const resource = await model.findById(req.params.id);
  
// //   if (!resource) {
// //     res.status(404);
// //     throw new Error('Resource not found');
// //   }

// //   // Check if user owns the resource or is admin
// //   if (resource.user.toString() !== req.user.id && req.user.role !== 'admin') {
// //     res.status(403);
// //     throw new Error('Not authorized to access this resource');
// //   }

// //   req.resource = resource;
// //   next();
// // });

// // // New: Optional authentication for public/private routes
// // const optionalAuth = asyncHandler(async (req, res, next) => {
// //   if (req.headers.authorization?.startsWith('Bearer')) {
// //     try {
// //       const token = req.headers.authorization.split(' ')[1];
// //       const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //       req.user = await User.findById(decoded.id).select('-password');
// //     } catch (error) {
// //       // Silently fail for optional auth
// //       console.log('Optional auth failed:', error.message);
// //     }
// //   }
// //   next();
// // });

// // export { 
// //   protect, 
// //   psychologist, 
// //   admin, 
// //   checkOwnership,
// //   optionalAuth
// // };








// const jwt = require('jsonwebtoken');
// const Admin = require('../models/Admin');
// const ErrorResponse = require('../utils/errorResponse');

// exports.protect = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     token = req.headers.authorization.split(' ')[1];
//   }

//   if (!token) {
//     return next(new ErrorResponse('Not authorized to access this route', 401));
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.admin = await Admin.findById(decoded.id);
//     next();
//   } catch (err) {
//     return next(new ErrorResponse('Not authorized to access this route', 401));
//   }
// };

// exports.authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.admin.role)) {
//       return next(
//         new ErrorResponse(
//           `Role ${req.admin.role} is not authorized to access this route`,
//           403
//         )
//       );
//     }
//     next();
//   };
// };







// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// // Verify JWT token
// const authenticateToken = async (req, res, next) => {
//   try {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: 'Access token is required'
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
//     // Check if user still exists
//     const user = await User.findById(decoded.userId);
//     if (!user || !user.isActive) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid token or user not found'
//       });
//     }

//     req.user = {
//       userId: user._id,
//       username: user.username,
//       email: user.email,
//       role: user.role,
//       firstName: user.firstName,
//       lastName: user.lastName
//     };
    
//     next();
//   } catch (error) {
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({
//         success: false,
//         message: 'Token has expired'
//       });
//     }
    
//     return res.status(403).json({
//       success: false,
//       message: 'Invalid token'
//     });
//   }
// };

// // Role-based authorization middleware
// const authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Authentication required'
//       });
//     }

//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         success: false,
//         message: `Access denied. Required roles: ${roles.join(', ')}`
//       });
//     }

//     next();
//   };
// };

// // Admin only middleware
// const adminOnly = (req, res, next) => {
//   return authorizeRoles('Admin')(req, res, next);
// };

// // Psychologist or Admin middleware
// const psychologistOrAdmin = (req, res, next) => {
//   return authorizeRoles('Psychologist', 'Admin')(req, res, next);
// };

// // Student, Psychologist or Admin middleware
// const authenticatedUser = (req, res, next) => {
//   return authorizeRoles('Student', 'Psychologist', 'Admin')(req, res, next);
// };

// module.exports = {
//   authenticateToken,
//   authorizeRoles,
//   adminOnly,
//   psychologistOrAdmin,
//   authenticatedUser
// };
































// middleware/auth.js
// Authentication and Authorization Middleware for LearnBridge
// Updated with aliases for psychologist module compatibility

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Also check cookies for token
    const cookieToken = req.cookies?.token;
    const finalToken = token || cookieToken;

    if (!finalToken) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const decoded = jwt.verify(finalToken, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if user still exists
    const user = await User.findById(decoded.userId || decoded.id || decoded._id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    // Attach full user object for psychologist module compatibility
    // Keep backward compatibility with existing code
    req.user = {
      _id: user._id,           // Added for psychologist module
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }
    
    return res.status(403).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Role-based authorization middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  return authorizeRoles('Admin')(req, res, next);
};

// Psychologist or Admin middleware
const psychologistOrAdmin = (req, res, next) => {
  return authorizeRoles('Psychologist', 'Admin')(req, res, next);
};

// Student, Psychologist or Admin middleware
const authenticatedUser = (req, res, next) => {
  return authorizeRoles('Student', 'Psychologist', 'Admin')(req, res, next);
};

// ============================================
// ALIASES FOR PSYCHOLOGIST MODULE ROUTES
// ============================================

/**
 * protect - Alias for authenticateToken
 * Used by psychologist module routes
 */
const protect = authenticateToken;

/**
 * authorize - Alias for authorizeRoles
 * Used by psychologist module routes
 */
const authorize = authorizeRoles;

/**
 * optionalAuth - Optional authentication
 * Attaches user to request if token is valid, but doesn't require it
 * Used for public routes that behave differently for logged-in users
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const cookieToken = req.cookies?.token;
    const finalToken = token || cookieToken;

    if (finalToken) {
      try {
        const decoded = jwt.verify(finalToken, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId || decoded.id || decoded._id);
        
        if (user && user.isActive) {
          req.user = {
            _id: user._id,
            userId: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
          };
        }
      } catch (error) {
        // Token invalid, but that's okay for optional auth
        // Just continue without user
      }
    }

    next();
  } catch (error) {
    // On any error, just continue without user
    next();
  }
};

module.exports = {
  // Original exports (for backward compatibility)
  authenticateToken,
  authorizeRoles,
  adminOnly,
  psychologistOrAdmin,
  authenticatedUser,
  
  // Aliases for psychologist module routes
  protect,
  authorize,
  optionalAuth
};