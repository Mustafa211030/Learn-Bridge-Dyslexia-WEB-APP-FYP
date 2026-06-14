// components/admin/AdminSidebar.jsx
// Premium Customizable Admin Sidebar with Beautiful UI

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/admin/AdminSidebar.module.css';
import Cookies from 'js-cookie';

// Sidebar Context for global state
const SidebarContext = createContext();

export const useSidebar = () => useContext(SidebarContext);

// Theme configurations
const themes = {
  midnight: {
    name: 'Midnight Blue',
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#a855f7',
    bg: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
    surface: 'rgba(30, 27, 75, 0.6)',
    text: '#f1f5f9',
    textMuted: '#94a3b8',
    border: 'rgba(99, 102, 241, 0.2)',
  },
  aurora: {
    name: 'Aurora',
    primary: '#10b981',
    secondary: '#14b8a6',
    accent: '#06b6d4',
    bg: 'linear-gradient(180deg, #042f2e 0%, #064e3b 50%, #042f2e 100%)',
    surface: 'rgba(6, 78, 59, 0.5)',
    text: '#ecfdf5',
    textMuted: '#6ee7b7',
    border: 'rgba(16, 185, 129, 0.2)',
  },
  sunset: {
    name: 'Sunset',
    primary: '#f59e0b',
    secondary: '#f97316',
    accent: '#ef4444',
    bg: 'linear-gradient(180deg, #1c1917 0%, #292524 50%, #1c1917 100%)',
    surface: 'rgba(41, 37, 36, 0.7)',
    text: '#fef3c7',
    textMuted: '#d6d3d1',
    border: 'rgba(245, 158, 11, 0.2)',
  },
  ocean: {
    name: 'Ocean',
    primary: '#0ea5e9',
    secondary: '#06b6d4',
    accent: '#3b82f6',
    bg: 'linear-gradient(180deg, #0c1929 0%, #0e2442 50%, #0c1929 100%)',
    surface: 'rgba(14, 36, 66, 0.7)',
    text: '#e0f2fe',
    textMuted: '#7dd3fc',
    border: 'rgba(14, 165, 233, 0.2)',
  },
  rose: {
    name: 'Rose',
    primary: '#ec4899',
    secondary: '#f472b6',
    accent: '#a855f7',
    bg: 'linear-gradient(180deg, #1a0a14 0%, #2d1f2d 50%, #1a0a14 100%)',
    surface: 'rgba(45, 31, 45, 0.7)',
    text: '#fce7f3',
    textMuted: '#f9a8d4',
    border: 'rgba(236, 72, 153, 0.2)',
  },
};

// Icon Components
const Icons = {
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Games: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="11" x2="10" y2="11" />
      <line x1="8" y1="9" x2="8" y2="13" />
      <line x1="15" y1="12" x2="15.01" y2="12" />
      <line x1="18" y1="10" x2="18.01" y2="10" />
      <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
    </svg>
  ),
  Content: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  ),
  Analytics: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Reports: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7,10 12,15 17,10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Logs: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  ),
  Psychologist: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  Chevron: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9,18 15,12 9,6" />
    </svg>
  ),
  Menu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  Close: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Logout: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16,17 21,12 16,7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Sun: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  Palette: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
    </svg>
  ),
  Pin: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
};

