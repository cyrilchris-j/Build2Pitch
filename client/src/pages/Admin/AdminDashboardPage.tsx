import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PlaceholderView } from '@/components/shared/PlaceholderView';

export const AdminDashboardPage: React.FC = () => {
  return (
    <PageContainer
      title="Executive Command Center"
      subtitle="Real-time pulse of teams, registrations, idea distribution, and incoming submissions."
    >
      <PlaceholderView
        title="Event Operations Dashboard"
        routePath="/admin/dashboard"
        module="Admin"
        description="High-level metrics on total teams registered, active participants, idea allocation status, and submission completion rate."
        expectedModels={['EventSettings', 'Team', 'Submission', 'StartupIdea']}
        nextSteps={[
          'Render real-time summary statistics cards (Total Teams, Students, Ideas Seeded, Submissions)',
          'Add master controls: Trigger Idea Reveal, Lock Submissions, Toggle Registration',
          'Display live activity log and recent submissions queue',
          'Connect to adminService.getStats()',
        ]}
        primaryAction={{
          label: 'Manage Teams',
          to: '/admin/teams',
        }}
      />
    </PageContainer>
  );
};
