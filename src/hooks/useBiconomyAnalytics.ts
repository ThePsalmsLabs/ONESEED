'use client';

import { useState, useEffect, useCallback } from 'react';
import { useBiconomy } from '@/components/BiconomyProvider';
import { useAccount } from 'wagmi';

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
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock function to fetch user operations from Biconomy API
  const fetchUserOps = useCallback(async (userAddress: string): Promise<UserOpHistory[]> => {
    // In a real implementation, this would call Biconomy's API
    // For now, we'll use localStorage to simulate data
    const storedOps = localStorage.getItem(`userOps_${userAddress}`);
    if (storedOps) {
      return JSON.parse(storedOps);
    }
    
    // Return mock data for demonstration
    return [
      {
        hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef' as `0x${string}`,
        timestamp: Date.now() - 86400000, // 1 day ago
        operation: 'setSavingStrategy',
        gasUsed: BigInt('21000'),
        gasPrice: BigInt('20000000000'), // 20 gwei
        sponsoredGas: BigInt('21000'),
        userPaid: BigInt('0'),
        savings: BigInt('420000000000000'), // 0.00042 ETH
        status: 'success'
      },
      {
        hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890' as `0x${string}`,
        timestamp: Date.now() - 172800000, // 2 days ago
        operation: 'executeDCA',
        gasUsed: BigInt('150000'),
        gasPrice: BigInt('20000000000'),
        sponsoredGas: BigInt('150000'),
        userPaid: BigInt('0'),
        savings: BigInt('3000000000000000'), // 0.003 ETH
        status: 'success'
      },
      {
        hash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba' as `0x${string}`,
        timestamp: Date.now() - 259200000, // 3 days ago
        operation: 'withdraw',
        gasUsed: BigInt('100000'),
        gasPrice: BigInt('20000000000'),
        sponsoredGas: BigInt('50000'),
        userPaid: BigInt('1000000000000000'), // 0.001 ETH
        savings: BigInt('1000000000000000'), // 0.001 ETH
        status: 'success'
      }
    ];
  }, []);

  const convertToUSD = useCallback(async (ethAmount: bigint): Promise<number> => {
    // In a real implementation, this would fetch current ETH price
    const ethPrice = 2000; // Mock ETH price
    const ethValue = Number(ethAmount) / 1e18;
    return ethValue * ethPrice;
  }, []);

  const getGasSavings = useCallback(async (): Promise<GasSavings> => {
    if (!smartAccountAddress) {
      throw new Error('Smart account address not available');
    }

    const userOps = await fetchUserOps(smartAccountAddress);
    
    const totalGasSaved = userOps.reduce((sum, op) => {
      return sum + op.savings;
    }, BigInt(0));

    const usdValue = await convertToUSD(totalGasSaved);
    const transactionCount = userOps.length;
    const averagePerTx = transactionCount > 0 ? totalGasSaved / BigInt(transactionCount) : BigInt(0);
    
    // Calculate monthly savings (assuming 30 transactions per month)
    const monthlySavings = usdValue * (30 / transactionCount);
    const yearlyProjection = monthlySavings * 12;

    return {
      totalGasSaved,
      usdValue,
      transactionCount,
      averagePerTx,
      monthlySavings,
      yearlyProjection
    };
  }, [smartAccountAddress, fetchUserOps, convertToUSD]);

  const getUserOpHistory = useCallback(async (): Promise<UserOpHistory[]> => {
    if (!smartAccountAddress) {
      throw new Error('Smart account address not available');
    }

    return await fetchUserOps(smartAccountAddress);
  }, [smartAccountAddress, fetchUserOps]);

  const getTopOperations = useCallback((userOps: UserOpHistory[]) => {
    const operationMap = new Map<string, { count: number; totalSavings: bigint }>();
    
    userOps.forEach(op => {
      const existing = operationMap.get(op.operation);
      if (existing) {
        existing.count++;
        existing.totalSavings += op.savings;
      } else {
        operationMap.set(op.operation, { count: 1, totalSavings: op.savings });
      }
    });

    return Array.from(operationMap.entries())
      .map(([operation, data]) => ({
        operation,
        count: data.count,
        totalSavings: data.totalSavings
      }))
      .sort((a, b) => Number(b.totalSavings - a.totalSavings))
      .slice(0, 5);
  }, []);

  const getMonthlyBreakdown = useCallback((userOps: UserOpHistory[]) => {
    const monthlyData = new Map<string, { transactions: number; gasSaved: bigint; usdValue: number }>();
    
    userOps.forEach(op => {
      const date = new Date(op.timestamp);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const existing = monthlyData.get(monthKey);
      if (existing) {
        existing.transactions++;
        existing.gasSaved += op.savings;
        existing.usdValue += Number(op.savings) / 1e18 * 2000; // Mock USD conversion
      } else {
        monthlyData.set(monthKey, {
          transactions: 1,
          gasSaved: op.savings,
          usdValue: Number(op.savings) / 1e18 * 2000
        });
      }
    });

    return Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        transactions: data.transactions,
        gasSaved: data.gasSaved,
        usdValue: data.usdValue
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, []);

  const loadAnalytics = useCallback(async () => {
    if (!smartAccountAddress || !address) return;

    setIsLoading(true);
    setError(null);

    try {
      const [gasSavings, userOpHistory] = await Promise.all([
        getGasSavings(),
        getUserOpHistory()
      ]);

      const topOperations = getTopOperations(userOpHistory);
      const monthlyBreakdown = getMonthlyBreakdown(userOpHistory);

      setAnalyticsData({
        gasSavings,
        userOpHistory,
        topOperations,
        monthlyBreakdown
      });
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [smartAccountAddress, address, getGasSavings, getUserOpHistory, getTopOperations, getMonthlyBreakdown]);

  const saveUserOp = useCallback(async (userOp: UserOpHistory) => {
    if (!smartAccountAddress) return;

    const existingOps = await fetchUserOps(smartAccountAddress);
    const updatedOps = [userOp, ...existingOps];
    
    localStorage.setItem(`userOps_${smartAccountAddress}`, JSON.stringify(updatedOps));
    
    // Reload analytics
    await loadAnalytics();
  }, [smartAccountAddress, fetchUserOps, loadAnalytics]);

  useEffect(() => {
    if (smartAccountAddress && address) {
      loadAnalytics();
    }
  }, [smartAccountAddress, address, loadAnalytics]);

  return {
    analyticsData,
    isLoading,
    error,
    loadAnalytics,
    saveUserOp,
    getGasSavings,
    getUserOpHistory
  };
}
