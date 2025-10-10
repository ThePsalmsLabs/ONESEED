'use client';

import { useState, useCallback } from 'react';
import { useBiconomy } from '@/components/BiconomyProvider';
import { useToast } from '@/components/ui/Toast';
import { type Hash } from 'viem';

interface TransactionOptions {
  onSuccess?: (hash: Hash) => void;
  onError?: (error: Error) => void;
}

export function useBiconomyTransaction() {
  const { smartAccount } = useBiconomy();
  const { showToast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const [hash, setHash] = useState<Hash | undefined>();

  const sendTransaction = useCallback(
    async (
      to: `0x${string}`,
      data: `0x${string}`,
      value: bigint = BigInt(0),
      options?: TransactionOptions
    ) => {
      if (!smartAccount) {
        const error = new Error('Smart account not initialized');
        showToast('Please wait for smart account to initialize', 'error');
        options?.onError?.(error);
        throw error;
      }

      setIsPending(true);
      setHash(undefined);

      try {
        // Build user operation
        const userOp = await smartAccount.buildUserOp([
          {
            to,
            data,
            value,
          },
        ]);

        // Send user operation
        const userOpResponse = await smartAccount.sendUserOp(userOp);
        
        // Wait for transaction hash
        const txHash = await userOpResponse.wait();
        
        setHash(txHash.userOpHash as Hash);
        showToast('Transaction successful!', 'success');
        
        options?.onSuccess?.(txHash.userOpHash as Hash);
        
        return txHash.userOpHash as Hash;
      } catch (error) {
        console.error('Transaction error:', error);
        const err = error as Error;
        showToast(err.message || 'Transaction failed', 'error');
        options?.onError?.(err);
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    [smartAccount, showToast]
  );

  return {
    sendTransaction,
    isPending,
    hash,
  };
}

