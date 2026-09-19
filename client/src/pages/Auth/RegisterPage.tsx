import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PlaceholderView } from '@/components/shared/PlaceholderView';

export const RegisterPage: React.FC = () => {
  return (
    <PageContainer maxWidth="narrow">
      <PlaceholderView
        title="Team Leader Registration"
        routePath="/register"
        module="Auth"
        description="Register a new 6-member startup team, designated team lead, and generate team invite code."
        expectedModels={['User', 'Team', 'TeamMember', 'ApiResponse']}
        nextSteps={[
          'Create multi-step team lead signup form (Leader info + Team name)',
          'Validate minimum & maximum team constraints from EventSettings',
          'Wire into authService.register() API',
          'Auto-generate 6-digit unique teamCode for teammates',
        ]}
        primaryAction={{
          label: 'Already have a team? Sign in',
          to: '/login',
        }}
      />
    </PageContainer>
  );
};
