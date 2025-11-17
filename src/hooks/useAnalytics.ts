'use client';

import { useReadContract } from 'wagmi';
import { useAccount } from 'wagmi';
import { useActiveChainId } from './useActiveChainId';
import { getContractAddress } from '@/contracts/addresses';
import { SpendSaveAnalyticsABI } from '@/contracts/abis/SpendSaveAnalytics';

export interface UserPortfolio {
  tokens: `0x${string}`[];
  savings: bigint[];
  dcaAmounts: bigint[];
  totalValueUSD: bigint;
}

export interface PoolAnalytics {
  sqrtPriceX96: bigint;
  tick: number;
  liquidity: bigint;
  feeGrowthGlobal0: bigint;
  feeGrowthGlobal1: bigint;
}

export interface TickLiquidityDistribution {
  currentTick: number;
  ticks: number[];
  liquidityGross: bigint[];
  liquidityNet: bigint[];
}

export function useAnalytics() {
  const { address } = useAccount();
  const chainId = useActiveChainId();
  
  const analyticsAddress = getContractAddress(chainId, 'Analytics');

  // Get user portfolio data
  const {
    data: portfolioData,
    isLoading: isLoadingPortfolio,
    error: portfolioError,
    refetch: refetchPortfolio
  } = useReadContract({
    address: analyticsAddress,
    abi: SpendSaveAnalyticsABI,
    functionName: 'getUserPortfolio' as any, // Type assertion to bypass TypeScript issue
    args: undefined,
    query: {
      enabled: !!address,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 30000, // 30 seconds
      refetchInterval: 60000, // 1 minute
    }
  });

  // Get pool analytics
  const getPoolAnalytics = async (poolKey: any): Promise<PoolAnalytics | null> => {
    try {
      // This would be implemented with a contract call
      return null;
    } catch (error) {
      console.error('Error fetching pool analytics:', error);
      return null;
    }
  };

  // Get tick liquidity distribution
  const getTickLiquidityDistribution = async (poolKey: any, tickRange: number): Promise<TickLiquidityDistribution | null> => {
    try {
      // This would be implemented with a contract call
      return null;
    } catch (error) {
      console.error('Error fetching tick liquidity distribution:', error);
      return null;
    }
  };

  return {
    portfolio: portfolioData as unknown as UserPortfolio | null,
    isLoadingPortfolio,
    portfolioError,
    refetchPortfolio,
    analyticsAddress,
    getPoolAnalytics,
    getTickLiquidityDistribution
  };
}