import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PlaceholderView } from '@/components/shared/PlaceholderView';

export const AdminStudentsPage: React.FC = () => {
  return (
    <PageContainer
      title="Participant Directory"
      subtitle="Complete database of all registered students, team affiliations, and specialized skills."
    >
      <PlaceholderView
        title="Student Roster"
        routePath="/admin/students"
        module="Admin"
        description="Searchable registry of all participating student developers, designers, and pitch leaders."
        expectedModels={['User', 'TeamMember', 'Team']}
        nextSteps={[
          'Render list with filter by specialization (developer, designer, pitcher, etc.)',
          'Show attendance / check-in toggle button',
          'Search by name, email, or team number',
          'Connect to adminService.getStudents()',
        ]}
        primaryAction={{
          label: 'View Startup Idea Bank',
          to: '/admin/ideas',
        }}
      />
    </PageContainer>
  );
};
