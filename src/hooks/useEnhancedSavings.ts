'use client';

import { useAccount, useReadContract, useChainId } from 'wagmi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parseEther, formatEther } from 'viem';
import { CONTRACT_ADDRESSES } from '@/contracts/addresses';
import { SavingsModuleABI, SavingsTokenType } from '@/contracts/abis/Savings';
import { useSmartContractWrite } from './useSmartContractWrite';

export function useEnhancedSavings() {
  const { address } = useAccount();
  const chainId = useChainId();
  const queryClient = useQueryClient();

  // Get contract address for current chain
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.Savings;

  // Biconomy write hook for gasless transactions
  const { write: writeContract, isPending: isWritePending, hash } = useSmartContractWrite();

  // Process savings with full context
  const processSavingsWithContext = useMutation({
    mutationFn: async (params: {
      hasStrategy: boolean;
      currentPercentage: number;
      inputAmount: string;
      inputToken: `0x${string}`;
      roundUpSavings: boolean;
      enableDCA: boolean;
      dcaTargetToken?: `0x${string}`;
      currentTick: number;
      savingsTokenType: SavingsTokenType;
      specificSavingsToken?: `0x${string}`;
      pendingSaveAmount: string;
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      if (!contractAddress) throw new Error('Contract not deployed on this network');
      
      const inputAmountWei = parseEther(params.inputAmount);
      const pendingSaveAmountWei = parseEther(params.pendingSaveAmount);
      
      return await writeContract({
        address: contractAddress as `0x${string}`,
        abi: SavingsModuleABI,
        functionName: 'processSavingsWithContext',
        args: [
          address,
          params.hasStrategy,
          BigInt(params.currentPercentage),
          inputAmountWei,
          params.inputToken,
          params.roundUpSavings,
          params.enableDCA,
          params.dcaTargetToken || '0x0000000000000000000000000000000000000000',
          params.currentTick,
          params.savingsTokenType,
          params.specificSavingsToken || '0x0000000000000000000000000000000000000000',
          pendingSaveAmountWei
        ]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsBalance'] });
      queryClient.invalidateQueries({ queryKey: ['savingsDetails'] });
    }
  });

  // Batch process savings
  const batchProcessSavings = useMutation({
    mutationFn: async (params: {
      users: `0x${string}`[];
      hasStrategy: boolean;
      currentPercentage: number;
      inputAmount: string;
      inputToken: `0x${string}`;
      roundUpSavings: boolean;
      enableDCA: boolean;
      dcaTargetToken?: `0x${string}`;
      currentTick: number;
      savingsTokenType: SavingsTokenType;
      specificSavingsToken?: `0x${string}`;
      pendingSaveAmount: string;
    }): Promise<`0x${string}`> => {
      if (!contractAddress) throw new Error('Contract not deployed on this network');
      
      const inputAmountWei = parseEther(params.inputAmount);
      const pendingSaveAmountWei = parseEther(params.pendingSaveAmount);
      
      return await writeContract({
        address: contractAddress as `0x${string}`,
        abi: SavingsModuleABI,
        functionName: 'batchProcessSavings',
        args: [
          params.users,
          params.hasStrategy,
          BigInt(params.currentPercentage),
          inputAmountWei,
          params.inputToken,
          params.roundUpSavings,
          params.enableDCA,
          params.dcaTargetToken || '0x0000000000000000000000000000000000000000',
          params.currentTick,
          params.savingsTokenType,
          params.specificSavingsToken || '0x0000000000000000000000000000000000000000',
          pendingSaveAmountWei
        ]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsBalance'] });
      queryClient.invalidateQueries({ queryKey: ['savingsDetails'] });
    }
  });

  // Auto-compound savings
  const autoCompoundSavings = useMutation({
    mutationFn: async (params: {
      token: `0x${string}`;
      compoundPercentage: number;
      minCompoundAmount: string;
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      if (!contractAddress) throw new Error('Contract not deployed on this network');
      
      const minCompoundAmountWei = parseEther(params.minCompoundAmount);
      
      return await writeContract({
        address: contractAddress as `0x${string}`,
        abi: SavingsModuleABI,
        functionName: 'autoCompoundSavings',
        args: [
          address,
          params.token,
          BigInt(params.compoundPercentage),
          minCompoundAmountWei
        ]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsBalance'] });
      queryClient.invalidateQueries({ queryKey: ['savingsDetails'] });
    }
  });

  // Set auto-compound settings
  const setAutoCompoundSettings = useMutation({
    mutationFn: async (params: {
      token: `0x${string}`;
      enabled: boolean;
      compoundPercentage: number;
      minCompoundAmount: string;
      compoundFrequency: number; // in hours
    }): Promise<`0x${string}`> => {
      if (!address) throw new Error('No wallet connected');
      if (!contractAddress) throw new Error('Contract not deployed on this network');
      
      const minCompoundAmountWei = parseEther(params.minCompoundAmount);
      
      return await writeContract({
        address: contractAddress as `0x${string}`,
        abi: SavingsModuleABI,
        functionName: 'setAutoCompoundSettings',
        args: [
          address,
          params.token,
          params.enabled,
          BigInt(params.compoundPercentage),
          minCompoundAmountWei,
          BigInt(params.compoundFrequency)
        ]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['autoCompoundSettings'] });
    }
  });

  // Get savings details
  const useSavingsDetails = (token: `0x${string}`) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: SavingsModuleABI,
      functionName: 'getSavingsDetails',
      args: address && token ? [address, token] : undefined,
      query: {
        enabled: !!address && !!token && !!contractAddress
      }
    });
  };

  // Get auto-compound settings (using getSavingsDetails which includes compound info)
  const useAutoCompoundSettings = (token: `0x${string}`) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: SavingsModuleABI,
      functionName: 'getSavingsDetails',
      args: address && token ? [address, token] : undefined,
      query: {
        enabled: !!address && !!token && !!contractAddress
      }
    });
  };

  // Get savings balance (using getSavingsDetails which includes balance info)
  const useSavingsBalance = (token: `0x${string}`) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: SavingsModuleABI,
      functionName: 'getSavingsDetails',
      args: address && token ? [address, token] : undefined,
      query: {
        enabled: !!address && !!token && !!contractAddress
      }
    });
  };

  // Get savings history (using getUserSavings which includes history info)
  const useSavingsHistory = (token: `0x${string}`) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: SavingsModuleABI,
      functionName: 'getUserSavings',
      args: address ? [address] : undefined,
      query: {
        enabled: !!address && !!contractAddress
      }
    });
  };

  // Calculate compound interest
  const calculateCompoundInterest = (
    principal: bigint,
    rate: number, // annual rate as percentage
    timeInYears: number,
    compoundFrequency: number = 365 // daily compounding
  ): bigint => {
    const rateDecimal = rate / 100;
    const compoundFactor = Math.pow(1 + (rateDecimal / compoundFrequency), compoundFrequency * timeInYears);
    return (principal * BigInt(Math.floor(compoundFactor * 10000))) / BigInt(10000);
  };

  // Calculate auto-compound potential
  const calculateAutoCompoundPotential = (
    currentBalance: bigint,
    compoundPercentage: number,
    timeInDays: number
  ): bigint => {
    const dailyRate = compoundPercentage / 100 / 365;
    const compoundFactor = Math.pow(1 + dailyRate, timeInDays);
    return (currentBalance * BigInt(Math.floor(compoundFactor * 10000))) / BigInt(10000);
  };

  // Format amount
  const formatAmount = (amount: bigint, decimals: number = 18) => {
    const formatted = formatEther(amount);
    return parseFloat(formatted).toFixed(4);
  };

  // Get compound frequency label
  const getCompoundFrequencyLabel = (frequency: number): string => {
    if (frequency >= 24) return `${frequency / 24} days`;
    return `${frequency} hours`;
  };

  // Get savings token type label
  const getSavingsTokenTypeLabel = (type: SavingsTokenType): string => {
    switch (type) {
      case SavingsTokenType.INPUT_TOKEN: return 'Input Token';
      case SavingsTokenType.OUTPUT_TOKEN: return 'Output Token';
      case SavingsTokenType.SPECIFIC_TOKEN: return 'Specific Token';
      default: return 'Unknown';
    }
  };

  // Calculate savings efficiency
  const calculateSavingsEfficiency = (
    totalSaved: bigint,
    totalSwapped: bigint
  ): number => {
    if (totalSwapped === BigInt(0)) return 0;
    return Number((totalSaved * BigInt(10000)) / totalSwapped) / 100;
  };

  // Get savings status
  const getSavingsStatus = (balance: bigint, goalAmount: bigint): 'inactive' | 'active' | 'goal_reached' => {
    if (balance === BigInt(0)) return 'inactive';
    if (goalAmount > BigInt(0) && balance >= goalAmount) return 'goal_reached';
    return 'active';
  };

  return {
    // Contract data
    contractAddress,

    // Loading states
    isWritePending,

    // Mutations (gasless)
    processSavingsWithContext: processSavingsWithContext.mutateAsync,
    batchProcessSavings: batchProcessSavings.mutateAsync,
    autoCompoundSavings: autoCompoundSavings.mutateAsync,
    setAutoCompoundSettings: setAutoCompoundSettings.mutateAsync,

    // Read functions
    useSavingsDetails,
    useAutoCompoundSettings,
    useSavingsBalance,
    useSavingsHistory,

    // Mutation states
    isProcessingWithContext: processSavingsWithContext.isPending,
    isBatchProcessing: batchProcessSavings.isPending,
    isAutoCompounding: autoCompoundSavings.isPending,
    isSettingAutoCompound: setAutoCompoundSettings.isPending,

    // Utility functions
    formatAmount,
    calculateCompoundInterest,
    calculateAutoCompoundPotential,
    getCompoundFrequencyLabel,
    getSavingsTokenTypeLabel,
    calculateSavingsEfficiency,
    getSavingsStatus,

    // Constants
    SavingsTokenType,

    // Transaction hash
    hash,

    // Error states
    processWithContextError: processSavingsWithContext.error,
    batchProcessError: batchProcessSavings.error,
    autoCompoundError: autoCompoundSavings.error,
    setAutoCompoundError: setAutoCompoundSettings.error
  };
}
