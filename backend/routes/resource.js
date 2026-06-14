// routes/resource.js
// Routes for educational resources

const express = require('express');
const router = express.Router();
const ResourceController = require('../controllers/ResourceController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

// Public routes
router.get('/published', ResourceController.getPublishedResources);
router.get('/popular', ResourceController.getPopularResources);
router.get('/categories', ResourceController.getCategories);

// Protected routes - any authenticated user
router.get('/:id', protect, ResourceController.getResourceById);
router.post('/:id/download', optionalAuth, ResourceController.recordDownload);
router.post('/:id/like', protect, ResourceController.toggleLike);
router.post('/:id/rate', protect, ResourceController.rateResource);

// Psychologist-only routes
router.get('/psychologist/my-resources', protect, authorize('Psychologist'), ResourceController.getMyResources);
router.post('/', protect, authorize('Psychologist'), ResourceController.createResource);
router.put('/:id', protect, authorize('Psychologist'), ResourceController.updateResource);
router.delete('/:id', protect, authorize('Psychologist'), ResourceController.deleteResource);

module.exports = router;
