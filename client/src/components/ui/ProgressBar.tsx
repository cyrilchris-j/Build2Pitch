import React from 'react';
import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showValue?: boolean;
  animated?: boolean;
  className?: string;
}

const colorClasses = {
  primary: 'bg-primary shadow-[0_0_8px_rgba(0,212,255,0.5)]',
  accent: 'bg-accent',
  success: 'bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]',
  warning: 'bg-warning',
  danger: 'bg-danger',
  purple: 'bg-purple-light',
};

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'primary',
  size = 'md',
  label,
  showValue = false,
  animated = false,
  className,
}) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={clsx('w-full', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-xs font-medium text-foreground-muted">{label}</span>
          )}
          {showValue && (
            <span className="text-xs font-bold text-foreground tabular-nums">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div
        className={clsx(
          'w-full bg-border rounded-full overflow-hidden',
          sizeClasses[size]
        )}
      >
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-700 ease-out',
            colorClasses[color],
            animated && 'animate-pulse-slow'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
