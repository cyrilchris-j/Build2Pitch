import { useState, useEffect, useCallback } from 'react';
import { teamService } from '@/services/api';
import type { TeamMember } from '@/types';

interface TeamDashboardData {
  team: {
    id?: string;
    teamNumber?: number;
    name?: string | null;
    teamCode?: string | null;
    isLocked?: boolean;
    membersCount?: number;
    tableNumber?: string | null;
  } | null;
  members: TeamMember[];
  ideaAssignment: {
    ideaId?: string;
    ideaTitle?: string | null;
    industry?: string | null;
    isRevealed?: boolean;
  } | null;
  submissionStatus: {
    submitted: boolean;
    isFinal: boolean;
    submissionStatus?: string;
  } | null;
}

interface UseTeamReturn {
  data: TeamDashboardData | null;
  members: TeamMember[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTeam(): UseTeamReturn {
  const [data, setData] = useState<TeamDashboardData | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeam = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dashboardRes, membersRes] = await Promise.all([
        teamService.getTeamDashboard(),
        teamService.getMembers(),
      ]);
      setData(dashboardRes.data?.data as TeamDashboardData ?? null);
      setMembers((membersRes.data?.data as TeamMember[]) ?? []);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Failed to load team data';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  return { data, members, isLoading, error, refetch: fetchTeam };
}
