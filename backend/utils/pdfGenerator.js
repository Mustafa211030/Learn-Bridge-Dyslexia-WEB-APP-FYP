const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class PDFGenerator {
  static async generateAssessmentReport(assessment, student, psychologist) {
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      
      const html = this.generateHTML(assessment, student, psychologist);
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      const pdfPath = path.join(process.env.PDF_TEMP_DIR || './temp/pdfs', `report-${Date.now()}.pdf`);
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
      });
      
      await browser.close();
      return pdfPath;
    } catch (error) {
      console.error('PDF generation error:', error);
      throw error;
    }
  }
  
  static generateHTML(assessment, student, psychologist) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #667eea; }
          .score { font-size: 24px; font-weight: bold; color: #764ba2; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        </style>
      </head>
      <body>
        <h1>Student Assessment Report</h1>
        <p><strong>Student:</strong> ${student.firstName} ${student.lastName}</p>
        <p><strong>Date:</strong> ${new Date(assessment.assessmentDate).toLocaleDateString()}</p>
        <p><strong>Psychologist:</strong> ${psychologist.firstName} ${psychologist.lastName}</p>
        
        <h2>Overall Cognitive Score</h2>
        <p class="score">${assessment.overallCognitiveScore}/100</p>
        
        <h2>Cognitive Domains</h2>
        <table>
          <tr><th>Domain</th><th>Score</th><th>Interpretation</th></tr>
          <tr><td>Memory</td><td>${assessment.cognitiveScores.memory.score}</td><td>${assessment.cognitiveScores.memory.interpretation}</td></tr>
          <tr><td>Attention</td><td>${assessment.cognitiveScores.attention.score}</td><td>${assessment.cognitiveScores.attention.interpretation}</td></tr>
          <tr><td>Reasoning</td><td>${assessment.cognitiveScores.reasoning.score}</td><td>${assessment.cognitiveScores.reasoning.interpretation}</td></tr>
          <tr><td>Accuracy</td><td>${assessment.cognitiveScores.accuracy.score}</td><td>${assessment.cognitiveScores.accuracy.interpretation}</td></tr>
          <tr><td>Speed</td><td>${assessment.cognitiveScores.speed.score}</td><td>${assessment.cognitiveScores.speed.interpretation}</td></tr>
        </table>
        
        <h2>Recommendations</h2>
        <ul>
          ${assessment.recommendations.map(r => `<li><strong>${r.category}:</strong> ${r.recommendation}</li>`).join('')}
        </ul>
      </body>
      </html>
    `;
  }
}

module.exports = PDFGenerator;
