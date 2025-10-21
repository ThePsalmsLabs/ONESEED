'use client';

import { useAccount, useReadContract, useChainId } from 'wagmi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parseEther, formatEther } from 'viem';
import { CONTRACT_ADDRESSES } from '@/contracts/addresses';
import { DailySavingsABI } from '@/contracts/abis/DailySavings';
import { 
  DailySavingsConfig, 
  DailySavingsStatus, 
  DailyExecutionStatus,
  YieldStrategy
} from '@/contracts/types';
import { useSmartContractWrite } from './useSmartContractWrite';

export function useDailySavings() {
  const { address } = useAccount();
  const chainId = useChainId();
  const queryClient = useQueryClient();

  // Get contract address for current chain
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.DailySavings;

  // Biconomy write hook for gasless transactions
  const { write: writeContract, isPending: isWritePending, hash } = useSmartContractWrite();

  // Check if user has pending daily savings
  const { data: hasPending, isLoading: isLoadingPending, refetch: refetchPending } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: DailySavingsABI,
    functionName: 'hasPendingDailySavings',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress
    }
  });

  // Get daily savings status for a specific token
  const useDailySavingsStatus = (token: `0x${string}`) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: DailySavingsABI,
      functionName: 'getDailySavingsStatus',
      args: address && token ? [address, token] : undefined,
      query: {
        enabled: !!address && !!token && !!contractAddress
      }
    }) as {
      data: [boolean, bigint, bigint, bigint, bigint, bigint, bigint] | undefined;
      isLoading: boolean;
      error: Error | null;
      refetch: () => void;
    };
  };

  // Get daily execution status for a specific token
  const useDailyExecutionStatus = (token: `0x${string}`) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: DailySavingsABI,
      functionName: 'getDailyExecutionStatus',
      args: address && token ? [address, token] : undefined,
      query: {
        enabled: !!address && !!token && !!contractAddress
      }
    }) as {
      data: [boolean, bigint, bigint] | undefined;
      isLoading: boolean;
      error: Error | null;
      refetch: () => void;
    };
  };

  // Configure daily savings
  const configureDailySavings = useMutation({
    mutationFn: async (params: {
      token: `0x${string}`;
      dailyAmount: string;
      goalAmount: string;
      penaltyBps: number;
      endTime: number;
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      if (!contractAddress) throw new Error('Contract not deployed on this network');
      
      const dailyAmountWei = parseEther(params.dailyAmount);
      const goalAmountWei = parseEther(params.goalAmount);
      const penaltyBpsWei = BigInt(params.penaltyBps);
      const endTimeWei = BigInt(params.endTime);
      
      return await writeContract({
        address: contractAddress as `0x${string}`,
        abi: DailySavingsABI,
        functionName: 'configureDailySavings',
        args: [
          address,
          params.token,
          dailyAmountWei,
          goalAmountWei,
          penaltyBpsWei,
          endTimeWei
        ]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailySavingsStatus'] });
      queryClient.invalidateQueries({ queryKey: ['dailyExecutionStatus'] });
    }
  });

  // Disable daily savings
  const disableDailySavings = useMutation({
    mutationFn: async (params: {
      token: `0x${string}`;
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      if (!contractAddress) throw new Error('Contract not deployed on this network');
      
      return await writeContract({
        address: contractAddress as `0x${string}`,
        abi: DailySavingsABI,
        functionName: 'disableDailySavings',
        args: [address, params.token]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailySavingsStatus'] });
      queryClient.invalidateQueries({ queryKey: ['dailyExecutionStatus'] });
    }
  });

  // Execute daily savings
  const executeDailySavings = useMutation({
    mutationFn: async (): Promise<{ hash: `0x${string}`; amount: bigint }> => {
      if (!address) throw new Error('No wallet connected');
      if (!contractAddress) throw new Error('Contract not deployed on this network');
      
      const hash = await writeContract({
        address: contractAddress as `0x${string}`,
        abi: DailySavingsABI,
        functionName: 'executeDailySavings',
        args: [address]
      });

      // Note: The contract returns uint256 amount
      // We'll need to parse this from the transaction receipt
      return { hash, amount: BigInt(0) };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailySavingsStatus'] });
      queryClient.invalidateQueries({ queryKey: ['dailyExecutionStatus'] });
      queryClient.invalidateQueries({ queryKey: ['hasPendingDailySavings'] });
    }
  });

  // Execute daily savings for specific token
  const executeDailySavingsForToken = useMutation({
    mutationFn: async (params: {
      token: `0x${string}`;
    }): Promise<{ hash: `0x${string}`; amount: bigint }> => {
      if (!address) throw new Error('No wallet connected');
      if (!contractAddress) throw new Error('Contract not deployed on this network');
      
      const hash = await writeContract({
        address: contractAddress as `0x${string}`,
        abi: DailySavingsABI,
        functionName: 'executeDailySavingsForToken',
        args: [address, params.token]
      });

      return { hash, amount: BigInt(0) };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailySavingsStatus'] });
      queryClient.invalidateQueries({ queryKey: ['dailyExecutionStatus'] });
      queryClient.invalidateQueries({ queryKey: ['hasPendingDailySavings'] });
    }
  });

  // Withdraw daily savings
  const withdrawDailySavings = useMutation({
    mutationFn: async (params: {
      token: `0x${string}`;
      amount: string;
    }): Promise<{ hash: `0x${string}`; actualAmount: bigint }> => {
      if (!address) throw new Error('No wallet connected');
      if (!contractAddress) throw new Error('Contract not deployed on this network');
      
      const amountWei = parseEther(params.amount);
      
      const hash = await writeContract({
        address: contractAddress as `0x${string}`,
        abi: DailySavingsABI,
        functionName: 'withdrawDailySavings',
        args: [address, params.token, amountWei]
      });

      return { hash, actualAmount: BigInt(0) };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailySavingsStatus'] });
      queryClient.invalidateQueries({ queryKey: ['dailyExecutionStatus'] });
    }
  });

  // Set yield strategy
  const setYieldStrategy = useMutation({
    mutationFn: async (params: {
      token: `0x${string}`;
      strategy: YieldStrategy;
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      if (!contractAddress) throw new Error('Contract not deployed on this network');
      
      return await writeContract({
        address: contractAddress as `0x${string}`,
        abi: DailySavingsABI,
        functionName: 'setDailySavingsYieldStrategy',
        args: [address, params.token, params.strategy]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailySavingsStatus'] });
    }
  });

  // Execute token savings
  const executeTokenSavings = useMutation({
    mutationFn: async (params: {
      token: `0x${string}`;
    }): Promise<{ hash: `0x${string}`; amount: bigint }> => {
      if (!address) throw new Error('No wallet connected');
      if (!contractAddress) throw new Error('Contract not deployed on this network');
      
      const hash = await writeContract({
        address: contractAddress as `0x${string}`,
        abi: DailySavingsABI,
        functionName: 'executeTokenSavings',
        args: [address, params.token]
      });

      return { hash, amount: BigInt(0) };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailySavingsStatus'] });
      queryClient.invalidateQueries({ queryKey: ['dailyExecutionStatus'] });
    }
  });

  // Utility functions
  const formatAmount = (amount: bigint, decimals: number = 18) => {
    const formatted = formatEther(amount);
    return parseFloat(formatted).toFixed(4);
  };

  const calculateProgress = (current: bigint, goal: bigint) => {
    if (goal === BigInt(0)) return 0;
    return Math.min(100, (Number(current) / Number(goal)) * 100);
  };

  const calculateDaysRemaining = (endTime: bigint) => {
    const now = BigInt(Math.floor(Date.now() / 1000));
    const remaining = Number(endTime - now);
    return Math.max(0, Math.ceil(remaining / (24 * 60 * 60)));
  };

  const calculatePenaltyAmount = (amount: bigint, penaltyBps: bigint) => {
    return (amount * penaltyBps) / BigInt(10000);
  };

  return {
    // Contract data
    hasPending,
    contractAddress,

    // Loading states
    isLoadingPending,
    isWritePending,

    // Hooks for specific tokens
    useDailySavingsStatus,
    useDailyExecutionStatus,

    // Mutations (gasless)
    configureDailySavings: configureDailySavings.mutateAsync,
    disableDailySavings: disableDailySavings.mutateAsync,
    executeDailySavings: executeDailySavings.mutateAsync,
    executeDailySavingsForToken: executeDailySavingsForToken.mutateAsync,
    withdrawDailySavings: withdrawDailySavings.mutateAsync,
    setYieldStrategy: setYieldStrategy.mutateAsync,
    executeTokenSavings: executeTokenSavings.mutateAsync,

    // Mutation states
    isConfiguring: configureDailySavings.isPending,
    isDisabling: disableDailySavings.isPending,
    isExecuting: executeDailySavings.isPending,
    isExecutingForToken: executeDailySavingsForToken.isPending,
    isWithdrawing: withdrawDailySavings.isPending,
    isSettingYield: setYieldStrategy.isPending,
    isExecutingToken: executeTokenSavings.isPending,

    // Utility functions
    formatAmount,
    calculateProgress,
    calculateDaysRemaining,
    calculatePenaltyAmount,

    // Refetch functions
    refetchPending,

    // Transaction hash
    hash,

    // Error states
    configureError: configureDailySavings.error,
    disableError: disableDailySavings.error,
    executeError: executeDailySavings.error,
    executeForTokenError: executeDailySavingsForToken.error,
    withdrawError: withdrawDailySavings.error,
    setYieldError: setYieldStrategy.error,
    executeTokenError: executeTokenSavings.error
  };
}