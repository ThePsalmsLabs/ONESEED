'use client';

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useSpendSaveContracts } from './useSpendSaveContracts';
import { SavingsTokenType } from '@/contracts/types';

export function useSavingsStrategy() {
  const { address } = useAccount();
  const contracts = useSpendSaveContracts();

  // Read user strategy
  const { data: strategy, isLoading, refetch } = useReadContract({
    ...contracts.savingStrategy,
    functionName: 'getUserStrategy',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address
    }
  });

  // Check if user has active strategy
  const { data: hasStrategy } = useReadContract({
    ...contracts.savingStrategy,
    functionName: 'hasActiveStrategy',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address
    }
  });

  // Preview savings for a given swap amount
  const usePreviewSavings = (swapAmount: bigint) => {
    return useReadContract({
      ...contracts.savingStrategy,
      functionName: 'previewSavings',
      args: address && swapAmount ? [address, swapAmount] : undefined,
      query: {
        enabled: !!address && !!swapAmount
      }
    });
  };

  // Write: Set saving strategy
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const setSavingStrategy = async (params: {
    percentage: bigint;
    autoIncrement: bigint;
    maxPercentage: bigint;
    roundUpSavings: boolean;
    savingsTokenType: SavingsTokenType;
    specificSavingsToken?: `0x${string}`;
  }) => {
    if (!address) throw new Error('No wallet connected');

    return writeContract({
      ...contracts.savingStrategy,
      functionName: 'setSavingStrategy',
      args: [
        address,
        params.percentage,
        params.autoIncrement,
        params.maxPercentage,
        params.roundUpSavings,
        params.savingsTokenType,
        params.specificSavingsToken || '0x0000000000000000000000000000000000000000'
      ]
    });
  };

  return {
    strategy: strategy ? {
      percentage: strategy[0],
      autoIncrement: strategy[1],
      maxPercentage: strategy[2],
      roundUpSavings: strategy[3],
      savingsTokenType: strategy[4] as SavingsTokenType
    } : undefined,
    hasStrategy: hasStrategy ?? false,
    isLoading,
    refetch,
    setSavingStrategy,
    isPending: isPending || isConfirming,
    isSuccess,
    usePreviewSavings
  };
}

