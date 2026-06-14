// routes/psychologist.js
// Routes for psychologist dashboard and profile

const express = require('express');
const router = express.Router();
const PsychologistController = require('../controllers/PsychologistController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication and psychologist role
router.use(protect);
router.use(authorize('Psychologist'));

// Dashboard
router.get('/dashboard', PsychologistController.getDashboard);

// Students
router.get('/students', PsychologistController.getStudents);
router.get('/students/:id', PsychologistController.getStudentDetail);

// Profile
router.get('/profile', PsychologistController.getProfile);
router.put('/profile', PsychologistController.updateProfile);

module.exports = router;
