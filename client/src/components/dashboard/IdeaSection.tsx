import React from 'react';
import { Lightbulb, Target, CircleDollarSign, Boxes, type LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { IdeaComplexity } from '@/types';
import type { DashboardData } from '@/components/dashboard/dashboardData';

interface IdeaSectionProps {
  data: DashboardData;
}

const COMPLEXITY_LABELS: Record<IdeaComplexity, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const InfoRow: React.FC<{ icon: LucideIcon; label: string; value?: string | null }> = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="flex items-start gap-2.5 rounded-lg border border-[#242424]/70 bg-[#161616]/60 p-3">
    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#E63946]" />
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8A8A8A]">{label}</p>
      <p className="text-sm text-white">{value ?? '—'}</p>
    </div>
  </div>
);

export const IdeaSection: React.FC<IdeaSectionProps> = ({ data }) => {
  const { idea, ideaAllocated } = data;

  return (
    <Card
      glass={false}
      className="h-full border-[#242424] shadow-[0_0_40px_-12px_rgba(230,57,70,0.35)]"
    >
      <CardHeader>
        <div className="flex items-center gap-2 text-white text-sm font-semibold">
          <Lightbulb className="h-4 w-4 text-[#E63946]" />
          <span>STARTUP IDEA</span>
        </div>
        {idea && ideaAllocated ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="mr-auto text-white">{idea.title}</CardTitle>
              {idea.industry && (
                <Badge variant="primary" className="bg-white/10 text-white border-white/20">
                  {idea.industry}
                </Badge>
              )}
              {idea.complexityLevel && (
                <Badge
                  variant="accent"
                  className="bg-[#E63946]/15 text-[#E63946] border-[#E63946]/30"
                >
                  {COMPLEXITY_LABELS[idea.complexityLevel]}
                </Badge>
              )}
            </div>
            <CardDescription className="text-[#8A8A8A]">
              Problem statement for your one-day build sprint.
            </CardDescription>
          </>
        ) : (
          <>
            <CardTitle className="text-white">Idea Pending Allocation</CardTitle>
            <CardDescription className="text-[#8A8A8A]">
              Your startup challenge brief will be unlocked here once allocated.
            </CardDescription>
          </>
        )}
      </CardHeader>

      <CardContent>
        {idea && ideaAllocated ? (
          <>
            <p className="text-sm leading-relaxed text-[#8A8A8A]">
              {idea.problemStatement ?? 'No problem statement provided yet.'}
            </p>

            <div className="grid grid-cols-1 gap-3 pt-3 sm:grid-cols-2">
              <InfoRow icon={Target} label="Target Users" value={idea.targetAudience} />
              <InfoRow icon={CircleDollarSign} label="Revenue Model" value={idea.revenueModel} />
            </div>

            {idea.keyFeatures.length > 0 && (
              <div className="pt-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
                  <Boxes className="h-3.5 w-3.5" />
                  Key Features
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {idea.keyFeatures.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-md border border-[#E63946]/30 bg-[#E63946]/10 px-2 py-0.5 text-xs font-mono text-[#E63946]"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#242424] py-10 text-center">
            <Lightbulb className="h-6 w-6 text-[#6E6E6E]" />
            <p className="mt-2 text-sm text-[#8A8A8A]">
              Roll for your startup idea from the Idea page.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};