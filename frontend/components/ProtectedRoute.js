import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('=== PROTECTED ROUTE CHECK ===');
    console.log('Loading:', loading);
    console.log('Is Authenticated:', isAuthenticated);
    console.log('User:', user);
    console.log('User Role:', user?.role);
    console.log('Allowed Roles:', allowedRoles);
    console.log('============================');

    // Only check authentication after loading is complete
    if (!loading) {
      if (!isAuthenticated || !user) {
        console.log('❌ User not authenticated, redirecting to login');
        router.replace('/login');
        return;
      }
      
      if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
        console.log(`❌ User role "${user.role}" not in allowed roles:`, allowedRoles);
        router.replace('/unauthorized');
        return;
      }

      console.log('✅ Access granted for role:', user?.role);
    }
  }, [isAuthenticated, user, loading, router, allowedRoles]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Don't render children if wrong role
  if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return children;
}