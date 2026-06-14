// components/student/StudentNavbar.jsx
// Top navigation bar for student module

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import NotificationBell from './NotificationBell';
import styles from './StudentNavbar.module.css';

export default function StudentNavbar({ onMenuClick, title, user }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={styles.navbar}>
      <div className={styles.leftSection}>
        {/* Mobile menu button */}
        <button className={styles.menuBtn} onClick={onMenuClick}>
          <span className={styles.menuIcon}>☰</span>
        </button>

        {/* Page title */}
        <h1 className={styles.pageTitle}>{title}</h1>
      </div>

      <div className={styles.rightSection}>
        {/* Search bar (optional) */}
        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search games, books..."
            className={styles.searchInput}
          />
        </div>

        {/* Notifications */}
        <NotificationBell />

        {/* User menu */}
        <div className={styles.userMenu} ref={userMenuRef}>
          <button 
            className={styles.userBtn}
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className={styles.userAvatar}>
              {user?.firstName?.charAt(0) || '👤'}
            </div>
            <span className={styles.userName}>
              {user?.firstName || 'Student'}
            </span>
            <span className={styles.dropdownIcon}>▼</span>
          </button>

          {showUserMenu && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <p className={styles.dropdownName}>
                  {user?.firstName} {user?.lastName}
                </p>
                <p className={styles.dropdownEmail}>{user?.email}</p>
              </div>
              <div className={styles.dropdownDivider}></div>
              <Link href="/student/profile" className={styles.dropdownItem}>
                <span>👤</span> My Profile
              </Link>
              <Link href="/student/settings" className={styles.dropdownItem}>
                <span>⚙️</span> Settings
              </Link>
              <Link href="/student/progress" className={styles.dropdownItem}>
                <span>📊</span> My Progress
              </Link>
              <div className={styles.dropdownDivider}></div>
              <Link href="/help" className={styles.dropdownItem}>
                <span>❓</span> Help & Support
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
