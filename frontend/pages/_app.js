// import { useEffect } from 'react';
// import '../styles/globals.css';
// import '../styles/theme.css';
// import 'aos/dist/aos.css';
// import AOS from 'aos';
// import Head from 'next/head';
// import { useRouter } from 'next/router';
// import { AuthProvider } from '@/contexts/AuthContext';
// import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
// import Navbar from '@/components/Navbar';
// import Footer from '@/components/Footer';
// import LoadingScreen from '@/components/LoadingScreen';
// import AdminNavbar from '@/components/admin/AdminNavbar';

// // Create a separate component that uses the context
// function AppContent({ Component, pageProps }) {
//   const router = useRouter();

//   useEffect(() => {
//     AOS.init({
//       duration: 800,
//       once: true,
//     });
//   }, []);

//   // Routes where navbar and footer should be hidden
//   const minimalRoutes = [
//     '/signin',
//     '/signup',
//     '/forgot-password',
//     '/reset-password',
//     '/onboarding',
//     '/psychologist/auth/login',
//     '/psychologist/auth/signup'
//   ];

//   // Updated psychologist dashboard routes based on frontend updates
//   const psychologistRoutes = [
//     '/psychologist/dashboard',
//     '/psychologist/credentials',
//     '/psychologist/blogs'
//   ];

//   // Admin dashboard routes
//   const adminRoutes = [
//     '/admin',
//     '/admin/dashboard',
//     '/admin/users',
//     '/admin/games',
//     '/admin/psychologists',
//     '/admin/login',
//     '/admin/signup'
//   ];

//   // Check layout requirements
//   const isMinimalRoute = minimalRoutes.includes(router.pathname);
//   const isPsychologistRoute = psychologistRoutes.some(route => router.pathname.startsWith(route));
//   const isAdminRoute = adminRoutes.some(route => router.pathname.startsWith(route));
//   const showMainLayout = !isMinimalRoute && !isPsychologistRoute && !isAdminRoute;

//   const adminLayoutStyles = {
//     minHeight: '100vh',
//     backgroundColor: '#121212',
//     color: 'white',
//     fontFamily: '"Raleway", sans-serif',
//     paddingTop: '80px',
//     paddingLeft: '2rem',
//     paddingRight: '2rem'
//   };

//   return (
//     <div className="app-container">
//       <LoadingScreen />
      
//       {/* Conditional rendering based on route type */}
//       {isAdminRoute ? (
//         <>
//           {/* Show admin navbar for authenticated admin routes */}
//           {!['/admin/login', '/admin/signup'].includes(router.pathname) && (
//             <AdminNavbar currentPath={router.pathname} />
//           )}
//           <div style={adminLayoutStyles}>
//             <Component {...pageProps} />
//           </div>
//         </>
//       ) : (
//         <>
//           {/* Show regular navbar for main layout routes */}
//           {showMainLayout && <Navbar currentPath={router.pathname} />}
          
//           <main className={`main-content ${
//             isPsychologistRoute ? 'psychologist-layout' : ''
//           }`}>
//             <Component {...pageProps} />
//           </main>

//           {/* Show regular footer for main layout routes */}
//           {showMainLayout && <Footer />}
//         </>
//       )}
//     </div>
//   );
// }

// function MyApp({ Component, pageProps }) {
//   return (
//     <>
//       <Head>
//         <title>LearnBridge Dyslexia</title>
//         <meta name="description" content="Empowering dyslexic learners" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         {/* ✅ Font link removed - now in _document.js */}
//       </Head>

//       {/* Wrap with providers */}
//       <AuthProvider>
//         <AdminAuthProvider>
//           <AppContent Component={Component} pageProps={pageProps} />
//         </AdminAuthProvider>
//       </AuthProvider>
//     </>
//   );
// }

// export default MyApp;











// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import axios from 'axios';
// import Navbar from '../components/Navbar';
// import '../index.css';

// export default function MyApp({ Component, pageProps }) {
//   const [user, setUser] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       axios.get('http://localhost:5000/api/auth/me', {
//         headers: { 'x-auth-token': token },
//       })
//         .then(res => setUser(res.data))
//         .catch(() => {
//           localStorage.removeItem('token');
//           setUser(null);
//         });
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     router.push('/login');
//   };

//   const protectedRoutes = {
//     user: ['/user/dashboard', '/user/profile', '/user/games', '/user/blogs'],
//     psychologist: [
//       '/psychologist/dashboard',
//       '/psychologist/credentials',
//       '/psychologist/progress',
//       '/psychologist/blogs',
//     ],
//     admin: ['/admin/dashboard', '/admin/users', '/admin/games'],
//   };

//   const isAuthorized = () => {
//     if (!user) return false;
//     const currentPath = router.pathname;
//     return protectedRoutes[user.role]?.includes(currentPath);
//   };

//   useEffect(() => {
//     if (user && !isAuthorized() && router.pathname !== '/login' && router.pathname !== '/signup') {
//       router.push('/login');
//     }
//   }, [user, router.pathname]);

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar user={user} handleLogout={handleLogout} />
//       <Component {...pageProps} setUser={setUser} user={user} />
//     </div>
//   );
// }

















// import '../styles/globals.css';
// import { AuthProvider } from '../contexts/AuthContext';
// import { Toaster } from 'react-hot-toast';
// import { Inter } from 'next/font/google';

