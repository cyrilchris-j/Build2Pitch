import React from 'react';
import { clsx } from 'clsx';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'purple';
  className?: string;
}

const colorMap = {
  primary: {
    icon: 'bg-primary/10 text-primary border-primary/20',
    value: 'text-primary',
    glow: 'hover:border-primary/30 hover:shadow-glow-sm',
  },
  accent: {
    icon: 'bg-accent/10 text-accent border-accent/20',
    value: 'text-accent',
    glow: 'hover:border-accent/30',
  },
  success: {
    icon: 'bg-success/10 text-success border-success/20',
    value: 'text-success',
    glow: 'hover:border-success/30',
  },
  warning: {
    icon: 'bg-warning/10 text-warning border-warning/20',
    value: 'text-warning',
    glow: 'hover:border-warning/30',
  },
  danger: {
    icon: 'bg-danger/10 text-danger border-danger/20',
    value: 'text-danger',
    glow: 'hover:border-danger/30',
  },
  purple: {
    icon: 'bg-purple/10 text-purple-light border-purple/20',
    value: 'text-purple-light',
    glow: 'hover:border-purple/30 hover:shadow-glow-purple',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  icon,
  color = 'primary',
  className,
}) => {
  const colors = colorMap[color];

  return (
    <div
      className={clsx(
        'bg-card border border-border rounded-2xl p-5 transition-all duration-200',
        colors.glow,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3">
            {label}
          </p>
          <p className={clsx('text-3xl font-black tabular-nums tracking-tight', colors.value)}>
            {value}
          </p>
          {subValue && (
            <p className="text-xs text-foreground-subtle mt-1">{subValue}</p>
          )}
        </div>
        {icon && (
          <div
            className={clsx(
              'h-10 w-10 rounded-xl border flex items-center justify-center shrink-0',
              colors.icon
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
