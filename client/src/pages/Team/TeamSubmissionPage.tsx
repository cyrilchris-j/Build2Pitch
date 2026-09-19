import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PlaceholderView } from '@/components/shared/PlaceholderView';

export const TeamSubmissionPage: React.FC = () => {
  return (
    <PageContainer
      title="Final Deliverables Submission"
      subtitle="Lock in your pitch deck, live demo URL, repository, and startup summary before the timer expires."
    >
      <PlaceholderView
        title="Project Submission Portal"
        routePath="/team/submission"
        module="Team"
        description="Form for uploading final startup deliverables (Pitch deck PDF/link, Live prototype website, GitHub repo, Video pitch)."
        expectedModels={['Submission', 'Team', 'EventSettings']}
        nextSteps={[
          'Build form inputs: Startup Name, Tagline, Pitch Deck URL, Live Demo URL, GitHub URL, Tech Stack chips',
          'Add draft saving vs final lock-in submit with confirmation modal',
          'Enforce submission deadline lockout logic based on EventSettings',
          'Connect to submissionService.saveDraft() and submissionService.submitFinal()',
        ]}
        primaryAction={{
          label: 'Review Team Dashboard',
          to: '/team/dashboard',
        }}
      />
    </PageContainer>
  );
};
