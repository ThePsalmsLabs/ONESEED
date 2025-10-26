'use client';

import { useReadContract } from 'wagmi';
import { useActiveChainId } from './useActiveChainId';
import { getContractAddress } from '@/contracts/addresses';
import { SpendSaveAnalyticsABI } from '@/contracts/abis/SpendSaveAnalytics';

export interface PoolKey {
  currency0: `0x${string}`;
  currency1: `0x${string}`;
  fee: number;
  tickSpacing: number;
  hooks: `0x${string}`;
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

export function usePoolAnalytics(poolKey?: PoolKey) {
  const chainId = useActiveChainId();
  const analyticsAddress = getContractAddress(chainId, 'Analytics');

  const {
    data: poolAnalyticsData,
    isLoading: isLoadingPoolAnalytics,
    error: poolAnalyticsError,
    refetch: refetchPoolAnalytics
  } = useReadContract({
    address: analyticsAddress,
    abi: SpendSaveAnalyticsABI,
    functionName: 'getPoolAnalytics',
    args: poolKey ? [poolKey] : undefined,
    query: {
      enabled: !!poolKey,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 10000, // 10 seconds
      refetchInterval: 30000, // 30 seconds
    }
  });

  const poolAnalytics: PoolAnalytics | null = poolAnalyticsData ? {
    sqrtPriceX96: poolAnalyticsData[0] as bigint,
    tick: Number(poolAnalyticsData[1]),
    liquidity: poolAnalyticsData[2] as bigint,
    feeGrowthGlobal0: poolAnalyticsData[3] as bigint,
    feeGrowthGlobal1: poolAnalyticsData[4] as bigint
  } : null;

  return {
    poolAnalytics,
    isLoadingPoolAnalytics,
    poolAnalyticsError,
    refetchPoolAnalytics
  };
}

export function useTickLiquidityDistribution(
  poolKey?: PoolKey,
  tickRange: number = 10
) {
  const chainId = useActiveChainId();
  const analyticsAddress = getContractAddress(chainId, 'Analytics');

  const {
    data: tickData,
    isLoading: isLoadingTickData,
    error: tickDataError,
    refetch: refetchTickData
  } = useReadContract({
    address: analyticsAddress,
    abi: SpendSaveAnalyticsABI,
    functionName: 'getTickLiquidityDistribution',
    args: poolKey ? [poolKey, BigInt(tickRange)] : undefined,
    query: {
      enabled: !!poolKey,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 10000, // 10 seconds
      refetchInterval: 30000, // 30 seconds
    }
  });

  const tickDistribution: TickLiquidityDistribution | null = tickData ? {
    currentTick: Number(tickData[0]),
    ticks: (tickData[1] as unknown as bigint[]).map(t => Number(t)),
    liquidityGross: tickData[2] as bigint[],
    liquidityNet: tickData[3] as bigint[]
  } : null;

  return {
    tickDistribution,
    isLoadingTickData,
    tickDataError,
    refetchTickData
  };
}

// Helper function to create a pool key
export function createPoolKey(
  currency0: `0x${string}`,
  currency1: `0x${string}`,
  fee: number = 3000,
  tickSpacing: number = 60,
  hooks: `0x${string}` = '0x0000000000000000000000000000000000000000'
): PoolKey {
  return {
    currency0,
    currency1,
    fee,
    tickSpacing,
    hooks
  };
}

// Helper function to calculate price from sqrtPriceX96
export function calculatePriceFromSqrtPriceX96(sqrtPriceX96: bigint): number {
  if (sqrtPriceX96 === BigInt(0)) return 0;
  
  // Convert sqrtPriceX96 to price
  // price = (sqrtPriceX96 / 2^96)^2
  const price = Number(sqrtPriceX96) / (2 ** 96);
  return price * price;
}

// Helper function to calculate tick from price
export function calculateTickFromPrice(price: number): number {
  if (price <= 0) return 0;
  
  // tick = floor(log(sqrt(price)) / log(1.0001))
  const sqrtPrice = Math.sqrt(price);
  const tick = Math.floor(Math.log(sqrtPrice) / Math.log(1.0001));
  return tick;
}
