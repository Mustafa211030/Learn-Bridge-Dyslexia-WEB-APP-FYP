// // components/psychologist/layout/PsychologistLayout.jsx
// // Main layout wrapper with sidebar navigation for psychologist module

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import Link from 'next/link';
// import { useAuth } from '../../../contexts/AuthContext';
// import styles from '../../../styles/psychologist/Layout.module.css';

// const PsychologistLayout = ({ children }) => {
//   const router = useRouter();
//   const { user, logout } = useAuth();
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [showUserMenu, setShowUserMenu] = useState(false);

//   // Close mobile menu on route change
//   useEffect(() => {
//     setMobileMenuOpen(false);
//   }, [router.pathname]);

//   // Close user menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showUserMenu && !event.target.closest('.userMenuWrapper')) {
//         setShowUserMenu(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [showUserMenu]);

//   const getInitials = (firstName, lastName) => {
//     return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
//   };

//   const isActiveRoute = (path) => {
//     if (path === '/psychologist/dashboard') {
//       return router.pathname === path;
//     }
//     return router.pathname.startsWith(path);
//   };

//   // Navigation configuration
//   const navigationGroups = [
//     {
//       label: 'Overview',
//       items: [
//         {
//           name: 'Dashboard',
//           path: '/psychologist/dashboard',
//           icon: (
//             <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//             </svg>
//           )
//         }
//       ]
//     },
//     {
//       label: 'Student Management',
//       items: [
//         {
//           name: 'Students',
//           path: '/psychologist/students',
//           icon: (
//             <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//             </svg>
//           )
//         },
//         {
//           name: 'Assessments',
//           path: '/psychologist/assessments',
//           icon: (
//             <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//             </svg>
//           )
//         }
//       ]
//     },
//     {
//       label: 'Content',
//       items: [
//         {
//           name: 'Blog Posts',
//           path: '/psychologist/blogs',
//           icon: (
//             <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//             </svg>
//           )
//         },
//         {
//           name: 'Resources',
//           path: '/psychologist/resources',
//           icon: (
//             <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//             </svg>
//           )
//         }
//       ]
//     },
//     {
//       label: 'Settings',
//       items: [
//         {
//           name: 'My Profile',
//           path: '/psychologist/profile',
//           icon: (
//             <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//             </svg>
//           )
//         }
//       ]
//     }
//   ];

//   const handleLogout = async () => {
//     try {
//       await logout();
//       router.push('/login');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   return (
//     <div className={styles.layoutWrapper}>
//       {/* Mobile Menu Button */}
//       <button
//         className={styles.mobileMenuBtn}
//         onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//         aria-label="Toggle menu"
//       >
//         {mobileMenuOpen ? (
//           <svg className={styles.mobileMenuIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         ) : (
//           <svg className={styles.mobileMenuIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//         )}
//       </button>

//       {/* Mobile Overlay */}
//       <div
//         className={`${styles.mobileOverlay} ${mobileMenuOpen ? styles.mobileOverlayVisible : ''}`}
//         onClick={() => setMobileMenuOpen(false)}
//       />

//       {/* Sidebar */}
//       <aside
//         className={`
//           ${styles.sidebar} 
//           ${sidebarCollapsed ? styles.sidebarCollapsed : ''} 
//           ${mobileMenuOpen ? styles.sidebarVisible : ''}
//         `}
//       >
//         {/* Sidebar Header - Logo */}
//         <div className={styles.sidebarHeader}>
//           <Link href="/psychologist/dashboard" className={styles.logoWrapper}>
//             <div className={styles.logoIcon}>
//               <svg className={styles.logoIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
//               </svg>
//             </div>
//             <div className={styles.logoText}>
//               <span className={styles.logoTitle}>LearnBridge</span>
//               <span className={styles.logoSubtitle}>Psychologist Portal</span>
//             </div>
//           </Link>
//         </div>

//         {/* Sidebar Navigation */}
//         <nav className={styles.sidebarNav}>
//           {navigationGroups.map((group, groupIndex) => (
//             <div key={groupIndex} className={styles.navGroup}>
//               <span className={styles.navGroupLabel}>{group.label}</span>
//               <ul className={styles.navList}>
//                 {group.items.map((item, itemIndex) => (
//                   <li key={itemIndex}>
//                     <Link
//                       href={item.path}
//                       className={`${styles.navItem} ${isActiveRoute(item.path) ? styles.navItemActive : ''}`}
//                     >
//                       {item.icon}
//                       <span className={styles.navLabel}>{item.name}</span>
//                       {item.badge && (
//                         <span className={styles.navBadge}>{item.badge}</span>
//                       )}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </nav>

//         {/* Sidebar Footer - User Profile */}
//         <div className={styles.sidebarFooter}>
//           <div 
//             className={`${styles.userProfile} userMenuWrapper`}
//             onClick={() => setShowUserMenu(!showUserMenu)}
//           >
//             <div className={styles.userAvatar}>
//               {user?.profilePhoto ? (
//                 <img 
//                   src={user.profilePhoto} 
//                   alt="" 
//                   className={styles.userAvatarImg}
//                 />
//               ) : (
//                 getInitials(user?.firstName, user?.lastName)
//               )}
//             </div>
//             <div className={styles.userInfo}>
//               <span className={styles.userName}>
//                 Dr. {user?.firstName} {user?.lastName}
//               </span>
//               <span className={styles.userRole}>Psychologist</span>
//             </div>
//             <svg className={styles.userMenuIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
//             </svg>
//           </div>

