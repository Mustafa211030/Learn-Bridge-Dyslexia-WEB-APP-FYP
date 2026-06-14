// components/student/ProtectedStudentRoute.jsx
// Protected route wrapper for student-only pages
// FIXED: Proper loading state handling

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import styles from './ProtectedStudentRoute.module.css';

export default function ProtectedStudentRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [authState, setAuthState] = useState('checking'); // 'checking', 'authorized', 'redirecting'

  useEffect(() => {
    // Still loading auth state
    if (loading) {
      setAuthState('checking');
      return;
    }

    // Not authenticated
    if (!isAuthenticated) {
      setAuthState('redirecting');
      router.push('/login?redirect=' + encodeURIComponent(router.asPath));
      return;
    }

    // Check if user is a student
    const role = user?.role?.toLowerCase();
    
    if (role === 'student') {
      // User is authorized!
      setAuthState('authorized');
    } else {
      // Not a student - redirect
      setAuthState('redirecting');
      console.warn('Access denied: User is not a student, role:', role);
      
      if (role === 'admin') {
        router.push('/admin/dashboard');
      } else if (role === 'psychologist') {
        router.push('/psychologist/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [isAuthenticated, user, loading, router]);

  // Show loading spinner only while checking
  if (authState === 'checking') {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading...</p>
        </div>
      </div>
    );
  }

  // Show redirecting message briefly
  if (authState === 'redirecting') {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Redirecting...</p>
        </div>
      </div>
    );
  }

  // User is authorized - render children
  return <>{children}</>;
}