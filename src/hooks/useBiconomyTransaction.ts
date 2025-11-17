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
  const [userOpHash, setUserOpHash] = useState<Hash | undefined>();
  const [transactionHash, setTransactionHash] = useState<Hash | undefined>();

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
      setUserOpHash(undefined);
      setTransactionHash(undefined);

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
        
        // Set UserOp hash immediately
        const userOpHashValue = userOpResponse.userOpHash as Hash;
        setUserOpHash(userOpHashValue);
        
        console.log('📦 UserOp sent:', {
          userOpHash: userOpHashValue,
        });

        // Wait for transaction receipt
        console.log('⏳ Waiting for transaction receipt...');
        const txReceipt = await userOpResponse.wait();

        // Extract both hashes separately
        const actualTransactionHash = txReceipt.receipt?.transactionHash as Hash | undefined;
        
        console.log('✅ Transaction mined:', {
          userOpHash: txReceipt.userOpHash,
          transactionHash: actualTransactionHash,
          blockNumber: txReceipt.receipt?.blockNumber,
          hasReceipt: !!txReceipt.receipt,
        });

        // Set transaction hash if available
        if (actualTransactionHash) {
          setTransactionHash(actualTransactionHash);
          setHash(actualTransactionHash); // Keep backwards compatibility
        } else {
          console.warn('⚠️ No transaction hash in receipt, using UserOp hash as fallback');
          setHash(userOpHashValue); // Fallback to UserOp hash
        }

        showToast('Transaction successful!', 'success');

        // Return the transaction hash if available, otherwise UserOp hash
        const returnHash = actualTransactionHash || userOpHashValue;
        options?.onSuccess?.(returnHash);

        return returnHash;
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

  const sendBatchTransaction = useCallback(
    async (
      transactions: Array<{
        to: `0x${string}`;
        data: `0x${string}`;
        value: bigint;
      }>,
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
      setUserOpHash(undefined);
      setTransactionHash(undefined);

      try {
        console.log('🔄 Building batch UserOp with', transactions.length, 'transactions');
        
        // Build user operation with multiple transactions
        const userOp = await smartAccount.buildUserOp(transactions);

        console.log('📦 Batch UserOp built:', {
          transactionCount: transactions.length,
          userOpHash: userOp.sender,
        });

        // Send user operation
        const userOpResponse = await smartAccount.sendUserOp(userOp);
        
        // Set UserOp hash immediately
        const userOpHashValue = userOpResponse.userOpHash as Hash;
        setUserOpHash(userOpHashValue);
        
        console.log('📦 Batch UserOp sent:', {
          userOpHash: userOpHashValue,
          transactionCount: transactions.length,
        });

        // Wait for transaction receipt
        console.log('⏳ Waiting for batch transaction receipt...');
        const txReceipt = await userOpResponse.wait();

        // Extract both hashes separately
        const actualTransactionHash = txReceipt.receipt?.transactionHash as Hash | undefined;
        
        console.log('✅ Batch transaction mined:', {
          userOpHash: txReceipt.userOpHash,
          transactionHash: actualTransactionHash,
          blockNumber: txReceipt.receipt?.blockNumber,
          transactionCount: transactions.length,
          hasReceipt: !!txReceipt.receipt,
        });

        // Set transaction hash if available
        if (actualTransactionHash) {
          setTransactionHash(actualTransactionHash);
          setHash(actualTransactionHash); // Keep backwards compatibility
        } else {
          console.warn('⚠️ No transaction hash in receipt, using UserOp hash as fallback');
          setHash(userOpHashValue); // Fallback to UserOp hash
        }

        showToast(`Batch transaction successful! (${transactions.length} operations)`, 'success');

        // Return the transaction hash if available, otherwise UserOp hash
        const returnHash = actualTransactionHash || userOpHashValue;
        options?.onSuccess?.(returnHash);

        return returnHash;
      } catch (error) {
        console.error('Batch transaction error:', error);
        const err = error as Error;
        showToast(err.message || 'Batch transaction failed', 'error');
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
    sendBatchTransaction,
    isPending,
    hash, // DEPRECATED: Keep for backwards compatibility
    userOpHash, // NEW: Biconomy UserOp hash
    transactionHash, // NEW: Actual blockchain transaction hash
  };
}

