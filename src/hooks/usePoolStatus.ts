'use client';

import { useAccount, usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { getContractAddress } from '@/contracts/addresses';
import { UniswapV4PoolManagerABI } from '@/contracts/abis/UniswapV4PoolManager';
import { useActiveChainId } from './useActiveChainId';
import { BASE_SEPOLIA_TOKENS } from '@/config/network';

export interface PoolStatus {
  exists: boolean;
  hasLiquidity: boolean;
  needsInit: boolean;
  isReady: boolean;
  sqrtPriceX96?: bigint;
  tick?: number;
  liquidity?: bigint;
  error?: string;
}

export interface PoolKey {
  currency0: `0x${string}`;
  currency1: `0x${string}`;
  fee: number;
  tickSpacing: number;
  hooks: `0x${string}`;
}

export function usePoolStatus(token0Address?: string, token1Address?: string) {
  const { address } = useAccount();
  const chainId = useActiveChainId();
  const publicClient = usePublicClient();

  // Default to USDC/WETH pair for Base Sepolia
  const defaultToken0 = BASE_SEPOLIA_TOKENS.USDC;
  const defaultToken1 = BASE_SEPOLIA_TOKENS.WETH;
  
  const token0 = token0Address || defaultToken0;
  const token1 = token1Address || defaultToken1;

  // Get contract addresses
  const poolManagerAddress = getContractAddress(chainId, 'UniswapV4PoolManager');
  const spendSaveHookAddress = getContractAddress(chainId, 'SpendSaveHook');

  // Create pool key
  const poolKey: PoolKey = {
    currency0: (token0.toLowerCase() < token1.toLowerCase() ? token0 : token1) as `0x${string}`,
    currency1: (token0.toLowerCase() < token1.toLowerCase() ? token1 : token0) as `0x${string}`,
    fee: 3000, // 0.3% fee tier
    tickSpacing: 60,
    hooks: spendSaveHookAddress as `0x${string}`,
  };

  // Generate pool ID (keccak256 hash of pool key)
  const poolId = `0x${Buffer.from(
    JSON.stringify(poolKey, (key, value) => 
      typeof value === 'bigint' ? value.toString() : value
    )
  ).toString('hex')}`;

  const { data: poolStatus, isLoading, error } = useQuery<PoolStatus>({
    queryKey: ['poolStatus', chainId, token0, token1, poolManagerAddress],
    queryFn: async (): Promise<PoolStatus> => {
      if (!publicClient || !poolManagerAddress || poolManagerAddress === '0x0000000000000000000000000000000000000000') {
        return {
          exists: false,
          hasLiquidity: false,
          needsInit: true,
          isReady: false,
          error: 'PoolManager not deployed on this network'
        };
      }

      try {
        // TODO: Implement proper pool status checking
        // For now, return a default state that indicates pool needs initialization
        return {
          exists: false,
          hasLiquidity: false,
          needsInit: true,
          isReady: false,
          sqrtPriceX96: BigInt(0),    
          tick: 0,
          liquidity: BigInt(0)
        };

      } catch (error: any) {
        console.error('Error checking pool status:', error);
        
        // If pool doesn't exist, it needs initialization
        if (error.message?.includes('Pool not found') || error.message?.includes('Pool does not exist')) {
          return {
            exists: false,
            hasLiquidity: false,
            needsInit: true,
            isReady: false,
            error: 'Pool not found - needs initialization'
          };
        }

        return {
          exists: false,
          hasLiquidity: false,
          needsInit: true,
          isReady: false,
          error: error.message || 'Unknown error checking pool status'
        };
      }
    },
    enabled: !!publicClient && !!poolManagerAddress && poolManagerAddress !== '0x0000000000000000000000000000000000000000',
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 2,
  });

  return {
    poolStatus: poolStatus || {
      exists: false,
      hasLiquidity: false,
      needsInit: true,
      isReady: false
    },
    isLoading,
    error: error?.message,
    poolKey,
    poolId,
    poolManagerAddress,
    spendSaveHookAddress
  };
}

// Hook to get pool initialization parameters
export function usePoolInitialization() {
  const { poolKey, poolManagerAddress } = usePoolStatus();

  return {
    poolKey,
    poolManagerAddress,
    canInitialize: !!poolKey && !!poolManagerAddress,
    initializationParams: poolKey ? {
      currency0: poolKey.currency0,
      currency1: poolKey.currency1,
      fee: poolKey.fee,
      tickSpacing: poolKey.tickSpacing,
      hooks: poolKey.hooks,
      sqrtPriceX96: BigInt(79228162514264337593543950336), // 1:1 price
    } : null
  };
}
