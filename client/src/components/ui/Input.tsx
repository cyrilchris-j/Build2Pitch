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
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-foreground-muted tracking-wide">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full rounded-lg bg-card/80 border border-border px-3.5 py-2 text-sm text-foreground placeholder:text-foreground-subtle',
            'transition-colors duration-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary',
            error && 'border-danger focus:border-danger focus:ring-danger',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        {!error && helperText && <p className="text-xs text-foreground-subtle">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
