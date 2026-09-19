import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Rocket, CheckCircle2, CalendarX2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import type { EventSettings } from '@/types';

/**
 * Passing a string is easiest from API data — the component accepts ISO 8601
 * strings (`new Date(...)`-parseable) or Date objects.
 */
export type EventTimeValue = string | Date | null | undefined;

export interface EventCountdownProps {
  /** ISO 8601 string or Date — when the event opens. */
  startTime?: EventTimeValue;
  /** ISO 8601 string or Date — when the event closes. */
  endTime?: EventTimeValue;
  /** Optional event label shown under the header. */
  eventName?: string;
  /** Extra classes merged onto the root card. */
  className?: string;
  /**
   * Optional reusable data source. When startTime/endTime are omitted they are
   * derived from EventSettings — `eventDate` maps to start, `submissionDeadline`
   * to end, and `eventName` to the event label.
   */
  settings?: EventSettings | null;
}

type CountdownPhase = 'unavailable' | 'upcoming' | 'inProgress' | 'completed';

const MS_PER_MINUTE = 60 * 1000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

const STATE_LABELS: Record<Exclude<CountdownPhase, 'unavailable'>, string> = {
  upcoming: 'EVENT STARTS IN',
  inProgress: 'EVENT IN PROGRESS',
  completed: 'EVENT COMPLETED',
};

interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const toTimestamp = (value: EventTimeValue): number | null => {
  if (value === undefined || value === null || value === '') return null;
  const date = typeof value === 'string' ? new Date(value) : value;
  return Number.isNaN(date.getTime()) ? null : date.getTime();
};

const splitTime = (milliseconds: number): TimeParts => {
  const total = Math.max(0, Math.floor(milliseconds / 1000) * 1000);
  return {
    days: Math.floor(total / MS_PER_DAY),
    hours: Math.floor((total % MS_PER_DAY) / MS_PER_HOUR),
    minutes: Math.floor((total % MS_PER_HOUR) / MS_PER_MINUTE),
    seconds: Math.floor((total % MS_PER_MINUTE) / 1000),
  };
};

const pad = (value: number) => String(value).padStart(2, '0');

const TimeUnit: React.FC<{ value: number; label: string; isPadded?: boolean }> = ({
  value,
  label,
  isPadded,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const content = isPadded ? pad(value) : String(value);

  return (
    <div className="flex flex-col items-center rounded-xl border border-[#242424] bg-[#111111] px-2 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      {prefersReducedMotion ? (
        <span className="font-display text-3xl font-black tabular-nums text-white sm:text-4xl">
          {content}
        </span>
      ) : (
        <motion.span
          key={content}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="font-display inline-block text-3xl font-black tabular-nums text-white sm:text-4xl"
        >
          {content}
        </motion.span>
      )}
      <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8A8A8A]">
        {label}
      </span>
    </div>
  );
};

export const EventCountdown: React.FC<EventCountdownProps> = ({
  startTime,
  endTime,
  eventName,
  className,
  settings,
}) => {
  const startMs = toTimestamp(startTime ?? settings?.eventDate);
  const endMs = toTimestamp(endTime ?? settings?.submissionDeadline);
  const name = eventName ?? settings?.eventName;

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [startMs, endMs]);

  const phase = useMemo<CountdownPhase>(() => {
    if (startMs === null || endMs === null || startMs >= endMs) return 'unavailable';
    if (now < startMs) return 'upcoming';
    if (now >= endMs) return 'completed';
    return 'inProgress';
  }, [startMs, endMs, now]);

  const targetMs = phase === 'upcoming' ? startMs : phase === 'inProgress' ? endMs : null;
  const parts: TimeParts | null = targetMs === null ? null : splitTime(targetMs - now);

  const showUnits = parts !== null;
  const stateLabel = phase === 'unavailable' ? null : STATE_LABELS[phase];

  return (
    <Card
      glass={false}
      className={cn(
        'relative overflow-hidden border-[#242424] p-5 shadow-[0_0_40px_-12px_rgba(230,57,70,0.45)]',
        className,
      )}
    >
      <div className="pointer-events-none absolute -inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E63946]/60 to-transparent" />
      <div className="pointer-events-none absolute -top-20 -right-16 h-48 w-48 rounded-full bg-[#E63946]/10 blur-3xl" />

      <div className="relative flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-white">
            <Rocket className="h-4 w-4 text-[#E63946]" />
            <span className="font-display text-xs font-extrabold uppercase tracking-[0.2em]">
              BUILD<span className="text-[#E63946]">2</span>PITCH
            </span>
          </div>

          {phase === 'unavailable' ? (
            <Badge variant="muted" className="border-[#242424] bg-[#111111] text-[#8A8A8A]">
              EVENT STATUS
            </Badge>
          ) : (
            <Badge className="bg-[#E63946]/15 text-[#E63946] border-[#E63946]/30 shadow-[0_0_18px_-4px_rgba(230,57,70,0.6)]">
              {stateLabel}
            </Badge>
          )}
        </div>

        {name && (
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">{name}</p>
        )}

        {showUnits ? (
          <div
            role="timer"
            aria-label={`${stateLabel ?? 'Countdown'}: ${parts.days} days, ${parts.hours} hours, ${parts.minutes} minutes, ${parts.seconds} seconds`}
            className="grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            <TimeUnit value={parts.days} label="DAYS" />
            <TimeUnit value={parts.hours} label="HOURS" isPadded />
            <TimeUnit value={parts.minutes} label="MINUTES" isPadded />
            <TimeUnit value={parts.seconds} label="SECONDS" isPadded />
          </div>
        ) : phase === 'completed' ? (
          <div className="flex flex-col items-center gap-2 py-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E63946]/30 bg-[#E63946]/10">
              <CheckCircle2 className="h-6 w-6 text-[#E63946]" />
            </div>
            <p className="font-display text-xl font-extrabold uppercase tracking-[0.18em] text-white">
              {STATE_LABELS.completed}
            </p>
            <p className="text-sm text-[#8A8A8A]">This event has concluded.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#242424] bg-[#111111]">
              <CalendarX2 className="h-6 w-6 text-[#8A8A8A]" />
            </div>
            <p className="font-display text-lg font-bold uppercase tracking-[0.18em] text-white">
              NO SCHEDULED TIME
            </p>
            <p className="text-sm text-[#8A8A8A]">Event time not available.</p>
          </div>
        )}
      </div>
    </Card>
  );
};