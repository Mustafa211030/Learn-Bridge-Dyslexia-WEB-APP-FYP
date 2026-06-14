// components/student/StudentSidebar.jsx
// Sidebar navigation for student module

import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import styles from './StudentSidebar.module.css';

const menuItems = [
  {
    section: 'Main',
    items: [
      { name: 'Dashboard', path: '/student/dashboard', icon: '🏠' },
      { name: 'My Profile', path: '/student/profile', icon: '👤' },
    ]
  },
  {
    section: 'Learning',
    items: [
      { name: 'Games Hub', path: '/student/games', icon: '🎮' },
      { name: 'E-Books', path: '/student/ebooks', icon: '📚' },
      { name: 'Blogs', path: '/student/blogs', icon: '📝' },
    ]
  },
  {
    section: 'Progress',
    items: [
      { name: 'My Progress', path: '/student/progress', icon: '📊' },
      { name: 'Achievements', path: '/student/achievements', icon: '🏆' },
    ]
  },
  {
    section: 'Family',
    items: [
      { name: 'Parent View', path: '/student/parent-view', icon: '👨‍👩‍👧' },
    ]
  },
  {
    section: 'Settings',
    items: [
      { name: 'Preferences', path: '/student/settings', icon: '⚙️' },
    ]
  }
];

export default function StudentSidebar({ isOpen, onClose, isMobile }) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const isActive = (path) => {
    if (path === '/student/dashboard') {
      return router.pathname === path;
    }
    return router.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      {/* Logo & Brand */}
      <div className={styles.brand}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🎓</span>
          <span className={styles.logoText}>LearnBridge</span>
        </div>
        {isMobile && (
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      {/* User Info */}
      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          {user?.firstName?.charAt(0) || '👤'}
        </div>
        <div className={styles.userDetails}>
          <p className={styles.userName}>
            {user?.firstName} {user?.lastName}
          </p>
          <span className={styles.userRole}>Student</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className={styles.section}>
            <h3 className={styles.sectionTitle}>{section.section}</h3>
            <ul className={styles.menuList}>
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Link
                    href={item.path}
                    className={`${styles.menuItem} ${isActive(item.path) ? styles.active : ''}`}
                  >
                    <span className={styles.menuIcon}>{item.icon}</span>
                    <span className={styles.menuText}>{item.name}</span>
                    {isActive(item.path) && (
                      <span className={styles.activeIndicator}></span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className={styles.logoutSection}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <span className={styles.menuIcon}>🚪</span>
          <span className={styles.menuText}>Logout</span>
        </button>
      </div>
    </aside>
  );
}