// Navigation Items Configuration
const navigationItems = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: Icons.Dashboard, 
    path: '/admin/dashboard',
    badge: null 
  },
  { 
    id: 'users', 
    label: 'Users', 
    icon: Icons.Users, 
    path: '/admin/users',
    badge: null,
    children: [
      { id: 'all-users', label: 'All Users', path: '/admin/users' },
      { id: 'students', label: 'Students', path: '/admin/users?role=Student' },
      { id: 'psychologists', label: 'Psychologists', path: '/admin/users/psychologists' },
    ]
  },
  { 
    id: 'games', 
    label: 'Games', 
    icon: Icons.Games, 
    path: '/admin/games',
    badge: null 
  },
  { 
    id: 'content', 
    label: 'Content', 
    icon: Icons.Content, 
    path: '/admin/content/blogs',
    badge: null,
    children: [
      { id: 'blogs', label: 'Blog Posts', path: '/admin/content/blogs' },
      { id: 'ebooks', label: 'E-Books', path: '/admin/content/ebooks' },
    ]
  },
  { 
    id: 'analytics', 
    label: 'Analytics', 
    icon: Icons.Analytics, 
    path: '/admin/analytics',
    badge: null 
  },
  { 
    id: 'reports', 
    label: 'Reports', 
    icon: Icons.Reports, 
    path: '/admin/reports',
    badge: null 
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: Icons.Settings, 
    path: '/admin/settings',
    badge: null 
  },
  { 
    id: 'logs', 
    label: 'Audit Logs', 
    icon: Icons.Logs, 
    path: '/admin/audit-logs',
    badge: null 
  },
];

