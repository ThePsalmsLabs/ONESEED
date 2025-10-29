'use client';

import { useAccount, usePublicClient } from 'wagmi';
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
  // Remove block number watching to prevent refresh on every block
  // const { data: blockNumber } = useBlockNumber({ watch: true });

  const getActivityFeed = useQuery({
    queryKey: ['activityFeed', address],
    queryFn: async (): Promise<ActivityItem[]> => {
      if (!address || !publicClient) return [];

      try {
        const activities: ActivityItem[] = [];

        // Get current block for time estimates
        const currentBlock = await publicClient.getBlockNumber();
        const blocksToSearch = BigInt(10000); // Last ~10k blocks
        const fromBlock = currentBlock - blocksToSearch;

        // Fetch savings events (using correct event name: SavingsProcessed)
        try {
          const savingsLogs = await publicClient.getLogs({
            address: contracts.savings.address,
            event: parseAbiItem('event SavingsProcessed(address indexed user, address indexed token, uint256 amount, uint256 netAmount, uint256 fee)'),
            fromBlock,
            toBlock: currentBlock,
            args: {
              user: address
            }
          });

          for (const log of savingsLogs) {
            const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
            const netAmount = log.args.netAmount || log.args.amount || BigInt(0);
            activities.push({
              id: `${log.transactionHash}-${log.logIndex}`,
              type: 'save',
              token: log.args.token || '0x0',
              amount: netAmount.toString(),
              amountFormatted: formatUnits(netAmount, 18),
              timestamp: Number(block.timestamp),
              hash: log.transactionHash,
              status: 'success',
              description: 'Saved automatically from swap'
            });
          }
        } catch (error) {
          console.warn('Error fetching savings events:', error);
        }

        // Fetch withdrawal events (using correct event name: WithdrawalProcessed)
        try {
          const withdrawalLogs = await publicClient.getLogs({
            address: contracts.savings.address,
            event: parseAbiItem('event WithdrawalProcessed(address indexed user, address indexed token, uint256 amount, uint256 actualAmount, bool earlyWithdrawal)'),
            fromBlock,
            toBlock: currentBlock,
            args: {
              user: address
            }
          });

          for (const log of withdrawalLogs) {
            const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
            const actualAmount = log.args.actualAmount || log.args.amount || BigInt(0);
            const earlyWithdrawal = log.args.earlyWithdrawal || false;
            activities.push({
              id: `${log.transactionHash}-${log.logIndex}`,
              type: 'withdraw',
              token: log.args.token || '0x0',
              amount: actualAmount.toString(),
              amountFormatted: formatUnits(actualAmount, 18),
              timestamp: Number(block.timestamp),
              hash: log.transactionHash,
              status: 'success',
              description: earlyWithdrawal
                ? 'Withdrew savings (early withdrawal)'
                : 'Withdrew savings'
            });
          }
        } catch (error) {
          console.warn('Error fetching withdrawal events:', error);
        }

        // Fetch strategy update events (using correct event: SavingStrategySet)
        try {
          const strategyLogs = await publicClient.getLogs({
            address: contracts.savingStrategy.address,
            event: parseAbiItem('event SavingStrategySet(address indexed user, uint256 percentage, uint256 autoIncrement, uint256 maxPercentage, uint8 tokenType)'),
            fromBlock,
            toBlock: currentBlock,
            args: {
              user: address
            }
          });

          for (const log of strategyLogs) {
            const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
            const percentage = Number(log.args.percentage || BigInt(0)) / 100;
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

        // Fetch DCA execution events (using correct event signature)
        try {
          const dcaLogs = await publicClient.getLogs({
            address: contracts.dca.address,
            event: parseAbiItem('event DCAExecuted(address indexed user, address fromToken, address toToken, uint256 fromAmount, uint256 toAmount)'),
            fromBlock,
            toBlock: currentBlock,
            args: {
              user: address
            }
          });

          for (const log of dcaLogs) {
            const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
            const toAmount = log.args.toAmount || BigInt(0);
            activities.push({
              id: `${log.transactionHash}-${log.logIndex}`,
              type: 'dca',
              token: log.args.toToken || '0x0',
              amount: toAmount.toString(),
              amountFormatted: formatUnits(toAmount, 18),
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
    refetchInterval: 120000, // Refetch every 2 minutes (reduced from 30s)
    staleTime: 90000, // Consider data stale after 90 seconds (increased from 20s)
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
  });

  return {
    activities: getActivityFeed.data || [],
    isLoading: getActivityFeed.isLoading,
    error: getActivityFeed.error,
    refetch: getActivityFeed.refetch
  };
}
