import type { DashboardSubmission } from './dashboardData';

export type DeliverableStatus = 'submitted' | 'pending';

export interface DeliverableItem {
  key: string;
  label: string;
  status: DeliverableStatus;
}

/**
 * ============================================================================
 * PRESENTATION FALLBACK — DELIVERABLE STATUS DERIVATION
 * ============================================================================
 *
 * The backend does NOT yet expose per-deliverable tracking. Until a real
 * submission/deliverable endpoint exists, statuses are derived ONLY from the
 * existing Submission fields (githubUrl, liveDemoUrl, videoUrl, pitchDeckUrl).
 *
 * Branding assets (logo, visiting card, poster, LinkedIn banner) have no
 * source field in the current API, so they default to 'pending'.
 *
 * Replace this module with live submission data once the backend catches up.
 * ============================================================================
 */

const has = (value?: string | null): boolean => Boolean(value && value.trim().length > 0);

const statusOf = (done: boolean): DeliverableStatus => (done ? 'submitted' : 'pending');

export function getDashboardDeliverables(submission: DashboardSubmission | null): DeliverableItem[] {
  const sub = submission as (DashboardSubmission & {
    logoUrl?: string;
    visitingCardUrl?: string;
    posterUrl?: string;
    linkedinBannerUrl?: string;
    deployedUrl?: string;
  }) | null;

  return [
    { key: 'logo', label: 'Logo Drive Link', status: statusOf(has(sub?.logoUrl)) },
    { key: 'visiting-card', label: 'Visiting Card Drive Link', status: statusOf(has(sub?.visitingCardUrl)) },
    { key: 'poster', label: 'Poster Drive Link', status: statusOf(has(sub?.posterUrl)) },
    { key: 'linkedin-banner', label: 'LinkedIn Banner Card Drive Link', status: statusOf(has(sub?.linkedinBannerUrl)) },
    { key: 'github', label: 'GitHub Repository', status: statusOf(has(sub?.githubUrl)) },
    { key: 'deployed', label: 'Deployed Website', status: statusOf(has(sub?.deployedUrl || sub?.liveDemoUrl)) },
    { key: 'video', label: '5-Minute Startup Video', status: statusOf(has(sub?.videoUrl)) },
    { key: 'pitch', label: 'Pitch Deck (Optional)', status: statusOf(has(sub?.pitchDeckUrl)) },
  ];
}

export interface ChallengeProgressInfo {
  completed: number;
  total: number;
  percent: number;
}

export function getChallengeProgress(items: DeliverableItem[]): ChallengeProgressInfo {
  const completed = items.filter((item) => item.status === 'submitted').length;
  const total = items.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, percent };
}