// pages/psychologist/assessments/index.jsx
// Assessments list page with filters and quick actions

import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PsychologistLayout from '../../../components/psychologist/layout/PsychologistLayout';
import ProtectedRoute from '../../../components/psychologist/common/ProtectedRoute';
import { assessmentsAPI } from '../../../services/psychologistApi';
import toast from 'react-hot-toast';
import styles from '../../../styles/psychologist/Students.module.css';

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [riskFilter, setRiskFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState(-1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });

  const fetchAssessments = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await assessmentsAPI.getAllAssessments({
        riskLevel: riskFilter,
        sortBy,
        sortOrder,
        page: pagination.page,
        limit: pagination.limit
      });

      if (response.data?.assessments) {
        setAssessments(response.data.assessments);
        setPagination(prev => ({
          ...prev,
          ...response.data.pagination
        }));
      }
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
      toast.error('Unable to load assessments');
    } finally {
      setIsLoading(false);
    }
  }, [riskFilter, sortBy, sortOrder, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      <Head>
        <title>Assessments - Psychologist Dashboard</title>
        <meta name="description" content="View and manage student cognitive assessments" />
      </Head>

      <ProtectedRoute allowedRoles={['Psychologist']}>
        <PsychologistLayout>
          <div className={styles.studentsPage}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
              <div className={styles.pageHeaderContent}>
                <div>
                  <h1 className={styles.pageTitle}>Assessments</h1>
                  <p className={styles.pageSubtitle}>
                    {pagination.total} cognitive assessments
                  </p>
                </div>
              </div>
            </div>

            {/* Page Content */}
            <div className={styles.pageContent}>
              {/* Filters */}
              <div className={styles.filtersCard}>
                <div className={styles.filtersRow}>
                  <select
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="">All Risk Levels</option>
                    <option value="high">High Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="low">Low Risk</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="createdAt">Sort by Date</option>
                    <option value="overallScore">Sort by Score</option>
                    <option value="riskLevel">Sort by Risk</option>
                  </select>

                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value))}
                    className={styles.filterSelect}
                  >
                    <option value={-1}>Newest First</option>
                    <option value={1}>Oldest First</option>
                  </select>
                </div>
              </div>

              {/* Assessments List */}
              {isLoading ? (
                <div className={styles.loadingGrid}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={styles.skeletonCard}></div>
                  ))}
                </div>
              ) : assessments.length > 0 ? (
                <div className={styles.studentsGrid}>
                  {assessments.map((assessment) => (
                    <Link
                      key={assessment._id}
                      href={`/psychologist/assessments/${assessment._id}`}
                      className={styles.studentCard}
                    >
                      <div className={styles.studentCardHeader}>
                        <div className={styles.studentCardAvatar}>
                          {assessment.student?.profilePhoto ? (
                            <img
                              src={assessment.student.profilePhoto}
                              alt=""
                              className={styles.studentCardAvatarImg}
                            />
                          ) : (
                            getInitials(
                              assessment.student?.firstName,
                              assessment.student?.lastName
                            )
                          )}
                        </div>
                        <h3 className={styles.studentCardName}>
                          {assessment.student?.firstName} {assessment.student?.lastName}
                        </h3>
                        <p className={styles.studentCardEmail}>
                          {assessment.assessmentType} assessment
                        </p>
                      </div>

                      <div className={styles.studentCardBody}>
                        <div className={styles.studentCardStats}>
                          <div className={styles.studentCardStat}>
                            <span className={styles.studentCardStatValue}>
                              {assessment.overallScore}%
                            </span>
                            <span className={styles.studentCardStatLabel}>Overall</span>
                          </div>
                          <div className={styles.studentCardStat}>
                            <span className={styles.studentCardStatValue}>
                              {assessment.cognitiveScores?.memory || 0}
                            </span>
                            <span className={styles.studentCardStatLabel}>Memory</span>
                          </div>
                          <div className={styles.studentCardStat}>
                            <span className={styles.studentCardStatValue}>
                              {assessment.cognitiveScores?.attention || 0}
                            </span>
                            <span className={styles.studentCardStatLabel}>Attention</span>
                          </div>
                        </div>

                        <div className={styles.studentCardFooter}>
                          <span className={`${styles.studentCardRisk} ${getRiskBadgeClass(assessment.riskLevel)}`}>
                            {assessment.riskLevel} risk
                          </span>
                          <span className={styles.studentCardLastActive}>
                            {formatDate(assessment.createdAt)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateIcon}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="48" height="48">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3>No Assessments Found</h3>
                  <p>
                    {riskFilter
                      ? 'Try adjusting your filters'
                      : 'Generate assessments from student profiles'}
                  </p>
                  <Link href="/psychologist/students" className={styles.btn}>
                    View Students
                  </Link>
                </div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.paginationBtn}
                    disabled={pagination.page <= 1}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  >
                    Previous
                  </button>
                  <span className={styles.paginationInfo}>
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    className={styles.paginationBtn}
                    disabled={pagination.page >= pagination.pages}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </PsychologistLayout>
      </ProtectedRoute>
    </>
  );
}
