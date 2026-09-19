import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PlaceholderView } from '@/components/shared/PlaceholderView';

export const TeamDashboardPage: React.FC = () => {
  return (
    <PageContainer
      title="Team Command Center"
      subtitle="Track your startup sprint progress, deliverables status, and assigned problem statement."
    >
      <PlaceholderView
        title="Team Dashboard Overview"
        routePath="/team/dashboard"
        module="Team"
        description="Central mission control for the 6-member team during the one-day hackathon sprint."
        expectedModels={['Team', 'TeamMember', 'StartupIdea', 'Submission', 'EventSettings']}
        nextSteps={[
          'Display team header with Team Name, Number, and Team Code',
          'Embed countdown timer to final submission deadline',
          'Show quick status cards for 6 Members, Assigned Idea, and Deliverable status',
          'Connect to teamService.getTeamDashboard()',
        ]}
        primaryAction={{
          label: 'View Assigned Idea',
          to: '/team/idea',
        }}
      />
    </PageContainer>
  );
};
