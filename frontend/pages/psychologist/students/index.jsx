// pages/psychologist/students/index.jsx
// Students list page with search, filters, and grid view

import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PsychologistLayout from '../../../components/psychologist/layout/PsychologistLayout';
import ProtectedRoute from '../../../components/psychologist/common/ProtectedRoute';
import { studentsAPI } from '../../../services/psychologistApi';
import toast from 'react-hot-toast';
import styles from '../../../styles/psychologist/Students.module.css';

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch students
  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await studentsAPI.getStudents({
        search: debouncedSearch,
        riskLevel: riskFilter,
        sortBy,
        page: pagination.page,
        limit: pagination.limit
      });

      if (response.data?.students) {
        setStudents(response.data.students);
        setPagination(prev => ({
          ...prev,
          ...response.data.pagination
        }));
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
      toast.error('Unable to load students');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, riskFilter, sortBy, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

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

  const formatLastActive = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const last = new Date(date);
    const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return last.toLocaleDateString();
  };

  return (
    <>
      <Head>
        <title>Students - Psychologist Dashboard</title>
        <meta name="description" content="Manage and monitor assigned students" />
      </Head>

      <ProtectedRoute allowedRoles={['Psychologist']}>
        <PsychologistLayout>
          <div className={styles.studentsPage}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
              <div className={styles.pageHeaderContent}>
                <div>
                  <h1 className={styles.pageTitle}>My Students</h1>
                  <p className={styles.pageSubtitle}>
                    {pagination.total} students under your care
                  </p>
                </div>
              </div>
            </div>

            {/* Page Content */}
            <div className={styles.pageContent}>
              {/* Filters Card */}
              <div className={styles.filtersCard}>
                <div className={styles.filtersRow}>
                  {/* Search */}
                  <div className={styles.searchWrapper}>
                    <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search students by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>

                  {/* Risk Level Filter */}
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

                  {/* Sort By */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="name">Sort by Name</option>
                    <option value="score">Sort by Score</option>
                    <option value="risk">Sort by Risk</option>
                  </select>

                  {/* View Toggle */}
                  <div className={styles.viewToggle}>
                    <button
                      className={`${styles.viewToggleBtn} ${viewMode === 'grid' ? styles.viewToggleBtnActive : ''}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <svg className={styles.viewToggleIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.viewToggleBtnActive : ''}`}
                      onClick={() => setViewMode('list')}
                    >
                      <svg className={styles.viewToggleIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Students Grid */}
              {isLoading ? (
                <div className={styles.loadingGrid}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={styles.skeletonCard}></div>
                  ))}
                </div>
              ) : students.length > 0 ? (
                <div className={styles.studentsGrid}>
                  {students.map((student) => (
                    <Link
                      key={student._id}
                      href={`/psychologist/students/${student._id}`}
                      className={styles.studentCard}
                    >
                      <div className={styles.studentCardHeader}>
                        <div className={styles.studentCardAvatar}>
                          {student.profilePhoto ? (
                            <img
                              src={student.profilePhoto}
                              alt=""
                              className={styles.studentCardAvatarImg}
                            />
                          ) : (
                            getInitials(student.firstName, student.lastName)
                          )}
                        </div>
                        <h3 className={styles.studentCardName}>
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className={styles.studentCardEmail}>{student.email}</p>
                      </div>

                      <div className={styles.studentCardBody}>
                        <div className={styles.studentCardStats}>
                          <div className={styles.studentCardStat}>
                            <span className={styles.studentCardStatValue}>
                              {student.latestAssessment?.overallScore || '-'}
                            </span>
                            <span className={styles.studentCardStatLabel}>Score</span>
                          </div>
                          <div className={styles.studentCardStat}>
                            <span className={styles.studentCardStatValue}>
                              {student.gameStats?.totalGames || 0}
                            </span>
                            <span className={styles.studentCardStatLabel}>Games</span>
                          </div>
                          <div className={styles.studentCardStat}>
                            <span className={styles.studentCardStatValue}>
                              {student.gameStats?.avgScore || 0}%
                            </span>
                            <span className={styles.studentCardStatLabel}>Avg</span>
                          </div>
                        </div>

                        <div className={styles.studentCardFooter}>
                          <span className={`${styles.studentCardRisk} ${getRiskBadgeClass(student.latestAssessment?.riskLevel)}`}>
                            {student.latestAssessment?.riskLevel || 'N/A'} risk
                          </span>
                          <span className={styles.studentCardLastActive}>
                            <svg className={styles.studentCardLastActiveIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatLastActive(student.gameStats?.lastPlayed)}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3>No Students Found</h3>
                  <p>
                    {searchTerm || riskFilter
                      ? 'Try adjusting your filters'
                      : 'Students will be assigned to you by the administrator'}
                  </p>
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
