import React from 'react';
import { cn } from '@/utils/cn';

export interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
  maxWidth?: 'default' | 'narrow' | 'wide' | 'full';
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  title,
  subtitle,
  actions,
  className,
  maxWidth = 'default',
}) => {
  const maxWClass = {
    narrow: 'max-w-4xl',
    default: 'max-w-7xl',
    wide: 'max-w-screen-2xl',
    full: 'w-full',
  }[maxWidth];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-background pb-16 overflow-hidden">
      {/* Background cinematic radial glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-full max-w-4xl rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />

      <main className={cn('relative mx-auto px-4 sm:px-6 lg:px-8 pt-8', maxWClass, className)}>
        {(title || actions) && (
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-6">
            <div>
              {title && (
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-foreground-muted">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
};
