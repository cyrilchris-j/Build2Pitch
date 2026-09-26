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
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#070707] text-[#FFFFFF] pb-16 overflow-hidden">
      <main className={cn('relative w-full mx-auto px-4 sm:px-6 lg:px-8 py-8', maxWClass, className)}>
        {(title || subtitle || actions) && (
          <div className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#242424] pb-6">
            <div>
              {title && (
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FFFFFF]">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-1.5 text-sm text-[#8A8A8A] leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && <div className="flex items-center gap-3 shrink-0 sm:self-start">{actions}</div>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
};
