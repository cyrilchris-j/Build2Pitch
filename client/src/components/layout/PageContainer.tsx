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
    <div className="relative bg-background text-foreground pb-16">
      {/* Subtle ambient background */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none opacity-50" />
      <div className="absolute inset-0 grid-texture opacity-20 pointer-events-none" />

      <div
        className={cn(
          'relative w-full mx-auto px-4 sm:px-6 lg:px-8 py-8',
          maxWClass,
          className
        )}
      >
        {(title || subtitle || actions) && (
          <div className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border pb-6">
            <div>
              {title && (
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-1.5 text-sm text-foreground-muted leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-3 shrink-0 sm:self-start">{actions}</div>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
