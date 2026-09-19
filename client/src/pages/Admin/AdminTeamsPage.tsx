import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PlaceholderView } from '@/components/shared/PlaceholderView';

export const AdminTeamsPage: React.FC = () => {
  return (
    <PageContainer
      title="Teams Directory"
      subtitle="Inspect and manage all participating student teams, rosters, and assigned tables."
    >
      <PlaceholderView
        title="Teams Management"
        routePath="/admin/teams"
        module="Admin"
        description="Filterable data table of teams, roster completeness, allocated startup ideas, and table assignments."
        expectedModels={['Team', 'TeamMember', 'StartupIdea']}
        nextSteps={[
          'Create data table with search, status filters, and export to CSV',
          'Add team edit modal (Table number, lock/unlock roster, reassign idea)',
          'Add batch actions (Send announcement, export badges)',
          'Connect to adminService.getTeams()',
        ]}
        primaryAction={{
          label: 'View Students Directory',
          to: '/admin/students',
        }}
      />
    </PageContainer>
  );
};
