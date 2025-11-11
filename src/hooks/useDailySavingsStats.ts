'use client';

import { useAccount, usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { getContractAddress } from '@/contracts/addresses';
import { DailySavingsABI } from '@/contracts/abis/DailySavings';
import { SpendSaveStorageABI } from '@/contracts/abis/SpendSaveStorage';
import { useActiveChainId } from './useActiveChainId';
import { useBiconomy } from '@/components/BiconomyProvider';
import { BASE_SEPOLIA_TOKENS } from '@/config/network';

export interface DailySavingsStats {
  totalSaved: number;
  activeGoals: number;
  pendingExecutions: number;
  totalGoalAmount: number;
  averageProgress: number;
  totalPenalties: number;
  thisMonth: number;
  thisMonthChange: {
    value: string;
    positive: boolean;
  };
  isLoading: boolean;
  error: Error | null;
}

export function useDailySavingsStats(): DailySavingsStats {
  const { address: eoaAddress } = useAccount();
  const { smartAccountAddress } = useBiconomy();
  const chainId = useActiveChainId();
  const publicClient = usePublicClient();

  // Use Smart Account address if available, fallback to EOA
  const address = smartAccountAddress || eoaAddress;

  // Get contract addresses
  const dailySavingsAddress = getContractAddress(chainId, 'DailySavings');
  const storageAddress = getContractAddress(chainId, 'SpendSaveStorage');

  // Tracked tokens
  const trackedTokens = [
    { address: BASE_SEPOLIA_TOKENS.USDC, decimals: 6 },
    { address: BASE_SEPOLIA_TOKENS.WETH, decimals: 18 },
  ];

  const { data, isLoading, error } = useQuery({
    queryKey: ['dailySavingsStats', address, chainId],
    queryFn: async (): Promise<DailySavingsStats> => {
      if (!address || !publicClient || !dailySavingsAddress || !storageAddress) {
        return {
          totalSaved: 0,
          activeGoals: 0,
          pendingExecutions: 0,
          totalGoalAmount: 0,
          averageProgress: 0,
          totalPenalties: 0,
          thisMonth: 0,
          thisMonthChange: { value: '0', positive: false },
          isLoading: false,
          error: null,
        };
      }

      try {
        let totalSaved = 0;
        let activeGoals = 0;
        let pendingExecutions = 0;
        let totalGoalAmount = 0;
        let totalProgress = 0;
        let totalPenalties = 0;
        let thisMonthSaved = 0;
        const lastMonthSaved = 0;

        // Fetch stats for each token
        const statsPromises = trackedTokens.map(async (token) => {
          try {
            // Get daily savings status
            const status = await publicClient.readContract({
              address: dailySavingsAddress as `0x${string}`,
              abi: DailySavingsABI,
              functionName: 'getDailySavingsStatus',
              args: [address as `0x${string}`, token.address as `0x${string}`],
            }).catch(() => null);

            if (!status) return null;

            const [
              enabled,
              dailyAmount,
              goalAmount,
              currentAmount,
              remainingAmount,
              penaltyAmount,
              estimatedCompletionDate,
            ] = status as [
              boolean,
              bigint,
              bigint,
              bigint,
              bigint,
              bigint,
              bigint,
            ];

            if (!enabled) return null;

            // Get execution status
            const executionStatus = await publicClient.readContract({
              address: dailySavingsAddress as `0x${string}`,
              abi: DailySavingsABI,
              functionName: 'getDailyExecutionStatus',
              args: [address as `0x${string}`, token.address as `0x${string}`],
            }).catch(() => null);

            const canExecute = executionStatus ? (executionStatus as [boolean, bigint, bigint])[0] : false;

            // Calculate values
            const currentAmountNum = parseFloat(formatUnits(currentAmount, token.decimals));
            const goalAmountNum = parseFloat(formatUnits(goalAmount, token.decimals));
            const penaltyAmountNum = parseFloat(formatUnits(penaltyAmount, token.decimals));
            const progress = goalAmount > BigInt(0) 
              ? Math.min(100, (currentAmountNum / goalAmountNum) * 100)
              : 0;

            return {
              enabled,
              currentAmount: currentAmountNum,
              goalAmount: goalAmountNum,
              progress,
              penaltyAmount: penaltyAmountNum,
              canExecute,
            };
          } catch (error) {
            console.warn(`Failed to fetch stats for token ${token.address}:`, error);
            return null;
          }
        });

        const statsResults = await Promise.all(statsPromises);

        // Aggregate stats
        for (const stats of statsResults) {
          if (!stats) continue;

          if (stats.enabled) {
            activeGoals++;
            totalSaved += stats.currentAmount;
            totalGoalAmount += stats.goalAmount;
            totalProgress += stats.progress;
            totalPenalties += stats.penaltyAmount;
            if (stats.canExecute) {
              pendingExecutions++;
            }
            thisMonthSaved += stats.currentAmount; // Simplified - would need timestamp filtering
          }
        }

        const averageProgress = activeGoals > 0 ? totalProgress / activeGoals : 0;
        
        // Calculate month-over-month change (simplified)
        const monthChange = thisMonthSaved - lastMonthSaved;
        const monthChangePercent = lastMonthSaved > 0 
          ? ((monthChange / lastMonthSaved) * 100).toFixed(1)
          : '0';

        return {
          totalSaved,
          activeGoals,
          pendingExecutions,
          totalGoalAmount,
          averageProgress,
          totalPenalties,
          thisMonth: thisMonthSaved,
          thisMonthChange: {
            value: `${monthChangePercent}%`,
            positive: monthChange >= 0,
          },
          isLoading: false,
          error: null,
        };
      } catch (error) {
        console.error('Error fetching daily savings stats:', error);
        return {
          totalSaved: 0,
          activeGoals: 0,
          pendingExecutions: 0,
          totalGoalAmount: 0,
          averageProgress: 0,
          totalPenalties: 0,
          thisMonth: 0,
          thisMonthChange: { value: '0', positive: false },
          isLoading: false,
          error: error instanceof Error ? error : new Error('Unknown error'),
        };
      }
    },
    enabled: !!address && !!publicClient && !!dailySavingsAddress && !!storageAddress,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });

  return {
    totalSaved: data?.totalSaved ?? 0,
    activeGoals: data?.activeGoals ?? 0,
    pendingExecutions: data?.pendingExecutions ?? 0,
    totalGoalAmount: data?.totalGoalAmount ?? 0,
    averageProgress: data?.averageProgress ?? 0,
    totalPenalties: data?.totalPenalties ?? 0,
    thisMonth: data?.thisMonth ?? 0,
    thisMonthChange: data?.thisMonthChange ?? { value: '0', positive: false },
    isLoading: isLoading || !data,
    error: error instanceof Error ? error : (data?.error ?? null),
  };
}

