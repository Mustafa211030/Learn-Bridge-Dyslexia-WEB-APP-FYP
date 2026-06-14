// pages/unauthorized.jsx
// Unauthorized Access Page

import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Unauthorized.module.css';

const UnauthorizedPage = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    
    const roleMap = {
      'student': '/student/dashboard',
      'psychologist': '/psychologist/dashboard',
      'admin': '/admin/dashboard'
    };
    
    return roleMap[user.role?.toLowerCase()] || '/';
  };

  return (
    <>
      <Head>
        <title>Unauthorized Access | LearnBridge</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.iconWrapper}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.icon}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <h1 className={styles.title}>Access Denied</h1>
          
          <p className={styles.message}>
            You don&apos;t have permission to access this page. 
            This area is restricted to administrators only.
          </p>

          {user && (
            <p className={styles.userInfo}>
              Logged in as: <strong>{user.firstName} {user.lastName}</strong> 
              <span className={styles.roleBadge}>{user.role}</span>
            </p>
          )}

          <div className={styles.actions}>
            <Link href={getDashboardLink()} className={styles.primaryBtn}>
              Go to My Dashboard
            </Link>
            <Link href="/" className={styles.secondaryBtn}>
              Back to Home
            </Link>
          </div>

          {user && (
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Switch Account
            </button>
          )}
        </div>

        <div className={styles.decoration}>
          <div className={styles.circle1}></div>
          <div className={styles.circle2}></div>
          <div className={styles.circle3}></div>
        </div>
      </div>
    </>
  );
};

export default UnauthorizedPage;
