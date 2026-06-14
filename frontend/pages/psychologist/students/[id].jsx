// pages/psychologist/students/[id].jsx
// Student detail page with cognitive scores, game data, and assessments

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PsychologistLayout from '../../../components/psychologist/layout/PsychologistLayout';
import ProtectedRoute from '../../../components/psychologist/common/ProtectedRoute';
import { studentsAPI, assessmentsAPI } from '../../../services/psychologistApi';
import toast from 'react-hot-toast';
import styles from '../../../styles/psychologist/Students.module.css';

export default function StudentDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [student, setStudent] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [gameData, setGameData] = useState(null);
  const [charts, setCharts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      fetchStudentData();
    }
  }, [id]);

  const fetchStudentData = async () => {
    try {
      setIsLoading(true);
      const response = await studentsAPI.getStudentDetail(id);
      
      if (response.data) {
        setStudent(response.data.student);
        setAssessments(response.data.assessments || []);
        setGameData(response.data.gameData);
        setCharts(response.data.charts);
      }
    } catch (error) {
      console.error('Failed to fetch student:', error);
      toast.error('Unable to load student data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAssessment = async () => {
    try {
      setIsGenerating(true);
      const response = await assessmentsAPI.generateAssessment(id, {
        assessmentType: 'periodic',
        periodDays: 30
      });
      
      if (response.data?.assessment) {
        toast.success('Assessment generated successfully!');
        fetchStudentData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to generate assessment:', error);
      toast.error(error.response?.data?.message || 'Failed to generate assessment');
    } finally {
      setIsGenerating(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getRiskBadgeClass = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return styles.riskHigh;
      case 'medium': return styles.riskMedium;
      default: return styles.riskLow;
    }
  };

  const getCognitiveScoreColor = (score) => {
    if (score >= 70) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['Psychologist']}>
        <PsychologistLayout>
          <div className={styles.loadingWrapper}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading student data...</p>
          </div>
        </PsychologistLayout>
      </ProtectedRoute>
    );
  }

  if (!student) {
    return (
      <ProtectedRoute allowedRoles={['Psychologist']}>
        <PsychologistLayout>
          <div className={styles.errorState}>
            <h2>Student Not Found</h2>
            <p>The student you're looking for doesn't exist or you don't have access.</p>
            <Link href="/psychologist/students" className={styles.btn}>
              Back to Students
            </Link>
          </div>
        </PsychologistLayout>
      </ProtectedRoute>
    );
  }

  const cognitiveScores = student.currentCognitiveScores || {};
  const latestAssessment = student.latestAssessment;

  return (
    <>
      <Head>
        <title>{student.firstName} {student.lastName} - Student Profile</title>
      </Head>

      <ProtectedRoute allowedRoles={['Psychologist']}>
        <PsychologistLayout>
          <div className={styles.studentDetailPage}>
            {/* Profile Header */}
            <div className={styles.profileHeader}>
              <div className={styles.profileHeaderContent}>
                <Link href="/psychologist/students" className={styles.backLink}>
                  <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Students
                </Link>

                <div className={styles.profileInfo}>
                  <div className={styles.profileAvatar}>
                    {student.profilePhoto ? (
                      <img src={student.profilePhoto} alt="" />
                    ) : (
                      getInitials(student.firstName, student.lastName)
                    )}
                  </div>
                  <div className={styles.profileDetails}>
                    <h1 className={styles.profileName}>
                      {student.firstName} {student.lastName}
                    </h1>
                    <p className={styles.profileEmail}>{student.email}</p>
                    <div className={styles.profileMeta}>
                      {latestAssessment && (
                        <span className={`${styles.profileMetaItem} ${getRiskBadgeClass(latestAssessment.riskLevel)}`}>
                          {latestAssessment.riskLevel} risk
                        </span>
                      )}
                      <span className={styles.profileMetaItem}>
                        {gameData?.totalGames || 0} games played
                      </span>
                      <span className={styles.profileMetaItem}>
                        Avg score: {gameData?.avgScore || 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className={styles.profileContent}>
              {/* Overview Stats */}
              <div className={styles.overviewStats}>
                <div className={styles.overviewStatCard}>
                  <div className={styles.overviewStatHeader}>
                    <div className={`${styles.overviewStatIcon} ${styles.overviewStatIconBlue}`}>
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className={styles.overviewStatValue}>
                    {latestAssessment?.overallScore || '-'}
                  </div>
                  <div className={styles.overviewStatLabel}>Overall Score</div>
                </div>

                <div className={styles.overviewStatCard}>
                  <div className={styles.overviewStatHeader}>
                    <div className={`${styles.overviewStatIcon} ${styles.overviewStatIconPurple}`}>
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className={styles.overviewStatValue}>{assessments.length}</div>
                  <div className={styles.overviewStatLabel}>Assessments</div>
                </div>

                <div className={styles.overviewStatCard}>
                  <div className={styles.overviewStatHeader}>
                    <div className={`${styles.overviewStatIcon} ${styles.overviewStatIconTeal}`}>
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className={styles.overviewStatValue}>{gameData?.totalGames || 0}</div>
                  <div className={styles.overviewStatLabel}>Games Played</div>
                </div>

                <div className={styles.overviewStatCard}>
                  <div className={styles.overviewStatHeader}>
                    <div className={`${styles.overviewStatIcon} ${styles.overviewStatIconPink}`}>
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                  <div className={styles.overviewStatValue}>{gameData?.avgScore || 0}%</div>
                  <div className={styles.overviewStatLabel}>Average Score</div>
                </div>
              </div>

              {/* Charts Grid */}
              <div className={styles.chartsGrid}>
                {/* Cognitive Scores */}
                <div className={styles.chartCard}>
                  <div className={styles.chartCardHeader}>
                    <h3 className={styles.chartCardTitle}>
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Cognitive Scores
                    </h3>
                    <button
                      className={styles.generateBtn}
                      onClick={handleGenerateAssessment}
                      disabled={isGenerating}
                    >
                      {isGenerating ? 'Generating...' : 'Generate Assessment'}
                    </button>
                  </div>
                  <div className={styles.chartCardBody}>
                    <div className={styles.cognitiveScores}>
                      {[
                        { key: 'memory', label: 'Memory', icon: '🧠' },
                        { key: 'attention', label: 'Attention', icon: '👁️' },
                        { key: 'problemSolving', label: 'Problem Solving', icon: '🧩' },
                        { key: 'processingSpeed', label: 'Processing', icon: '⚡' },
                        { key: 'verbal', label: 'Verbal', icon: '💬' }
                      ].map(({ key, label, icon }) => (
                        <div key={key} className={styles.cognitiveScoreItem}>
                          <div 
                            className={styles.cognitiveScoreIcon}
                            style={{ 
                              background: `linear-gradient(135deg, ${getCognitiveScoreColor(cognitiveScores[key] || 0)}20, ${getCognitiveScoreColor(cognitiveScores[key] || 0)}10)`,
                              color: getCognitiveScoreColor(cognitiveScores[key] || 0)
                            }}
                          >
                            {icon}
                          </div>
                          <div 
                            className={styles.cognitiveScoreValue}
                            style={{ color: getCognitiveScoreColor(cognitiveScores[key] || 0) }}
                          >
                            {cognitiveScores[key] || 0}
                          </div>
                          <div className={styles.cognitiveScoreLabel}>{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Games */}
                <div className={styles.chartCard}>
                  <div className={styles.chartCardHeader}>
                    <h3 className={styles.chartCardTitle}>
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                      </svg>
                      Game Performance
                    </h3>
                  </div>
                  <div className={styles.chartCardBody}>
                    {gameData?.statsByType?.length > 0 ? (
                      <div className={styles.gamesList}>
                        {gameData.statsByType.slice(0, 5).map((stat, index) => (
                          <div key={index} className={styles.gameItem}>
                            <div 
                              className={styles.gameIcon}
                              style={{ 
                                background: `linear-gradient(135deg, ${getCognitiveScoreColor(stat.avgScore || 0)}20, ${getCognitiveScoreColor(stat.avgScore || 0)}10)`,
                                color: getCognitiveScoreColor(stat.avgScore || 0)
                              }}
                            >
                              {stat._id?.charAt(0).toUpperCase() || 'G'}
                            </div>
                            <div className={styles.gameInfo}>
                              <div className={styles.gameName}>{stat._id || 'Unknown'}</div>
                              <div className={styles.gameType}>
                                {stat.count} games • Avg: {Math.round(stat.avgScore || 0)}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.emptyState}>
                        <p>No game data available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Assessments */}
              <div className={`${styles.chartCard} ${styles.chartCardFull}`}>
                <div className={styles.chartCardHeader}>
                  <h3 className={styles.chartCardTitle}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Assessment History
                  </h3>
                </div>
                <div className={styles.chartCardBody}>
                  {assessments.length > 0 ? (
                    <div className={styles.assessmentsList}>
                      {assessments.slice(0, 5).map((assessment) => (
                        <Link
                          key={assessment._id}
                          href={`/psychologist/assessments/${assessment._id}`}
                          className={styles.assessmentItem}
                        >
                          <div className={styles.assessmentInfo}>
                            <div className={styles.assessmentDate}>
                              {new Date(assessment.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                            <div className={styles.assessmentType}>
                              {assessment.assessmentType} assessment
                            </div>
                          </div>
                          <div className={styles.assessmentScore}>
                            Score: {assessment.overallScore}%
                          </div>
                          <span className={`${styles.assessmentRisk} ${getRiskBadgeClass(assessment.riskLevel)}`}>
                            {assessment.riskLevel}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <p>No assessments generated yet</p>
                      <button
                        className={styles.btn}
                        onClick={handleGenerateAssessment}
                        disabled={isGenerating}
                      >
                        Generate First Assessment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </PsychologistLayout>
      </ProtectedRoute>
    </>
  );
}
