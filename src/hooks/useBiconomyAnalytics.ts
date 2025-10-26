'use client';

import { useState, useEffect, useCallback } from 'react';
import { useBiconomy } from '@/components/BiconomyProvider';
import { useAccount } from 'wagmi';
import { useActiveChainId } from './useActiveChainId';
import { useTokenPrice } from './swap/useTokenPrice';

interface GasSavings {
  totalGasSaved: bigint;
  usdValue: number;
  transactionCount: number;
  averagePerTx: bigint;
  monthlySavings: number;
  yearlyProjection: number;
}

interface UserOpHistory {
  hash: `0x${string}`;
  timestamp: number;
  operation: string;
  gasUsed: bigint;
  gasPrice: bigint;
  sponsoredGas: bigint;
  userPaid: bigint;
  savings: bigint;
  status: 'success' | 'failed' | 'pending';
}

interface RawUserOp {
  hash: string;
  timestamp: number;
  operation?: string;
  gasUsed?: string | number;
  gasPrice?: string | number;
  sponsoredGas?: string | number;
  userPaid?: string | number;
  savings?: string | number;
  status?: string;
}

interface AnalyticsData {
  gasSavings: GasSavings;
  userOpHistory: UserOpHistory[];
  topOperations: Array<{
    operation: string;
    count: number;
    totalSavings: bigint;
  }>;
  monthlyBreakdown: Array<{
    month: string;
    transactions: number;
    gasSaved: bigint;
    usdValue: number;
  }>;
}

export function useBiconomyAnalytics() {
  const { smartAccountAddress } = useBiconomy();
  const { address } = useAccount();
  const chainId = useActiveChainId();
  const { priceUSD: ethPrice, isLoading: isLoadingEthPrice } = useTokenPrice({ 
    tokenAddress: '0x0000000000000000000000000000000000000000' as `0x${string}`, // Native ETH address
    enabled: !!address
  });
  
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user operations from Biconomy API
  const fetchUserOps = useCallback(async (userAddress: string): Promise<UserOpHistory[]> => {
    try {
      // Try to fetch from Biconomy's UserOp API
      const response = await fetch(
        `https://bundler.biconomy.io/api/v2/${chainId}/userOps?address=${userAddress}&limit=50`
      );
      
      if (response.ok) {
        const data = await response.json();
        return data.userOps?.map((op: RawUserOp) => ({
          hash: op.hash as `0x${string}`,
          timestamp: op.timestamp,
          operation: op.operation || 'unknown',
          gasUsed: BigInt(op.gasUsed || 0),
          gasPrice: BigInt(op.gasPrice || 0),
          sponsoredGas: BigInt(op.sponsoredGas || 0),
          userPaid: BigInt(op.userPaid || 0),
          savings: BigInt(op.savings || 0),
          status: op.status || 'success'
        })) || [];
      }
    } catch (error) {
      console.warn('Biconomy API not available:', error);
    }

    // Return empty array if no data available
    return [];
  }, [chainId]);

  // Calculate gas savings in USD
  const calculateGasSavingsUSD = useCallback((gasSavedWei: bigint, ethPriceUSD: number): number => {
    if (ethPriceUSD === 0) return 0;
    
    // Convert wei to ETH (1 ETH = 10^18 wei)
    const gasSavedETH = Number(gasSavedWei) / 1e18;
    return gasSavedETH * ethPriceUSD;
  }, []);

  // Process analytics data
  const processAnalyticsData = useCallback((userOps: UserOpHistory[], ethPriceUSD: number): AnalyticsData => {
    const totalGasSaved = userOps.reduce((sum, op) => sum + op.savings, BigInt(0));
    const totalTransactions = userOps.length;
    const averagePerTx = totalTransactions > 0 ? totalGasSaved / BigInt(totalTransactions) : BigInt(0);
    
    const usdValue = calculateGasSavingsUSD(totalGasSaved, ethPriceUSD);
    const monthlySavings = usdValue * 0.1; // Rough estimate
    const yearlyProjection = monthlySavings * 12;

    // Calculate top operations
    const operationCounts = new Map<string, { count: number; totalSavings: bigint }>();
    userOps.forEach(op => {
      const existing = operationCounts.get(op.operation) || { count: 0, totalSavings: BigInt(0) };
      operationCounts.set(op.operation, {
        count: existing.count + 1,
        totalSavings: existing.totalSavings + op.savings
      });
    });

    const topOperations = Array.from(operationCounts.entries())
      .map(([operation, data]) => ({
        operation,
        count: data.count,
        totalSavings: data.totalSavings
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate monthly breakdown
    const monthlyBreakdown = new Map<string, { transactions: number; gasSaved: bigint; usdValue: number }>();
    userOps.forEach(op => {
      const month = new Date(op.timestamp * 1000).toISOString().slice(0, 7); // YYYY-MM
      const existing = monthlyBreakdown.get(month) || { transactions: 0, gasSaved: BigInt(0), usdValue: 0 };
      monthlyBreakdown.set(month, {
        transactions: existing.transactions + 1,
        gasSaved: existing.gasSaved + op.savings,
        usdValue: existing.usdValue + calculateGasSavingsUSD(op.savings, ethPriceUSD)
      });
    });

    const monthlyBreakdownArray = Array.from(monthlyBreakdown.entries())
      .map(([month, data]) => ({
        month,
        transactions: data.transactions,
        gasSaved: data.gasSaved,
        usdValue: data.usdValue
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      gasSavings: {
        totalGasSaved,
        usdValue,
        transactionCount: totalTransactions,
        averagePerTx,
        monthlySavings,
        yearlyProjection
      },
      userOpHistory: userOps,
      topOperations,
      monthlyBreakdown: monthlyBreakdownArray
    };
  }, [calculateGasSavingsUSD]);

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    if (!address || !smartAccountAddress || isLoadingEthPrice) return;

    setIsLoading(true);
    setError(null);

    try {
      const userOps = await fetchUserOps(smartAccountAddress);
      const analytics = processAnalyticsData(userOps, ethPrice);
      setAnalyticsData(analytics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  }, [address, smartAccountAddress, isLoadingEthPrice, ethPrice, fetchUserOps, processAnalyticsData]);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Refresh function
  const refreshAnalytics = useCallback(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analyticsData,
    isLoading,
    error,
    refreshAnalytics,
    // Expose individual metrics for convenience
    totalUserOps: analyticsData?.gasSavings.transactionCount || 0,
    totalGasSaved: analyticsData?.gasSavings.totalGasSaved || BigInt(0),
    totalSavingsUSD: analyticsData?.gasSavings.usdValue || 0,
    averageGasSavedPerTx: analyticsData?.gasSavings.averagePerTx || BigInt(0),
    monthlySavings: analyticsData?.gasSavings.monthlySavings || 0,
    yearlyProjection: analyticsData?.gasSavings.yearlyProjection || 0,
    topOperations: analyticsData?.topOperations || [],
    monthlyBreakdown: analyticsData?.monthlyBreakdown || [],
    userOpHistory: analyticsData?.userOpHistory || []
  };
}