'use client';

import { useAccount, useReadContract } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useCallback, useState } from 'react';
import { useSpendSaveContracts } from './useSpendSaveContracts';
import { useActiveChainId } from './useActiveChainId';
import { useBiconomy } from '@/components/BiconomyProvider';
import { useBiconomyTransaction } from './useBiconomyTransaction';
import { encodeFunctionData, type Hash } from 'viem';
import type { WithdrawalPreview } from '@/contracts/types';

export function useWithdraw() {
  const { address: eoaAddress } = useAccount();
  const { smartAccountAddress } = useBiconomy();
  const contracts = useSpendSaveContracts();
  const queryClient = useQueryClient();
  const chainId = useActiveChainId();
  const lastInvalidationRef = useRef<number>(0);
  const { sendTransaction, isPending, transactionHash, userOpHash } = useBiconomyTransaction();
  
  // State for tracking transaction success
  const [isSuccess, setIsSuccess] = useState(false);

  // Use Smart Account address if available, fallback to EOA
  const address = smartAccountAddress || eoaAddress;

  // Calculate withdrawal amount with penalties
  const useCalculateWithdrawal = (token?: `0x${string}`, amount?: bigint) => {
    const { data, isLoading } = useReadContract({
      ...contracts.savings,
      functionName: 'calculateWithdrawalAmount',
      args: address && token && amount ? [address as `0x${string}`, token, amount] : undefined,
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

  // Comprehensive invalidation function - prevents refresh storms
  const invalidateSavingsQueries = useCallback(() => {
    const now = Date.now();
    const timeSinceLastInvalidation = now - lastInvalidationRef.current;

    // Only invalidate if at least 2 seconds have passed since last invalidation
    if (timeSinceLastInvalidation < 2000) {
      console.log('⏳ Skipping invalidation - too soon since last refresh');
      return;
    }

    lastInvalidationRef.current = now;

    if (!address) {
      console.log('❌ No address available for invalidation');
      return;
    }

    console.log('🔄 Invalidating savings queries after withdrawal...', {
      address,
      chainId,
      smartAccountAddress,
      eoaAddress
    });

    // Invalidate all savings balance queries to force immediate refresh
    queryClient.invalidateQueries({
      queryKey: ['realtimeSavingsBalance', address, chainId]
    });

    queryClient.invalidateQueries({
      queryKey: ['tokenBalances', address, chainId]
    });

    // Also invalidate individual token balances
    queryClient.invalidateQueries({
      queryKey: ['tokenSavingsBalance']
    });

    console.log('✅ Savings queries invalidated');

    // Refetch queries after a delay to ensure blockchain state is updated
    setTimeout(() => {
      console.log('🔍 Refetching queries after delay...');
      queryClient.refetchQueries({
        queryKey: ['realtimeSavingsBalance', address, chainId]
      });
    }, 2000);
  }, [address, chainId, queryClient, smartAccountAddress, eoaAddress]);

  // Reset success state when transaction hash changes
  useEffect(() => {
    if (transactionHash) {
      console.log('✅ Withdrawal transaction confirmed:', {
        transactionHash,
        userOpHash
      });
      setIsSuccess(true);
      
      // Invalidate queries immediately
      invalidateSavingsQueries();
    }
  }, [transactionHash, userOpHash, invalidateSavingsQueries]);

  const withdraw = async (token: `0x${string}`, amount: bigint, force: boolean = false) => {
    if (!address) throw new Error('No wallet connected');
    if (!smartAccountAddress) throw new Error('Smart Account not initialized');

    console.log('🔓 Initiating withdrawal:', {
      user: address,
      smartAccountAddress,
      eoaAddress,
      token,
      amount: amount.toString(),
      force,
      savingsAddress: contracts.savings.address
    });

    try {
      // Encode the withdraw function call
      const withdrawCalldata = encodeFunctionData({
        abi: contracts.savings.abi,
        functionName: 'withdraw',
        args: [smartAccountAddress as `0x${string}`, token, amount, force] as readonly [`0x${string}`, `0x${string}`, bigint, boolean]
      });

      console.log('📝 Encoded withdrawal calldata:', {
        to: contracts.savings.address,
        calldata: withdrawCalldata,
        args: {
          user: smartAccountAddress,
          token,
          amount: amount.toString(),
          force
        }
      });

      // Send transaction via Biconomy Smart Account
      const hash = await sendTransaction(
        contracts.savings.address as `0x${string}`,
        withdrawCalldata as `0x${string}`,
        BigInt(0),
        {
          onSuccess: (txHash: Hash) => {
            console.log('✅ Withdrawal successful:', txHash);
            setIsSuccess(true);
          },
          onError: (error: Error) => {
            console.error('❌ Withdrawal error:', error);
            setIsSuccess(false);
            throw error;
          }
        }
      );

      console.log('📦 Withdrawal transaction hash:', hash);
      return hash;
    } catch (error) {
      console.error('❌ Withdrawal failed:', error);
      setIsSuccess(false);
      throw error;
    }
  };

  const reset = useCallback(() => {
    setIsSuccess(false);
    console.log('🔄 Withdrawal state reset');
  }, []);

  return {
    withdraw,
    useCalculateWithdrawal,
    isPending,
    isSuccess,
    transactionHash,
    reset
  };
}

