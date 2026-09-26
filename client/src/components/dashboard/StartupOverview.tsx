import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Hash, MapPin, Lightbulb, FileText, Upload, Users } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { fadeUp } from '@/components/dashboard/motion';
import type { DashboardData } from '@/components/dashboard/dashboardData';

interface StartupOverviewProps {
  data: DashboardData;
}

export const StartupOverview: React.FC<StartupOverviewProps> = ({ data }) => {
  const { team, idea, ideaAllocated, ideaRevealed, members } = data;

  const rosterCount = members.length || team?.memberCount || 0;
  const rosterLabel = `${rosterCount} / 6`;
  const isValidTeam = rosterCount >= 2;

  const ideaStatusLabel = !ideaAllocated
    ? 'AWAITING IDEA'
    : ideaRevealed
      ? 'IDEA REVEALED'
      : 'IDEA ALLOCATED';
  const ideaStatusVariant = !ideaAllocated ? 'muted' : ideaRevealed ? 'success' : 'accent';

  const actions = [
    { label: 'View My Idea', to: '/team/idea', icon: Lightbulb, primary: false },
    { label: 'Instructions', to: '/team/instructions', icon: FileText, primary: false },
    { label: 'Submit Deliverables', to: '/team/submission', icon: Upload, primary: true },
  ];

  return (
    <motion.section variants={fadeUp}>
      {/* Main hero card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-background-elevated">
        {/* Ambient top glow line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        {/* Ambient orbs */}
        <div className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full bg-primary/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-purple/5 blur-3xl" />

        <div className="relative p-6 sm:p-8 flex flex-col gap-6">

          {/* ── Header row ──────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            {/* Left: brand + team name */}
            <div className="space-y-3">
              {/* Brand pill */}
              <div className="inline-flex items-center gap-2 text-primary">
                <Zap className="h-4 w-4" />
                <span className="font-display text-xs font-extrabold uppercase tracking-[0.2em]">
                  BUILD<span className="text-primary">2</span>PITCH
                </span>
              </div>

              {/* Team Name */}
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                {team?.name ?? 'Your Team'}
              </h1>

              {/* Meta chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground-muted">
                  <Hash className="h-3 w-3 text-primary" />
                  {team?.teamCode ?? '—'}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground-muted">
                  <MapPin className="h-3 w-3 text-foreground-subtle" />
                  Table: {team?.tableNumber ?? 'TBA'}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground-muted">
                  <Users className="h-3 w-3 text-foreground-subtle" />
                  Team #{team?.teamNumber ?? '—'}
                </span>
                {team?.isLocked && <Badge variant="danger">TEAM LOCKED</Badge>}
              </div>
            </div>

            {/* Right: status badges */}
            <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2">
              <Badge variant={ideaStatusVariant}>{ideaStatusLabel}</Badge>
              <Badge variant={isValidTeam ? 'success' : 'muted'}>
                ROSTER {rosterLabel}{isValidTeam ? ' (VALID TEAM)' : ''}
              </Badge>
            </div>
          </div>

          {/* ── Idea Row ─────────────────────────────────── */}
          <div className="border-t border-border/60 pt-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                <Lightbulb className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle mb-1">
                  Startup Idea
                </p>
                <p className="font-display text-lg font-bold text-foreground leading-snug">
                  {idea?.title ?? 'Awaiting startup allocation'}
                </p>
                {idea?.industry && (
                  <span className="inline-flex mt-1.5 items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
                    {idea.industry}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── Action Buttons ───────────────────────────── */}
          <div className="border-t border-border/60 pt-4 flex flex-wrap gap-2.5">
            {actions.map(({ label, to, icon: Icon, primary }) => (
              <Link
                key={to}
                to={to}
                className={clsx(
                  'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 border',
                  primary
                    ? 'bg-primary text-background border-primary hover:bg-primary-hover shadow-glow-sm hover:shadow-glow-primary'
                    : 'bg-card text-foreground-muted border-border hover:text-foreground hover:border-border-hover hover:bg-card-hover'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

// clsx helper (local usage)
function clsx(...args: (string | boolean | undefined | null)[]): string {
  return args.filter(Boolean).join(' ');
}