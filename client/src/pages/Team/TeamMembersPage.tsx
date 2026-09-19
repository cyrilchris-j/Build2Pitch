import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { teamService } from '@/services/api';
import type { Team, TeamMember } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { AddMemberForm, type MemberFormValues } from './components/AddMemberForm';
import { MemberCard } from './components/MemberCard';
import { TeamOverview } from './components/TeamOverview';
import { TeamProgress } from './components/TeamProgress';

const unwrap = <T,>(response: { data?: { data?: T } }): T => response.data?.data as T;

export const TeamMembersPage: React.FC = () => {
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [editing, setEditing] = useState<TeamMember | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isLead = user?.role === 'team_lead';

  const loadTeam = useCallback(async () => {
    setLoading(true);
    try {
      setTeam(unwrap<Team>(await teamService.getTeam()));
      setError('');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load your team');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadTeam(); }, [loadTeam]);

  const submitMember = async (values: MemberFormValues) => {
    try {
      if (editing) await teamService.updateMember(editing.id, values);
      else await teamService.addMember(values);
      setEditing(undefined);
      setShowForm(false);
      await loadTeam();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save member');
    }
  };

  const removeMember = async (member: TeamMember) => {
    if (!window.confirm(`Remove ${member.name} from this team?`)) return;
    try {
      await teamService.removeMember(member.id);
      await loadTeam();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to remove member');
    }
  };

  const count = useMemo(() => team?.membersCount || (team ? team.members.length + 1 : 0), [team]);
  if (loading) return <PageContainer title="Team Members"><p className="text-foreground-muted">Loading team...</p></PageContainer>;
  if (!team) return <PageContainer title="Team Members"><p className="text-danger">{error || 'No team found.'}</p></PageContainer>;

  return (
    <PageContainer title="Team Members" subtitle="View your roster and keep member details up to date.">
      <div className="space-y-6">
        {error && <div className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>}
        <TeamOverview team={team} />
        <Card><TeamProgress count={count} max={6} /></Card>
        {isLead && !team.isLocked && count < 6 && !showForm && !editing && (
          <Button onClick={() => setShowForm(true)}><Plus size={16} className="mr-2" />Add member</Button>
        )}
        {(showForm || editing) && isLead && (
          <Card><CardHeader><CardTitle>{editing ? 'Edit member' : 'Add team member'}</CardTitle></CardHeader><AddMemberForm initial={editing} onSubmit={submitMember} onCancel={() => { setEditing(undefined); setShowForm(false); }} /></Card>
        )}
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold">Team Lead</h2>
          {team.leader && <MemberCard member={team.leader} isLeader canEdit={false} />}
        </section>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold">Team Members</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {team.members.map((member) => <MemberCard key={member.id} member={member} canEdit={isLead && !team.isLocked} onEdit={(selected) => { setEditing(selected); setShowForm(false); }} onRemove={removeMember} />)}
            {Array.from({ length: Math.max(0, 5 - team.members.length) }, (_, index) => <Card key={`empty-${index}`} className="border-dashed"><p className="text-sm text-foreground-subtle">Member {String(team.members.length + index + 1).padStart(2, '0')} · Available</p></Card>)}
          </div>
        </section>
      </div>
    </PageContainer>
  );
};
