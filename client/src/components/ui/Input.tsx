import React from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block mb-2 text-xs font-semibold uppercase tracking-wider text-[#FFFFFF]">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'h-12 w-full box-border rounded-lg bg-[#111111] border border-[#242424] px-3.5 text-sm text-[#FFFFFF] placeholder:text-[#8A8A8A]',
            'transition-colors duration-200 focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]',
            error && 'border-[#E63946] focus:border-[#E63946] focus:ring-[#E63946]',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-[#E63946]">{error}</p>}
        {!error && helperText && <p className="mt-1.5 text-xs text-[#8A8A8A]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
