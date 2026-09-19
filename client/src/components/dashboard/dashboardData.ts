import type { TeamMember, IdeaComplexity } from '@/types';

/**
 * Dashboard view-model.
 *
 * These are thin projections of the existing domain types (Team, TeamMember,
 * StartupIdea, Submission) shaped for presentation only. They do NOT introduce
 * a new backend data model.
 */

export interface DashboardTeam {
  name: string | null;
  teamCode: string | null;
  teamNumber: number | null;
  tableNumber: string | null;
  isLocked: boolean;
  memberCount: number;
}

export interface DashboardIdea {
  title: string | null;
  industry: string | null;
  complexityLevel: IdeaComplexity | null;
  problemStatement: string | null;
  targetAudience: string | null;
  keyFeatures: string[];
  revenueModel: string | null;
}

export interface DashboardSubmission {
  startupName?: string | null;
  tagline?: string | null;
  pitchDeckUrl?: string | null;
  liveDemoUrl?: string | null;
  githubUrl?: string | null;
  videoUrl?: string | null;
  isFinal: boolean;
  submittedAt?: string | null;
}

export interface DashboardData {
  team: DashboardTeam | null;
  members: TeamMember[];
  idea: DashboardIdea | null;
  ideaAllocated: boolean;
  ideaRevealed: boolean;
  submission: DashboardSubmission | null;
  submissionSubmitted: boolean;
  submissionFinal: boolean;
}

export const EMPTY_DASHBOARD: DashboardData = {
  team: null,
  members: [],
  idea: null,
  ideaAllocated: false,
  ideaRevealed: false,
  submission: null,
  submissionSubmitted: false,
  submissionFinal: false,
};

export function formatDateTime(value?: string | null): string {
  if (!value) return 'Not recorded yet';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not recorded yet';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}