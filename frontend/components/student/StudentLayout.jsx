// components/student/StudentLayout.jsx
// Main layout component for student module with sidebar and navbar
// FIXED: Blur/frozen screen issue - proper SSR handling

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import StudentSidebar from './StudentSidebar';
import StudentNavbar from './StudentNavbar';
import ProtectedStudentRoute from './ProtectedStudentRoute';
import { useAuth } from '../../contexts/AuthContext';
import styles from './StudentLayout.module.css';

export default function StudentLayout({ children, title = 'Student Dashboard' }) {
  // IMPORTANT: Start with sidebar closed and assume mobile
  // This prevents the overlay from showing during SSR/hydration
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [isClient, setIsClient] = useState(false);
  
  const { user } = useAuth();
  const router = useRouter();

  // Close sidebar - memoized callback
  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // FIXED: Only run on client after mount
  useEffect(() => {
    // Mark as client-side
    setIsClient(true);
    
    // Now safe to check window
    const mobile = window.innerWidth < 1024;
    setIsMobile(mobile);
    
    // Open sidebar by default on desktop only
    if (!mobile) {
      setSidebarOpen(true);
    }

    const handleResize = () => {
      const nowMobile = window.innerWidth < 1024;
      setIsMobile(nowMobile);
      
      // Auto-close on mobile, auto-open on desktop
      if (nowMobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // FIXED: Only show overlay when:
  // 1. We're on the client (isClient = true)
  // 2. It's mobile view
  // 3. Sidebar is open
  const showOverlay = isClient && isMobile && sidebarOpen;

  return (
    <ProtectedStudentRoute>
      <div className={styles.layout}>
        {/* Sidebar */}
        <StudentSidebar 
          isOpen={sidebarOpen} 
          onClose={closeSidebar}
          isMobile={isMobile}
        />

        {/* Mobile overlay - FIXED: Only render on client when needed */}
        {showOverlay && (
          <div 
            className={styles.overlay}
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Main content area */}
        <div className={`${styles.mainContent} ${sidebarOpen && !isMobile ? styles.withSidebar : ''}`}>
          {/* Top navbar */}
          <StudentNavbar 
            onMenuClick={toggleSidebar}
            title={title}
            user={user}
          />

          {/* Page content */}
          <main className={styles.pageContent}>
            {children}
          </main>

          {/* Footer */}
          <footer className={styles.footer}>
            <p>© {new Date().getFullYear()} LearnBridge. Keep learning, keep growing! 🌟</p>
          </footer>
        </div>
      </div>
    </ProtectedStudentRoute>
  );
}