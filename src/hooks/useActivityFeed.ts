'use client';

import { useAccount, usePublicClient, useBlockNumber } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { useSpendSaveContracts } from './useSpendSaveContracts';
import { formatUnits, parseAbiItem } from 'viem';

export interface ActivityItem {
  id: string;
  type: 'save' | 'withdraw' | 'dca' | 'strategy' | 'daily_save';
  token: string;
  amount: string;
  amountFormatted: string;
  timestamp: number;
  hash: string;
  status: 'success' | 'pending' | 'failed';
  description: string;
}

export function useActivityFeed() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const contracts = useSpendSaveContracts();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const getActivityFeed = useQuery({
    queryKey: ['activityFeed', address, blockNumber],
    queryFn: async (): Promise<ActivityItem[]> => {
      if (!address || !publicClient) return [];

      try {
        const activities: ActivityItem[] = [];

        // Get current block for time estimates
        const currentBlock = await publicClient.getBlockNumber();
        const blocksToSearch = 10000n; // Last ~10k blocks
        const fromBlock = currentBlock - blocksToSearch;

        // Fetch savings events
        try {
          const savingsLogs = await publicClient.getLogs({
            address: contracts.savings.address,
            event: parseAbiItem('event SavingsDeposited(address indexed user, address indexed token, uint256 amount)'),
            fromBlock,
            toBlock: currentBlock,
            args: {
              user: address
            }
          });

          for (const log of savingsLogs) {
            const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
            activities.push({
              id: `${log.transactionHash}-${log.logIndex}`,
              type: 'save',
              token: log.args.token || '0x0',
              amount: log.args.amount?.toString() || '0',
              amountFormatted: formatUnits(log.args.amount || 0n, 18),
              timestamp: Number(block.timestamp),
              hash: log.transactionHash,
              status: 'success',
              description: 'Saved automatically from swap'
            });
          }
        } catch (error) {
          console.warn('Error fetching savings events:', error);
        }

        // Fetch withdrawal events
        try {
          const withdrawalLogs = await publicClient.getLogs({
            address: contracts.savings.address,
            event: parseAbiItem('event SavingsWithdrawn(address indexed user, address indexed token, uint256 amount, uint256 penalty)'),
            fromBlock,
            toBlock: currentBlock,
            args: {
              user: address
            }
          });

          for (const log of withdrawalLogs) {
            const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
            const penalty = log.args.penalty || 0n;
            activities.push({
              id: `${log.transactionHash}-${log.logIndex}`,
              type: 'withdraw',
              token: log.args.token || '0x0',
              amount: log.args.amount?.toString() || '0',
              amountFormatted: formatUnits(log.args.amount || 0n, 18),
              timestamp: Number(block.timestamp),
              hash: log.transactionHash,
              status: 'success',
              description: penalty > 0n
                ? `Withdrew with ${formatUnits(penalty, 18)} penalty`
                : 'Withdrew savings'
            });
          }
        } catch (error) {
          console.warn('Error fetching withdrawal events:', error);
        }

        // Fetch strategy update events
        try {
          const strategyLogs = await publicClient.getLogs({
            address: contracts.savingStrategy.address,
            event: parseAbiItem('event StrategyUpdated(address indexed user, uint256 percentage, uint256 autoIncrement, uint256 maxPercentage)'),
            fromBlock,
            toBlock: currentBlock,
            args: {
              user: address
            }
          });

          for (const log of strategyLogs) {
            const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
            const percentage = Number(log.args.percentage || 0n) / 100;
            activities.push({
              id: `${log.transactionHash}-${log.logIndex}`,
              type: 'strategy',
              token: '0x0',
              amount: '0',
              amountFormatted: '0',
              timestamp: Number(block.timestamp),
              hash: log.transactionHash,
              status: 'success',
              description: `Updated savings strategy to ${percentage}%`
            });
          }
        } catch (error) {
          console.warn('Error fetching strategy events:', error);
        }

        // Fetch DCA execution events
        try {
          const dcaLogs = await publicClient.getLogs({
            address: contracts.dca.address,
            event: parseAbiItem('event DCAExecuted(address indexed user, address indexed fromToken, address indexed toToken, uint256 amount, uint256 timestamp)'),
            fromBlock,
            toBlock: currentBlock,
            args: {
              user: address
            }
          });

          for (const log of dcaLogs) {
            const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
            activities.push({
              id: `${log.transactionHash}-${log.logIndex}`,
              type: 'dca',
              token: log.args.toToken || '0x0',
              amount: log.args.amount?.toString() || '0',
              amountFormatted: formatUnits(log.args.amount || 0n, 18),
              timestamp: Number(block.timestamp),
              hash: log.transactionHash,
              status: 'success',
              description: 'DCA executed'
            });
          }
        } catch (error) {
          console.warn('Error fetching DCA events:', error);
        }

        // Sort by timestamp descending
        return activities.sort((a, b) => b.timestamp - a.timestamp);
      } catch (error) {
        console.error('Error fetching activity feed:', error);
        return [];
      }
    },
    enabled: !!address && !!publicClient,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 20000 // Consider data stale after 20 seconds
  });

  return {
    activities: getActivityFeed.data || [],
    isLoading: getActivityFeed.isLoading,
    error: getActivityFeed.error,
    refetch: getActivityFeed.refetch
  };
}
