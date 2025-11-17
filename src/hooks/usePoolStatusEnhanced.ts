'use client';

import { useAccount, usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { getContractAddress } from '@/contracts/addresses';
import { StateViewABI } from '@/contracts/abis/StateView';
import { useActiveChainId } from './useActiveChainId';
import { BASE_SEPOLIA_TOKENS } from '@/config/network';
import { Address, keccak256, encodeAbiParameters, parseAbiParameters } from 'viem';

export interface PoolStatus {
  exists: boolean;
  hasLiquidity: boolean;
  needsInit: boolean;
  isReady: boolean;
  sqrtPriceX96?: bigint;
  tick?: number;
  liquidity?: bigint;
  error?: string;
  lastSwapBlock?: number;
  lastLiquidityBlock?: number;
}

export interface PoolKey {
  currency0: `0x${string}`;
  currency1: `0x${string}`;
  fee: number;
  tickSpacing: number;
  hooks: `0x${string}`;
}

export interface PoolInfo {
  poolKey: PoolKey;
  poolId: `0x${string}`;
  poolManagerAddress: `0x${string}`;
  spendSaveHookAddress: `0x${string}`;
}

/**
 * Enhanced pool status checking using StateView contract
 * This is more reliable than event log parsing
 */
export function usePoolStatusEnhanced(token0Address?: string, token1Address?: string) {
  
  const publicClient = usePublicClient();
  const chainId = useActiveChainId();

  // Default to USDC/WETH on Base Sepolia
  const token0 = token0Address || BASE_SEPOLIA_TOKENS.USDC;
  const token1 = token1Address || BASE_SEPOLIA_TOKENS.WETH;

  // Get contract addresses
  const poolManagerAddress = getContractAddress(chainId, 'UniswapV4PoolManager') as `0x${string}`;
  const spendSaveHookAddress = getContractAddress(chainId, 'SpendSaveHook') as `0x${string}`;
  const stateViewAddress = getContractAddress(chainId, 'StateView') as `0x${string}`;

  // Create pool key
  const [currency0, currency1] = token0.toLowerCase() < token1.toLowerCase() 
    ? [token0 as `0x${string}`, token1 as `0x${string}`]
    : [token1 as `0x${string}`, token0 as `0x${string}`];

  const poolKey: PoolKey = {
    currency0,
    currency1,
    fee: 3000, // 0.3% fee tier
    tickSpacing: 60,
    hooks: spendSaveHookAddress,
  };

  // Generate pool ID using the same method as the contract
  const poolId = keccak256(
    encodeAbiParameters(
      parseAbiParameters('(address currency0, address currency1, uint24 fee, int24 tickSpacing, address hooks)'),
      [poolKey]
    )
  ) as `0x${string}`;

  const { data: poolStatus, isLoading, error } = useQuery<PoolStatus>({
    queryKey: ['poolStatusEnhanced', chainId, token0, token1, poolManagerAddress],
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

      if (!stateViewAddress || stateViewAddress === '0x0000000000000000000000000000000000000000') {
        return {
          exists: false,
          hasLiquidity: false,
          needsInit: true,
          isReady: false,
          error: 'StateView not deployed on this network'
        };
      }

      try {
        console.log('🔍 Checking pool status for:', {
          poolId,
          stateViewAddress,
          poolManagerAddress,
          spendSaveHookAddress
        });

        // Try to get slot0 data from StateView
        const slot0Data = await publicClient.readContract({
          address: stateViewAddress,
          abi: StateViewABI,
          functionName: 'getSlot0',
          args: [poolId]
        });

        console.log('📊 Slot0 data:', slot0Data);

        const [sqrtPriceX96, tick, protocolFee, lpFee] = slot0Data as [bigint, number, number, number];

        // If we get slot0 data, the pool exists and is initialized
        if (sqrtPriceX96 && sqrtPriceX96 > BigInt(0)) {
          // Try to get liquidity data
          let liquidity = BigInt(0);
          try {
            const liquidityData = await publicClient.readContract({
              address: stateViewAddress,
              abi: StateViewABI,
              functionName: 'getLiquidity',
              args: [poolId]
            });
            liquidity = liquidityData as bigint;
          } catch (liquidityError) {
            console.warn('Could not fetch liquidity data:', liquidityError);
            // Pool exists but liquidity data might not be available
            liquidity = BigInt(1); // Assume minimal liquidity
          }

          console.log('✅ Pool is initialized and ready:', {
            sqrtPriceX96: sqrtPriceX96.toString(),
            tick,
            liquidity: liquidity.toString(),
            protocolFee,
            lpFee
          });

          return {
            exists: true,
            hasLiquidity: liquidity > BigInt(0),
            needsInit: false,
            isReady: true,
            sqrtPriceX96,
            tick,
            liquidity,
            error: undefined
          };
        } else {
          return {
            exists: false,
            hasLiquidity: false,
            needsInit: true,
            isReady: false,
            error: 'Pool not initialized - sqrtPriceX96 is zero'
          };
        }

      } catch (error: any) {
        console.error('❌ Error checking pool status:', error);
        
        // Check if it's a "pool not found" error
        if (error.message?.includes('execution reverted') || 
            error.message?.includes('Pool not found') || 
            error.message?.includes('Pool does not exist')) {
          return {
            exists: false,
            hasLiquidity: false,
            needsInit: true,
            isReady: false,
            error: 'Pool not initialized - needs setup'
          };
        }

        // For other errors, assume pool needs initialization
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
    poolInfo: {
      poolKey,
      poolId,
      poolManagerAddress,
      spendSaveHookAddress
    }
  };
}

/**
 * Hook to get pool initialization parameters
 */
export function usePoolInitialization() {
  const { poolInfo } = usePoolStatusEnhanced();
  
  return {
    poolKey: poolInfo.poolKey,
    poolId: poolInfo.poolId,
    poolManagerAddress: poolInfo.poolManagerAddress,
    spendSaveHookAddress: poolInfo.spendSaveHookAddress
  };
}

/**
 * Hook to get recent pool activity
 */
export function usePoolActivity() {
  const { poolInfo } = usePoolStatusEnhanced();
  const publicClient = usePublicClient();
  const chainId = useActiveChainId();

  return useQuery({
    queryKey: ['poolActivity', chainId, poolInfo.poolId],
    queryFn: async () => {
      if (!publicClient) return null;

      try {
        // Get current block and limit range to avoid RPC errors
        const currentBlock = await publicClient.getBlockNumber();
        const maxBlocksToSearch = BigInt(50000); // Limit to 50k blocks to stay under RPC limit
        const fromBlock = currentBlock > maxBlocksToSearch ? currentBlock - maxBlocksToSearch : BigInt(0);

        // Get recent swap events
        const swapEvents = await publicClient.getLogs({
          address: poolInfo.poolManagerAddress,
          event: {
            type: 'event',
            name: 'Swap',
            inputs: [
              { indexed: true, name: 'id', type: 'bytes32' },
              { indexed: true, name: 'currency0', type: 'address' },
              { indexed: true, name: 'currency1', type: 'address' },
              { indexed: false, name: 'amount0', type: 'int128' },
              { indexed: false, name: 'amount1', type: 'int128' },
              { indexed: false, name: 'sqrtPriceX96', type: 'uint160' },
              { indexed: false, name: 'tick', type: 'int24' },
              { indexed: false, name: 'fee', type: 'uint24' }
            ]
          },
          args: {
            id: poolInfo.poolId
          },
          fromBlock,
          toBlock: currentBlock
        });

        // Get recent liquidity events
        const liquidityEvents = await publicClient.getLogs({
          address: poolInfo.poolManagerAddress,
          event: {
            type: 'event',
            name: 'ModifyLiquidity',
            inputs: [
              { indexed: true, name: 'id', type: 'bytes32' },
              { indexed: true, name: 'currency0', type: 'address' },
              { indexed: true, name: 'currency1', type: 'address' },
              { indexed: false, name: 'liquidityDelta', type: 'int256' },
              { indexed: false, name: 'tickLower', type: 'int24' },
              { indexed: false, name: 'tickUpper', type: 'int24' }
            ]
          },
          args: {
            id: poolInfo.poolId
          },
          fromBlock,
          toBlock: currentBlock
        });

        return {
          recentSwaps: swapEvents.length,
          recentLiquidityChanges: liquidityEvents.length,
          isActive: swapEvents.length > 0 || liquidityEvents.length > 0,
          lastSwapBlock: swapEvents.length > 0 ? swapEvents[swapEvents.length - 1].blockNumber : undefined,
          lastLiquidityBlock: liquidityEvents.length > 0 ? liquidityEvents[liquidityEvents.length - 1].blockNumber : undefined
        };
      } catch (error) {
        console.error('Error fetching pool activity:', error);
        return null;
      }
    },
    enabled: !!publicClient && !!poolInfo.poolId,
    refetchInterval: 60000, // Refetch every minute
  });
}

/**
 * Hook to get who initialized the pool
 */
export function usePoolInitializedBy(userAddress?: string) {
  const { poolInfo } = usePoolStatusEnhanced();
  const publicClient = usePublicClient();
  const chainId = useActiveChainId();

  return useQuery({
    queryKey: ['poolInitializedBy', chainId, poolInfo.poolId, userAddress],
    queryFn: async () => {
      if (!publicClient) return null;

      try {
        // Get current block and limit range to avoid RPC errors
        const currentBlock = await publicClient.getBlockNumber();
        const maxBlocksToSearch = BigInt(100000); // Use max allowed for initialization events
        const fromBlock = currentBlock > maxBlocksToSearch ? currentBlock - maxBlocksToSearch : BigInt(0);

        // Get Initialize events
        const initializeEvents = await publicClient.getLogs({
          address: poolInfo.poolManagerAddress,
          event: {
            type: 'event',
            name: 'Initialize',
            inputs: [
              { indexed: true, name: 'id', type: 'bytes32' },
              { indexed: true, name: 'currency0', type: 'address' },
              { indexed: true, name: 'currency1', type: 'address' },
              { indexed: false, name: 'fee', type: 'uint24' },
              { indexed: false, name: 'tickSpacing', type: 'int24' },
              { indexed: false, name: 'hooks', type: 'address' },
              { indexed: false, name: 'sqrtPriceX96', type: 'uint160' },
              { indexed: false, name: 'tick', type: 'int24' }
            ]
          },
          args: {
            id: poolInfo.poolId
          },
          fromBlock,
          toBlock: currentBlock
        });

        if (initializeEvents.length > 0) {
          const initEvent = initializeEvents[0];
          return {
            initializedBy: initEvent.transactionHash,
            blockNumber: initEvent.blockNumber,
            transactionHash: initEvent.transactionHash,
            isUserInitialized: userAddress ? initEvent.transactionHash === userAddress : false
          };
        }

        return null;
      } catch (error) {
        console.error('Error fetching pool initialization info:', error);
        return null;
      }
    },
    enabled: !!publicClient && !!poolInfo.poolId,
  });
}