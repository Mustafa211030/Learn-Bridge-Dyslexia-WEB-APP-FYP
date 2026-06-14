// // routes/blog.js
// // Routes for blog management with file upload support

// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const BlogController = require('../controllers/BlogController');
// const { protect, authorize, optionalAuth } = require('../middleware/auth');

// // ============================================
// // ENSURE UPLOAD DIRECTORY EXISTS
// // ============================================
// const uploadDir = path.join(__dirname, '../public/uploads/blogs');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
//   console.log('📁 Created blogs upload directory');
// }

// // ============================================
// // MULTER CONFIGURATION FOR BLOG IMAGES
// // ============================================
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname).toLowerCase();
//     const name = path.basename(file.originalname, ext)
//       .toLowerCase()
//       .replace(/[^a-z0-9]/g, '-')
//       .substring(0, 30);
//     cb(null, `blog-${name}-${uniqueSuffix}${ext}`);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024 // 5MB max
//   }
// });

// // ============================================
// // MIDDLEWARE TO PROCESS REQUEST BODY
// // ============================================
// const processFormData = (req, res, next) => {
//   console.log('📥 Processing form data...');
//   console.log('Body:', req.body);
//   console.log('File:', req.file);

//   // Process uploaded file
//   if (req.file) {
//     const baseUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;
//     req.body.featuredImage = {
//       url: `${baseUrl}/uploads/blogs/${req.file.filename}`,
//       filename: req.file.filename,
//       alt: req.body.title || 'Blog image'
//     };
//   }
  
//   // Parse tags if it's a string
//   if (req.body.tags && typeof req.body.tags === 'string') {
//     try {
//       req.body.tags = JSON.parse(req.body.tags);
//     } catch (e) {
//       req.body.tags = req.body.tags.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean);
//     }
//   }
  
//   // Parse boolean fields
//   if (req.body.allowComments !== undefined) {
//     req.body.allowComments = req.body.allowComments === 'true' || req.body.allowComments === true;
//   }
//   if (req.body.isFeatured !== undefined) {
//     req.body.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;
//   }
  
//   next();
// };

// // ============================================
// // PUBLIC ROUTES (No authentication required)
// // ============================================

// // Get published blogs
// router.get('/published', BlogController.getPublishedBlogs);

// // Get featured blogs
// router.get('/featured', BlogController.getFeaturedBlogs);

// // Get blog categories
// router.get('/categories', BlogController.getCategories);

// // Get blog by slug (with optional auth for tracking)
// router.get('/slug/:slug', optionalAuth, BlogController.getBlogBySlug);

// // ============================================
// // PROTECTED ROUTES (Any authenticated user)
// // ============================================

// // Toggle like on a blog
// router.post('/:id/like', protect, BlogController.toggleLike);

// // Add comment to a blog
// router.post('/:id/comment', protect, BlogController.addComment);

// // ============================================
// // PSYCHOLOGIST-ONLY ROUTES
// // ============================================

// // Get all blogs for the authenticated psychologist
// router.get(
//   '/psychologist/my-blogs',
//   protect,
//   authorize('Psychologist'),
//   BlogController.getMyBlogs
// );

// // Get single blog by ID (for editing)
// router.get(
//   '/psychologist/:id',
//   protect,
//   authorize('Psychologist'),
//   BlogController.getBlogById
// );

// // Create new blog post
// router.post(
//   '/',
//   protect,
//   authorize('Psychologist'),
//   upload.single('featuredImage'),
//   processFormData,
//   BlogController.createBlog
// );

// // Update blog post
// router.put(
//   '/:id',
//   protect,
//   authorize('Psychologist'),
//   upload.single('featuredImage'),
//   processFormData,
//   BlogController.updateBlog
// );

// // Delete blog post
// router.delete(
//   '/:id',
//   protect,
//   authorize('Psychologist'),
//   BlogController.deleteBlog
// );

// // ============================================
// // ERROR HANDLER FOR MULTER
// // ============================================
// router.use((err, req, res, next) => {
//   console.error('❌ Blog Route Error:', err);
  
//   if (err instanceof multer.MulterError) {
//     if (err.code === 'LIMIT_FILE_SIZE') {
//       return res.status(400).json({
//         success: false,
//         message: 'Image too large. Maximum size is 5MB.'
//       });
//     }
//     return res.status(400).json({
//       success: false,
//       message: `Upload error: ${err.message}`
//     });
//   }
  
//   if (err.message && err.message.includes('Only image files')) {
//     return res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   }
  
//   next(err);
// });

// module.exports = router;













// routes/blog.js
// Blog routes with file upload support

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const BlogController = require('../controllers/BlogController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

// ============================================
// SETUP UPLOAD DIRECTORY
// ============================================
const uploadDir = path.join(__dirname, '../public/uploads/blogs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Created blogs upload directory');
}

// ============================================
// MULTER CONFIGURATION
// ============================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    const name = file.originalname
      .replace(ext, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .substring(0, 30);
    cb(null, `blog-${name}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images allowed (JPEG, PNG, GIF, WebP)'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// ============================================
// PUBLIC ROUTES
// ============================================
router.get('/published', BlogController.getPublishedBlogs);
router.get('/featured', BlogController.getFeaturedBlogs);
router.get('/categories', BlogController.getCategories);
router.get('/slug/:slug', optionalAuth, BlogController.getBlogBySlug);

// ============================================
// PROTECTED ROUTES (any authenticated user)
// ============================================
router.post('/:id/like', protect, BlogController.toggleLike);
router.post('/:id/comment', protect, BlogController.addComment);

// ============================================
// PSYCHOLOGIST ROUTES
// ============================================
router.get('/psychologist/my-blogs', protect, authorize('Psychologist'), BlogController.getMyBlogs);
router.get('/psychologist/:id', protect, authorize('Psychologist'), BlogController.getBlogById);

// Create blog with image upload
router.post('/', protect, authorize('Psychologist'), upload.single('featuredImage'), BlogController.createBlog);

// Update blog with image upload
router.put('/:id', protect, authorize('Psychologist'), upload.single('featuredImage'), BlogController.updateBlog);

// Delete blog
router.delete('/:id', protect, authorize('Psychologist'), BlogController.deleteBlog);

// ============================================
// ERROR HANDLER
// ============================================
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'Image too large (max 5MB)' });
    }
    return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
  }
  if (err.message?.includes('Only images')) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next(err);
});

module.exports = router;