import React from 'react';
import { Pencil, Trash2, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { TeamMember } from '@/types';

interface MemberCardProps {
  member: TeamMember;
  isLeader?: boolean;
  canEdit: boolean;
  onEdit?: (member: TeamMember) => void;
  onRemove?: (member: TeamMember) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, isLeader, canEdit, onEdit, onRemove }) => (
  <Card className="relative">
    <div className="flex items-start gap-3">
      <div className="rounded-full bg-primary/10 p-2 text-primary"><UserRound size={20} /></div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-foreground">{member.name}</h3>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{isLeader ? 'Team Lead' : 'Member'}</span>
        </div>
        <p className="mt-1 text-sm text-foreground-muted">{member.email}</p>
        <p className="text-xs text-foreground-subtle">{member.registerNumber} · {member.section} · {member.mobile}</p>
      </div>
      {canEdit && !isLeader && (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" aria-label={`Edit ${member.name}`} onClick={() => onEdit?.(member)}><Pencil size={15} /></Button>
          <Button variant="ghost" size="sm" aria-label={`Remove ${member.name}`} onClick={() => onRemove?.(member)}><Trash2 size={15} className="text-danger" /></Button>
        </div>
      )}
    </div>
  </Card>
);
