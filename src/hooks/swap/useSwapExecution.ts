'use client';

import { useState, useCallback, useMemo } from 'react';
import { Address, encodeFunctionData, parseUnits, Hash, encodeAbiParameters } from 'viem';
import { useBiconomy } from '@/components/BiconomyProvider';
import { useTokenApproval } from './useTokenApproval';
import { useBiconomyTransaction } from '../useBiconomyTransaction';
import { Token } from './useTokenList';
import { SwapQuote } from '@/utils/quoteHelpers';
import { UniswapV4PoolManagerABI } from '@/contracts/abis/UniswapV4PoolManager';
import { getContractAddress } from '@/contracts/addresses';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { toast } from 'sonner';

export type SwapStatus =
  | 'idle'
  | 'checking_approval'
  | 'approving'
  | 'building'
  | 'executing'
  | 'confirming'
  | 'success'
  | 'error';

export interface SwapParams {
  inputToken: Token;
  outputToken: Token;
  inputAmount: string;
  outputAmount: bigint;
  minOutputAmount: bigint;
  savingsPercentage: number;
  deadlineMinutes: number;
}

export interface SwapResult {
  success: boolean;
  txHash?: string;
  savingsAmount?: bigint;
  error?: string;
}

const NATIVE_ETH = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' as Address;

/**
 * Hook for executing swaps with automatic savings through SpendSave protocol
 *
 * ARCHITECTURE NOTE (from SWAP_FLOW_DOCUMENTATION.md):
 * SpendSave is a UNISWAP V4 HOOK, not a standalone DEX.
 *
 * Correct flow for user-initiated swaps with savings:
 * 1. User configures savings strategy via setSavingStrategy (one-time)
 * 2. User calls Uniswap V4 PoolManager.swap() with poolKey containing SpendSaveHook address
 * 3. PoolManager automatically calls SpendSaveHook.beforeSwap() (captures savings intent)
 * 4. Swap executes with adjusted amounts
 * 5. PoolManager automatically calls SpendSaveHook.afterSwap() (records savings)
 * 6. User receives output tokens + savings are stored
 *
 * NO DIRECT HOOK CALLS NEEDED - PoolManager handles everything automatically.
 */
