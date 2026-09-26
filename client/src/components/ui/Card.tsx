import React from 'react';
import { clsx } from 'clsx';

type CardGlow = 'none' | 'blue' | 'cyan' | 'purple' | 'success' | 'amber';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: CardGlow;
  glass?: boolean;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const glowClasses: Record<CardGlow, string> = {
  none: '',
  blue: 'hover:border-primary/30 hover:shadow-glow-sm',
  cyan: 'hover:border-accent/30 hover:shadow-glow-accent',
  purple: 'hover:border-purple/30 hover:shadow-glow-purple',
  success: 'hover:border-success/30',
  amber: 'hover:border-warning/30',
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ glow = 'none', glass = false, hover = false, padding, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-2xl border transition-all duration-200',
          glass
            ? 'bg-background-elevated/60 backdrop-blur-xl border-border/60'
            : 'bg-card border-border',
          hover && 'cursor-pointer',
          glow !== 'none' && glowClasses[glow],
          padding && paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={clsx('px-5 pt-5 pb-3', className)} {...props}>
    {children}
  </div>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={clsx('px-5 pb-5', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3
    className={clsx('text-base font-bold text-foreground tracking-tight', className)}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p className={clsx('text-sm text-foreground-muted leading-relaxed', className)} {...props}>
    {children}
  </p>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={clsx('px-5 py-4 border-t border-border flex items-center gap-3', className)}
    {...props}
  >
    {children}
  </div>
);
