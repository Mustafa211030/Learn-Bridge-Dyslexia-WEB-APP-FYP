// components/psychologist/common/ProtectedRoute.jsx
// Protected route wrapper for psychologist dashboard
// Ensures only authenticated psychologists can access protected pages

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../contexts/AuthContext'; // Fixed: 3 levels up from common folder

const ProtectedRoute = ({ children, allowedRoles = ['Psychologist'] }) => {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthorization = () => {
      // Still loading auth state
      if (loading) {
        return;
      }

      // Not authenticated - redirect to login
      if (!isAuthenticated || !user) {
        console.log('🔒 Not authenticated, redirecting to login');
        router.replace('/login');
        return;
      }

      // Check if user has allowed role
      const userRole = user.role?.toLowerCase();
      const hasAllowedRole = allowedRoles.some(
        role => role.toLowerCase() === userRole
      );

      if (!hasAllowedRole) {
        console.log('🚫 User role not authorized:', userRole);
        console.log('Allowed roles:', allowedRoles);
        
        // Redirect based on user's actual role
        if (userRole === 'student') {
          router.replace('/student/dashboard');
        } else if (userRole === 'admin') {
          router.replace('/admin/dashboard');
        } else {
          router.replace('/');
        }
        return;
      }

      // User is authorized
      console.log('✅ User authorized:', user.email, 'Role:', userRole);
      setIsAuthorized(true);
      setCheckingAuth(false);
    };

    checkAuthorization();
  }, [user, isAuthenticated, loading, router, allowedRoles]);

  // Show loading state while checking authentication
  if (loading || checkingAuth) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Verifying access...</p>
        </div>
        <style jsx>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0a0a0f 0%, #111118 50%, #0f172a 100%);
          }
          .loading-spinner {
            text-align: center;
            color: #ffffff;
          }
          .spinner {
            width: 48px;
            height: 48px;
            border: 3px solid rgba(0, 255, 255, 0.1);
            border-top-color: #00ffff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }
          .loading-spinner p {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.875rem;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Not authorized - don't render anything (redirect will happen)
  if (!isAuthorized) {
    return null;
  }

  // Authorized - render children
  return <>{children}</>;
};

export default ProtectedRoute;