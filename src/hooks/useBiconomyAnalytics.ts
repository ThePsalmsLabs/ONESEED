'use client';

import { useState, useEffect, useCallback } from 'react';
import { useBiconomy } from '@/components/BiconomyProvider';
import { useAccount } from 'wagmi';
import { useActiveChainId } from './useActiveChainId';

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
      console.warn('Biconomy API not available, falling back to localStorage:', error);
    }

    // Fallback to localStorage for development
    const storedOps = localStorage.getItem(`userOps_${userAddress}`);
    if (storedOps) {
      return JSON.parse(storedOps);
    }
    
    // Return empty array if no data available
    return [];
  }, []);

  const convertToUSD = useCallback(async (ethAmount: bigint): Promise<number> => {
    try {
      // Fetch real ETH price from CoinGecko
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      );
      const data = await response.json();
      const ethPrice = data.ethereum?.usd || 2000; // Fallback to $2000
      const ethValue = Number(ethAmount) / 1e18;
      return ethValue * ethPrice;
    } catch (error) {
      console.warn('Failed to fetch ETH price, using fallback:', error);
      const ethPrice = 2000; // Fallback price
      const ethValue = Number(ethAmount) / 1e18;
      return ethValue * ethPrice;
    }
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
