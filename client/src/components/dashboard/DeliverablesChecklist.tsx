import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ClipboardList } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { fadeIn } from '@/components/dashboard/motion';
import { getDashboardDeliverables } from '@/components/dashboard/deliverablesData';
import type { DashboardData } from '@/components/dashboard/dashboardData';

interface DeliverablesChecklistProps {
  data: DashboardData;
}

export const DeliverablesChecklist: React.FC<DeliverablesChecklistProps> = ({ data }) => {
  const items = getDashboardDeliverables(data.submission);
  const submitted = items.filter((item) => item.status === 'submitted').length;

  return (
    <motion.div variants={fadeIn}>
      <Card glass={false} className="border-[#242424]">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-white text-sm font-semibold">
              <ClipboardList className="h-4 w-4 text-[#E63946]" />
              <span>DELIVERABLES CHECKLIST</span>
            </div>
            <Badge
              variant={submitted === items.length ? 'success' : 'accent'}
              className={
                submitted === items.length
                  ? ''
                  : 'bg-[#E63946]/15 text-[#E63946] border-[#E63946]/30'
              }
            >
              {submitted} / {items.length} COMPLETE
            </Badge>
          </div>
          <CardTitle className="text-white">What You Must Build</CardTitle>
          <CardDescription className="text-[#8A8A8A]">
            Your startup&apos;s required one-day outputs. Statuses derive from existing submission links.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const done = item.status === 'submitted';
              return (
                <div
                  key={item.key}
                  className={
                    done
                      ? 'flex items-center gap-3 rounded-lg border border-[#34D399]/40 bg-[#0F3A2E]/60 p-3'
                      : 'flex items-center gap-3 rounded-lg border border-[#242424]/70 bg-[#161616]/60 p-3'
                  }
                >
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[#34D399]" />
                  ) : (
                    <Circle className="h-5 w-5 shrink-0 text-[#6E6E6E]" />
                  )}
                  <span className="flex-1 text-sm font-medium text-white">{item.label}</span>
                  <Badge
                    variant={done ? 'success' : 'muted'}
                    className={done ? '' : 'text-[#8A8A8A] border-[#242424] bg-[#111111]'}
                  >
                    {done ? 'Done' : 'Pending'}
                  </Badge>
                </div>
              );
            })}
          </div>

          <p className="pt-4 text-[11px] text-[#6E6E6E]">
            Branding items (logo, visiting card, poster, banner) default to pending until live
            deliverable tracking ships.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};