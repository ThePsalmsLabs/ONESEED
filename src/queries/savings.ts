'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAccount, useBlockNumber } from 'wagmi';
import { useSavingsBalance } from '@/hooks/useSavingsBalance';

export function useSavingsQuery() {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  
  const { tokenBalances, totalBalance, isLoading } = useSavingsBalance();

  // Auto-refetch on new blocks
  useQuery({
    queryKey: ['savingsBalance', address, blockNumber],
    queryFn: async () => {
      if (address) {
        // TODO: Implement refetch functionality
        // await refetch();
      }
      return null;
    },
    enabled: !!address && !!blockNumber,
  });

  return {
    tokenBalances,
    totalBalance,
    isLoading
  };
}

export function useInvalidateSavings() {
  const queryClient = useQueryClient();
  const { address } = useAccount();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['savingsBalance', address] });
  };
}

