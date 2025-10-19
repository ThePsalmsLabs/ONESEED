'use client';

import { useAccount, usePublicClient, useBlockNumber } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { useSpendSaveContracts } from './useSpendSaveContracts';
import { useDCA } from './useDCA';
import { formatUnits, parseAbiItem } from 'viem';

export interface DCAAnalytics {
  totalExecutions: bigint;
  totalVolume: bigint;
  averageExecutionPrice: bigint;
  successRate: number;
  topPairs: Array<{
    fromToken: `0x${string}`;
    toToken: `0x${string}`;
    volume: bigint;
    executions: bigint;
  }>;
}

export interface DCAMetrics {
  executionCount: number;
  totalVolumeFormatted: string;
  averageAmount: string;
  successRate: number;
}

export function useDCAAnalytics() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const contracts = useSpendSaveContracts();
  const { history: dcaHistory } = useDCA();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const getAnalytics = useQuery({
    queryKey: ['dcaAnalytics', address, blockNumber],
    queryFn: async (): Promise<DCAAnalytics> => {
      if (!address || !publicClient) {
        return {
          totalExecutions: 0n,
          totalVolume: 0n,
          averageExecutionPrice: 0n,
          successRate: 0,
          topPairs: []
        };
      }

      try {
        const currentBlock = await publicClient.getBlockNumber();
        const blocksToSearch = 100000n; // More history for analytics
        const fromBlock = currentBlock > blocksToSearch ? currentBlock - blocksToSearch : 0n;

        // Fetch all DCA execution events
        const dcaLogs = await publicClient.getLogs({
          address: contracts.dca.address,
          event: parseAbiItem('event DCAExecuted(address indexed user, address indexed fromToken, address indexed toToken, uint256 amount, uint256 timestamp)'),
          fromBlock,
          toBlock: currentBlock,
          args: {
            user: address
          }
        });

        const totalExecutions = BigInt(dcaLogs.length);
        const totalVolume = dcaLogs.reduce((sum, log) => sum + (log.args.amount || 0n), 0n);
        const averageExecutionPrice = totalExecutions > 0n ? totalVolume / totalExecutions : 0n;

        // Calculate token pair statistics
        const pairMap = new Map<string, {
          fromToken: `0x${string}`;
          toToken: `0x${string}`;
          volume: bigint;
          executions: bigint;
        }>();

        for (const log of dcaLogs) {
          const from = log.args.fromToken || '0x0';
          const to = log.args.toToken || '0x0';
          const key = `${from}-${to}`;
          const existing = pairMap.get(key);

          if (existing) {
            existing.volume += log.args.amount || 0n;
            existing.executions += 1n;
          } else {
            pairMap.set(key, {
              fromToken: from as `0x${string}`,
              toToken: to as `0x${string}`,
              volume: log.args.amount || 0n,
              executions: 1n
            });
          }
        }

        const topPairs = Array.from(pairMap.values())
          .sort((a, b) => Number(b.volume - a.volume))
          .slice(0, 5);

        return {
          totalExecutions,
          totalVolume,
          averageExecutionPrice,
          successRate: 100, // Would need failed transaction tracking
          topPairs
        };
      } catch (error) {
        console.error('Error fetching DCA analytics:', error);
        return {
          totalExecutions: 0n,
          totalVolume: 0n,
          averageExecutionPrice: 0n,
          successRate: 0,
          topPairs: []
        };
      }
    },
    enabled: !!address && !!publicClient,
    refetchInterval: 60000, // Refetch every minute
    staleTime: 50000
  });

  // Calculate formatted metrics
  const metrics: DCAMetrics = {
    executionCount: Number(getAnalytics.data?.totalExecutions || 0n),
    totalVolumeFormatted: formatUnits(getAnalytics.data?.totalVolume || 0n, 18),
    averageAmount: formatUnits(getAnalytics.data?.averageExecutionPrice || 0n, 18),
    successRate: getAnalytics.data?.successRate || 0
  };

  return {
    analytics: getAnalytics.data,
    metrics,
    isLoading: getAnalytics.isLoading,
    error: getAnalytics.error,
    refetch: getAnalytics.refetch
  };
}
