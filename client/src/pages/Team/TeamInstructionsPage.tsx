import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PlaceholderView } from '@/components/shared/PlaceholderView';

export const TeamInstructionsPage: React.FC = () => {
  return (
    <PageContainer
      title="Sprint Rules & Instructions"
      subtitle="Evaluation criteria, deliverables rubric, and schedule milestones."
    >
      <PlaceholderView
        title="Event Guidelines & Judging Rubric"
        routePath="/team/instructions"
        module="Team"
        description="Comprehensive briefing on how pitches, landing pages, working prototypes, and branding will be graded."
        expectedModels={['EventSettings']}
        nextSteps={[
          'Render timeline breakdown: Ideation, Building, Submission, Pitch Rounds',
          'Display judging rubric weights: Product (30%), Market (25%), Design (20%), Pitch (25%)',
          'Embed official resources, API keys, and templates links',
        ]}
        primaryAction={{
          label: 'Submit Deliverables',
          to: '/team/submission',
        }}
      />
    </PageContainer>
  );
};
