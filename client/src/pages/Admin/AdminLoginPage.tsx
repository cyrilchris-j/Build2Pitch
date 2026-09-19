import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PlaceholderView } from '@/components/shared/PlaceholderView';

export const AdminLoginPage: React.FC = () => {
  return (
    <PageContainer maxWidth="narrow">
      <PlaceholderView
        title="Admin Portal Access"
        routePath="/admin/login"
        module="Admin"
        description="Restricted authentication gateway for event organizers, judges, and system administrators."
        expectedModels={['User', 'ApiResponse']}
        nextSteps={[
          'Create secure admin credentials input (Email & Passkey)',
          'Implement 2FA / security challenge placeholder',
          'Enforce strict role: "admin" verification upon token decode',
          'Redirect to /admin/dashboard',
        ]}
        primaryAction={{
          label: 'Enter Admin Dashboard (Dev Pass)',
          to: '/admin/dashboard',
        }}
      />
    </PageContainer>
  );
};
