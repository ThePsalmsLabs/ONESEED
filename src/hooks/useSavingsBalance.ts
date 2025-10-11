'use client';

import { useAccount, useReadContract } from 'wagmi';
import { useSpendSaveContracts } from './useSpendSaveContracts';
import type { TokenBalance } from '@/contracts/types';

export function useSavingsBalance() {
  const { address } = useAccount();
  const contracts = useSpendSaveContracts();

  // Get all user savings across tokens
  const { data: savingsData, isLoading, refetch } = useReadContract({
    ...contracts.savings,
    functionName: 'getUserSavings',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address
    }
  });

  // Parse savings data into TokenBalance array
  const tokenBalances: TokenBalance[] = savingsData ? 
    (savingsData[0] as `0x${string}`[]).map((token, index) => ({
      token,
      amount: (savingsData[1] as bigint[])[index],
    })) : [];

  // Get details for specific token
  const useSavingsDetails = (token?: `0x${string}`) => {
    return useReadContract({
      ...contracts.savings,
      functionName: 'getSavingsDetails',
      args: address && token ? [address, token] : undefined,
      query: {
        enabled: !!address && !!token
      }
    });
  };

  // Calculate total savings (would need token prices for USD value)
  const totalBalance = tokenBalances.reduce((sum, balance) => sum + balance.amount, BigInt(0));

  return {
    tokenBalances,
    totalBalance,
    isLoading,
    refetch,
    useSavingsDetails
  };
}

