import React from 'react';
import { Rocket } from 'lucide-react';

export interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Initializing BUILD2PITCH platform...',
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground">
      {/* Ambient glow */}
      <div className="absolute h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-pulse" />

      <div className="relative flex flex-col items-center space-y-4">
        {/* Animated Brand Icon */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-card border border-primary/40 shadow-glow-primary">
          <Rocket className="h-8 w-8 text-primary animate-bounce" />
          <div className="absolute -inset-1 rounded-2xl border border-primary/30 animate-ping opacity-25" />
        </div>

        {/* Brand Text */}
        <div className="text-center">
          <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
            BUILD<span className="text-primary">2</span>PITCH
          </h2>
          <p className="mt-2 text-sm text-foreground-muted animate-pulse">
            {message}
          </p>
        </div>

        {/* Progress Bar Track */}
        <div className="w-48 h-1 bg-border rounded-full overflow-hidden mt-4">
          <div className="h-full bg-gradient-to-r from-primary to-accent animate-[indeterminate_1.5s_infinite_linear]" />
        </div>
      </div>
    </div>
  );
};
