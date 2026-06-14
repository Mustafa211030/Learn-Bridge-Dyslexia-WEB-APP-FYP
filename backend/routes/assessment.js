// routes/assessment.js
// Routes for student assessments

const express = require('express');
const router = express.Router();
const AssessmentController = require('../controllers/AssessmentController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Psychologist-only routes
router.use(authorize('Psychologist'));

// Generate assessment for a student
router.post('/generate/:studentId', AssessmentController.generateAssessment);

// Get all assessments for psychologist
router.get('/', AssessmentController.getAllAssessments);

// Get assessments for a specific student
router.get('/student/:studentId', AssessmentController.getStudentAssessments);

// Get single assessment detail
router.get('/:assessmentId', AssessmentController.getAssessmentDetail);

// Update assessment notes/recommendations
router.put('/:assessmentId', AssessmentController.updateAssessment);

module.exports = router;
