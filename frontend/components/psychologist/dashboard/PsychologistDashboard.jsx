// components/psychologist/dashboard/PsychologistDashboard.jsx
// Beautiful main dashboard component with glass-morphism and animations

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import { psychologistAPI } from '../../../services/api';
import toast from 'react-hot-toast';
import styles from '../../../styles/psychologist/Dashboard.module.css';

const PsychologistDashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  const [dashboardData, setDashboardData] = useState({
    quickStats: {
      totalStudents: 0,
      todaySessions: 0,
      pendingAssessments: 0,
      highRiskStudents: 0
    },
    recentActivities: [],
    highRiskAlerts: [],
    recentStudents: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await psychologistAPI.getDashboard();
      
      if (response.data?.dashboard) {
        setDashboardData(response.data.dashboard);
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast.error('Unable to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '☀️ Good Morning';
    if (hour < 18) return '🌤️ Good Afternoon';
    return '🌙 Good Evening';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
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

  // Quick Actions configuration
  const quickActions = [
    {
      name: 'View Students',
      description: 'Manage student profiles',
      path: '/psychologist/students',
      icon: (
        <svg className={styles.actionIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      name: 'Generate Assessment',
      description: 'Create cognitive report',
      path: '/psychologist/assessments',
      icon: (
        <svg className={styles.actionIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      name: 'Write Blog',
      description: 'Share insights & tips',
      path: '/psychologist/blogs',
      icon: (
        <svg className={styles.actionIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      name: 'Upload Resource',
      description: 'Add learning materials',
      path: '/psychologist/resources',
      icon: (
        <svg className={styles.actionIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Loading your dashboard...</p>
          <p className={styles.loadingSubtext}>Preparing insights and analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardWrapper}>
      {/* Background gradient */}
      <div className={styles.dashboardBackground}></div>
      
      <div className={styles.dashboardContent}>
        {/* Header Section */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerText}>
              <p className={styles.greeting}>
                <span className={styles.greetingIcon}>{getGreeting().split(' ')[0]}</span>
                {getGreeting().split(' ').slice(1).join(' ')}
              </p>
              <h1 className={styles.title}>
                Welcome back, Dr. {user?.firstName || 'Psychologist'}
              </h1>
              <p className={styles.subtitle}>
                Here&apos;s your overview for today. Let&apos;s make a difference!
              </p>
              
              <div className={styles.headerMeta}>
                <div className={styles.metaItem}>
                  <svg className={styles.metaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(currentTime)}</span>
                </div>
                <div className={styles.metaItem}>
                  <svg className={styles.metaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formatTime(currentTime)}</span>
                </div>
              </div>
            </div>
            
            <div className={styles.headerActions}>
              <Link href="/psychologist/students" className={`${styles.headerBtn} ${styles.headerBtnPrimary}`}>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                View Students
              </Link>
              <button 
                className={`${styles.headerBtn} ${styles.headerBtnSecondary}`}
                onClick={fetchDashboardData}
                type="button"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </header>

        {/* Statistics Cards */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            {/* Total Students */}
            <Link href="/psychologist/students" className={`${styles.statCard} ${styles.statCardBlue}`}>
              <div className={styles.statCardHeader}>
                <div className={`${styles.statIconWrapper} ${styles.statIconBlue}`}>
                  <svg className={styles.statIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className={`${styles.statBadge} ${styles.statBadgeUp}`}>+12%</span>
              </div>
              <div className={styles.statBody}>
                <div className={styles.statNumber}>{dashboardData.quickStats.totalStudents}</div>
                <div className={styles.statLabel}>Total Students</div>
              </div>
              <div className={styles.statTrend}>
                <span className={`${styles.trendIndicator} ${styles.trendUp}`}>
                  <svg className={styles.trendIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  +3
                </span>
                <span className={styles.trendText}>this month</span>
              </div>
            </Link>

            {/* Today's Sessions */}
            <div className={`${styles.statCard} ${styles.statCardPurple}`}>
              <div className={styles.statCardHeader}>
                <div className={`${styles.statIconWrapper} ${styles.statIconPurple}`}>
                  <svg className={styles.statIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className={styles.statBody}>
                <div className={styles.statNumber}>{dashboardData.quickStats.todaySessions}</div>
                <div className={styles.statLabel}>Sessions Today</div>
              </div>
              <div className={styles.statTrend}>
                <span className={`${styles.trendIndicator} ${styles.trendNeutral}`}>
                  {dashboardData.quickStats.todaySessions} completed
                </span>
              </div>
            </div>

            {/* Pending Assessments */}
            <Link href="/psychologist/assessments" className={`${styles.statCard} ${styles.statCardTeal}`}>
              <div className={styles.statCardHeader}>
                <div className={`${styles.statIconWrapper} ${styles.statIconTeal}`}>
                  <svg className={styles.statIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
              <div className={styles.statBody}>
                <div className={styles.statNumber}>{dashboardData.quickStats.pendingAssessments}</div>
                <div className={styles.statLabel}>Pending Assessments</div>
              </div>
              <div className={styles.statTrend}>
                <span className={styles.trendText}>Need attention</span>
              </div>
            </Link>

            {/* High Risk Students */}
            <div className={`${styles.statCard} ${styles.statCardPink}`}>
              <div className={styles.statCardHeader}>
                <div className={`${styles.statIconWrapper} ${styles.statIconPink}`}>
                  <svg className={styles.statIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                {dashboardData.quickStats.highRiskStudents > 0 && (
                  <span className={`${styles.statBadge} ${styles.statBadgeDown}`}>Alert</span>
                )}
              </div>
              <div className={styles.statBody}>
                <div className={styles.statNumber}>{dashboardData.quickStats.highRiskStudents}</div>
                <div className={styles.statLabel}>High Risk Students</div>
              </div>
              <div className={styles.statTrend}>
                <span className={`${styles.trendIndicator} ${dashboardData.quickStats.highRiskStudents > 0 ? styles.trendDown : styles.trendUp}`}>
                  {dashboardData.quickStats.highRiskStudents > 0 ? 'Needs review' : 'All good!'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className={styles.quickActionsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <svg className={styles.sectionTitleIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick Actions
            </h2>
          </div>
          <div className={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <Link 
                key={index}
                href={action.path}
                className={styles.actionCard}
              >
                <div className={styles.actionIconWrapper}>
                  {action.icon}
                </div>
                <div className={styles.actionContent}>
                  <div className={styles.actionLabel}>{action.name}</div>
                  <div className={styles.actionDescription}>{action.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className={styles.mainContentGrid}>
          {/* Recent Activity */}
          <div className={styles.contentCard}>
            <div className={styles.contentCardHeader}>
              <div>
                <h3 className={styles.contentCardTitle}>
                  <svg className={styles.contentCardTitleIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Recent Activity
                </h3>
                <p className={styles.contentCardSubtitle}>Latest assessments &amp; updates</p>
              </div>
              <Link href="/psychologist/assessments" className={styles.contentCardHeaderAction}>
                View All →
              </Link>
            </div>
            <div className={styles.contentCardBody}>
              {dashboardData.recentActivities.length > 0 ? (
                <div className={styles.activityList}>
                  {dashboardData.recentActivities.map((activity, index) => (
                    <div key={index} className={styles.activityItem}>
                      <div className={styles.activityAvatar}>
                        {activity.student?.profilePhoto ? (
                          <img 
                            src={activity.student.profilePhoto} 
                            alt="" 
                            className={styles.activityAvatarImg}
                          />
                        ) : (
                          getInitials(activity.student?.firstName, activity.student?.lastName)
                        )}
                      </div>
                      <div className={styles.activityContent}>
                        <div className={styles.activityTitle}>
                          {activity.student?.firstName} {activity.student?.lastName}
                        </div>
                        <div className={styles.activityText}>
                          Assessment completed • Score: {activity.overallScore}%
                        </div>
                        <div className={styles.activityMeta}>
                          <span className={styles.activityTime}>
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </span>
                          <span className={`${styles.activityTag} ${getRiskBadgeClass(activity.riskLevel)}`}>
                            {activity.riskLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateIcon}>
                    <svg className={styles.emptyStateIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className={styles.emptyStateTitle}>No Recent Activity</h4>
                  <p className={styles.emptyStateText}>
                    Start by generating assessments for your students
                  </p>
                  <Link href="/psychologist/assessments" className={`${styles.btn} ${styles.btnPrimary}`}>
                    Generate Assessment
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* High Risk Alerts */}
          <div className={styles.contentCard}>
            <div className={styles.contentCardHeader}>
              <div>
                <h3 className={styles.contentCardTitle}>
                  <svg className={styles.contentCardTitleIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Risk Alerts
                </h3>
                <p className={styles.contentCardSubtitle}>Students needing attention</p>
              </div>
            </div>
            <div className={styles.contentCardBody}>
              {dashboardData.highRiskAlerts.length > 0 ? (
                <div className={styles.alertsList}>
                  {dashboardData.highRiskAlerts.map((alert, index) => (
                    <Link 
                      key={index}
                      href={`/psychologist/students/${alert.studentId}`}
                      className={`${styles.alertItem} ${alert.riskLevel === 'high' ? styles.alertItemHigh : styles.alertItemMedium}`}
                    >
                      <div className={`${styles.alertIcon} ${alert.riskLevel === 'high' ? styles.alertIconHigh : styles.alertIconMedium}`}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className={styles.alertContent}>
                        <div className={styles.alertTitle}>
                          {alert.student?.firstName} {alert.student?.lastName}
                        </div>
                        <div className={styles.alertText}>
                          Score: {alert.overallScore}%
                        </div>
                      </div>
                      <span className={`${styles.alertBadge} ${alert.riskLevel === 'high' ? styles.alertBadgeHigh : styles.alertBadgeMedium}`}>
                        {alert.riskLevel}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateIcon}>
                    <svg className={styles.emptyStateIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className={styles.emptyStateTitle}>All Clear!</h4>
                  <p className={styles.emptyStateText}>
                    No high-risk students at the moment
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Students Overview */}
        <section className={styles.studentsOverview}>
          <div className={styles.contentCard}>
            <div className={styles.contentCardHeader}>
              <div>
                <h3 className={styles.contentCardTitle}>
                  <svg className={styles.contentCardTitleIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Recent Students
                </h3>
                <p className={styles.contentCardSubtitle}>
                  {dashboardData.quickStats.totalStudents} students under your care
                </p>
              </div>
              <Link href="/psychologist/students" className={styles.contentCardHeaderAction}>
                View All →
              </Link>
            </div>
            <div className={styles.contentCardBody}>
              {dashboardData.recentStudents.length > 0 ? (
                <div className={styles.studentsList}>
                  {dashboardData.recentStudents.map((student, index) => (
                    <Link 
                      key={index}
                      href={`/psychologist/students/${student._id}`}
                      className={styles.studentCard}
                    >
                      <div className={styles.studentAvatar}>
                        {student.profilePhoto ? (
                          <img src={student.profilePhoto} alt="" />
                        ) : (
                          getInitials(student.firstName, student.lastName)
                        )}
                      </div>
                      <div className={styles.studentInfo}>
                        <div className={styles.studentName}>
                          {student.firstName} {student.lastName}
                        </div>
                        <div className={styles.studentMeta}>{student.email}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateIcon}>
                    <svg className={styles.emptyStateIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h4 className={styles.emptyStateTitle}>No Students Yet</h4>
                  <p className={styles.emptyStateText}>
                    Students will be assigned to you by the administrator
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PsychologistDashboard;
































// // components/psychologist/dashboard/PsychologistDashboard.jsx
// // Professional Psychologist Dashboard with REAL data integration

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useAuth } from '../../../contexts/AuthContext';
// import styles from '../../../styles/psychologist/Dashboard.module.css';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// export default function PsychologistDashboard() {
//   const { user } = useAuth();
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (user?._id) {
//       fetchDashboardData();
//     }
//   }, [user]);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Fetch real data from backend
//       const [studentsRes, assessmentsRes, statsRes] = await Promise.allSettled([
//         fetch(`${API_BASE_URL}/psychologist/students?psychologistId=${user._id}`, {
//           headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//         }).then(r => r.json()),
//         fetch(`${API_BASE_URL}/psychologist/assessments?psychologistId=${user._id}&limit=10`, {
//           headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//         }).then(r => r.json()),
//         fetch(`${API_BASE_URL}/psychologist/statistics?psychologistId=${user._id}`, {
//           headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//         }).then(r => r.json())
//       ]);

//       const students = studentsRes.status === 'fulfilled' ? studentsRes.value : { students: [], total: 0 };
//       const assessments = assessmentsRes.status === 'fulfilled' ? assessmentsRes.value : { assessments: [], total: 0 };
//       const stats = statsRes.status === 'fulfilled' ? statsRes.value : {};

//       // Calculate statistics from real data
//       const totalStudents = students.total || students.students?.length || 0;
//       const highRiskStudents = students.students?.filter(s => s.latestAssessment?.riskLevel === 'high').length || 0;
//       const mediumRiskStudents = students.students?.filter(s => s.latestAssessment?.riskLevel === 'medium').length || 0;
//       const totalAssessments = assessments.total || assessments.assessments?.length || 0;
//       const pendingReviews = assessments.assessments?.filter(a => !a.reviewed).length || 0;

//       // Get recent activities
//       const recentStudents = students.students?.slice(0, 5) || [];
//       const recentAssessments = assessments.assessments?.slice(0, 5) || [];

//       // Calculate average scores
//       const avgScore = recentAssessments.length > 0
//         ? Math.round(recentAssessments.reduce((acc, a) => acc + (a.overallScore || 0), 0) / recentAssessments.length)
//         : 0;

//       setDashboardData({
//         statistics: {
//           totalStudents,
//           highRiskStudents,
//           mediumRiskStudents,
//           totalAssessments,
//           pendingReviews,
//           avgScore,
//           ...stats
//         },
//         recentStudents,
//         recentAssessments,
//         rawData: { students, assessments, stats }
//       });

//     } catch (err) {
//       console.error('Dashboard fetch error:', err);
//       setError('Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (date) => {
//     if (!date) return 'N/A';
//     return new Date(date).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   const formatTimeAgo = (date) => {
//     if (!date) return 'Never';
//     const seconds = Math.floor((new Date() - new Date(date)) / 1000);
//     if (seconds < 60) return 'Just now';
//     if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
//     if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
//     if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
//     return formatDate(date);
//   };

//   const getInitials = (firstName, lastName) => {
//     return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
//   };

//   const getRiskClass = (risk) => {
//     switch (risk?.toLowerCase()) {
//       case 'high': return styles.riskHigh;
//       case 'medium': return styles.riskMedium;
//       default: return styles.riskLow;
//     }
//   };

//   if (loading) {
//     return (
//       <div className={styles.loadingContainer}>
//         <div className={styles.loadingContent}>
//           <div className={styles.spinner}></div>
//           <p className={styles.loadingText}>Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={styles.errorContainer}>
//         <div className={styles.errorContent}>
//           <div className={styles.errorIcon}>
//             <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="48" height="48">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//             </svg>
//           </div>
//           <h3>Unable to Load Dashboard</h3>
//           <p>{error}</p>
//           <button onClick={fetchDashboardData} className={styles.retryBtn}>
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const { statistics, recentStudents, recentAssessments } = dashboardData || {};

//   return (
//     <div className={styles.dashboard}>
//       <div className={styles.container}>
//         {/* Header */}
//         <header className={styles.header}>
//           <div className={styles.headerContent}>
//             <div className={styles.headerText}>
//               <h1 className={styles.title}>Welcome back, Dr. {user?.lastName || 'Professional'}</h1>
//               <p className={styles.subtitle}>Here's an overview of your practice today</p>
//             </div>
//             <div className={styles.headerMeta}>
//               <div className={styles.metaItem}>
//                 <svg className={styles.metaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//                 <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Statistics Grid */}
//         <section className={styles.statsSection}>
//           <div className={styles.statsGrid}>
//             {/* Total Students */}
//             <div className={styles.statCard}>
//               <div className={styles.statCardHeader}>
//                 <div className={`${styles.statIconWrapper} ${styles.iconBlue}`}>
//                   <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//                   </svg>
//                 </div>
//                 <Link href="/psychologist/students" className={styles.statLink}>
//                   View All
//                   <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </Link>
//               </div>
//               <div className={styles.statBody}>
//                 <span className={styles.statNumber}>{statistics?.totalStudents || 0}</span>
//                 <span className={styles.statLabel}>Total Students</span>
//               </div>
//               <div className={styles.statFooter}>
//                 <span className={styles.statTrendUp}>Active in your care</span>
//               </div>
//             </div>

//             {/* High Risk Students */}
//             <div className={styles.statCard}>
//               <div className={styles.statCardHeader}>
//                 <div className={`${styles.statIconWrapper} ${styles.iconRed}`}>
//                   <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                   </svg>
//                 </div>
//                 <span className={styles.urgentBadge}>Needs Attention</span>
//               </div>
//               <div className={styles.statBody}>
//                 <span className={styles.statNumber}>{statistics?.highRiskStudents || 0}</span>
//                 <span className={styles.statLabel}>High Risk Students</span>
//               </div>
//               <div className={styles.statFooter}>
//                 <span className={styles.statTrendWarning}>Requires immediate review</span>
//               </div>
//             </div>

//             {/* Assessments */}
//             <div className={styles.statCard}>
//               <div className={styles.statCardHeader}>
//                 <div className={`${styles.statIconWrapper} ${styles.iconPurple}`}>
//                   <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                 </div>
//                 <Link href="/psychologist/assessments" className={styles.statLink}>
//                   View All
//                   <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </Link>
//               </div>
//               <div className={styles.statBody}>
//                 <span className={styles.statNumber}>{statistics?.totalAssessments || 0}</span>
//                 <span className={styles.statLabel}>Total Assessments</span>
//               </div>
//               <div className={styles.statFooter}>
//                 <span className={styles.statTrendNeutral}>{statistics?.pendingReviews || 0} pending review</span>
//               </div>
//             </div>

//             {/* Average Score */}
//             <div className={styles.statCard}>
//               <div className={styles.statCardHeader}>
//                 <div className={`${styles.statIconWrapper} ${styles.iconGreen}`}>
//                   <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className={styles.statBody}>
//                 <span className={styles.statNumber}>{statistics?.avgScore || 0}%</span>
//                 <span className={styles.statLabel}>Average Score</span>
//               </div>
//               <div className={styles.statFooter}>
//                 <span className={styles.statTrendUp}>Across all assessments</span>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Quick Actions */}
//         <section className={styles.quickActionsSection}>
//           <h2 className={styles.sectionTitle}>Quick Actions</h2>
//           <div className={styles.quickActionsGrid}>
//             <Link href="/psychologist/students" className={styles.actionCard}>
//               <div className={styles.actionIcon}>
//                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                 </svg>
//               </div>
//               <span className={styles.actionLabel}>View Students</span>
//               <span className={styles.actionDescription}>Manage assigned students</span>
//             </Link>

//             <Link href="/psychologist/assessments" className={styles.actionCard}>
//               <div className={styles.actionIcon}>
//                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
//                 </svg>
//               </div>
//               <span className={styles.actionLabel}>Assessments</span>
//               <span className={styles.actionDescription}>Review cognitive tests</span>
//             </Link>

//             <Link href="/psychologist/content" className={styles.actionCard}>
//               <div className={styles.actionIcon}>
//                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
//                 </svg>
//               </div>
//               <span className={styles.actionLabel}>Content Manager</span>
//               <span className={styles.actionDescription}>Blogs & resources</span>
//             </Link>

//             <Link href="/psychologist/reports" className={styles.actionCard}>
//               <div className={styles.actionIcon}>
//                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//               </div>
//               <span className={styles.actionLabel}>Reports</span>
//               <span className={styles.actionDescription}>Generate analytics</span>
//             </Link>
//           </div>
//         </section>

//         {/* Content Grid */}
//         <div className={styles.contentGrid}>
//           {/* Recent Students */}
//           <div className={styles.contentCard}>
//             <div className={styles.contentCardHeader}>
//               <h3 className={styles.contentCardTitle}>Recent Students</h3>
//               <Link href="/psychologist/students" className={styles.viewAllLink}>
//                 View All
//               </Link>
//             </div>
//             <div className={styles.contentCardBody}>
//               {recentStudents?.length > 0 ? (
//                 <div className={styles.studentsList}>
//                   {recentStudents.map((student) => (
//                     <Link
//                       key={student._id}
//                       href={`/psychologist/students/${student._id}`}
//                       className={styles.studentItem}
//                     >
//                       <div className={styles.studentAvatar}>
//                         {student.profilePhoto ? (
//                           <img src={student.profilePhoto} alt="" />
//                         ) : (
//                           getInitials(student.firstName, student.lastName)
//                         )}
//                       </div>
//                       <div className={styles.studentInfo}>
//                         <span className={styles.studentName}>
//                           {student.firstName} {student.lastName}
//                         </span>
//                         <span className={styles.studentMeta}>
//                           Last active: {formatTimeAgo(student.lastActive || student.updatedAt)}
//                         </span>
//                       </div>
//                       <span className={`${styles.riskBadge} ${getRiskClass(student.latestAssessment?.riskLevel)}`}>
//                         {student.latestAssessment?.riskLevel || 'N/A'}
//                       </span>
//                     </Link>
//                   ))}
//                 </div>
//               ) : (
//                 <div className={styles.emptyState}>
//                   <div className={styles.emptyStateIcon}>
//                     <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//                     </svg>
//                   </div>
//                   <p className={styles.emptyStateText}>No students assigned yet</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Recent Assessments */}
//           <div className={styles.contentCard}>
//             <div className={styles.contentCardHeader}>
//               <h3 className={styles.contentCardTitle}>Recent Assessments</h3>
//               <Link href="/psychologist/assessments" className={styles.viewAllLink}>
//                 View All
//               </Link>
//             </div>
//             <div className={styles.contentCardBody}>
//               {recentAssessments?.length > 0 ? (
//                 <div className={styles.assessmentsList}>
//                   {recentAssessments.map((assessment) => (
//                     <Link
//                       key={assessment._id}
//                       href={`/psychologist/assessments/${assessment._id}`}
//                       className={styles.assessmentItem}
//                     >
//                       <div className={styles.assessmentInfo}>
//                         <span className={styles.assessmentStudent}>
//                           {assessment.student?.firstName} {assessment.student?.lastName}
//                         </span>
//                         <span className={styles.assessmentMeta}>
//                           {assessment.assessmentType} • {formatDate(assessment.createdAt)}
//                         </span>
//                       </div>
//                       <div className={styles.assessmentScore}>
//                         <span className={styles.scoreValue}>{assessment.overallScore}%</span>
//                         <span className={`${styles.riskBadge} ${getRiskClass(assessment.riskLevel)}`}>
//                           {assessment.riskLevel}
//                         </span>
//                       </div>
//                     </Link>
//                   ))}
//                 </div>
//               ) : (
//                 <div className={styles.emptyState}>
//                   <div className={styles.emptyStateIcon}>
//                     <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                     </svg>
//                   </div>
//                   <p className={styles.emptyStateText}>No assessments yet</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }