'use client';

import { useAccount, usePublicClient } from 'wagmi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useCallback } from 'react';
import { formatUnits } from 'viem';
import { getContractAddress } from '@/contracts/addresses';
import { SpendSaveStorageABI } from '@/contracts/abis/SpendSaveStorage';
import { SpendSaveHookABI } from '@/contracts/abis/SpendSaveHook';
import { useActiveChainId } from './useActiveChainId';
import { BASE_SEPOLIA_TOKENS } from '@/config/network';
import { useBiconomy } from '@/components/BiconomyProvider';

export interface RealtimeSavingsBalance {
  token: string;
  amount: bigint;
  formatted: string;
  symbol: string;
  decimals: number;
  lastUpdated: number;
}

export interface RealtimeSavingsData {
  balances: RealtimeSavingsBalance[];
  totalBalance: bigint;
  totalFormatted: string;
  isLoading: boolean;
  error?: string;
  lastUpdate: number;
}

export function useSavingsBalanceRealtime() {
  const { address: eoaAddress } = useAccount();
  const { smartAccountAddress } = useBiconomy();
  const chainId = useActiveChainId();
  const publicClient = usePublicClient();
  const queryClient = useQueryClient();

  // Use Smart Account address if available, fallback to EOA
  const address = smartAccountAddress || eoaAddress;

  // Get contract address
  const storageAddress = getContractAddress(chainId, 'SpendSaveStorage');

  // Tracked tokens for Base Sepolia
  const trackedTokens = [
    {
      address: BASE_SEPOLIA_TOKENS.USDC,
      symbol: 'USDC',
      decimals: 6
    },
    {
      address: BASE_SEPOLIA_TOKENS.WETH,
      symbol: 'WETH',
      decimals: 18
    }
  ];

  // Fetch individual token savings balance
  const fetchTokenSavings = useCallback(async (tokenAddress: string) => {
    if (!address || !publicClient || !storageAddress || storageAddress === '0x0000000000000000000000000000000000000000') {
      return null;
    }

    try {
      const balance = await publicClient.readContract({
        address: storageAddress as `0x${string}`,
        abi: SpendSaveStorageABI,
        functionName: 'savings',
        args: [address as `0x${string}`, tokenAddress as `0x${string}`]
      });

      console.log(`💰 Fetched savings for ${tokenAddress}:`, {
        eoaAddress,
        smartAccountAddress,
        addressUsed: address,
        token: tokenAddress,
        balance: balance.toString()
      });

      return balance as bigint;
    } catch (error) {
      console.error(`Error fetching savings for token ${tokenAddress}:`, error);
      return BigInt(0);
    }
  }, [address, publicClient, storageAddress]);

  // Fetch all savings balances with optimized caching
  const { data: savingsData, isLoading, error, refetch } = useQuery<RealtimeSavingsData>({
    queryKey: ['realtimeSavingsBalance', address, chainId],
    queryFn: async (): Promise<RealtimeSavingsData> => {
      if (!address || !publicClient || !storageAddress || storageAddress === '0x0000000000000000000000000000000000000000') {
        return {
          balances: [],
          totalBalance: BigInt(0),
          totalFormatted: '0',
          isLoading: false,
          lastUpdate: Date.now()
        };
      }

      try {
        const balancePromises = trackedTokens.map(async (token) => {
          const amount = await fetchTokenSavings(token.address);
          return {
            token: token.address,
            amount: amount || BigInt(0),
            formatted: amount ? formatUnits(amount, token.decimals) : '0',
            symbol: token.symbol,
            decimals: token.decimals,
            lastUpdated: Date.now()
          };
        });

        const balances = await Promise.all(balancePromises);
        const totalBalance = balances.reduce((sum, balance) => sum + balance.amount, BigInt(0));

        // Debug logging
        console.log('🔍 Savings data fetched:', {
          eoaAddress,
          smartAccountAddress,
          addressUsed: address,
          balances: balances.map(b => ({
            token: b.token,
            symbol: b.symbol,
            amount: b.amount.toString(),
            formatted: b.formatted
          })),
          totalBalance: totalBalance.toString()
        });

        return {
          balances: balances, // Show all balances, including zero ones
          totalBalance,
          totalFormatted: formatUnits(totalBalance, 18), // Use 18 decimals for total
          isLoading: false,
          lastUpdate: Date.now()
        };
      } catch (error) {
        console.error('Error fetching realtime savings:', error);
        return {
          balances: [],
          totalBalance: BigInt(0),
          totalFormatted: '0',
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          lastUpdate: Date.now()
        };
      }
    },
    enabled: !!address && !!publicClient && !!storageAddress && storageAddress !== '0x0000000000000000000000000000000000000000',
    refetchInterval: 5000, // Reduced to 5 seconds for faster updates
    refetchIntervalInBackground: false, // Only refetch when tab is active
    retry: 2,
    staleTime: 2000, // Consider data stale after 2 seconds
    gcTime: 10000, // Keep in cache for 10 seconds
  });

  // Subscribe to multiple events for real-time updates
  useEffect(() => {
    if (!address || !publicClient || !storageAddress || storageAddress === '0x0000000000000000000000000000000000000000') {
      return;
    }

    const handleSavingsUpdate = () => {
      console.log('🔄 Savings update detected, refreshing data...');
      // Invalidate and refetch savings data when event is detected
      queryClient.invalidateQueries({
        queryKey: ['realtimeSavingsBalance', address, chainId]
      });
    };

    // Set up multiple event listeners for different savings events
    const unwatchSavingsIncreased = publicClient.watchContractEvent({
      address: storageAddress as `0x${string}`,
      abi: SpendSaveStorageABI,
      eventName: 'SavingsIncreased',
      args: {
        user: address as `0x${string}`
      },
      onLogs: (logs) => {
        console.log('💰 SavingsIncreased event detected:', logs);
        handleSavingsUpdate();
      },
      onError: (error) => {
        console.error('Error watching SavingsIncreased events:', error);
      }
    });

    // Also listen for AfterSwapExecuted events from SpendSaveHook
    const spendSaveHookAddress = getContractAddress(chainId, 'SpendSaveHook');
    const unwatchAfterSwap = publicClient.watchContractEvent({
      address: spendSaveHookAddress as `0x${string}`,
      abi: SpendSaveHookABI,
      eventName: 'AfterSwapExecuted',
      args: {
        user: address as `0x${string}`
      },
      onLogs: (logs) => {
        console.log('🔄 AfterSwapExecuted event detected:', logs);
        handleSavingsUpdate();
      },
      onError: (error) => {
        console.error('Error watching AfterSwapExecuted events:', error);
      }
    });

    return () => {
      unwatchSavingsIncreased();
      unwatchAfterSwap();
    };
  }, [address, publicClient, storageAddress, chainId, queryClient]);

  // Manual refresh function
  const refreshSavings = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['realtimeSavingsBalance', address, chainId]
    });
  }, [queryClient, address, chainId]);

  return {
    ...savingsData,
    isLoading: isLoading || savingsData?.isLoading || false,
    error: error?.message || savingsData?.error,
    refreshSavings: refetch,
    trackedTokens
  };
}

