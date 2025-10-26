'use client';

import { useAccount, useReadContract } from 'wagmi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parseEther, formatEther } from 'viem';
import { getContractAddress } from '@/contracts/addresses';
import { DCAABI } from '@/contracts/abis/DCA';
import { useSmartContractWrite } from './useSmartContractWrite';
import { useActiveChainId } from './useActiveChainId';
import { useBiconomy } from '@/components/BiconomyProvider';

interface DCAExecution {
  user: `0x${string}`;
  fromToken: `0x${string}`;
  toToken: `0x${string}`;
  amount: bigint;
  timestamp: number;
}

export function useAdvancedDCA() {
  const { address: eoaAddress } = useAccount();
  const { smartAccountAddress } = useBiconomy();
  const chainId = useActiveChainId();
  const queryClient = useQueryClient();

  // Use Smart Account address if available, fallback to EOA
  const address = smartAccountAddress || eoaAddress;

  // Get contract address for current chain
  const contractAddress = getContractAddress(chainId, 'DCA');

  // Biconomy write hook for gasless transactions
  const { write: writeContract, isPending: isWritePending, hash } = useSmartContractWrite();

  // Process DCA from savings
  const processDCAFromSavings = useMutation({
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
        functionName: 'processDCAFromSavings',
        args: [address, params.fromToken, params.toToken, amountWei]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dcaConfig'] });
      queryClient.invalidateQueries({ queryKey: ['dcaHistory'] });
      queryClient.invalidateQueries({ queryKey: ['pendingDCA'] });
    }
  });

  // Queue DCA from swap context
  const queueDCAFromSwap = useMutation({
    mutationFn: async (params: {
      fromToken: `0x${string}`;
      toToken: `0x${string}`;
      amount: string;
      poolKey: {
        currency0: `0x${string}`;
        currency1: `0x${string}`;
        fee: number;
        tickSpacing: number;
        hooks: `0x${string}`;
      };
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      if (!contractAddress) throw new Error('Contract not deployed on this network');
      
      const amountWei = parseEther(params.amount);
      
      return await writeContract({
        address: contractAddress as `0x${string}`,
        abi: DCAABI,
        functionName: 'queueDCAFromSwap',
        args: [address, params.fromToken, params.toToken, amountWei, params.poolKey]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingDCA'] });
      queryClient.invalidateQueries({ queryKey: ['dcaConfig'] });
    }
  });

  // Execute DCA at specific index
  const executeDCAAtIndex = useMutation({
    mutationFn: async (params: {
      index: number;
    }): Promise<{ hash: `0x${string}`; executed: boolean; amount: bigint }> => {
      if (!address) throw new Error('No wallet connected');
      if (!contractAddress) throw new Error('Contract not deployed on this network');
      
      const hash = await writeContract({
        address: contractAddress as `0x${string}`,
        abi: DCAABI,
        functionName: 'executeDCAAtIndex',
        args: [address, params.index]
      });

      return { hash, executed: true, amount: BigInt(0) };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingDCA'] });
      queryClient.invalidateQueries({ queryKey: ['dcaHistory'] });
    }
  });

  // Check if DCA should execute at tick (public)
  const useShouldExecuteDCAAtTickPublic = (poolKey?: {
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
      args: address && poolKey ? [address as `0x${string}`, poolKey] : undefined,
      query: {
        enabled: !!address && !!poolKey && !!contractAddress
      }
    });
  };

  // Get current tick
  const useCurrentTick = (poolKey?: {
    currency0: `0x${string}`;
    currency1: `0x${string}`;
    fee: number;
    tickSpacing: number;
    hooks: `0x${string}`;
  }) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: DCAABI,
      functionName: 'getPendingDCA',
      args: address && poolKey ? [address as `0x${string}`] : undefined,
      query: {
        enabled: !!address && !!contractAddress
      }
    });
  };

  // Calculate dynamic DCA amount
  const useCalculateDynamicDCAAmount = (params: {
    fromToken: `0x${string}`;
    toToken: `0x${string}`;
    baseAmount: string;
    tickMovement: number;
    volatilityFactor: number;
  }) => {
    const baseAmountWei = parseEther(params.baseAmount);
    
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: DCAABI,
      functionName: 'calculateOptimalDCAAmount',
      args: address && params.fromToken && params.toToken ? [
        address as `0x${string}`,
        params.fromToken,
        params.toToken,
        baseAmountWei
      ] : undefined,
      query: {
        enabled: !!address && !!params.fromToken && !!params.toToken && !!contractAddress
      }
    });
  };

  // Batch execute DCA
  const batchExecuteDCA = useMutation({
    mutationFn: async (params: {
      users: `0x${string}`[];
    }): Promise<{ hash: `0x${string}`; executions: DCAExecution[] }> => {
      if (!contractAddress) throw new Error('Contract not deployed on this network');

      const hash = await writeContract({
        address: contractAddress as `0x${string}`,
        abi: DCAABI,
        functionName: 'batchExecuteDCA',
        args: [params.users]
      });

      return { hash, executions: [] };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dcaHistory'] });
      queryClient.invalidateQueries({ queryKey: ['pendingDCA'] });
    }
  });

  // Set dynamic DCA sizing
  const setDynamicDCASizing = useMutation({
    mutationFn: async (params: {
      enabled: boolean;
      baseAmount: string;
      volatilityMultiplier: number;
      maxMultiplier: number;
      minMultiplier: number;
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      if (!contractAddress) throw new Error('Contract not deployed on this network');
      
      const baseAmountWei = parseEther(params.baseAmount);
      
      return await writeContract({
        address: contractAddress as `0x${string}`,
        abi: DCAABI,
        functionName: 'setDynamicDCASizing',
        args: [
          address,
          params.enabled,
          baseAmountWei,
          BigInt(params.volatilityMultiplier * 10000), // Convert to basis points
          BigInt(params.maxMultiplier * 10000),
          BigInt(params.minMultiplier * 10000)
        ]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dcaConfig'] });
    }
  });

  // Set advanced tick strategy
  const setAdvancedTickStrategy = useMutation({
    mutationFn: async (params: {
      lowerTick: number;
      upperTick: number;
      tickDelta: number;
      tickExpiryTime: number;
      onlyImprovePrice: boolean;
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      if (!contractAddress) throw new Error('Contract not deployed on this network');
      
      return await writeContract({
        address: contractAddress as `0x${string}`,
        abi: DCAABI,
        functionName: 'setAdvancedTickStrategy',
        args: [
          address,
          params.lowerTick,
          params.upperTick,
          params.tickDelta,
          BigInt(params.tickExpiryTime),
          params.onlyImprovePrice
        ]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dcaConfig'] });
    }
  });

  // Get DCA execution criteria
  const useDCAExecutionCriteria = (token: `0x${string}`) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: DCAABI,
      functionName: 'getDCAConfig',
      args: address && token ? [address as `0x${string}`] : undefined,
      query: {
        enabled: !!address && !!contractAddress
      }
    });
  };

  // Utility functions
  const formatAmount = (amount: bigint, decimals: number = 18) => {
    const formatted = formatEther(amount);
    return parseFloat(formatted).toFixed(4);
  };

  const calculateDynamicAmount = (
    baseAmount: bigint,
    tickMovement: number,
    volatilityFactor: number
  ): bigint => {
    // Simple dynamic calculation based on tick movement and volatility
    const tickFactor = 1 + (tickMovement / 1000); // Convert tick movement to percentage
    const volatilityFactorDecimal = volatilityFactor / 100;
    
    const dynamicMultiplier = tickFactor * volatilityFactorDecimal;
    const clampedMultiplier = Math.max(0.5, Math.min(2.0, dynamicMultiplier)); // Clamp between 0.5x and 2x
    
    return (baseAmount * BigInt(Math.floor(clampedMultiplier * 10000))) / BigInt(10000);
  };

  const getTickPrice = (tick: number): number => {
    // Convert tick to price (simplified calculation)
    return Math.pow(1.0001, tick);
  };

  const calculateTickMovement = (oldTick: number, newTick: number): number => {
    return newTick - oldTick;
  };

  const isTickWithinRange = (tick: number, lowerTick: number, upperTick: number): boolean => {
    return tick >= lowerTick && tick <= upperTick;
  };

  const getVolatilityLevel = (tickMovement: number): 'low' | 'medium' | 'high' => {
    const absMovement = Math.abs(tickMovement);
    if (absMovement < 10) return 'low';
    if (absMovement < 50) return 'medium';
    return 'high';
  };

  return {
    // Contract data
    contractAddress,

    // Loading states
    isWritePending,

    // Mutations (gasless)
    processDCAFromSavings: processDCAFromSavings.mutateAsync,
    queueDCAFromSwap: queueDCAFromSwap.mutateAsync,
    executeDCAAtIndex: executeDCAAtIndex.mutateAsync,
    batchExecuteDCA: batchExecuteDCA.mutateAsync,
    setDynamicDCASizing: setDynamicDCASizing.mutateAsync,
    setAdvancedTickStrategy: setAdvancedTickStrategy.mutateAsync,

    // Read functions
    useShouldExecuteDCAAtTickPublic,
    useCurrentTick,
    useCalculateDynamicDCAAmount,
    useDCAExecutionCriteria,

    // Mutation states
    isProcessingFromSavings: processDCAFromSavings.isPending,
    isQueueingFromSwap: queueDCAFromSwap.isPending,
    isExecutingAtIndex: executeDCAAtIndex.isPending,
    isBatchExecuting: batchExecuteDCA.isPending,
    isSettingDynamicSizing: setDynamicDCASizing.isPending,
    isSettingAdvancedStrategy: setAdvancedTickStrategy.isPending,

    // Utility functions
    formatAmount,
    calculateDynamicAmount,
    getTickPrice,
    calculateTickMovement,
    isTickWithinRange,
    getVolatilityLevel,

    // Transaction hash
    hash,

    // Error states
    processFromSavingsError: processDCAFromSavings.error,
    queueFromSwapError: queueDCAFromSwap.error,
    executeAtIndexError: executeDCAAtIndex.error,
    batchExecuteError: batchExecuteDCA.error,
    setDynamicSizingError: setDynamicDCASizing.error,
    setAdvancedStrategyError: setAdvancedTickStrategy.error
  };
}