// const inter = Inter({ 
//   subsets: ['latin'],
//   weight: ['300', '400', '500', '600', '700']
// });

// function MyApp({ Component, pageProps }) {
//   return (
//     <AuthProvider>
//       <main className={inter.className}>
//         <Component {...pageProps} />
//       </main>
//       <Toaster 
//         position="top-right"
//         toastOptions={{
//           duration: 4000,
//           style: {
//             background: '#363636',
//             color: '#fff',
//           },
//         }}
//       />
//     </AuthProvider>
//   );
// }

// export default MyApp;








// // pages/_app.js
// // LearnBridge Dyslexia Platform - Main App Component

// import '../styles/globals.css';
// // Import psychologist styles only for psychologist routes
// // import '../styles/psychologist/globals.css';

// function MyApp({ Component, pageProps }) {
//   return <Component {...pageProps} />;
// }

// export default MyApp;



































// pages/_app.js
// LearnBridge Dyslexia Platform - Main App Component
// Handles both main site and psychologist dashboard themes

import { useRouter } from 'next/router';
import { useMemo } from 'react';
import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import { Inter, Raleway } from 'next/font/google';

// Font configurations
const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
});

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-raleway',
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  // Check if we're on a psychologist route
  const isPsychologistRoute = router.pathname.startsWith('/psychologist');

  // Toast configurations based on route
  const toastConfig = useMemo(() => isPsychologistRoute 
    ? {
        duration: 4000,
        style: {
          background: '#1e293b',
          color: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #334155',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#f8fafc',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#f8fafc',
          },
        },
      }
    : {
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
        },
      }, [isPsychologistRoute]);

  // Psychologist theme CSS
  const psychologistStyles = `
    body {
      font-family: var(--font-inter), 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
      min-height: 100vh;
    }
    :root {
      --primary-cyan: #00ffff;
      --primary-cyan-dark: #00e6e6;
      --primary-cyan-light: #66ffff;
      --primary-purple: #764ba2;
      --primary-blue: #667eea;
      --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --gradient-cyan: linear-gradient(135deg, #00ffff 0%, #00e6e6 100%);
      --gradient-dark: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
      --gradient-card: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
      --glass-bg: rgba(255, 255, 255, 0.03);
      --glass-border: rgba(255, 255, 255, 0.08);
      --glass-white: rgba(255, 255, 255, 0.85);
      --bg-primary: #0a0a0f;
      --bg-secondary: #111118;
      --bg-tertiary: #1a1a24;
      --bg-card: #16161e;
      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --text-muted: #64748b;
      --accent-success: #10b981;
      --accent-warning: #f59e0b;
      --accent-error: #ef4444;
      --accent-info: #3b82f6;
      --success: #10b981;
      --success-light: rgba(16, 185, 129, 0.1);
      --warning: #f59e0b;
      --warning-light: rgba(245, 158, 11, 0.1);
      --error: #ef4444;
      --error-light: rgba(239, 68, 68, 0.1);
      --info: #3b82f6;
      --info-light: rgba(59, 130, 246, 0.1);
      --gray-50: #f8fafc;
      --gray-100: #f1f5f9;
      --gray-200: #e2e8f0;
      --gray-300: #cbd5e1;
      --gray-400: #94a3b8;
      --gray-500: #64748b;
      --gray-600: #475569;
      --gray-700: #334155;
      --gray-800: #1e293b;
      --gray-900: #0f172a;
      --risk-low: #10b981;
      --risk-medium: #f59e0b;
      --risk-high: #ef4444;
      --risk-low-bg: rgba(16, 185, 129, 0.15);
      --risk-medium-bg: rgba(245, 158, 11, 0.15);
      --risk-high-bg: rgba(239, 68, 68, 0.15);
      --text-xs: 0.75rem;
      --text-sm: 0.875rem;
      --text-base: 1rem;
      --text-lg: 1.125rem;
      --text-xl: 1.25rem;
      --text-2xl: 1.5rem;
      --text-3xl: 1.875rem;
      --text-4xl: 2.25rem;
      --radius-sm: 0.375rem;
      --radius: 0.5rem;
      --radius-md: 0.625rem;
      --radius-lg: 0.75rem;
      --radius-xl: 1rem;
      --radius-2xl: 1.25rem;
      --radius-full: 9999px;
      --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
      --shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      --shadow-md: 0 10px 15px rgba(0, 0, 0, 0.3);
      --shadow-lg: 0 20px 25px rgba(0, 0, 0, 0.4);
      --shadow-glow: 0 0 40px rgba(0, 255, 255, 0.15);
      --transition-fast: 150ms ease;
      --transition: 200ms ease;
      --transition-slow: 300ms ease;
      --z-dropdown: 100;
      --z-sticky: 200;
      --z-fixed: 300;
      --z-modal-backdrop: 400;
      --z-modal: 500;
    }
  `;

  return (
    <AuthProvider>
      {/* Apply fonts globally */}
      <div className={`${inter.variable} ${raleway.variable}`}>
        {/* Psychologist Dashboard Styles */}
        {isPsychologistRoute && (
          <style dangerouslySetInnerHTML={{ __html: psychologistStyles }} />
        )}

        <main className={isPsychologistRoute ? inter.className : raleway.className}>
          <Component {...pageProps} />
        </main>
      </div>
      
      <Toaster 
        position="top-right"
        toastOptions={toastConfig}
      />
    </AuthProvider>
  );
}

export default MyApp;