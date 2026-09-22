import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, rounded = 'md' }) => {
  const roundedClasses = {
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-2xl',
    full: 'rounded-full',
  };
  return (
    <div
      className={clsx(
        'skeleton',
        roundedClasses[rounded],
        className
      )}
    />
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('bg-card border border-border rounded-2xl p-5 space-y-3', className)}>
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10" rounded="lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-4/5" />
    <Skeleton className="h-8 w-full" rounded="lg" />
  </div>
);

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className,
}) => (
  <div className={clsx('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={clsx('h-3', i === lines - 1 ? 'w-3/4' : 'w-full')}
      />
    ))}
  </div>
);
