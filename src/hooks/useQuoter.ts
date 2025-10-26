'use client';

import { useQuery } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';
import { getContractAddress } from '@/contracts/addresses';
import { SpendSaveQuoterABI } from '@/contracts/abis/SpendSaveQuoter';
import { useActiveChainId } from './useActiveChainId';

export interface SavingsImpactPreview {
  swapOutput: bigint;
  savedAmount: bigint;
  netOutput: bigint;
}

export interface DCAQuote {
  amountOut: bigint;
  gasEstimate: bigint;
}

export interface MultiHopRoutingPreview {
  amountOut: bigint;
  gasEstimate: bigint;
}

export function useSavingsImpactPreview(
  poolKey?: {
    currency0: `0x${string}`;
    currency1: `0x${string}`;
    fee: number;
    tickSpacing: number;
    hooks: `0x${string}`;
  },
  zeroForOne?: boolean,
  amountIn?: bigint,
  savingsPercentage?: bigint
) {
  const chainId = useActiveChainId();
  const publicClient = usePublicClient();
  const quoterAddress = getContractAddress(chainId, 'Quoter');

  const {
    data: savingsImpactData,
    isLoading: isLoadingSavingsImpact,
    error: savingsImpactError,
    refetch: refetchSavingsImpact
  } = useQuery({
    queryKey: ['savingsImpact', quoterAddress, poolKey, zeroForOne, amountIn, savingsPercentage],
    queryFn: async () => {
      if (!publicClient || !quoterAddress || !poolKey || zeroForOne === undefined || amountIn === undefined || savingsPercentage === undefined) {
        return null;
      }

      try {
        const result = await publicClient.simulateContract({
          address: quoterAddress,
          abi: SpendSaveQuoterABI,
          functionName: 'previewSavingsImpact',
          args: [poolKey, zeroForOne, amountIn, savingsPercentage],
        });

        return result.result;
      } catch (err) {
        console.error('Error fetching savings impact:', err);
        throw err;
      }
    },
    enabled: !!(poolKey && zeroForOne !== undefined && amountIn !== undefined && savingsPercentage !== undefined),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5000, // 5 seconds
    refetchInterval: 15000, // 15 seconds
  });

  const savingsImpact: SavingsImpactPreview | null = savingsImpactData ? {
    swapOutput: savingsImpactData[0] as unknown as bigint,
    savedAmount: savingsImpactData[1] as unknown as bigint,
    netOutput: savingsImpactData[2] as unknown as bigint
  } : null;

  return {
    savingsImpact,
    isLoadingSavingsImpact,
    savingsImpactError,
    refetchSavingsImpact
  };
}

export function useDCAQuote(
  poolKey?: {
    currency0: `0x${string}`;
    currency1: `0x${string}`;
    fee: number;
    tickSpacing: number;
    hooks: `0x${string}`;
  },
  zeroForOne?: boolean,
  amountIn?: bigint
) {
  const chainId = useActiveChainId();
  const publicClient = usePublicClient();
  const quoterAddress = getContractAddress(chainId, 'Quoter');

  const { 
    data: dcaQuoteData, 
    isLoading: isLoadingDCAQuote,
    error: dcaQuoteError,
    refetch: refetchDCAQuote
  } = useQuery({
    queryKey: ['dcaQuote', quoterAddress, poolKey, zeroForOne, amountIn],
    queryFn: async () => {
      if (!publicClient || !quoterAddress || !poolKey || zeroForOne === undefined || amountIn === undefined) {
        return null;
      }

      try {
        const result = await publicClient.simulateContract({
          address: quoterAddress,
          abi: SpendSaveQuoterABI,
          functionName: 'getDCAQuote',
          args: [poolKey, zeroForOne, amountIn],
        });

        return result.result;
      } catch (err) {
        console.error('Error fetching DCA quote:', err);
        throw err;
      }
    },
    enabled: !!(poolKey && zeroForOne !== undefined && amountIn !== undefined),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5000, // 5 seconds
    refetchInterval: 15000, // 15 seconds
  });

  const dcaQuote: DCAQuote | null = dcaQuoteData ? {
    amountOut: dcaQuoteData[0] as bigint,
    gasEstimate: dcaQuoteData[1] as bigint
  } : null;

  return {
    dcaQuote,
    isLoadingDCAQuote,
    dcaQuoteError,
    refetchDCAQuote
  };
}

export function useMultiHopRoutingPreview(
  startingCurrency?: `0x${string}`,
  path?: Array<{
    currency0: `0x${string}`;
    currency1: `0x${string}`;
    fee: number;
    tickSpacing: number;
    hooks: `0x${string}`;
  }>,
  amountIn?: bigint
) {
  const chainId = useActiveChainId();
  const publicClient = usePublicClient();
  const quoterAddress = getContractAddress(chainId, 'Quoter');

  const {
    data: multiHopData,
    isLoading: isLoadingMultiHop,
    error: multiHopError,
    refetch: refetchMultiHop
  } = useQuery({
    queryKey: ['multiHopRouting', quoterAddress, startingCurrency, path, amountIn],
    queryFn: async () => {
      if (!publicClient || !quoterAddress || !startingCurrency || !path || path.length === 0 || amountIn === undefined) {
        return null;
      }

      try {
        const result = await publicClient.simulateContract({
          address: quoterAddress,
          abi: SpendSaveQuoterABI,
          functionName: 'previewMultiHopRouting',
          args: [startingCurrency, path, amountIn],
        });

        return result.result;
      } catch (err) {
        console.error('Error fetching multi-hop routing:', err);
        throw err;
      }
    },
    enabled: !!(startingCurrency && path && path.length > 0 && amountIn !== undefined),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5000, // 5 seconds
    refetchInterval: 15000, // 15 seconds
  });

  const multiHopRouting: MultiHopRoutingPreview | null = multiHopData ? {
    amountOut: multiHopData[0] as bigint,
    gasEstimate: multiHopData[1] as bigint
  } : null;

  return {
    multiHopRouting,
    isLoadingMultiHop,
    multiHopError,
    refetchMultiHop
  };
}
