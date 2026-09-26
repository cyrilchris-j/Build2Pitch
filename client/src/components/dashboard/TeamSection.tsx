import React from 'react';
import { Users, ShieldAlert } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { MemberSpecialization } from '@/types';
import type { DashboardData } from '@/components/dashboard/dashboardData';

interface TeamSectionProps {
  data: DashboardData;
}

const ROLE_LABELS: Record<MemberSpecialization, string> = {
  leader: 'Team Lead',
  developer: 'Developer',
  designer: 'Designer',
  pitcher: 'Pitcher',
  researcher: 'Researcher',
  marketer: 'Marketer',
};

const ROLE_VARIANTS: Record<MemberSpecialization, 'primary' | 'accent' | 'success' | 'muted'> = {
  leader: 'accent',
  developer: 'primary',
  designer: 'primary',
  pitcher: 'success',
  researcher: 'primary',
  marketer: 'success',
};

const ROLE_CLASS: Record<MemberSpecialization, string | undefined> = {
  leader: 'bg-[#E63946]/15 text-[#E63946] border-[#E63946]/30',
  developer: 'bg-white/10 text-white border-white/25',
  designer: 'bg-white/10 text-white border-white/25',
  pitcher: undefined,
  researcher: 'bg-white/10 text-white border-white/25',
  marketer: undefined,
};

const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || '?';

export const TeamSection: React.FC<TeamSectionProps> = ({ data }) => {
  const { team, members } = data;
  const count = members.length || team?.memberCount || 0;

  return (
    <Card glass={false} className="h-full border-[#242424]">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-white text-sm font-semibold">
            <Users className="h-4 w-4 text-[#E63946]" />
            <span>TEAM ROSTER</span>
          </div>
          <Badge
            variant={count >= 2 ? 'success' : 'accent'}
            className={count >= 2 ? '' : 'bg-[#E63946]/15 text-[#E63946] border-[#E63946]/30'}
          >
            {count} / 6 MEMBERS {count >= 2 ? '(VALID TEAM)' : '(MIN 2 REQUIRED)'}
          </Badge>
        </div>
        <CardTitle className="text-white">Your Startup Crew</CardTitle>
        <CardDescription className="text-[#8A8A8A]">
          {team
            ? [team.name, team.teamCode, team.tableNumber ? `Table ${team.tableNumber}` : null]
                .filter(Boolean)
                .join(' · ')
            : 'Team data will appear after registration sync.'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {members.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {members.slice(0, 6).map((member) => {
                const isLeader = member.role === 'leader';
                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 rounded-lg border border-[#242424]/70 bg-[#161616]/70 p-3"
                  >
                    <div
                      className={
                        isLeader
                          ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E63946]/50 bg-gradient-to-br from-[#E63946]/25 to-[#E63946]/10 text-xs font-bold text-[#E63946] shadow-[0_0_14px_-3px_rgba(230,57,70,0.6)]'
                          : 'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-bold text-white'
                      }
                    >
                      {initialsOf(member.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{member.name}</p>
                      <Badge variant={ROLE_VARIANTS[member.role]} className={ROLE_CLASS[member.role]}>
                        {ROLE_LABELS[member.role]}
                      </Badge>
                    </div>
                    {isLeader && <ShieldAlert className="ml-auto h-4 w-4 shrink-0 text-[#E63946]" />}
                  </div>
                );
              })}
            </div>
            {members.length < 6 && (
              <p className="pt-3 text-xs text-[#8A8A8A]">
                {6 - members.length} open slot{6 - members.length === 1 ? '' : 's'} remaining (Teams can have 2 to 6 members).
              </p>
            )}
          </>
        ) : count > 0 ? (
          <p className="text-sm text-[#8A8A8A]">
            Roster entries for this team have not synced with the account yet.
          </p>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#242424] py-10 text-center">
            <Users className="h-6 w-6 text-[#6E6E6E]" />
            <p className="mt-2 text-sm text-[#8A8A8A]">
              Team roster will appear here after registration.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};