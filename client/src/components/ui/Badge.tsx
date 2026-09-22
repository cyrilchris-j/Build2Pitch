import React from 'react';
import { clsx } from 'clsx';

type BadgeVariant =
  | 'default'
  | 'primary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'purple'
  | 'outline'
  | 'muted';

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-card border border-border text-foreground-muted',
  primary: 'bg-primary/10 border border-primary/30 text-primary',
  accent: 'bg-accent/10 border border-accent/30 text-accent',
  success: 'bg-success/10 border border-success/30 text-success',
  warning: 'bg-warning/10 border border-warning/30 text-warning',
  danger: 'bg-danger/10 border border-danger/30 text-danger',
  purple: 'bg-purple/10 border border-purple/30 text-purple-light',
  outline: 'border border-border text-foreground-muted',
  muted: 'bg-background-subtle border border-border text-foreground-subtle',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-foreground-muted',
  primary: 'bg-primary',
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  purple: 'bg-purple-light',
  outline: 'bg-foreground-muted',
  muted: 'bg-foreground-subtle',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  className,
  children,
  dot = false,
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide',
        variantClasses[variant],
        className
      )}
    >
      {dot && (
        <span
          className={clsx('h-1.5 w-1.5 rounded-full shrink-0 animate-pulse', dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
};
