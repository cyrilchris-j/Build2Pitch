import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PlaceholderView } from '@/components/shared/PlaceholderView';

export const LoginPage: React.FC = () => {
  return (
    <PageContainer maxWidth="narrow">
      <PlaceholderView
        title="Team Leader & User Login"
        routePath="/login"
        module="Auth"
        description="Authenticate registered team leads and participants with email and password."
        expectedModels={['User', 'Team', 'ApiResponse']}
        nextSteps={[
          'Create email & password login form',
          'Wire into authService.login() endpoint',
          'Store JWT token in localStorage and AuthContext',
          'Redirect to /team/dashboard or /admin/dashboard based on role',
        ]}
        primaryAction={{
          label: 'Register New Team',
          to: '/register',
        }}
      />
    </PageContainer>
  );
};
