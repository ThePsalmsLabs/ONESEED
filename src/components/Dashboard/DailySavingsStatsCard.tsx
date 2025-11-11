'use client';

import { StatsCard } from './StatsCard';
import { useDailySavingsStats } from '@/hooks/useDailySavingsStats';

interface DailySavingsStatsCardProps {
  type: 'total' | 'goals' | 'pending';
}

export function DailySavingsStatsCard({ type }: DailySavingsStatsCardProps) {
  const stats = useDailySavingsStats();

  if (type === 'total') {
    return (
      <StatsCard
        title="Daily Savings Total"
        value={`$${stats.totalSaved.toFixed(2)}`}
        change={stats.thisMonthChange}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        isLoading={stats.isLoading}
      />
    );
  }

  if (type === 'goals') {
    return (
      <StatsCard
        title="Active Goals"
        value={stats.activeGoals.toString()}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        isLoading={stats.isLoading}
      />
    );
  }

  return (
    <StatsCard
      title="Pending Executions"
      value={stats.pendingExecutions > 0 ? 'Yes' : 'None'}
      icon={
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
      isLoading={stats.isLoading}
    />
  );
}

