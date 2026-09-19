import React from 'react';
import { CheckCircle2, Clock, Circle, ListChecks } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime } from '@/components/dashboard/dashboardData';
import { getDashboardDeliverables, getChallengeProgress } from '@/components/dashboard/deliverablesData';
import type { DashboardData } from '@/components/dashboard/dashboardData';

interface SubmissionStatusCardProps {
  data: DashboardData;
}

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-lg border border-[#242424]/70 bg-[#161616]/60 p-3">
    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A8A8A]">{label}</p>
    <p className="mt-0.5 truncate text-sm font-semibold text-white" title={value}>
      {value}
    </p>
  </div>
);

export const SubmissionStatusCard: React.FC<SubmissionStatusCardProps> = ({ data }) => {
  const { submission, submissionSubmitted, submissionFinal } = data;
  const items = getDashboardDeliverables(submission);
  const { completed, total } = getChallengeProgress(items);

  const status = submissionFinal ? 'LOCKED' : submissionSubmitted ? 'IN PROGRESS' : 'NOT STARTED';
  const variant = submissionFinal ? 'success' : submissionSubmitted ? 'accent' : 'muted';
  const StatusIcon = submissionFinal ? CheckCircle2 : submissionSubmitted ? Clock : Circle;

  const statusClass =
    variant === 'accent' ? 'bg-[#E63946]/15 text-[#E63946] border-[#E63946]/30' : '';

  const statusText = submissionFinal
    ? 'Final submission locked'
    : submissionSubmitted
      ? 'Submission in progress'
      : 'Not started yet';

  const stageHint = submissionFinal
    ? 'Ready for judging review'
    : submissionSubmitted
      ? 'Keep capturing deliverables'
      : 'Upload the first branding asset';

  return (
    <Card glass={false} className="h-full border-[#242424]">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white text-sm font-semibold">
            <ListChecks className="h-4 w-4 text-[#E63946]" />
            <span>SUBMISSION STATUS</span>
          </div>
          <Badge variant={variant} className={statusClass}>
            {status}
          </Badge>
        </div>
        <CardTitle className="text-white">Launch Pipeline</CardTitle>
        <CardDescription className="text-[#8A8A8A]">
          Final deliverable lock-in for your startup.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-3 rounded-lg border border-[#242424]/70 bg-[#161616]/60 p-3.5">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
              submissionFinal
                ? 'border-success/30 bg-success/10 text-success'
                : submissionSubmitted
                  ? 'border-[#E63946]/30 bg-[#E63946]/10 text-[#E63946]'
                  : 'border-white/15 bg-white/10 text-white'
            }`}
          >
            <StatusIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{statusText}</p>
            <p className="text-xs text-[#8A8A8A]">{stageHint}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3">
          <Stat label="Deliverables" value={`${completed} / ${total}`} />
          <Stat label="Last update" value={formatDateTime(submission?.submittedAt)} />
        </div>

        {submission?.startupName && (
          <p className="pt-3 text-xs text-[#8A8A8A]">
            Startup: {submission.startupName}
            {submission.tagline ? ` — ${submission.tagline}` : ''}
          </p>
        )}
      </CardContent>
    </Card>
  );
};