// Hook for individual token savings balance
export function useTokenSavingsBalance(tokenAddress: string) {
  const { address: eoaAddress } = useAccount();
  const { smartAccountAddress } = useBiconomy();
  const chainId = useActiveChainId();
  const publicClient = usePublicClient();
  const storageAddress = getContractAddress(chainId, 'SpendSaveStorage');

  // Use Smart Account address if available, fallback to EOA
  const address = smartAccountAddress || eoaAddress;

  const { data: balance, isLoading, error } = useQuery({
    queryKey: ['tokenSavingsBalance', address, tokenAddress, chainId],
    queryFn: async () => {
      if (!address || !publicClient || !storageAddress || storageAddress === '0x0000000000000000000000000000000000000000') {
        return BigInt(0);
      }

      try {
        const balance = await publicClient.readContract({
          address: storageAddress as `0x${string}`,
          abi: SpendSaveStorageABI,
          functionName: 'savings',
          args: [address as `0x${string}`, tokenAddress as `0x${string}`]
        });

        return balance as bigint;
      } catch (error) {
        console.error(`Error fetching token savings balance:`, error);
        return BigInt(0);
      }
    },
    enabled: !!address && !!publicClient && !!storageAddress && storageAddress !== '0x0000000000000000000000000000000000000000',
    refetchInterval: 2000, // Refresh every 2 seconds for real-time updates
    retry: 2,
  });

  return {
    balance: balance || BigInt(0),
    isLoading,
    error: error?.message
  };
}
