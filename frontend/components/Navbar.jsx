// 'use client';
// import React, { useState, useEffect, useRef } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import styles from './Navbar.module.css';

// const Navbar = () => {
//   const [navActive, setNavActive] = useState(false);
//   const [dropdownActive, setDropdownActive] = useState(false);
//   const [showNavbar, setShowNavbar] = useState(true);
//   const dropdownRef = useRef(null);
//   const prevScrollY = useRef(0);

//   const toggleDropdown = () => {
//     setDropdownActive(prev => !prev);
//   };

//   const toggleNav = () => {
//     setNavActive(prev => !prev);
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownActive(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;

//       if (currentScrollY > prevScrollY.current && currentScrollY > 60) {
//         setShowNavbar(false); // scrolling down
//       } else {
//         setShowNavbar(true); // scrolling up
//       }

//       prevScrollY.current = currentScrollY;
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return (
//     <div className={`${styles.navbar} ${showNavbar ? '' : styles.hidden}`}>
//       <div className={styles.logo}>
//         <Link href="/">
//           <Image src="/logo_b.jpg" alt="Logo" width={140} height={40} />
//         </Link>
//       </div>

//       <div className={`${styles.navLinks} ${navActive ? styles.active : ''}`}>
//         <Link href="/">Home</Link>
//         <Link href="/about-us">About</Link>
//         <Link href="/games">Games</Link>
//         <Link href=".\psychologist\dashboard\profile">Psych DashBoard</Link>
//         <Link href=".\psychologist\blogs-page">Blogs</Link>
//         <Link href="admin/dashboard">Admin DashBoard</Link>
//       </div>

//       <div className={styles.signIn} ref={dropdownRef}>
//         <button className={styles.signInBtn} onClick={toggleDropdown}>Sign In</button>
//         <div className={`${styles.dropdown} ${dropdownActive ? styles.active : ''}`}>
//           <Link href="/signin">User</Link>
//           <Link href=".\psychologist\auth\login">Psychologist</Link>
//           <Link href=".\pages\admin\login">Admin</Link>
//         </div>
//       </div>

//       <div className={styles.hamburger} onClick={toggleNav}>
//         <div></div>
//         <div></div>
//         <div></div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;















import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';  
import { useRouter } from 'next/router';  
import { useAuth } from '../contexts/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const lastScrollY = useRef(0);
  const router = useRouter();  

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide navbar based on scroll direction
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      
      setScrolled(currentScrollY > 20);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    router.push('/login');
  };

  const isActiveRoute = (path) => {
    return router.pathname === path;
  };

  const getUserInitials = (userData) => {
    if (!userData?.firstName && !userData?.lastName) return 'U';
    return `${userData.firstName?.[0] || ''}${userData.lastName?.[0] || ''}`.toUpperCase();
  };

  const getDashboardLink = () => {
    if (!user?.role) return '/';
    
    const normalizedRole = user.role.toLowerCase();
    const roleMap = {
      'admin': '/admin/dashboard',
      'psychologist': '/psychologist/dashboard',
      'student': '/student/dashboard'
    };
    
    return roleMap[normalizedRole] || '/';
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''} ${hidden ? styles.navbarHidden : ''}`}>
      <div className={styles.navbarContainer}>
        {/* Logo */}
        <Link href="/" className={styles.navbarLogo}>
          <div className={styles.logoIcon}>LB</div>
          <span className={styles.logoText}>LearnBridge</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className={`${styles.navbarMenu} ${mobileMenuOpen ? styles.navbarMenuActive : ''}`}>
          <li className={styles.navbarItem}>
            <Link 
              href="/" 
              className={`${styles.navbarLink} ${isActiveRoute('/') ? styles.navbarLinkActive : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li className={styles.navbarItem}>
            <Link 
              href="/about" 
              className={`${styles.navbarLink} ${isActiveRoute('/about') ? styles.navbarLinkActive : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
          </li>
          <li className={styles.navbarItem}>
            <Link 
              href="/games" 
              className={`${styles.navbarLink} ${isActiveRoute('/games') ? styles.navbarLinkActive : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Games
            </Link>
          </li>
          
          {/* Auth Section */}
          <div className={styles.navbarAuth}>
            {isAuthenticated && user ? (
              <>
                <li className={styles.navbarItem}>
                  <Link 
                    href={getDashboardLink()} 
                    className={`${styles.navbarLink} ${isActiveRoute(getDashboardLink()) ? styles.navbarLinkLinkActive : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className={styles.navbarItem}>
                  <Link href="/profile" className={styles.userProfile} onClick={() => setMobileMenuOpen(false)}>
                    <div className={styles.userAvatar}>
                      {getUserInitials(user)}
                    </div>
                    <div className={styles.userInfo}>
                      <span className={styles.userName}>
                        {user.firstName || 'User'}
                      </span>
                      <span className={styles.userRole}>
                        {user.role || 'Member'}
                      </span>
                    </div>
                  </Link>
                </li>
                <li className={styles.navbarItem}>
                  <button 
                    onClick={handleLogout}
                    className={`${styles.authButton} ${styles.authButtonSecondary}`}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className={styles.navbarItem}>
                  <Link 
                    href="/login" 
                    className={`${styles.authButton} ${styles.authButtonSecondary}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </li>
                <li className={styles.navbarItem}>
                  <Link 
                    href="/signup" 
                    className={`${styles.authButton} ${styles.authButtonPrimary}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </div>
        </ul>

        {/* Mobile Menu Toggle */}
        <button 
          className={`${styles.mobileToggle} ${mobileMenuOpen ? styles.mobileToggleActive : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={styles.mobileToggleLine}></span>
          <span className={styles.mobileToggleLine}></span>
          <span className={styles.mobileToggleLine}></span>
        </button>
      </div>
    </nav>
  );
}






















// import { useState, useEffect, useRef } from 'react';
// import Link from 'next/link';  
// import { useRouter } from 'next/router';  
// import { useAuth } from '../contexts/AuthContext';
// import styles from './Navbar.module.css';

// export default function Navbar() {
//   const { user, isAuthenticated, logout } = useAuth();
//   const [scrolled, setScrolled] = useState(false);
//   const [hidden, setHidden] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
//   const lastScrollY = useRef(0);
//   const router = useRouter();

//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;
      
//       // Show/hide navbar based on scroll direction
//       if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
//         setHidden(true);
//       } else {
//         setHidden(false);
//       }
      
//       setScrolled(currentScrollY > 20);
//       lastScrollY.current = currentScrollY;
//     };

//     window.addEventListener('scroll', handleScroll, { passive: true });
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     // Close mobile menu when route changes
//     const handleRouteChange = () => {
//       setMobileMenuOpen(false);
//     };

//     router.events.on('routeChangeStart', handleRouteChange);
//     return () => {
//       router.events.off('routeChangeStart', handleRouteChange);
//     };
//   }, [router]);

//   const handleLogout = async () => {
//     await logout();
//     setMobileMenuOpen(false);
//     router.push('/login');
//   };

//   const isActiveRoute = (path) => {
//     if (path === '/') {
//       return router.pathname === path;
//     }
//     return router.pathname.startsWith(path);
//   };

//   const getUserInitials = (userData) => {
//     if (!userData?.firstName && !userData?.lastName) return 'U';
//     return `${userData.firstName?.[0] || ''}${userData.lastName?.[0] || ''}`.toUpperCase();
//   };

//   const getDashboardLink = () => {
//     if (!user?.role) return '/dashboard';
    
//     const normalizedRole = user.role.toLowerCase();
//     const roleMap = {
//       'admin': '/admin/dashboard',
//       'psychologist': '/psychologist/dashboard',
//       'student': '/student/dashboard',
//       'parent': '/parent/dashboard',
//       'teacher': '/teacher/dashboard'
//     };
    
//     return roleMap[normalizedRole] || '/dashboard';
//   };

//   const getNavLinks = () => {
//     const baseLinks = [
//       { path: '/', label: 'Home', exact: true },
//       { path: '/about', label: 'About Us' },
//       { path: '/games', label: 'Games' },
//       { path: '/resources', label: 'Resources' },
//       { path: '/contact', label: 'Contact' }
//     ];

//     if (isAuthenticated && user) {
//       baseLinks.splice(1, 0, { 
//         path: getDashboardLink(), 
//         label: 'Dashboard',
//         icon: '📊'
//       });
//     }

//     return baseLinks;
//   };

//   const navLinks = getNavLinks();

//   return (
//     <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''} ${hidden ? styles.navbarHidden : ''}`}>
//       <div className={styles.navbarContainer}>
//         {/* Logo */}
//         <Link href="/" className={styles.navbarLogo} onClick={() => setMobileMenuOpen(false)}>
//           <div className={styles.logoIcon}>
//             <span className={styles.logoGradient}>LB</span>
//           </div>
//           <span className={styles.logoText}>
//             Learn<span className={styles.logoHighlight}>Bridge</span>
//           </span>
//         </Link>

//         {/* Desktop Navigation */}
//         <div className={styles.navbarContent}>
//           <ul className={`${styles.navbarMenu} ${mobileMenuOpen ? styles.navbarMenuActive : ''}`}>
//             {navLinks.map((link, index) => (
//               <li key={link.path} className={styles.navbarItem} data-aos="fade-down" data-aos-delay={index * 100}>
//                 <Link 
//                   href={link.path} 
//                   className={`${styles.navbarLink} ${isActiveRoute(link.path) ? styles.navbarLinkActive : ''}`}
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   {link.icon && <span className={styles.linkIcon}>{link.icon}</span>}
//                   {link.label}
//                   {isActiveRoute(link.path) && <span className={styles.activeIndicator}></span>}
//                 </Link>
//               </li>
//             ))}
//           </ul>

//           {/* Auth Section */}
//           <div className={styles.navbarAuth}>
//             {isAuthenticated && user ? (
//               <div className={styles.userSection} data-aos="fade-down" data-aos-delay="500">
//                 <Link 
//                   href="/profile" 
//                   className={styles.userProfile}
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <div className={styles.userAvatar}>
//                     <span className={styles.userInitials}>
//                       {getUserInitials(user)}
//                     </span>
//                   </div>
//                   <div className={styles.userInfo}>
//                     <span className={styles.userName}>
//                       {user.firstName || 'User'}
//                     </span>
//                     <span className={styles.userRole}>
//                       {user.role || 'Member'}
//                     </span>
//                   </div>
//                 </Link>
//                 <div className={styles.authActions}>
//                   <button 
//                     onClick={handleLogout}
//                     className={`${styles.authButton} ${styles.authButtonLogout}`}
//                   >
//                     <svg className={styles.logoutIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                     </svg>
//                     Logout
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className={styles.authButtons} data-aos="fade-down" data-aos-delay="500">
//                 <Link 
//                   href="/login" 
//                   className={`${styles.authButton} ${styles.authButtonSecondary}`}
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
//                   </svg>
//                   Sign In
//                 </Link>
//                 <Link 
//                   href="/signup" 
//                   className={`${styles.authButton} ${styles.authButtonPrimary}`}
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
//                   </svg>
//                   Sign Up
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Mobile Menu Toggle */}
//         <button 
//           className={`${styles.mobileToggle} ${mobileMenuOpen ? styles.mobileToggleActive : ''}`}
//           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           aria-label="Toggle menu"
//           data-aos="fade-down"
//         >
//           <span className={styles.mobileToggleLine}></span>
//           <span className={styles.mobileToggleLine}></span>
//           <span className={styles.mobileToggleLine}></span>
//         </button>
//       </div>

//       {/* Mobile Menu Overlay */}
//       {mobileMenuOpen && (
//         <div 
//           className={styles.mobileOverlay}
//           onClick={() => setMobileMenuOpen(false)}
//         />
//       )}
//     </nav>
//   );
// }