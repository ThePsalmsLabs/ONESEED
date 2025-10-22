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
          totalExecutions: BigInt(0) ,
          totalVolume: BigInt(0),
          averageExecutionPrice: BigInt(0),
          successRate: 0,
          topPairs: []
        };
      }

      try {
        const currentBlock = await publicClient.getBlockNumber();
        const blocksToSearch = BigInt(100000); // More history for analytics
        const fromBlock = currentBlock > blocksToSearch ? currentBlock - blocksToSearch : BigInt(0);

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
        const totalVolume = dcaLogs.reduce((sum, log) => sum + (log.args.amount || BigInt(0)), BigInt(0));
        const averageExecutionPrice = totalExecutions > BigInt(0) ? totalVolume / totalExecutions : BigInt(0);

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
            existing.volume += log.args.amount || BigInt(0);
            existing.executions += BigInt(1);
          } else {
            pairMap.set(key, {
              fromToken: from as `0x${string}`,
              toToken: to as `0x${string}`,
              volume: log.args.amount || BigInt(0),
              executions: BigInt(1)
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
          totalExecutions: BigInt(0),
          totalVolume: BigInt(0),
          averageExecutionPrice: BigInt(0),
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
    executionCount: Number(getAnalytics.data?.totalExecutions || BigInt(0)),
    totalVolumeFormatted: formatUnits(getAnalytics.data?.totalVolume || BigInt(0), 18),
    averageAmount: formatUnits(getAnalytics.data?.averageExecutionPrice || BigInt(0), 18),
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
