const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const CMSController = require('../controllers/CMSController');

const psychologistOnly = [authenticateToken, authorizeRoles('Psychologist')];

// Blog routes
router.get('/blogs', psychologistOnly, CMSController.getBlogs);
router.post('/blogs', psychologistOnly, CMSController.createBlog);
router.put('/blogs/:id', psychologistOnly, CMSController.updateBlog);
router.delete('/blogs/:id', psychologistOnly, CMSController.deleteBlog);

// Resource routes
router.get('/resources', psychologistOnly, CMSController.getResources);
router.post('/resources', psychologistOnly, CMSController.createResource);
router.put('/resources/:id', psychologistOnly, CMSController.updateResource);
router.delete('/resources/:id', psychologistOnly, CMSController.deleteResource);

module.exports = router;