export function useSwapExecution(params?: SwapParams) {
  const { smartAccountAddress, smartAccount } = useBiconomy();
  const { sendTransaction } = useBiconomyTransaction();
  const chainId = useActiveChainId();
  const [status, setStatus] = useState<SwapStatus>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get Uniswap V4 PoolManager address
  const poolManagerAddress = useMemo(() => {
    try {
      return getContractAddress(chainId, 'UniswapV4PoolManager');
    } catch {
      return '0x0000000000000000000000000000000000000000' as Address;
    }
  }, [chainId]);
  
  // Get SpendSaveHook address for poolKey
  const spendSaveHookAddress = useMemo(() => {
    try {
      return getContractAddress(chainId, 'SpendSaveHook');
    } catch {
      return '0x0000000000000000000000000000000000000000' as Address;
    }
  }, [chainId]);

  // Parse input amount for approval
  const inputAmountBigInt = useMemo(() => {
    if (!params?.inputAmount || !params?.inputToken) return BigInt(0);
    try {
      return parseUnits(params.inputAmount, params.inputToken.decimals);
    } catch {
      return BigInt(0);
    }
  }, [params?.inputAmount, params?.inputToken]);

  // Check if native ETH
  const isNativeETH = useMemo(() => {
    if (!params?.inputToken) return false;
    return params.inputToken.address === NATIVE_ETH ||
           params.inputToken.address === '0x0000000000000000000000000000000000000000';
  }, [params?.inputToken]);

  // Setup token approval for PoolManager (hook must be called unconditionally)
  const tokenApproval = useTokenApproval({
    tokenAddress: params?.inputToken?.address,
    spenderAddress: poolManagerAddress,
    amount: inputAmountBigInt,
    enabled: !isNativeETH && !!params?.inputToken && inputAmountBigInt > 0,
  });

  const executeSwap = useCallback(async (swapParams: SwapParams): Promise<SwapResult> => {
    try {
      setStatus('checking_approval');
      setError(null);
      setTxHash(null);

      // Validate smart account
      if (!smartAccountAddress || !smartAccount) {
        throw new Error('Smart account not initialized. Please wait...');
      }

      if (poolManagerAddress === '0x0000000000000000000000000000000000000000') {
        throw new Error('Uniswap V4 PoolManager not available on this network');
      }
      
      if (spendSaveHookAddress === '0x0000000000000000000000000000000000000000') {
        throw new Error('SpendSaveHook not deployed on this network');
      }

      // Parse input amount
      const inputAmountBigInt = parseUnits(swapParams.inputAmount, swapParams.inputToken.decimals);

      // Calculate savings amount (savingsPercentage is 0-100)
      // Note: Hook will handle savings capture automatically in beforeSwap
      const savingsAmount = (inputAmountBigInt * BigInt(swapParams.savingsPercentage * 100)) / BigInt(10000);

      // Check if we need approval (skip for native ETH)
      const isNativeETH = swapParams.inputToken.address === NATIVE_ETH ||
                         swapParams.inputToken.address === '0x0000000000000000000000000000000000000000';

      if (!isNativeETH && tokenApproval.needsApproval) {
        setStatus('approving');
        try {
          await tokenApproval.approve(true); // Use max approval for better UX

          // Wait for approval confirmation
          let attempts = 0;
          while ((tokenApproval.isApproving || tokenApproval.isConfirming) && attempts < 60) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
          }

          if (!tokenApproval.isConfirmed) {
            throw new Error('Token approval failed');
          }
        } catch (approvalError) {
          throw new Error(`Token approval failed: ${approvalError instanceof Error ? approvalError.message : 'Unknown error'}`);
        }
      }

      setStatus('building');

      /**
       * Build PoolKey with SpendSaveHook
       * This is CRITICAL - the hook address in poolKey tells PoolManager to call our hook
       */
      // Sort tokens (currency0 < currency1)
      const token0Address = swapParams.inputToken.address.toLowerCase() < swapParams.outputToken.address.toLowerCase()
        ? swapParams.inputToken.address
        : swapParams.outputToken.address;
      const token1Address = swapParams.inputToken.address.toLowerCase() < swapParams.outputToken.address.toLowerCase()
        ? swapParams.outputToken.address
        : swapParams.inputToken.address;
      
      const zeroForOne = swapParams.inputToken.address.toLowerCase() === token0Address.toLowerCase();
      
      // Build PoolKey with SpendSaveHook
      const poolKey = {
        currency0: token0Address,
        currency1: token1Address,
        fee: 3000, // 0.3% fee tier (most common)
        tickSpacing: 60,
        hooks: spendSaveHookAddress, // THIS IS THE MAGIC - enables automatic savings
      };
      
      // Build swap params
      const swapParamsStruct = {
        zeroForOne,
        amountSpecified: -BigInt(inputAmountBigInt), // Negative for exact input
        sqrtPriceLimitX96: BigInt(0), // No price limit
      };
      
      // Encode hookData with user address (optional but recommended)
      const hookData = encodeAbiParameters(
        [{ type: 'address' }],
        [smartAccountAddress as Address]
      );
      
      /**
       * Call PoolManager.swap() with poolKey containing SpendSaveHook
       * 
       * Flow:
       * 1. PoolManager receives swap request
       * 2. Sees poolKey.hooks = SpendSaveHook address
       * 3. Automatically calls SpendSaveHook.beforeSwap() -> captures savings
       * 4. Executes actual AMM swap with adjusted amounts
       * 5. Automatically calls SpendSaveHook.afterSwap() -> records savings
       * 6. Returns swap delta to user
       */
      const swapCalldata = encodeFunctionData({
        abi: UniswapV4PoolManagerABI,
        functionName: 'swap',
        args: [poolKey, swapParamsStruct, hookData],
      });

      setStatus('executing');

      // Execute gasless transaction via Biconomy Smart Account
      const hash = await sendTransaction(
        poolManagerAddress,
        swapCalldata,
        isNativeETH ? inputAmountBigInt : BigInt(0),
        {
          onSuccess: (txHash: Hash) => {
            setTxHash(txHash);
            setStatus('confirming');
            toast.success('Swap executing with automatic savings!');
          },
          onError: (err: Error) => {
            throw err;
          },
        }
      );

      setTxHash(hash);
      setStatus('confirming');

      // Wait for confirmation (handled by useBiconomyTransaction)
      // The transaction is already confirmed when sendTransaction returns

      setStatus('success');

      return {
        success: true,
        txHash: hash,
        savingsAmount,
      };

    } catch (err) {
      let errorMessage = 'Swap execution failed';
      
      // Enhanced error messages
      if (err instanceof Error) {
        if (err.message.includes('insufficient')) {
          errorMessage = 'Insufficient token balance';
        } else if (err.message.includes('allowance')) {
          errorMessage = 'Token approval required';
        } else if (err.message.includes('slippage')) {
          errorMessage = 'Price moved too much. Try increasing slippage tolerance.';
        } else if (err.message.includes('Pool not initialized')) {
          errorMessage = 'Trading pair not available. Try different tokens.';
        } else if (err.message.includes('user rejected') || err.message.includes('User rejected')) {
          errorMessage = 'Transaction cancelled';
        } else {
          errorMessage = err.message;
        }
      }
      
      console.error('Swap execution error:', err);
      setError(errorMessage);
      setStatus('error');
      toast.error(errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    }
  }, [smartAccountAddress, smartAccount, sendTransaction, poolManagerAddress, spendSaveHookAddress, tokenApproval]);

  const reset = useCallback(() => {
    setStatus('idle');
    setTxHash(null);
    setError(null);
  }, []);

  return {
    executeSwap,
    status,
    txHash,
    error,
    isLoading: status !== 'idle' && status !== 'success' && status !== 'error',
    isSuccess: status === 'success',
    isError: status === 'error',
    reset,
  };
}