// Sidebar Provider Component
export const SidebarProvider = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isPinned, setIsPinned] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('midnight');
  const [showThemePicker, setShowThemePicker] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('admin-theme');
    const savedPinned = localStorage.getItem('admin-sidebar-pinned');
    if (savedTheme && themes[savedTheme]) setActiveTheme(savedTheme);
    if (savedPinned !== null) setIsPinned(savedPinned === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('admin-theme', activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    localStorage.setItem('admin-sidebar-pinned', isPinned.toString());
  }, [isPinned]);

  const theme = themes[activeTheme];

  return (
    <SidebarContext.Provider value={{
      isExpanded, setIsExpanded,
      isPinned, setIsPinned,
      isMobileOpen, setIsMobileOpen,
      activeTheme, setActiveTheme,
      showThemePicker, setShowThemePicker,
      theme, themes
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Main Sidebar Component
const AdminSidebar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const {
    isExpanded, setIsExpanded,
    isPinned, setIsPinned,
    isMobileOpen, setIsMobileOpen,
    activeTheme, setActiveTheme,
    showThemePicker, setShowThemePicker,
    theme, themes
  } = useSidebar();

  const [expandedMenus, setExpandedMenus] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const handleMouseEnter = () => {
    if (!isPinned) setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (!isPinned) setIsExpanded(false);
  };

  const toggleSubmenu = (id) => {
    setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isActivePath = (path) => {
    if (path === '/admin/dashboard') return router.pathname === path;
    return router.pathname.startsWith(path.split('?')[0]);
  };

  const handleLogout = async () => {
  try {
    // Clear token and auth state immediately
    Cookies.remove('auth_token');
    
    // Call logout from auth context (ignore any errors)
    await logout().catch(err => {
      console.log('Logout API error ignored:', err.message);
    });
    
    // Force redirect to login page
    router.replace('/login');
  } catch (error) {
    // Even if everything fails, clear local data and redirect
    console.error('Logout error:', error);
    Cookies.remove('auth_token');
    router.replace('/login');
  }
};

  const filteredNavItems = navigationItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.children?.some(child => child.label.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Generate CSS variables from theme
  const themeStyles = {
    '--primary': theme.primary,
    '--secondary': theme.secondary,
    '--accent': theme.accent,
    '--bg': theme.bg,
    '--surface': theme.surface,
    '--text': theme.text,
    '--text-muted': theme.textMuted,
    '--border': theme.border,
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className={styles.mobileOverlay} 
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button 
        className={styles.mobileToggle}
        onClick={() => setIsMobileOpen(true)}
        style={{ '--primary': theme.primary }}
      >
        <Icons.Menu />
      </button>

      {/* Main Sidebar */}
      <aside
        className={`${styles.sidebar} ${isExpanded ? styles.expanded : styles.collapsed} ${isMobileOpen ? styles.mobileOpen : ''}`}
        style={themeStyles}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logoSection}>
            <div className={styles.logoIcon}>
              <span>LB</span>
            </div>
            {isExpanded && (
              <div className={styles.logoText}>
                <span className={styles.logoTitle}>LearnBridge</span>
                <span className={styles.logoSubtitle}>Admin Panel</span>
              </div>
            )}
          </div>
          
          {isExpanded && (
            <div className={styles.headerActions}>
              <button 
                className={`${styles.pinBtn} ${isPinned ? styles.pinned : ''}`}
                onClick={() => setIsPinned(!isPinned)}
                title={isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
              >
                <Icons.Pin />
              </button>
              <button 
                className={styles.mobileCloseBtn}
                onClick={() => setIsMobileOpen(false)}
              >
                <Icons.Close />
              </button>
            </div>
          )}
        </div>

        {/* Search */}
        {isExpanded && (
          <div className={styles.searchSection}>
            <div className={styles.searchBox}>
              <Icons.Search />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className={styles.navigation}>
          <div className={styles.navSection}>
            {isExpanded && <span className={styles.navSectionTitle}>Main Menu</span>}
            <ul className={styles.navList}>
              {filteredNavItems.map((item) => (
                <li key={item.id} className={styles.navItem}>
                  {item.children ? (
                    <>
                      <button
                        className={`${styles.navLink} ${isActivePath(item.path) ? styles.active : ''}`}
                        onClick={() => toggleSubmenu(item.id)}
                      >
                        <span className={styles.navIcon}>
                          <item.icon />
                        </span>
                        {isExpanded && (
                          <>
                            <span className={styles.navLabel}>{item.label}</span>
                            <span className={`${styles.navChevron} ${expandedMenus[item.id] ? styles.rotated : ''}`}>
                              <Icons.Chevron />
                            </span>
                          </>
                        )}
                      </button>
                      {isExpanded && expandedMenus[item.id] && (
                        <ul className={styles.submenu}>
                          {item.children.map((child) => (
                            <li key={child.id}>
                              <Link 
                                href={child.path}
                                className={`${styles.submenuLink} ${router.asPath === child.path ? styles.active : ''}`}
                              >
                                <span className={styles.submenuDot}></span>
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link 
                      href={item.path}
                      className={`${styles.navLink} ${isActivePath(item.path) ? styles.active : ''}`}
                    >
                      <span className={styles.navIcon}>
                        <item.icon />
                      </span>
                      {isExpanded && (
                        <>
                          <span className={styles.navLabel}>{item.label}</span>
                          {item.badge && (
                            <span className={styles.navBadge}>{item.badge}</span>
                          )}
                        </>
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Theme Picker */}
        {isExpanded && (
          <div className={styles.themePicker}>
            <button 
              className={styles.themeToggle}
              onClick={() => setShowThemePicker(!showThemePicker)}
            >
              <Icons.Palette />
              <span>Theme</span>
              <span className={styles.currentTheme}>{theme.name}</span>
            </button>
            
            {showThemePicker && (
              <div className={styles.themeOptions}>
                {Object.entries(themes).map(([key, t]) => (
                  <button
                    key={key}
                    className={`${styles.themeOption} ${activeTheme === key ? styles.activeTheme : ''}`}
                    onClick={() => {
                      setActiveTheme(key);
                      setShowThemePicker(false);
                    }}
                  >
                    <span 
                      className={styles.themeColor}
                      style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})` }}
                    />
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Section */}
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user?.firstName?.charAt(0) || 'A'}{user?.lastName?.charAt(0) || 'D'}
            </div>
            {isExpanded && (
              <div className={styles.userDetails}>
                <span className={styles.userName}>
                  {user?.firstName || 'Admin'} {user?.lastName || 'User'}
                </span>
                <span className={styles.userRole}>{user?.role || 'Administrator'}</span>
              </div>
            )}
          </div>
          
          {isExpanded && (
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <Icons.Logout />
              <span>Logout</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;