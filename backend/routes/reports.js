const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const ReportController = require('../controllers/ReportController');

const psychologistOnly = [authenticateToken, authorizeRoles('Psychologist')];

router.post('/generate/:assessmentId', psychologistOnly, ReportController.generateReport);
router.get('/student/:studentId', psychologistOnly, ReportController.getStudentReports);

module.exports = router;
