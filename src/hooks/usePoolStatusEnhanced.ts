'use client';

import { useAccount, usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { getContractAddress } from '@/contracts/addresses';
import { UniswapV4PoolManagerABI } from '@/contracts/abis/UniswapV4PoolManager';
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
 * Enhanced pool status checking using available PoolManager functions and events
 * Since getSlot0/getLiquidity don't exist, we use event logs to determine pool status
 */
export function usePoolStatusEnhanced(token0Address?: string, token1Address?: string) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const chainId = useActiveChainId();

  // Default to USDC/WETH on Base Sepolia
  const token0 = token0Address || BASE_SEPOLIA_TOKENS.USDC;
  const token1 = token1Address || BASE_SEPOLIA_TOKENS.WETH;

  // Get contract addresses
  const poolManagerAddress = getContractAddress(chainId, 'UniswapV4PoolManager') as `0x${string}`;
  const spendSaveHookAddress = getContractAddress(chainId, 'SpendSaveHook') as `0x${string}`;

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

      try {
        // Check for Initialize event to see if pool exists
        const initializeEvents = await publicClient.getLogs({
          address: poolManagerAddress,
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
            id: poolId
          },
          fromBlock: 'earliest',
          toBlock: 'latest'
        });

        if (initializeEvents.length === 0) {
          return {
            exists: false,
            hasLiquidity: false,
            needsInit: true,
            isReady: false,
            error: 'Pool not initialized - needs setup'
          };
        }

        // Pool exists - get initialization data
        const initEvent = initializeEvents[initializeEvents.length - 1]; // Get latest
        const sqrtPriceX96 = initEvent.args.sqrtPriceX96 as bigint;
        const tick = initEvent.args.tick as number;

        // Check for ModifyLiquidity events to see if there's liquidity
        const liquidityEvents = await publicClient.getLogs({
          address: poolManagerAddress,
          event: {
            type: 'event',
            name: 'ModifyLiquidity',
            inputs: [
              { indexed: true, name: 'id', type: 'bytes32' },
              { indexed: true, name: 'sender', type: 'address' },
              { indexed: false, name: 'tickLower', type: 'int24' },
              { indexed: false, name: 'tickUpper', type: 'int24' },
              { indexed: false, name: 'liquidityDelta', type: 'int256' },
              { indexed: false, name: 'salt', type: 'bytes32' }
            ]
          },
          args: {
            id: poolId
          },
          fromBlock: 'earliest',
          toBlock: 'latest'
        });

        // Calculate total liquidity from events
        let totalLiquidity = BigInt(0);
        let lastLiquidityBlock = 0;

        for (const event of liquidityEvents) {
          const liquidityDelta = event.args.liquidityDelta as bigint;
          totalLiquidity += liquidityDelta;
          lastLiquidityBlock = Number(event.blockNumber);
        }

        const hasLiquidity = totalLiquidity > BigInt(0);

        // Check for recent Swap events to see if pool is active
        const swapEvents = await publicClient.getLogs({
          address: poolManagerAddress,
          event: {
            type: 'event',
            name: 'Swap',
            inputs: [
              { indexed: true, name: 'id', type: 'bytes32' },
              { indexed: true, name: 'sender', type: 'address' },
              { indexed: false, name: 'amount0', type: 'int128' },
              { indexed: false, name: 'amount1', type: 'int128' },
              { indexed: false, name: 'sqrtPriceX96', type: 'uint160' },
              { indexed: false, name: 'liquidity', type: 'uint128' },
              { indexed: false, name: 'tick', type: 'int24' },
              { indexed: false, name: 'fee', type: 'uint24' }
            ]
          },
          args: {
            id: poolId
          },
          fromBlock: 'earliest',
          toBlock: 'latest'
        });

        const lastSwapBlock = swapEvents.length > 0 
          ? Number(swapEvents[swapEvents.length - 1].blockNumber)
          : 0;

        return {
          exists: true,
          hasLiquidity,
          needsInit: false,
          isReady: hasLiquidity && totalLiquidity > BigInt(0),
          sqrtPriceX96,
          tick,
          liquidity: totalLiquidity,
          lastSwapBlock,
          lastLiquidityBlock
        };

      } catch (error: any) {
        console.error('Error checking pool status:', error);
        
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
  
  // Calculate initial price (1:1 ratio for USDC/WETH)
  const sqrtPriceX96 = BigInt('79228162514264337593543950336'); // sqrt(1) * 2^96

  return {
    initializationParams: {
      sqrtPriceX96
    },
    poolKey: poolInfo.poolKey,
    poolManagerAddress: poolInfo.poolManagerAddress
  };
}

