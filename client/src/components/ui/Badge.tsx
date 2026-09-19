import React from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'accent' | 'success' | 'danger' | 'muted';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'primary',
  ...props
}) => {
  const variants = {
    primary: 'bg-[#111111] text-[#E63946] border-[#242424]',
    accent: 'bg-[#111111] text-[#E63946] border-[#242424]',
    success: 'bg-[#111111] text-[#FFFFFF] border-[#242424]',
    danger: 'bg-[#111111] text-[#E63946] border-[#242424]',
    muted: 'bg-[#111111] text-[#8A8A8A] border-[#242424]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide uppercase',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
