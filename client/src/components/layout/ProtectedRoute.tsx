import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import type { UserRole } from '@/types';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

/**
 * ProtectedRoute
 * Enforces authentication and Role-Based Access Control (RBAC).
 * - Displays loading screen during session verification
 * - Redirects unauthenticated users to the appropriate login page
 * - Prevents role privilege escalations (e.g., Team Member -> /team/*, Team Lead -> /admin/*)
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen message="Authenticating credentials..." />;
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    const isAdminRoute = location.pathname.startsWith('/admin');
    const redirectTarget = isAdminRoute ? '/admin/login' : '/login';
    return <Navigate to={redirectTarget} state={{ from: location }} replace />;
  }

  // Role validation
  if (allowedRoles && allowedRoles.length > 0) {
    const isAuthorized = hasRole(allowedRoles);

    if (!isAuthorized) {
      // Intelligently redirect to the user's primary portal
      const normalizeRole = (r: string) => {
        const upper = r.toUpperCase();
        if (upper === 'MEMBER') return 'TEAM_MEMBER';
        return upper;
      };

      const userRole = normalizeRole(user.role);

      if (userRole === 'ADMIN') {
        return <Navigate to="/admin/dashboard" replace />;
      } else if (userRole === 'TEAM_LEAD') {
        return <Navigate to="/team/dashboard" replace />;
      } else if (userRole === 'TEAM_MEMBER') {
        return <Navigate to="/member/dashboard" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }

  return <>{children}</>;
};

