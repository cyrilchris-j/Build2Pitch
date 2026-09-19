import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Rocket, Hash, MapPin, Lightbulb, FileText, Upload } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { fadeUp } from '@/components/dashboard/motion';
import type { DashboardData } from '@/components/dashboard/dashboardData';

interface StartupOverviewProps {
  data: DashboardData;
}

const chipClass =
  'inline-flex items-center gap-1.5 rounded-full border border-[#242424]/70 bg-[#111111]/80 px-3 py-1 text-xs font-medium text-[#8A8A8A]';

export const StartupOverview: React.FC<StartupOverviewProps> = ({ data }) => {
  const { team, idea, ideaAllocated, ideaRevealed, members } = data;

  const rosterCount = members.length || team?.memberCount || 0;
  const rosterLabel = `${rosterCount} / 6`;

  const ideaStatusLabel = !ideaAllocated
    ? 'AWAITING IDEA'
    : ideaRevealed
      ? 'IDEA REVEALED'
      : 'IDEA ALLOCATED';
  const ideaStatusVariant = !ideaAllocated ? 'muted' : ideaRevealed ? 'success' : 'accent';
  const ideaStatusClass = ideaStatusVariant === 'accent' ? 'bg-[#E63946]/15 text-[#E63946] border-[#E63946]/30' : '';

  const actions = [
    { label: 'View My Idea', to: '/team/idea', icon: Lightbulb },
    { label: 'Challenge Instructions', to: '/team/instructions', icon: FileText },
    { label: 'Submit Deliverables', to: '/team/submission', icon: Upload, primary: true },
  ];

  return (
    <motion.section variants={fadeUp}>
      <Card
        glass={false}
        className="relative overflow-hidden border-[#242424] shadow-[0_0_40px_-10px_rgba(230,57,70,0.45)]"
      >
        <div className="pointer-events-none absolute -inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E63946]/60 to-transparent" />
        <div className="pointer-events-none absolute -top-28 -right-20 h-72 w-72 rounded-full bg-[#E63946]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-white/5 blur-3xl" />

        <div className="relative flex flex-col gap-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white">
                <Rocket className="h-5 w-5 text-[#E63946]" />
                <span className="font-display text-sm font-extrabold uppercase tracking-[0.2em]">
                  BUILD<span className="text-[#E63946]">2</span>PITCH
                </span>
              </div>

              <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {team?.name ?? 'Your Team'}
              </h1>

              <div className="flex flex-wrap items-center gap-2.5">
                <span className={chipClass}>
                  <Hash className="h-3 w-3 text-white" />
                  Team ID: {team?.teamCode ?? '—'}
                </span>
                <span className={chipClass}>
                  <MapPin className="h-3 w-3 text-[#E63946]" />
                  Table: {team?.tableNumber ?? '—'}
                </span>
                <span className={chipClass}>
                  <Rocket className="h-3 w-3 text-[#8A8A8A]" />
                  Team #{team?.teamNumber ?? '—'}
                </span>
                {team?.isLocked && <Badge variant="danger">TEAM LOCKED</Badge>}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Badge variant={ideaStatusVariant} className={ideaStatusClass}>
                {ideaStatusLabel}
              </Badge>
              <Badge
                variant={rosterCount === 6 ? 'success' : 'accent'}
                className={
                  rosterCount === 6 ? '' : 'bg-[#E63946]/15 text-[#E63946] border-[#E63946]/30'
                }
              >
                ROSTER {rosterLabel}
              </Badge>
            </div>
          </div>

          <div className="border-t border-[#242424]/60 pt-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E63946]/30 bg-[#E63946]/10 text-[#E63946]">
                <Lightbulb className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
                  Startup Idea
                </p>
                <p className="mt-0.5 font-display text-lg font-bold text-white">
                  {idea?.title ?? 'Awaiting startup allocation'}
                </p>
                {idea?.industry && (
                  <Badge
                    variant="primary"
                    className="mt-1.5 bg-white/10 text-white border-white/20"
                  >
                    {idea.industry}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 border-t border-[#242424]/60 pt-4">
            {actions.map(({ label, to, icon: Icon, primary }) => (
              <Link key={to} to={to}>
                <Button
                  variant={primary ? 'primary' : 'outline'}
                  size="sm"
                  className={`gap-1.5 ${
                    primary
                      ? 'bg-[#E63946] hover:bg-[#C3273B] text-white shadow-[0_0_22px_-6px_rgba(230,57,70,0.7)] focus:ring-[#E63946]'
                      : 'border-[#242424] text-white hover:border-[#E63946]/60 hover:bg-[#161616] focus:ring-[#E63946]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </Card>
    </motion.section>
  );
};