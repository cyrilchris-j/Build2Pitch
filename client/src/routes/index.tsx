import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import { TeamLayout } from '@/components/layout/TeamLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

// Pages - Landing
import { LandingPage } from '@/pages/Landing/LandingPage';

// Pages - Auth
import { LoginPage } from '@/pages/Auth/LoginPage';
import { RegisterPage } from '@/pages/Auth/RegisterPage';
import { MemberLoginPage } from '@/pages/Auth/MemberLoginPage';

// Pages - Team
import { TeamDashboardPage } from '@/pages/Team/TeamDashboardPage';
import { TeamMembersPage } from '@/pages/Team/TeamMembersPage';
import { TeamIdeaPage } from '@/pages/Team/TeamIdeaPage';
import { TeamInstructionsPage } from '@/pages/Team/TeamInstructionsPage';
import { TeamSubmissionPage } from '@/pages/Team/TeamSubmissionPage';

// Pages - Member
import { MemberDashboardPage } from '@/pages/Member/MemberDashboardPage';

// Pages - Admin
import { AdminLoginPage } from '@/pages/Admin/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/Admin/AdminDashboardPage';
import { AdminTeamsPage } from '@/pages/Admin/AdminTeamsPage';
import { AdminStudentsPage } from '@/pages/Admin/AdminStudentsPage';
import { AdminIdeasPage } from '@/pages/Admin/AdminIdeasPage';
import { AdminSubmissionsPage } from '@/pages/Admin/AdminSubmissionsPage';

// 404
import { NotFoundPage } from '@/pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public & Landing Route */}
      <Route path="/" element={<LandingPage />} />

      {/* Authentication Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/member-login" element={<MemberLoginPage />} />

      {/* Member Portal Route (Strictly for Team Members) */}
      <Route
        path="/member/dashboard"
        element={
          <ProtectedRoute allowedRoles={['TEAM_MEMBER', 'member']}>
            <MemberDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Team Portal Routes (Strictly for Team Leads) */}
      <Route
        path="/team"
        element={
          <ProtectedRoute allowedRoles={['TEAM_LEAD', 'team_lead']}>
            <TeamLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<TeamDashboardPage />} />
        <Route path="members" element={<TeamMembersPage />} />
        <Route path="idea" element={<TeamIdeaPage />} />
        <Route path="instructions" element={<TeamInstructionsPage />} />
        <Route path="submission" element={<TeamSubmissionPage />} />
      </Route>

      {/* Admin Portal Authentication */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin Portal Routes (Strictly for Admins) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="teams" element={<AdminTeamsPage />} />
        <Route path="students" element={<AdminStudentsPage />} />
        <Route path="ideas" element={<AdminIdeasPage />} />
        <Route path="submissions" element={<AdminSubmissionsPage />} />
      </Route>

      {/* Fallback 404 Handler */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
