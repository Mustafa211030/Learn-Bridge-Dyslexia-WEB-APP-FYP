// components/admin/AdminLayout.jsx
// Premium Admin Layout with Header & Content Area

import { useEffect } from 'react';
import Head from 'next/head';
import AdminSidebar, { SidebarProvider, useSidebar } from './AdminSidebar';
import styles from '../../styles/admin/AdminLayout.module.css';

// Icons
const Icons = {
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9,18 15,12 9,6" />
    </svg>
  ),
};

// Inner Layout Component (uses sidebar context)
const LayoutInner = ({ children, title, breadcrumbs = [] }) => {
  const { isExpanded, isPinned, theme } = useSidebar();
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Generate CSS variables from theme
  const themeStyles = {
    '--primary': theme.primary,
    '--secondary': theme.secondary,
    '--accent': theme.accent,
    '--text': theme.text,
    '--text-muted': theme.textMuted,
    '--border': theme.border,
    '--surface': theme.surface,
  };

  return (
    <div className={styles.layout} style={themeStyles}>
      <AdminSidebar />
      
      <main 
        className={`${styles.main} ${(isExpanded && isPinned) ? styles.sidebarExpanded : styles.sidebarCollapsed}`}
      >
        {/* Top Header Bar */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            {/* Breadcrumbs */}
            <nav className={styles.breadcrumbs}>
              <span className={styles.breadcrumbItem}>Admin</span>
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className={styles.breadcrumbItem}>
                  <Icons.ChevronRight />
                  {crumb}
                </span>
              ))}
            </nav>
            <h1 className={styles.pageTitle}>{title}</h1>
          </div>

          <div className={styles.headerRight}>
            {/* Date Display */}
            <div className={styles.dateDisplay}>
              <Icons.Calendar />
              <span>{currentDate}</span>
            </div>

            {/* Search */}
            <div className={styles.headerSearch}>
              <Icons.Search />
              <input type="text" placeholder="Quick search..." />
            </div>

            {/* Notifications */}
            <button className={styles.notificationBtn}>
              <Icons.Bell />
              <span className={styles.notificationBadge}>3</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className={styles.content}>
          {children}
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>© 2024 LearnBridge. All rights reserved.</p>
          <p>Version 1.0.0</p>
        </footer>
      </main>
    </div>
  );
};

// Main Layout Component
const AdminLayout = ({ children, title = 'Dashboard', breadcrumbs }) => {
  return (
    <>
      <Head>
        <title>{title} | LearnBridge Admin</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <SidebarProvider>
        <LayoutInner title={title} breadcrumbs={breadcrumbs}>
          {children}
        </LayoutInner>
      </SidebarProvider>
    </>
  );
};

export default AdminLayout;
