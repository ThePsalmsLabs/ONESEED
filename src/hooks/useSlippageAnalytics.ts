'use client';

import { useAccount, usePublicClient, useBlockNumber } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { useSpendSaveContracts } from './useSpendSaveContracts';
import { parseAbiItem } from 'viem';

export interface SlippageEvent {
  timestamp: number;
  expectedAmount: bigint;
  actualAmount: bigint;
  token: `0x${string}`;
  slippagePercentage: number;
  hash: string;
}

export interface SlippageStatistics {
  totalEvents: number;
  averageSlippage: number;
  maxSlippage: number;
  minSlippage: number;
  exceededCount: number;
  withinToleranceCount: number;
}

export interface SlippageAlert {
  id: string;
  type: 'warning' | 'critical';
  message: string;
  timestamp: number;
  details: {
    expectedAmount: string;
    actualAmount: string;
    slippagePercentage: number;
  };
}

export function useSlippageAnalytics() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const contracts = useSpendSaveContracts();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const getSlippageEvents = useQuery({
    queryKey: ['slippageEvents', address, blockNumber],
    queryFn: async (): Promise<SlippageEvent[]> => {
      if (!address || !publicClient) return [];

      try {
        const currentBlock = await publicClient.getBlockNumber();
        const blocksToSearch = BigInt(50000);
        const fromBlock = currentBlock > blocksToSearch ? currentBlock - blocksToSearch : BigInt(0);

        const logs = await publicClient.getLogs({
          address: contracts.slippageControl.address,
          event: parseAbiItem('event SlippageExceeded(address indexed user, uint256 expectedAmount, uint256 actualAmount, address indexed token)'),
          fromBlock,
          toBlock: currentBlock,
          args: {
            user: address
          }
        });

        const events: SlippageEvent[] = [];

        for (const log of logs) {
          const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
          const expected = log.args.expectedAmount || BigInt(0);
          const actual = log.args.actualAmount || BigInt(0);
          const slippagePercentage = expected > BigInt(0)
            ? Number((expected - actual) * BigInt(10000) / expected) / 100
            : 0;

          events.push({
            timestamp: Number(block.timestamp),
            expectedAmount: expected,
            actualAmount: actual,
            token: (log.args.token || '0x0') as `0x${string}`,
            slippagePercentage,
            hash: log.transactionHash
          });
        }

        return events.sort((a, b) => b.timestamp - a.timestamp);
      } catch (error) {
        console.error('Error fetching slippage events:', error);
        return [];
      }
    },
    enabled: !!address && !!publicClient,
    refetchInterval: 30000,
    staleTime: 20000
  });

  // Calculate statistics
  const statistics: SlippageStatistics = {
    totalEvents: getSlippageEvents.data?.length || 0,
    averageSlippage: getSlippageEvents.data?.length
      ? getSlippageEvents.data.reduce((sum, evt) => sum + evt.slippagePercentage, 0) / getSlippageEvents.data.length
      : 0,
    maxSlippage: getSlippageEvents.data?.length
      ? Math.max(...getSlippageEvents.data.map(evt => evt.slippagePercentage))
      : 0,
    minSlippage: getSlippageEvents.data?.length
      ? Math.min(...getSlippageEvents.data.map(evt => evt.slippagePercentage))
      : 0,
    exceededCount: getSlippageEvents.data?.filter(evt => evt.slippagePercentage > 3).length || 0,
    withinToleranceCount: getSlippageEvents.data?.filter(evt => evt.slippagePercentage <= 3).length || 0
  };

  // Generate alerts from recent events
  const alerts: SlippageAlert[] = (getSlippageEvents.data || [])
    .filter(evt => evt.slippagePercentage > 1) // Only show > 1% slippage
    .slice(0, 10) // Last 10 alerts
    .map((evt, index) => ({
      id: `${evt.hash}-${index}`,
      type: evt.slippagePercentage > 5 ? 'critical' as const : 'warning' as const,
      message: evt.slippagePercentage > 5
        ? `Critical slippage: ${evt.slippagePercentage.toFixed(2)}% exceeded tolerance`
        : `High slippage detected: ${evt.slippagePercentage.toFixed(2)}%`,
      timestamp: evt.timestamp,
      details: {
        expectedAmount: evt.expectedAmount.toString(),
        actualAmount: evt.actualAmount.toString(),
        slippagePercentage: evt.slippagePercentage
      }
    }));

  return {
    events: getSlippageEvents.data || [],
    statistics,
    alerts,
    isLoading: getSlippageEvents.isLoading,
    error: getSlippageEvents.error,
    refetch: getSlippageEvents.refetch
  };
}
