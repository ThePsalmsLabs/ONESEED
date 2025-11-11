'use client';

import { useMemo } from 'react';
import { useDailySavingsStats } from './useDailySavingsStats';
import { useDailySavingsTokens } from './useDailySavingsTokens';

export interface DailySavingsSummary {
  // Stats
  totalSaved: number;
  activeGoals: number;
  pendingExecutions: number;
  totalGoalAmount: number;
  averageProgress: number;
  totalPenalties: number;
  thisMonth: number;
  thisMonthChange: {
    value: string;
    positive: boolean;
  };
  
  // Token data
  tokens: Array<{
    token: `0x${string}`;
    symbol: string;
    name: string;
    icon: string;
    enabled: boolean;
    dailyAmount: bigint;
    goalAmount: bigint;
    currentAmount: bigint;
    remainingAmount: bigint;
    penaltyAmount: bigint;
    estimatedCompletionDate: bigint;
    canExecute: boolean;
    daysPassed: bigint;
    amountToSave: bigint;
    progress: number;
    daysRemaining: number;
    isLoading: boolean;
  }>;
  
  // Combined loading and error states
  isLoading: boolean;
  error: Error | null;
  
  // Refetch function
  refetch: () => void;
}

export function useDailySavingsSummary(): DailySavingsSummary {
  const stats = useDailySavingsStats();
  const { tokens, isLoading: isLoadingTokens, error: tokensError, refetch } = useDailySavingsTokens();

  const summary = useMemo(() => ({
    ...stats,
    tokens,
    isLoading: stats.isLoading || isLoadingTokens,
    error: stats.error || tokensError,
    refetch
  }), [stats, tokens, isLoadingTokens, tokensError, refetch]);

  return summary;
}
