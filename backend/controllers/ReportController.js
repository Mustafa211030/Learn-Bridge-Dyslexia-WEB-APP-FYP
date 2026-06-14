const AssessmentReport = require('../models/AssessmentReport');
const StudentAssessment = require('../models/StudentAssessment');

class ReportController {
  static async generateReport(req, res) {
    try {
      const assessment = await StudentAssessment.findById(req.params.assessmentId)
        .populate('studentId').populate('psychologistId');
      
      if (!assessment) {
        return res.status(404).json({ success: false, message: 'Assessment not found' });
      }
      
      // In production, generate actual PDF here
      const pdfUrl = `/reports/${assessment._id}.pdf`;
      
      const report = await AssessmentReport.create({
        studentId: assessment.studentId._id,
        psychologistId: req.user.userId,
        assessmentId: assessment._id,
        reportTitle: `Assessment Report - ${assessment.studentId.firstName} ${assessment.studentId.lastName}`,
        pdfUrl,
        pdfFileName: `report-${Date.now()}.pdf`,
        reportData: {
          studentInfo: { name: `${assessment.studentId.firstName} ${assessment.studentId.lastName}` },
          cognitiveScores: assessment.cognitiveScores,
          summaryText: 'Generated report'
        },
        generatedAt: new Date()
      });
      
      res.status(201).json({ success: true, report });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to generate report' });
    }
  }
  
  static async getStudentReports(req, res) {
    try {
      const reports = await AssessmentReport.find({ studentId: req.params.studentId })
        .sort({ generatedAt: -1 });
      res.json({ success: true, reports });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch reports' });
    }
  }
}

module.exports = ReportController;
