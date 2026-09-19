import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PlaceholderView } from '@/components/shared/PlaceholderView';

export const AdminIdeasPage: React.FC = () => {
  return (
    <PageContainer
      title="Startup Idea Repository"
      subtitle="Curated collection of unique startup problems, market domains, and assignment controls."
    >
      <PlaceholderView
        title="Idea Bank & Auto-Distributor"
        routePath="/admin/ideas"
        module="Admin"
        description="Repository of pre-seeded startup challenges with automatic balanced distribution engine to teams."
        expectedModels={['StartupIdea', 'IdeaAssignment', 'Team']}
        nextSteps={[
          'Create Idea creation modal (Title, industry, problem statement, target audience, key features)',
          'Implement one-click "Auto-Distribute Ideas to Unassigned Teams" button',
          'Show allocation status badge for each idea (Assigned vs Available)',
          'Connect to adminService.getIdeas()',
        ]}
        primaryAction={{
          label: 'View Submissions Pipeline',
          to: '/admin/submissions',
        }}
      />
    </PageContainer>
  );
};
