import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { Team } from '@/types';

export const TeamOverview: React.FC<{ team: Team }> = ({ team }) => (
  <Card glow="cyan">
    <CardHeader><CardTitle>{team.name}</CardTitle><p className="text-sm text-foreground-muted">Team code: {team.teamCode}</p></CardHeader>
    <CardContent><div className="grid gap-3 text-sm sm:grid-cols-3"><div><p className="text-foreground-subtle">Team number</p><p className="font-semibold">{team.teamNumber}</p></div><div><p className="text-foreground-subtle">Status</p><p className="font-semibold text-success">{team.isLocked ? 'Locked' : 'Open for changes'}</p></div><div><p className="text-foreground-subtle">Gender requirement</p><p className="font-semibold">{team.leader?.gender && team.members.some((member) => member.gender !== team.leader?.gender) ? 'Complete' : 'Needs both genders'}</p></div></div></CardContent>
  </Card>
);
