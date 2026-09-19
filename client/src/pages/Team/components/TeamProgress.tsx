import React from 'react';

interface TeamProgressProps {
  count: number;
  max?: number;
}

export const TeamProgress: React.FC<TeamProgressProps> = ({ count, max = 6 }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-sm">
      <span className="text-foreground-muted">Team progress</span>
      <strong className="text-primary">{count}/{max} Members</strong>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-border">
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, (count / max) * 100)}%` }} />
    </div>
  </div>
);
