'use client';

import { useState, useCallback, useMemo } from 'react';
import { Address, encodeFunctionData, parseUnits, Hash, encodeAbiParameters, erc20Abi, maxUint256 } from 'viem';
import { useBiconomy } from '@/components/BiconomyProvider';
import { useTokenApproval } from './useTokenApproval';
import { useBiconomyTransaction } from '../useBiconomyTransaction';
import { Token } from './useTokenList';
import { SwapQuote } from '@/utils/quoteHelpers';
import { getContractAddress } from '@/contracts/addresses';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { UniswapV4PoolSwapTestABI } from '@/contracts/abis/UniswapV4PoolSwapTest';
import { usePublicClient } from 'wagmi';

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
  const { sendTransaction, userOpHash, transactionHash } = useBiconomyTransaction();
  const chainId = useActiveChainId();
  const queryClient = useQueryClient();
  const publicClient = usePublicClient();
  const [status, setStatus] = useState<SwapStatus>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [userOpHashState, setUserOpHashState] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get PoolSwapTest address for V4 swaps (matches CompleteProtocolTest.s.sol)
  const poolSwapTestAddress = useMemo(() => {
    try {
      return getContractAddress(chainId, 'UniswapV4PoolSwapTest');
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

  // Custom Smart Account token approval logic
  const checkSmartAccountApproval = useCallback(async (tokenAddress: Address, spenderAddress: Address, amount: bigint): Promise<boolean> => {
    if (!smartAccountAddress || !publicClient) return false;
    
    try {
      const allowance = await publicClient.readContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [smartAccountAddress as Address, spenderAddress],
      });
      
      console.log('🔍 Smart Account allowance check:', {
        smartAccount: smartAccountAddress,
        token: tokenAddress,
        spender: spenderAddress,
        currentAllowance: allowance.toString(),
        requiredAmount: amount.toString(),
        hasEnoughAllowance: allowance >= amount
      });
      
      return allowance >= amount;
    } catch (error) {
      console.error('Error checking Smart Account allowance:', error);
      return false;
    }
  }, [smartAccountAddress, publicClient]);

  const executeSmartAccountApproval = useCallback(async (tokenAddress: Address, spenderAddress: Address, amount: bigint): Promise<string> => {
    if (!smartAccount || !smartAccountAddress) {
      throw new Error('Smart account not initialized');
    }

    console.log('🔐 Executing Smart Account approval:', {
      smartAccount: smartAccountAddress,
      token: tokenAddress,
      spender: spenderAddress,
      amount: amount.toString()
    });

    // Use max approval for better UX
    const approvalCalldata = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'approve',
      args: [spenderAddress, maxUint256],
    });

    const hash = await sendTransaction(
      tokenAddress,
      approvalCalldata,
      BigInt(0)
    );

    return hash;
  }, [smartAccount, smartAccountAddress, sendTransaction]);

  const executeSwap = useCallback(async (swapParams: SwapParams): Promise<SwapResult> => {
    try {
      setStatus('checking_approval');
      setError(null);
      setTxHash(null);
      setUserOpHashState(null);

      // Validate smart account
      if (!smartAccountAddress || !smartAccount) {
        throw new Error('Smart account not initialized. Please wait...');
      }

      if (poolSwapTestAddress === '0x0000000000000000000000000000000000000000') {
        throw new Error('UniswapV4PoolSwapTest not deployed on this network');
      }

      if (spendSaveHookAddress === '0x0000000000000000000000000000000000000000') {
        throw new Error('SpendSaveHook not deployed on this network');
      }

      // Parse input amount
      const inputAmountBigInt = parseUnits(swapParams.inputAmount, swapParams.inputToken.decimals);

      // Calculate savings amount (savingsPercentage is 0-100)
      // Note: Hook will handle savings capture automatically in beforeSwap
      const savingsAmount = (inputAmountBigInt * BigInt(swapParams.savingsPercentage * 100)) / BigInt(10000);
      
      console.log('💰 Savings calculation:', {
        inputAmount: inputAmountBigInt.toString(),
        inputAmountFormatted: swapParams.inputAmount,
        savingsPercentage: swapParams.savingsPercentage,
        calculatedSavings: savingsAmount.toString(),
        tokenDecimals: swapParams.inputToken.decimals,
        tokenSymbol: swapParams.inputToken.symbol,
      });

      // Check if we need Smart Account approval (skip for native ETH)
      const isNativeETH = swapParams.inputToken.address === NATIVE_ETH ||
                         swapParams.inputToken.address === '0x0000000000000000000000000000000000000000';

      if (!isNativeETH) {
        const hasApproval = await checkSmartAccountApproval(
          swapParams.inputToken.address,
          poolSwapTestAddress,
          inputAmountBigInt
        );

        if (!hasApproval) {
          setStatus('approving');
          try {
            console.log('🔐 Smart Account needs approval, executing...');
            const approvalHash = await executeSmartAccountApproval(
              swapParams.inputToken.address,
              poolSwapTestAddress,
              inputAmountBigInt
            );
            
            console.log('✅ Smart Account approval submitted:', approvalHash);
            
            // Wait a bit for the approval to be processed
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Verify approval was successful
            const approvalConfirmed = await checkSmartAccountApproval(
              swapParams.inputToken.address,
              poolSwapTestAddress,
              inputAmountBigInt
            );
            
            if (!approvalConfirmed) {
              throw new Error('Smart Account approval failed or not confirmed');
            }
            
            console.log('✅ Smart Account approval confirmed');
          } catch (approvalError) {
            throw new Error(`Smart Account approval failed: ${approvalError instanceof Error ? approvalError.message : 'Unknown error'}`);
          }
        } else {
          console.log('✅ Smart Account already has sufficient approval');
        }
      }

      setStatus('building');

      /**
       * Build PoolKey with SpendSaveHook (exactly matching CompleteProtocolTest.s.sol)
       * This is CRITICAL - the hook address in poolKey tells PoolManager to call our hook
       */
      // Sort tokens (currency0 < currency1) - matching the Solidity script
      const token0Address = swapParams.inputToken.address.toLowerCase() < swapParams.outputToken.address.toLowerCase()
        ? swapParams.inputToken.address
        : swapParams.outputToken.address;
      const token1Address = swapParams.inputToken.address.toLowerCase() < swapParams.outputToken.address.toLowerCase()
        ? swapParams.outputToken.address
        : swapParams.inputToken.address;
      
      const zeroForOne = swapParams.inputToken.address.toLowerCase() === token0Address.toLowerCase();
      
      // Build PoolKey with SpendSaveHook (exactly as in CompleteProtocolTest.s.sol)
      const poolKey = {
        currency0: token0Address,
        currency1: token1Address,
        fee: 3000, // 0.3% fee tier (matches the script)
        tickSpacing: 60,
        hooks: spendSaveHookAddress, // THIS IS THE MAGIC - enables automatic savings
      };
      
      // Build swap params with proper price limits (fixing PriceLimitOutOfBounds error)
      // For zeroForOne = true (selling token0 for token1), use MIN price limit
      // For zeroForOne = false (selling token1 for token0), use MAX price limit
      const MIN_SQRT_PRICE = BigInt('4295128739'); // TickMath.MIN_SQRT_PRICE
      const MAX_SQRT_PRICE = BigInt('1461446703485210103287273052203988822378723970342'); // TickMath.MAX_SQRT_PRICE
      
      const swapParamsStruct = {
        zeroForOne,
        amountSpecified: -BigInt(inputAmountBigInt), // Negative for exact input
        sqrtPriceLimitX96: zeroForOne 
          ? MIN_SQRT_PRICE + BigInt(1) // For selling token0, use minimum price limit
          : MAX_SQRT_PRICE - BigInt(1), // For selling token1, use maximum price limit
      };
      
      // Build test settings (exactly matching CompleteProtocolTest.s.sol)
      const testSettings = {
        takeClaims: false,
        settleUsingBurn: false,
      };
      
      // Encode hookData with user address (exactly as in CompleteProtocolTest.s.sol)
      const hookData = encodeAbiParameters(
        [{ type: 'address' }],
        [smartAccountAddress as Address]
      );
      
      /**
       * Use PoolSwapTest contract (exactly matching CompleteProtocolTest.s.sol)
       * This is the proven approach that works in the Solidity test script
       */
      const swapCalldata = encodeFunctionData({
        abi: UniswapV4PoolSwapTestABI,
        functionName: 'swap',
        args: [poolKey, swapParamsStruct, testSettings, hookData]
      });

      setStatus('executing');

      // Debug: Log what we're sending (with proper price limits to avoid PriceLimitOutOfBounds)
      console.log('🔄 Executing swap via PoolSwapTest:', {
        poolSwapTest: poolSwapTestAddress,
        poolKey: {
          currency0: poolKey.currency0,
          currency1: poolKey.currency1,
          fee: poolKey.fee,
          tickSpacing: poolKey.tickSpacing,
          hooks: poolKey.hooks,
        },
        swapParams: {
          zeroForOne,
          amountSpecified: swapParamsStruct.amountSpecified.toString(),
          sqrtPriceLimitX96: swapParamsStruct.sqrtPriceLimitX96.toString(),
          priceLimitType: zeroForOne ? 'MIN_SQRT_PRICE + 1' : 'MAX_SQRT_PRICE - 1',
        },
        testSettings: {
          takeClaims: testSettings.takeClaims,
          settleUsingBurn: testSettings.settleUsingBurn,
        },
        inputAmount: inputAmountBigInt.toString(),
        inputToken: swapParams.inputToken.symbol,
        outputToken: swapParams.outputToken.symbol,
        hookData: hookData,
        savingsPercentage: swapParams.savingsPercentage,
      });

      console.log('📊 Swap Details:', {
        userAddress: smartAccountAddress,
        chainId: chainId,
        isNativeETH,
        savingsAmount: savingsAmount.toString(),
        expectedOutput: swapParams.outputAmount.toString(),
        minOutput: swapParams.minOutputAmount.toString(),
      });

      // Execute gasless transaction via Biconomy Smart Account
      const hash = await sendTransaction(
        poolSwapTestAddress,  // Send to PoolSwapTest for V4 swaps (matching CompleteProtocolTest.s.sol)
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

      // Update state with both hash types
      setTxHash(hash);
      if (userOpHash) {
        setUserOpHashState(userOpHash);
      }
      setStatus('confirming');

      console.log('✅ Swap transaction submitted:', {
        returnedHash: hash,
        userOpHash: userOpHash,
        transactionHash: transactionHash,
        status: 'confirming',
      });

      // Wait for confirmation (handled by useBiconomyTransaction)
      // The transaction is already confirmed when sendTransaction returns

      setStatus('success');

      console.log('🎉 Swap completed successfully:', {
        finalTxHash: hash,
        finalUserOpHash: userOpHash,
        finalTransactionHash: transactionHash,
        savingsAmount: savingsAmount.toString(),
        status: 'success',
      });

      // Refresh savings balance after successful swap
      console.log('🔄 Refreshing savings balance after swap...');
      
      // Immediate refresh (in case event listener works)
      queryClient.invalidateQueries({
        queryKey: ['realtimeSavingsBalance', smartAccountAddress, chainId]
      });
      
      // Add a delayed refresh to ensure blockchain has processed the savings
      setTimeout(() => {
        // Invalidate all savings-related queries
        queryClient.invalidateQueries({
          queryKey: ['realtimeSavingsBalance', smartAccountAddress, chainId]
        });
        
        queryClient.invalidateQueries({
          queryKey: ['realtimeSavingsBalance']
        });
        
        queryClient.invalidateQueries({
          queryKey: ['savingsBalance']
        });
        
        queryClient.invalidateQueries({
          queryKey: ['tokenBalances', smartAccountAddress, chainId]
        });
        
        queryClient.invalidateQueries({
          queryKey: ['tokenBalances']
        });
        
        console.log('✅ Savings balance refresh triggered for all queries');
      }, 2000); // 2 second delay to allow blockchain processing

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
      
      console.error('❌ Swap execution error:', {
        error: err,
        errorMessage,
        userOpHash: userOpHash,
        transactionHash: transactionHash,
        status: 'error',
      });
      setError(errorMessage);
      setStatus('error');
      toast.error(errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    }
  }, [smartAccountAddress, smartAccount, sendTransaction, poolSwapTestAddress, spendSaveHookAddress, checkSmartAccountApproval, executeSmartAccountApproval]);

  const reset = useCallback(() => {
    setStatus('idle');
    setTxHash(null);
    setUserOpHashState(null);
    setError(null);
  }, []);

  return {
    executeSwap,
    status,
    txHash,
    userOpHash: userOpHashState,
    error,
    isLoading: status !== 'idle' && status !== 'success' && status !== 'error',
    isSuccess: status === 'success',
    isError: status === 'error',
    reset,
  };
}
