import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PlaceholderView } from '@/components/shared/PlaceholderView';

export const TeamMembersPage: React.FC = () => {
  return (
    <PageContainer
      title="Team Roster & Roles"
      subtitle="Manage your 6-member squad and assign strategic startup responsibilities."
    >
      <PlaceholderView
        title="6-Member Team Management"
        routePath="/team/members"
        module="Team"
        description="Allocate specialized roles: Team Leader, Full-Stack Developer, UI/UX Designer, Pitch Lead, Market Researcher, Growth Marketer."
        expectedModels={['Team', 'TeamMember', 'User']}
        nextSteps={[
          'Render 6 interactive member slots with role badges',
          'Add modal to invite or add teammate name & email',
          'Enforce exact 6-member limit validation',
          'Connect to teamService.getMembers() and teamService.addMember()',
        ]}
        primaryAction={{
          label: 'Back to Dashboard',
          to: '/team/dashboard',
        }}
      />
    </PageContainer>
  );
};
