'use client';

import { useMemo } from 'react';
import { useActivityFeed } from './useActivityFeed';

interface TrendData {
  savingsTrend: number[];
  swapsTrend: number[];
}

// Helper to get start of a specific number of days ago
const getDaysAgo = (daysAgo: number): number => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(0, 0, 0, 0);
  return Math.floor(date.getTime() / 1000);
};

// Helper to group activities by time period
const groupByTimePeriod = (activities: any[], periods: number, getPeriodKey: (timestamp: number) => string) => {
  const grouped: { [key: string]: any[] } = {};
  
  activities.forEach(activity => {
    const key = getPeriodKey(activity.timestamp);
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(activity);
  });

  return grouped;
};

// Generate trend data for the last 30 days grouped into 12 periods (2.5 days each)
export function useSavingsTrend(): TrendData {
  const { activities } = useActivityFeed();

  const trendData = useMemo(() => {
    const now = Math.floor(Date.now() / 1000);
    const daysBack = 30;
    const periods = 12;

    // Filter activities from the last 30 days
    const recentActivities = activities.filter(a => a.timestamp >= (now - daysBack * 24 * 60 * 60));

    // Group activities by 2.5-day periods
    const getPeriodKey = (timestamp: number): string => {
      const daysAgo = (now - timestamp) / (24 * 60 * 60);
      const periodIndex = Math.floor(daysAgo / (daysBack / periods));
      return Math.min(periodIndex, periods - 1).toString();
    };

    const grouped = groupByTimePeriod(recentActivities, periods, getPeriodKey);

    // Generate trends
    const savingsTrend: number[] = [];
    const swapsTrend: number[] = [];

    for (let i = 0; i < periods; i++) {
      const periodKey = i.toString();
      const periodActivities = grouped[periodKey] || [];

      // Calculate savings amount for this period
      const savingsAmount = periodActivities
        .filter(a => a.type === 'save')
        .reduce((sum, a) => sum + parseFloat(a.amountFormatted), 0);
      
      savingsTrend.push(Math.max(0, savingsAmount * 10)); // Scale up for visibility

      // Count unique swaps for this period
      const uniqueTxs = new Set(
        periodActivities
          .filter(a => a.type === 'save')
          .map(a => a.hash)
      ).size;
      
      swapsTrend.push(uniqueTxs * 5); // Scale up for visibility
    }

    // If no data, fill with zeros
    if (savingsTrend.every(v => v === 0)) {
      for (let i = 0; i < periods; i++) {
        savingsTrend[i] = 0;
      }
    }

    if (swapsTrend.every(v => v === 0)) {
      for (let i = 0; i < periods; i++) {
        swapsTrend[i] = 0;
      }
    }

    // Normalize to 0-100 range for sparkline display
    const maxSavings = Math.max(...savingsTrend, 1);
    const maxSwaps = Math.max(...swapsTrend, 1);

    return {
      savingsTrend: savingsTrend.map(v => (v / maxSavings) * 100),
      swapsTrend: swapsTrend.map(v => (v / maxSwaps) * 100)
    };
  }, [activities]);

  return trendData;
}

