import React from 'react';
import type { UserRole } from '@/types';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

/**
 * ProtectedRoute Placeholder
 * 
 * NOTE: Authentication logic is intentionally bypassed in this foundation phase.
 * In the next implementation sprint, hook this to `useAuth()` context:
 * - Check `isAuthenticated`
 * - Redirect to `/login` if unauthenticated
 * - Verify user role against `allowedRoles`
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  // Placeholder pass-through
  // Example future implementation:
  // const { user, isAuthenticated, isLoading } = useAuth();
  // if (isLoading) return <LoadingScreen />;
  // if (!isAuthenticated) return <Navigate to="/login" replace />;
  // if (allowedRoles && (!user || !allowedRoles.includes(user.role))) return <Navigate to="/unauthorized" replace />;

  if (process.env.NODE_ENV === 'development') {
    // Helpful developer notice in console
    if (allowedRoles) {
      // Allowed roles passed for documentation
    }
  }

  return <>{children}</>;
};
