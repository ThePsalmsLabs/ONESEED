'use client';

import { useMemo } from 'react';
import { useActivityFeed, ActivityItem } from './useActivityFeed';

export interface DashboardStats {
  thisMonth: number;
  thisMonthChange: {
    value: string;
    positive: boolean;
  };
  totalSwaps: number;
  totalSwapsChange: {
    value: string;
    positive: boolean;
  };
  gasSaved: number;
  gasSavedChange: {
    value: string;
    positive: boolean;
  };
  isLoading: boolean;
}

// Helper to check if timestamp is in current month
const isCurrentMonth = (timestamp: number): boolean => {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

// Helper to check if timestamp is in previous month
const isPreviousMonth = (timestamp: number): boolean => {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return date.getMonth() === previousMonth.getMonth() && date.getFullYear() === previousMonth.getFullYear();
};

// Helper to check if timestamp is within last N days
const isWithinLastNDays = (timestamp: number, days: number): boolean => {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= days;
};

// Helper to get unique transaction count
const getUniqueTxCount = (activities: ActivityItem[]): number => {
  const txHashes = new Set(activities.map(a => a.hash));
  return txHashes.size;
};

// Estimate gas savings: batch transactions save ~50% gas
const estimateGasSavings = (txCount: number): number => {
  // Average gas for a swap: ~150k gas
  // Average gas for a batched swap+save: ~100k gas (saves ~50k per transaction)
  const gasPerTx = 50000; // Saved gas units per transaction
  const ethPrice = 3000; // Approximate ETH price in USD
  const gasPrice = 0.000000001; // 1 gwei in ETH
  
  const totalGasSaved = txCount * gasPerTx;
  const ethSaved = totalGasSaved * gasPrice;
  const usdSaved = ethSaved * ethPrice;
  
  return usdSaved;
};

export function useDashboardStats(): DashboardStats {
  const { activities, isLoading } = useActivityFeed();

  // Calculate all metrics in one pass
  const metrics = useMemo(() => {
    const thisMonthActivities = activities.filter(a => 
      a.type === 'save' && isCurrentMonth(a.timestamp)
    );
    
    const previousMonthActivities = activities.filter(a => 
      a.type === 'save' && isPreviousMonth(a.timestamp)
    );

    const thisMonth = thisMonthActivities.reduce((sum, activity) => {
      return sum + parseFloat(activity.amountFormatted);
    }, 0);

    const previousMonth = previousMonthActivities.reduce((sum, activity) => {
      return sum + parseFloat(activity.amountFormatted);
    }, 0);

    const thisMonthChange = previousMonth === 0
      ? { value: thisMonth > 0 ? '+$0.00' : '$0.00', positive: true }
      : {
          value: `${thisMonth - previousMonth > 0 ? '+' : ''}$${(thisMonth - previousMonth).toFixed(2)}`,
          positive: thisMonth >= previousMonth
        };

    const totalSwaps = getUniqueTxCount(activities.filter(a => a.type === 'save'));
    const previousMonthSwaps = getUniqueTxCount(previousMonthActivities);
    
    const totalSwapsChange = previousMonthSwaps === 0
      ? { value: totalSwaps > 0 ? '+0' : '0', positive: true }
      : {
          value: `${totalSwaps - previousMonthSwaps > 0 ? '+' : ''}${totalSwaps - previousMonthSwaps}`,
          positive: totalSwaps >= previousMonthSwaps
        };

    const gasSaved = estimateGasSavings(totalSwaps);
    const previousGasSaved = estimateGasSavings(previousMonthSwaps);
    
    const gasSavedChange = previousGasSaved === 0
      ? { value: gasSaved > 0 ? '+$0.00' : '$0.00', positive: true }
      : {
          value: `${gasSaved - previousGasSaved > 0 ? '+' : ''}$${(gasSaved - previousGasSaved).toFixed(2)}`,
          positive: gasSaved >= previousGasSaved
        };

    return {
      thisMonth,
      thisMonthChange,
      totalSwaps,
      totalSwapsChange,
      gasSaved,
      gasSavedChange
    };
  }, [activities]);

  return {
    ...metrics,
    isLoading
  };
}

