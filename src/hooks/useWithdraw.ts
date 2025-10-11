'use client';

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useSpendSaveContracts } from './useSpendSaveContracts';
import type { WithdrawalPreview } from '@/contracts/types';

export function useWithdraw() {
  const { address } = useAccount();
  const contracts = useSpendSaveContracts();

  // Calculate withdrawal amount with penalties
  const useCalculateWithdrawal = (token?: `0x${string}`, amount?: bigint) => {
    const { data, isLoading } = useReadContract({
      ...contracts.savings,
      functionName: 'calculateWithdrawalAmount',
      args: address && token && amount ? [address, token, amount] : undefined,
      query: {
        enabled: !!address && !!token && !!amount && amount > BigInt(0)
      }
    });

    const preview: WithdrawalPreview | undefined = data ? {
      actualAmount: data[0],
      penalty: data[1],
      penaltyPercentage: Number(data[1]) / Number(amount || BigInt(1)) * 100
    } : undefined;

    return { preview, isLoading };
  };

  // Write: Withdraw savings
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const withdraw = async (token: `0x${string}`, amount: bigint, force: boolean = false) => {
    if (!address) throw new Error('No wallet connected');

    return writeContract({
      ...contracts.savings,
      functionName: 'withdraw',
      args: [address, token, amount, force]
    });
  };

  return {
    withdraw,
    useCalculateWithdrawal,
    isPending: isPending || isConfirming,
    isSuccess,
    transactionHash: hash
  };
}