//           {/* User Dropdown Menu */}
//           {showUserMenu && (
//             <div className={styles.userDropdown}>
//               <Link href="/psychologist/profile" className={styles.userDropdownItem}>
//                 <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                 </svg>
//                 View Profile
//               </Link>
//               <Link href="/psychologist/settings" className={styles.userDropdownItem}>
//                 <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                 </svg>
//                 Settings
//               </Link>
//               <div className={styles.userDropdownDivider}></div>
//               <button onClick={handleLogout} className={styles.userDropdownItem}>
//                 <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                 </svg>
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Sidebar Toggle Button */}
//         <button
//           className={styles.sidebarToggle}
//           onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
//           aria-label="Toggle sidebar"
//         >
//           <svg className={styles.sidebarToggleIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//         </button>
//       </aside>

//       {/* Main Content Area */}
//       <main className={`${styles.layoutMain} ${sidebarCollapsed ? styles.layoutMainCollapsed : ''}`}>
//         <div className={styles.layoutContent}>
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default PsychologistLayout;


















// components/psychologist/layout/PsychologistLayout.jsx
// Main layout wrapper with sidebar navigation for psychologist module

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import styles from '../../../styles/psychologist/Layout.module.css';

const PsychologistLayout = ({ children }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router.pathname]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.userMenuWrapper')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const isActiveRoute = (path) => {
    if (path === '/psychologist/dashboard') {
      return router.pathname === path;
    }
    return router.pathname.startsWith(path);
  };

  // Navigation configuration
  const navigationGroups = [
    {
      label: 'Overview',
      items: [
        {
          name: 'Dashboard',
          path: '/psychologist/dashboard',
          icon: (
            <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          )
        }
      ]
    },
    {
      label: 'Student Management',
      items: [
        {
          name: 'Students',
          path: '/psychologist/students',
          icon: (
            <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )
        },
        {
          name: 'Assessments',
          path: '/psychologist/assessments',
          icon: (
            <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )
        }
      ]
    },
    {
      label: 'Content',
      items: [
        {
          name: 'Blog Posts',
          path: '/psychologist/blogs',
          icon: (
            <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          )
        },
        {
          name: 'Resources',
          path: '/psychologist/resources',
          icon: (
            <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          )
        }
      ]
    },
    {
      label: 'Settings',
      items: [
        {
          name: 'My Profile',
          path: '/psychologist/profile',
          icon: (
            <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )
        }
      ]
    }
  ];

  // FIXED: Proper logout handler with event stopping
  const handleLogout = async (e) => {
    // Stop event propagation to prevent dropdown from closing before logout
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🚪 Logout button clicked');
    
    try {
      // Close the menu first visually
      setShowUserMenu(false);
      
      // Call the logout function from AuthContext
      await logout();
      
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Even if API fails, still redirect to login
      router.push('/login');
    }
  };

  // Toggle user menu
  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setShowUserMenu(!showUserMenu);
  };

  return (
    <div className={styles.layoutWrapper}>
      {/* Mobile Menu Button */}
      <button
        className={styles.mobileMenuBtn}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <svg className={styles.mobileMenuIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className={styles.mobileMenuIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Overlay */}
      <div
        className={`${styles.mobileOverlay} ${mobileMenuOpen ? styles.mobileOverlayVisible : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`
          ${styles.sidebar} 
          ${sidebarCollapsed ? styles.sidebarCollapsed : ''} 
          ${mobileMenuOpen ? styles.sidebarVisible : ''}
        `}
      >
        {/* Sidebar Header - Logo */}
        <div className={styles.sidebarHeader}>
          <Link href="/psychologist/dashboard" className={styles.logoWrapper}>
            <div className={styles.logoIcon}>
              <svg className={styles.logoIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>LearnBridge</span>
              <span className={styles.logoSubtitle}>Psychologist Portal</span>
            </div>
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <nav className={styles.sidebarNav}>
          {navigationGroups.map((group, groupIndex) => (
            <div key={groupIndex} className={styles.navGroup}>
              <span className={styles.navGroupLabel}>{group.label}</span>
              <ul className={styles.navList}>
                {group.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      href={item.path}
                      className={`${styles.navItem} ${isActiveRoute(item.path) ? styles.navItemActive : ''}`}
                    >
                      {item.icon}
                      <span className={styles.navLabel}>{item.name}</span>
                      {item.badge && (
                        <span className={styles.navBadge}>{item.badge}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer - User Profile */}
        <div className={styles.sidebarFooter}>
          <div 
            className={`${styles.userProfile} userMenuWrapper`}
            onClick={toggleUserMenu}
          >
            <div className={styles.userAvatar}>
              {user?.profilePhoto ? (
                <img 
                  src={user.profilePhoto} 
                  alt="" 
                  className={styles.userAvatarImg}
                />
              ) : (
                getInitials(user?.firstName, user?.lastName)
              )}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>
                Dr. {user?.firstName} {user?.lastName}
              </span>
              <span className={styles.userRole}>Psychologist</span>
            </div>
            <svg className={styles.userMenuIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </div>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className={`${styles.userDropdown} userMenuWrapper`}>
              <Link 
                href="/psychologist/profile" 
                className={styles.userDropdownItem}
                onClick={() => setShowUserMenu(false)}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                View Profile
              </Link>
              <Link 
                href="/psychologist/settings" 
                className={styles.userDropdownItem}
                onClick={() => setShowUserMenu(false)}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Link>
              <div className={styles.userDropdownDivider}></div>
              <button 
                type="button"
                onClick={handleLogout} 
                className={`${styles.userDropdownItem} ${styles.logoutBtn}`}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Toggle Button */}
        <button
          className={styles.sidebarToggle}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label="Toggle sidebar"
        >
          <svg className={styles.sidebarToggleIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className={`${styles.layoutMain} ${sidebarCollapsed ? styles.layoutMainCollapsed : ''}`}>
        <div className={styles.layoutContent}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default PsychologistLayout;