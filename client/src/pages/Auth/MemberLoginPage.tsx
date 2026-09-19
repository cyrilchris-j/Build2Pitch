import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PlaceholderView } from '@/components/shared/PlaceholderView';

export const MemberLoginPage: React.FC = () => {
  return (
    <PageContainer maxWidth="narrow">
      <PlaceholderView
        title="Team Member Access Pass"
        routePath="/member-login"
        module="Auth"
        description="Fast access login for 6-member team participants using unique Team Code or Member ID."
        expectedModels={['Team', 'TeamMember', 'ApiResponse']}
        nextSteps={[
          'Create high-contrast PIN/Invite-code input field',
          'Allow team members to claim their specialized profile slot (Developer, Designer, etc.)',
          'Wire into authService.memberLogin()',
          'Navigate directly to /member/dashboard',
        ]}
        primaryAction={{
          label: 'Team Leader Portal',
          to: '/login',
        }}
      />
    </PageContainer>
  );
};
