import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PlaceholderView } from '@/components/shared/PlaceholderView';

export const AdminSubmissionsPage: React.FC = () => {
  return (
    <PageContainer
      title="Submissions & Pitch Pipeline"
      subtitle="Review submitted pitch decks, live websites, GitHub repos, and judging scores."
    >
      <PlaceholderView
        title="Submissions Review & Judging Console"
        routePath="/admin/submissions"
        module="Admin"
        description="Judges console for inspecting live deliverables, checking demo links, and inputting rubric scores."
        expectedModels={['Submission', 'Team', 'StartupIdea']}
        nextSteps={[
          'Create submissions table with quick preview modal for pitch decks and live websites',
          'Add submission lock toggle to reject late edits',
          'Add scoring inputs for judges (Problem, Solution, Prototype, Pitch)',
          'Export final rankings leaderboard',
          'Connect to adminService.getSubmissions()',
        ]}
        primaryAction={{
          label: 'Back to Admin Overview',
          to: '/admin/dashboard',
        }}
      />
    </PageContainer>
  );
};
