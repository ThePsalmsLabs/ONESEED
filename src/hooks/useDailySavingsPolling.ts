'use client';

import { useEffect } from 'react';
import { useDailySavings } from './useDailySavings';

const POLLING_INTERVAL = 30000; // 30 seconds

export function useDailySavingsPolling() {
  const { hasPending, refetchPending, isLoadingPending } = useDailySavings();

  useEffect(() => {
    // Only poll when tab is visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refetchPending();
      }
    };

    // Set up visibility listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Set up interval polling
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        refetchPending();
      }
    }, POLLING_INTERVAL);

    // Initial fetch
    refetchPending();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [refetchPending]);

  return {
    hasPending,
    isLoadingPending
  };
}
