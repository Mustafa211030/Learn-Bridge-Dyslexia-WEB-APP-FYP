// components/admin/AdminProtectedRoute.jsx
// Admin Protected Route - Restricts access to admin users only
// Uses AuthContext for role-based authentication

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/admin/AdminProtectedRoute.module.css';

const AdminProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Wait for auth context to finish loading
    if (loading) return;

    // Not authenticated - redirect to login
    if (!isAuthenticated || !user) {
      console.log('🔒 Not authenticated, redirecting to login');
      router.replace('/login?redirect=' + encodeURIComponent(router.asPath));
      return;
    }

    // Check if user is admin (case-insensitive)
    const userRole = user?.role?.toLowerCase();
    const isAdmin = userRole === 'admin';

    if (!isAdmin) {
      console.log('⛔ User is not admin, role:', user?.role);
      router.replace('/admin/unauthorized');
      return;
    }

    // User is authorized admin
    console.log('✅ Admin access granted for:', user.firstName, user.lastName);
    setIsAuthorized(true);
    setCheckingAuth(false);

  }, [user, isAuthenticated, loading, router]);

  // Loading state - waiting for auth check
  if (loading || checkingAuth) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}>
            <div className={styles.spinnerRing}></div>
            <div className={styles.spinnerRing}></div>
            <div className={styles.spinnerRing}></div>
          </div>
          <h2 className={styles.loadingTitle}>Verifying Access</h2>
          <p className={styles.loadingText}>Please wait while we verify your admin credentials...</p>
        </div>
      </div>
    );
  }

  // Not authorized - show redirect message
  if (!isAuthorized) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.redirectIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16,17 21,12 16,7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </div>
          <h2 className={styles.loadingTitle}>Redirecting...</h2>
          <p className={styles.loadingText}>Taking you to the appropriate page</p>
        </div>
      </div>
    );
  }

  // Authorized - render children
  return <>{children}</>;
};

export default AdminProtectedRoute;