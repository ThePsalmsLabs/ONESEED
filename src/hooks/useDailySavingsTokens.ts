'use client';

import { useAccount, usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { getContractAddress } from '@/contracts/addresses';
import { DailySavingsABI } from '@/contracts/abis/DailySavings';
import { useActiveChainId } from './useActiveChainId';
import { useBiconomy } from '@/components/BiconomyProvider';
import { BASE_SEPOLIA_TOKENS } from '@/config/network';

export interface DailySavingsToken {
  token: `0x${string}`;
  symbol: string;
  name: string;
  icon: string;
  enabled: boolean;
  dailyAmount: bigint;
  goalAmount: bigint;
  currentAmount: bigint;
  remainingAmount: bigint;
  penaltyAmount: bigint;
  estimatedCompletionDate: bigint;
  canExecute: boolean;
  daysPassed: bigint;
  amountToSave: bigint;
  progress: number;
  daysRemaining: number;
  isLoading: boolean;
}

export function useDailySavingsTokens() {
  const { address: eoaAddress } = useAccount();
  const { smartAccountAddress } = useBiconomy();
  const chainId = useActiveChainId();
  const publicClient = usePublicClient();

  // Use Smart Account address if available, fallback to EOA
  const address = smartAccountAddress || eoaAddress;

  // Get contract address
  const contractAddress = getContractAddress(chainId, 'DailySavings');

  // Tracked tokens with metadata
  const trackedTokens = [
    { 
      address: BASE_SEPOLIA_TOKENS.USDC as `0x${string}`, 
      symbol: 'USDC',
      name: 'USD Coin',
      icon: '💰',
      decimals: 6
    },
    { 
      address: BASE_SEPOLIA_TOKENS.WETH as `0x${string}`, 
      symbol: 'WETH',
      name: 'Wrapped Ethereum',
      icon: '🔷',
      decimals: 18
    },
  ];

  const { data: tokens, isLoading, error, refetch } = useQuery({
    queryKey: ['dailySavingsTokens', address, chainId],
    queryFn: async (): Promise<DailySavingsToken[]> => {
      if (!address || !publicClient || !contractAddress) {
        return [];
      }

      try {
        const tokenPromises = trackedTokens.map(async (token) => {
          try {
            // Get daily savings status
            const status = await publicClient.readContract({
              address: contractAddress as `0x${string}`,
              abi: DailySavingsABI,
              functionName: 'getDailySavingsStatus',
              args: [address as `0x${string}`, token.address],
            }).catch(() => null);

            if (!status) {
              return {
                ...token,
                enabled: false,
                dailyAmount: BigInt(0),
                goalAmount: BigInt(0),
                currentAmount: BigInt(0),
                remainingAmount: BigInt(0),
                penaltyAmount: BigInt(0),
                estimatedCompletionDate: BigInt(0),
                canExecute: false,
                daysPassed: BigInt(0),
                amountToSave: BigInt(0),
                progress: 0,
                daysRemaining: 0,
                isLoading: false,
              };
            }

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

            // Get execution status
            const executionStatus = await publicClient.readContract({
              address: contractAddress as `0x${string}`,
              abi: DailySavingsABI,
              functionName: 'getDailyExecutionStatus',
              args: [address as `0x${string}`, token.address],
            }).catch(() => null);

            const canExecute = executionStatus ? (executionStatus as [boolean, bigint, bigint])[0] : false;
            const daysPassedFromStatus = executionStatus ? (executionStatus as [boolean, bigint, bigint])[1] : BigInt(0);
            const amountToSave = executionStatus ? (executionStatus as [boolean, bigint, bigint])[2] : BigInt(0);

            // Calculate progress
            const currentAmountNum = parseFloat(formatUnits(currentAmount, token.decimals));
            const goalAmountNum = parseFloat(formatUnits(goalAmount, token.decimals));
            const progress = goalAmount > BigInt(0) 
              ? Math.min(100, (currentAmountNum / goalAmountNum) * 100)
              : 0;

            // Calculate days remaining
            const now = BigInt(Math.floor(Date.now() / 1000));
            const daysRemaining = estimatedCompletionDate > now
              ? Math.ceil(Number(estimatedCompletionDate - now) / (24 * 60 * 60))
              : 0;

            // Use daysPassed from execution status
            const daysPassed = daysPassedFromStatus;

            return {
              token: token.address,
              symbol: token.symbol,
              name: token.name,
              icon: token.icon,
              enabled,
              dailyAmount,
              goalAmount,
              currentAmount,
              remainingAmount,
              penaltyAmount,
              estimatedCompletionDate,
              canExecute,
              daysPassed,
              amountToSave,
              progress,
              daysRemaining,
              isLoading: false,
            };
          } catch (error) {
            console.warn(`Error fetching token ${token.address}:`, error);
            return {
              token: token.address,
              symbol: token.symbol,
              name: token.name,
              icon: token.icon,
              enabled: false,
              dailyAmount: BigInt(0),
              goalAmount: BigInt(0),
              currentAmount: BigInt(0),
              remainingAmount: BigInt(0),
              penaltyAmount: BigInt(0),
              estimatedCompletionDate: BigInt(0),
              canExecute: false,
              daysPassed: BigInt(0),
              amountToSave: BigInt(0),
              progress: 0,
              daysRemaining: 0,
              isLoading: false,
            };
          }
        });

        const results = await Promise.all(tokenPromises);
        return results;
      } catch (error) {
        console.error('Error fetching daily savings tokens:', error);
        return [];
      }
    },
    enabled: !!address && !!publicClient && !!contractAddress,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });

  return {
    tokens: tokens ?? [],
    isLoading,
    error: error instanceof Error ? error : null,
    refetch,
  };
}

