import React from 'react';
import { motion } from 'framer-motion';
import { Gauge } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getDashboardDeliverables, getChallengeProgress } from '@/components/dashboard/deliverablesData';
import type { DashboardData } from '@/components/dashboard/dashboardData';

interface ChallengeProgressProps {
  data: DashboardData;
}

export const ChallengeProgress: React.FC<ChallengeProgressProps> = ({ data }) => {
  const items = getDashboardDeliverables(data.submission);
  const { completed, total, percent } = getChallengeProgress(items);

  const stageVariant = data.submissionFinal ? 'success' : data.submission ? 'accent' : 'muted';
  const stageLabel = data.submissionFinal
    ? 'Submitted for judging'
    : data.submission
      ? 'In progress'
      : 'Not started';

  const stageClass =
    stageVariant === 'accent' ? 'bg-[#E63946]/15 text-[#E63946] border-[#E63946]/30' : '';

  return (
    <Card glass={false} className="h-full border-[#242424]">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-white text-sm font-semibold">
            <Gauge className="h-4 w-4 text-[#E63946]" />
            <span>CHALLENGE PROGRESS</span>
          </div>
          <Badge variant={stageVariant} className={stageClass}>
            {stageLabel}
          </Badge>
        </div>
        <CardTitle className="text-white">Sprint Completion</CardTitle>
        <CardDescription className="text-[#8A8A8A]">
          Deliverables gathered toward your final launch.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-end justify-between gap-4">
          <span className="font-display text-5xl font-black tracking-tight text-white">{percent}%</span>
          <span className="pb-1 text-xs text-[#8A8A8A]">
            {completed} / {total} milestones
          </span>
        </div>

        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full border border-[#242424]/60 bg-[#161616]/60">
          <motion.div
            className="h-full rounded-full bg-[#E63946] shadow-[0_0_16px_-2px_rgba(230,57,70,0.8)]"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />
        </div>

        <p className="mt-3 text-xs text-[#8A8A8A]">
          Progress is derived from submitted deliverable links (GitHub, demo, video, pitch deck).
        </p>
      </CardContent>
    </Card>
  );
};