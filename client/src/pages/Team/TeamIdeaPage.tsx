import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PlaceholderView } from '@/components/shared/PlaceholderView';

export const TeamIdeaPage: React.FC = () => {
  return (
    <PageContainer
      title="Assigned Startup Idea"
      subtitle="Your team's secret problem statement, target industry, and market challenge."
    >
      <PlaceholderView
        title="Startup Idea Reveal Chamber"
        routePath="/team/idea"
        module="Team"
        description="Inspect the unique startup idea assigned to your team with problem statement, target audience, and suggested revenue streams."
        expectedModels={['StartupIdea', 'IdeaAssignment', 'EventSettings']}
        nextSteps={[
          'Add reveal countdown overlay if ideas are not yet unlocked by admin',
          'Display detailed idea card with industry badge, target demographic, and key MVP features',
          'Add brainstorming notes / canvas section for team collaboration',
          'Connect to teamService.getAssignedIdea()',
        ]}
        primaryAction={{
          label: 'View Deliverables Guidelines',
          to: '/team/instructions',
        }}
      />
    </PageContainer>
  );
};