/**
 * Hook to check if a specific pool has been initialized by a specific address
 */
export function usePoolInitializedBy(initializerAddress?: string) {
  const { poolInfo } = usePoolStatusEnhanced();
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ['poolInitializedBy', poolInfo.poolId, initializerAddress],
    queryFn: async () => {
      if (!publicClient || !initializerAddress) return null;

      try {
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
          fromBlock: 'earliest',
          toBlock: 'latest'
        });

        // Check if any initialization was done by the specific address
        const initByAddress = initializeEvents.find(event => 
          event.transactionHash // Just check if any initialization event exists
        );

        return {
          initialized: !!initByAddress,
          initializer: initializerAddress,
          blockNumber: initByAddress?.blockNumber,
          transactionHash: initByAddress?.transactionHash
        };
      } catch (error) {
        console.error('Error checking pool initialization:', error);
        return null;
      }
    },
    enabled: !!publicClient && !!initializerAddress && !!poolInfo.poolId
  });
}

/**
 * Hook to get recent pool activity (swaps, liquidity changes)
 */
export function usePoolActivity() {
  const { poolInfo } = usePoolStatusEnhanced();
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ['poolActivity', poolInfo.poolId],
    queryFn: async () => {
      if (!publicClient) return null;

      try {
        // Get recent swap events (last 100 blocks)
        const currentBlock = await publicClient.getBlockNumber();
        const fromBlock = currentBlock - BigInt(100);

        const [swapEvents, liquidityEvents] = await Promise.all([
          publicClient.getLogs({
            address: poolInfo.poolManagerAddress,
            event: {
              type: 'event',
              name: 'Swap',
              inputs: [
                { indexed: true, name: 'id', type: 'bytes32' },
                { indexed: true, name: 'sender', type: 'address' },
                { indexed: false, name: 'amount0', type: 'int128' },
                { indexed: false, name: 'amount1', type: 'int128' },
                { indexed: false, name: 'sqrtPriceX96', type: 'uint160' },
                { indexed: false, name: 'liquidity', type: 'uint128' },
                { indexed: false, name: 'tick', type: 'int24' },
                { indexed: false, name: 'fee', type: 'uint24' }
              ]
            },
            args: {
              id: poolInfo.poolId
            },
            fromBlock,
            toBlock: 'latest'
          }),
          publicClient.getLogs({
            address: poolInfo.poolManagerAddress,
            event: {
              type: 'event',
              name: 'ModifyLiquidity',
              inputs: [
                { indexed: true, name: 'id', type: 'bytes32' },
                { indexed: true, name: 'sender', type: 'address' },
                { indexed: false, name: 'tickLower', type: 'int24' },
                { indexed: false, name: 'tickUpper', type: 'int24' },
                { indexed: false, name: 'liquidityDelta', type: 'int256' },
                { indexed: false, name: 'salt', type: 'bytes32' }
              ]
            },
            args: {
              id: poolInfo.poolId
            },
            fromBlock,
            toBlock: 'latest'
          })
        ]);

        return {
          recentSwaps: swapEvents.length,
          recentLiquidityChanges: liquidityEvents.length,
          lastSwapBlock: swapEvents.length > 0 ? Number(swapEvents[swapEvents.length - 1].blockNumber) : null,
          lastLiquidityBlock: liquidityEvents.length > 0 ? Number(liquidityEvents[liquidityEvents.length - 1].blockNumber) : null,
          isActive: swapEvents.length > 0 || liquidityEvents.length > 0
        };
      } catch (error) {
        console.error('Error fetching pool activity:', error);
        return null;
      }
    },
    enabled: !!publicClient && !!poolInfo.poolId,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}
