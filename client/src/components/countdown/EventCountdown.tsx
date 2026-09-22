import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, CalendarDays } from 'lucide-react';
import type { EventSettings } from '@/types';
import { clsx } from 'clsx';

interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  isRunning: boolean;
}

interface EventCountdownProps {
  settings?: EventSettings | null;
  targetDate?: string | null; // ISO string override
  className?: string;
  compact?: boolean;
}

function computeCountdown(targetIso: string | null | undefined): CountdownValues {
  if (!targetIso) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false, isRunning: false };
  }

  const target = new Date(targetIso).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, isRunning: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false, isRunning: true };
}

const DigitBlock: React.FC<{ value: number; label: string; color?: string }> = ({
  value,
  label,
  color = 'text-primary',
}) => {
  const display = String(value).padStart(2, '0');

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative">
        <div className="flex gap-1">
          {display.split('').map((digit, i) => (
            <motion.div
              key={`${digit}-${i}`}
              initial={{ opacity: 0.5, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                'w-12 sm:w-16 h-14 sm:h-20 flex items-center justify-center',
                'bg-card border border-border rounded-xl font-display font-black text-3xl sm:text-5xl',
                'countdown-digit shadow-card',
                color
              )}
            >
              {digit}
            </motion.div>
          ))}
        </div>
        {/* glow */}
        <div className="absolute inset-0 rounded-xl opacity-20 blur-xl bg-primary -z-10" />
      </div>
      <span className="text-[10px] sm:text-xs font-bold text-foreground-subtle uppercase tracking-[0.2em]">
        {label}
      </span>
    </div>
  );
};

export const EventCountdown: React.FC<EventCountdownProps> = ({
  settings,
  targetDate,
  className,
  compact = false,
}) => {
  // Resolve the target time: explicit prop → eventSettings.startTime → null
  const resolvedTarget =
    targetDate ??
    (settings?.startTime ?? null);

  const [countdown, setCountdown] = useState<CountdownValues>(() =>
    computeCountdown(resolvedTarget)
  );

  const tick = useCallback(() => {
    setCountdown(computeCountdown(resolvedTarget));
  }, [resolvedTarget]);

  useEffect(() => {
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  if (!countdown.isRunning && !countdown.isExpired) {
    // No event date configured
    return (
      <div className={clsx('bg-card border border-border rounded-2xl p-6 text-center', className)}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <CalendarDays className="h-5 w-5 text-foreground-subtle" />
          <span className="text-sm text-foreground-muted font-semibold uppercase tracking-wider">
            Event Date TBA
          </span>
        </div>
        <p className="text-xs text-foreground-subtle">
          The event schedule will be announced soon. Stay tuned.
        </p>
      </div>
    );
  }

  if (countdown.isExpired) {
    return (
      <div
        className={clsx(
          'bg-card border border-primary/30 rounded-2xl p-6 text-center shadow-glow-sm',
          className
        )}
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Zap className="h-5 w-5 text-primary animate-pulse" />
          <span className="text-primary font-bold uppercase tracking-wider">
            THE CHALLENGE IS LIVE!
          </span>
        </div>
        <p className="text-sm text-foreground-muted">
          The event has started. Build, create, and ship!
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={clsx('flex items-center gap-3', className)}>
        <Clock className="h-4 w-4 text-primary shrink-0" />
        <span className="text-sm font-mono font-bold text-primary">
          {String(countdown.days).padStart(2, '0')}d{' '}
          {String(countdown.hours).padStart(2, '0')}h{' '}
          {String(countdown.minutes).padStart(2, '0')}m{' '}
          {String(countdown.seconds).padStart(2, '0')}s
        </span>
      </div>
    );
  }

  return (
    <div className={clsx('bg-card border border-border rounded-2xl overflow-hidden', className)}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-foreground-subtle uppercase tracking-wider font-semibold">
              The Clock Is Running
            </p>
            <p className="text-sm font-bold text-foreground">Time Until NEXTGEN</p>
          </div>
        </div>
        <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          LIVE
        </span>
      </div>

      {/* Countdown digits */}
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-center gap-4 sm:gap-8">
          <DigitBlock value={countdown.days} label="Days" />
          <div className="flex items-center h-14 sm:h-20 text-2xl sm:text-4xl font-black text-foreground-subtle mt-0 sm:mt-0">
            :
          </div>
          <DigitBlock value={countdown.hours} label="Hours" />
          <div className="flex items-center h-14 sm:h-20 text-2xl sm:text-4xl font-black text-foreground-subtle">
            :
          </div>
          <DigitBlock value={countdown.minutes} label="Minutes" />
          <div className="flex items-center h-14 sm:h-20 text-2xl sm:text-4xl font-black text-foreground-subtle">
            :
          </div>
          <DigitBlock value={countdown.seconds} label="Seconds" color="text-accent" />
        </div>

        {settings?.startTime && (
          <p className="text-center text-xs text-foreground-subtle mt-6">
            Event Date: {new Date(settings.startTime).toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Asia/Kolkata',
            })} IST
          </p>
        )}
      </div>
    </div>
  );
};