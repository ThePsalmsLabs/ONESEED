'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAccount, useBlockNumber } from 'wagmi';
import { useSavingsStrategy } from '@/hooks/useSavingsStrategy';

export function useStrategyQuery() {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  
  const { strategy, hasStrategy, isLoading, refetch } = useSavingsStrategy();

  // Auto-refetch on new blocks
  useQuery({
    queryKey: ['savingsStrategy', address, blockNumber],
    queryFn: async () => {
      if (address) {
        await refetch();
      }
      return null;
    },
    enabled: !!address && !!blockNumber,
  });

  return {
    strategy,
    hasStrategy,
    isLoading
  };
}

export function useInvalidateStrategy() {
  const queryClient = useQueryClient();
  const { address } = useAccount();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['savingsStrategy', address] });
  };
}

