import { useState, useEffect, useCallback } from 'react';
import { eventService } from '@/services/api';
import type { EventSettings } from '@/types';

interface UseEventSettingsReturn {
  settings: EventSettings | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEventSettings(): UseEventSettingsReturn {
  const [settings, setSettings] = useState<EventSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await eventService.getSettings();
      setSettings(data);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Failed to load event settings';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, isLoading, error, refetch: fetchSettings };
}
