'use client';

import { useAccount, useReadContract } from 'wagmi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parseEther, formatEther } from 'viem';
import { getContractAddress } from '@/contracts/addresses';
import { DCAABI } from '@/contracts/abis/DCA';
import {
  DCAConfig,
  DCAExecution,
  PendingDCA,
  TransactionResult
} from '@/contracts/types';
import { useSmartContractWrite } from './useSmartContractWrite';
import { useActiveChainId } from './useActiveChainId';

export function useDCA() {
  const { address } = useAccount();
  const chainId = useActiveChainId();
  const queryClient = useQueryClient();

  // Get contract address for current chain
  const contractAddress = getContractAddress(chainId, 'DCA');

  // Get DCA configuration from contract
  const { data: config, isLoading: isLoadingConfig, refetch: refetchConfig } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: DCAABI,
    functionName: 'getDCAConfig',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress
    }
  });

  // Get pending DCA from contract
  const { data: pending, isLoading: isLoadingPending, refetch: refetchPending } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: DCAABI,
    functionName: 'getPendingDCA',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress
    }
  });

  // Get DCA history from contract
  const { data: history, isLoading: isLoadingHistory, refetch: refetchHistory } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: DCAABI,
    functionName: 'getDCAHistory',
    args: address ? [address, BigInt(50)] : undefined, // Limit to 50 recent executions
    query: {
      enabled: !!address && !!contractAddress
    }
  });

  // Biconomy write hook for gasless transactions
  const { write: writeContract, isPending: isWritePending, hash } = useSmartContractWrite();

  // Enable DCA (gasless)
  const enableDCA = useMutation({
    mutationFn: async (params: {
      targetToken: `0x${string}`;
      minAmount: string;
      maxSlippage: number;
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      if (!contractAddress) throw new Error('Contract not deployed on this network');
      
      const minAmountWei = parseEther(params.minAmount);
      const maxSlippageWei = BigInt(params.maxSlippage);
      
      return await writeContract({
        address: contractAddress as `0x${string}`,
        abi: DCAABI,
        functionName: 'enableDCA',
        args: [
          address,
          params.targetToken,
          minAmountWei,
          maxSlippageWei
        ]
      });
    },
    onSuccess: () => {
      refetchConfig();
    }
  });

  // Set DCA tick strategy (gasless)
  const setDCATickStrategy = useMutation({
    mutationFn: async (params: {
      lowerTick: number;
      upperTick: number;
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      if (!contractAddress) throw new Error('Contract not deployed on this network');
      
      return await writeContract({
        address: contractAddress as `0x${string}`,
        abi: DCAABI,
        functionName: 'setDCATickStrategy',
        args: [
          address,
          params.lowerTick,
          params.upperTick
        ]
      });
    },
    onSuccess: () => {
      refetchConfig();
    }
  });

  // Queue DCA execution (gasless)
  const queueDCAExecution = useMutation({
    mutationFn: async (params: {
      fromToken: `0x${string}`;
      toToken: `0x${string}`;
      amount: string;
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      if (!contractAddress) throw new Error('Contract not deployed on this network');
      
      const amountWei = parseEther(params.amount);
      
      return await writeContract({
        address: contractAddress as `0x${string}`,
        abi: DCAABI,
        functionName: 'queueDCAExecution',
        args: [
          address,
          params.fromToken,
          params.toToken,
          amountWei
        ]
      });
    },
    onSuccess: () => {
      refetchPending();
    }
  });

  // Execute DCA (gasless)
  const executeDCA = useMutation({
    mutationFn: async (): Promise<{ hash: `0x${string}`; executed: boolean; totalAmount: bigint }> => {
      if (!address) throw new Error('No wallet connected');
      if (!contractAddress) throw new Error('Contract not deployed on this network');
      
      const hash = await writeContract({
        address: contractAddress as `0x${string}`,
        abi: DCAABI,
        functionName: 'executeDCA',
        args: [address]
      });

      // Note: The contract returns (bool executed, uint256 totalAmount)
      // We'll need to parse this from the transaction receipt
      return { hash, executed: true, totalAmount: BigInt(0) };
    },
    onSuccess: () => {
      refetchPending();
      refetchHistory();
    }
  });

  // Disable DCA (gasless)
  const disableDCA = useMutation({
    mutationFn: async (): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      if (!contractAddress) throw new Error('Contract not deployed on this network');
      
      return await writeContract({
        address: contractAddress as `0x${string}`,
        abi: DCAABI,
        functionName: 'disableDCA',
        args: [address]
      });
    },
    onSuccess: () => {
      refetchConfig();
    }
  });

  // Calculate optimal DCA amount from contract
  const useCalculateOptimalDCAAmount = (params: {
    fromToken: `0x${string}`;
    toToken: `0x${string}`;
    availableAmount: string;
  }) => {
    const availableAmountWei = parseEther(params.availableAmount);
    
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: DCAABI,
      functionName: 'calculateOptimalDCAAmount',
      args: address && params.fromToken && params.toToken ? [
        address,
        params.fromToken,
        params.toToken,
        availableAmountWei
      ] : undefined,
      query: {
        enabled: !!address && !!params.fromToken && !!params.toToken && !!contractAddress
      }
    });
  };

  // Check if DCA should execute (requires pool key)
  const useShouldExecuteDCA = (poolKey?: {
    currency0: `0x${string}`;
    currency1: `0x${string}`;
    fee: number;
    tickSpacing: number;
    hooks: `0x${string}`;
  }) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: DCAABI,
      functionName: 'shouldExecuteDCA',
      args: address && poolKey ? [address, poolKey] : undefined,
      query: {
        enabled: !!address && !!poolKey && !!contractAddress
      }
    });
  };

  return {
    // Contract data
    config: config as DCAConfig | undefined,
    pending: pending as PendingDCA | undefined,
    history: history as DCAExecution[] | undefined,
    contractAddress,

    // Loading states
    isLoadingConfig,
    isLoadingPending,
    isLoadingHistory,
    isWritePending,

    // Mutations (gasless)
    enableDCA: enableDCA.mutateAsync,
    setDCATickStrategy: setDCATickStrategy.mutateAsync,
    queueDCAExecution: queueDCAExecution.mutateAsync,
    executeDCA: executeDCA.mutateAsync,
    disableDCA: disableDCA.mutateAsync,

    // Mutation states
    isEnabling: enableDCA.isPending,
    isSettingStrategy: setDCATickStrategy.isPending,
    isQueueing: queueDCAExecution.isPending,
    isExecuting: executeDCA.isPending,
    isDisabling: disableDCA.isPending,

    // Utility hooks
    useCalculateOptimalDCAAmount,
    useShouldExecuteDCA,

    // Refetch functions
    refetchConfig,
    refetchPending,
    refetchHistory,

    // Transaction hash
    hash,

    // Error states
    configError: enableDCA.error,
    setStrategyError: setDCATickStrategy.error,
    queueError: queueDCAExecution.error,
    executeError: executeDCA.error,
    disableError: disableDCA.error
  };
}
