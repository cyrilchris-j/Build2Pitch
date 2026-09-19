import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { AxiosResponse } from 'axios';
import { AlertTriangle } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import { Card, CardContent } from '@/components/ui/Card';
import { teamService, submissionService } from '@/services/api';
import type { ApiResponse, TeamMember, IdeaComplexity, EventSettings } from '@/types';
import { StartupOverview } from '@/components/dashboard/StartupOverview';
import { TeamSection } from '@/components/dashboard/TeamSection';
import { IdeaSection } from '@/components/dashboard/IdeaSection';
import { ChallengeProgress } from '@/components/dashboard/ChallengeProgress';
import { SubmissionStatusCard } from '@/components/dashboard/SubmissionStatusCard';
import { DeliverablesChecklist } from '@/components/dashboard/DeliverablesChecklist';
import { stagger, fadeUp } from '@/components/dashboard/motion';
import { EMPTY_DASHBOARD, type DashboardData } from '@/components/dashboard/dashboardData';
import { EventCountdown } from '@/components/countdown/EventCountdown';

interface RawTeam {
  id?: string;
  teamNumber?: number;
  name?: string;
  teamCode?: string;
  isLocked?: boolean;
  membersCount?: number;
  tableNumber?: string;
}

interface RawIdeaAssignment {
  ideaId?: string;
  ideaTitle?: string;
  industry?: string;
  isRevealed?: boolean;
}

interface RawSubmissionStatus {
  submitted?: boolean;
  isFinal?: boolean;
}

interface RawDashboardPayload {
  team?: RawTeam | null;
  ideaAssignment?: RawIdeaAssignment | null;
  submissionStatus?: RawSubmissionStatus | null;
}

interface RawIdea {
  ideaId?: string;
  title?: string;
  industry?: string;
  complexityLevel?: IdeaComplexity;
  problemStatement?: string;
  targetAudience?: string;
  keyFeatures?: string[];
  revenueModel?: string;
}

interface RawSubmission {
  startupName?: string;
  tagline?: string;
  pitchDeckUrl?: string;
  liveDemoUrl?: string;
  githubUrl?: string;
  videoUrl?: string;
  isFinal?: boolean;
  submittedAt?: string;
}

const readData = <T,>(response: AxiosResponse<ApiResponse<unknown>>): T | null =>
  (response.data?.data as T | null) ?? null;

function normalizeDashboard(
  payload: RawDashboardPayload | null,
  members: TeamMember[],
  idea: RawIdea | null,
  submission: RawSubmission | null,
): DashboardData {
  const rawTeam = payload?.team ?? null;
  const submissionStatus = payload?.submissionStatus ?? null;
  const ideaBrief = payload?.ideaAssignment ?? null;

  return {
    team: rawTeam
      ? {
          name: rawTeam.name ?? null,
          teamCode: rawTeam.teamCode ?? null,
          teamNumber: rawTeam.teamNumber ?? null,
          tableNumber: rawTeam.tableNumber ?? null,
          isLocked: Boolean(rawTeam.isLocked),
          memberCount: rawTeam.membersCount ?? members.length,
        }
      : null,
    members: Array.isArray(members) ? members : [],
    idea: idea
      ? {
          title: idea.title ?? ideaBrief?.ideaTitle ?? null,
          industry: idea.industry ?? ideaBrief?.industry ?? null,
          complexityLevel: idea.complexityLevel ?? null,
          problemStatement: idea.problemStatement ?? null,
          targetAudience: idea.targetAudience ?? null,
          keyFeatures: Array.isArray(idea.keyFeatures) ? idea.keyFeatures : [],
          revenueModel: idea.revenueModel ?? null,
        }
      : null,
    ideaAllocated: Boolean(idea || ideaBrief?.ideaTitle),
    ideaRevealed: Boolean(ideaBrief?.isRevealed || idea),
    submission: submission
      ? {
          startupName: submission.startupName ?? null,
          tagline: submission.tagline ?? null,
          pitchDeckUrl: submission.pitchDeckUrl ?? null,
          liveDemoUrl: submission.liveDemoUrl ?? null,
          githubUrl: submission.githubUrl ?? null,
          videoUrl: submission.videoUrl ?? null,
          isFinal: Boolean(submission.isFinal),
          submittedAt: submission.submittedAt ?? null,
        }
      : null,
    submissionSubmitted: Boolean(submissionStatus?.submitted ?? submission?.isFinal ?? false),
    submissionFinal: Boolean(submissionStatus?.isFinal ?? submission?.isFinal ?? false),
  };
}

export const TeamDashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData>(EMPTY_DASHBOARD);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  // The current backend does not expose EventSettings through any endpoint.
  // When real event timing becomes available, source it (e.g. from an
  // events settings API) and pass it here — EventCountdown will count down live.
  const eventSettings: EventSettings | null = null;

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [dashboardRes, membersRes, ideaRes, submissionRes] = await Promise.all([
          teamService.getTeamDashboard(),
          teamService.getMembers(),
          teamService.getAssignedIdea(),
          submissionService.getSubmission(),
        ]);
        if (!active) return;

        const payload = readData<RawDashboardPayload>(dashboardRes);
        const members = readData<TeamMember[]>(membersRes) ?? [];
        const idea = readData<RawIdea>(ideaRes);
        const submission = readData<RawSubmission>(submissionRes);

        setData(normalizeDashboard(payload, members, idea, submission));
      } catch {
        if (active) setIsOffline(true);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Initializing your startup command center..." />;
  }

  return (
    <PageContainer className="min-h-[calc(100vh-4rem)] bg-[#070707]">
      {isOffline && (
        <Card
          glass={false}
          className="mb-6 border-[#E63946]/40 shadow-[0_0_22px_-6px_rgba(230,57,70,0.4)]"
        >
          <CardContent className="flex items-center gap-3 py-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-[#E63946]" />
            <p className="text-sm text-[#8A8A8A]">
              Live API is unavailable — showing an offline snapshot. Deliverable statuses are
              presentational defaults until the backend is reachable.
            </p>
          </CardContent>
        </Card>
      )}

      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
        <StartupOverview data={data} />

        {/* EventCountdown takes an optional settings prop mapping
            EventSettings.eventDate -> start and submissionDeadline -> end.
            No existing endpoint exposes EventSettings yet, so it passes null
            and EventCountdown shows its neutral "Event time not available"
            state until the backend provides real timing. */}
        <motion.div variants={fadeUp}>
          <EventCountdown settings={eventSettings} />
        </motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <TeamSection data={data} />
          </div>
          <div className="lg:col-span-2">
            <SubmissionStatusCard data={data} />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChallengeProgress data={data} />
          <IdeaSection data={data} />
        </motion.div>

        <DeliverablesChecklist data={data} />
      </motion.div>
    </PageContainer>
  );
};