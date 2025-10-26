'use client';

import { useState, useEffect, useCallback } from 'react';
import { Address } from 'viem';
import { usePublicClient } from 'wagmi';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { Token } from './useTokenList';
import { useTokenPrice } from './useTokenPrice';
import { 
  SwapQuote, 
  calculateMinOutput, 
  calculatePriceImpact,
  estimateSwapGas 
} from '@/utils/quoteHelpers';
import { SpendSaveQuoterABI } from '@/contracts/abis/SpendSaveQuoter';
import { getContractAddress } from '@/contracts/addresses';

// Define PoolKey type
export interface PoolKey {
  currency0: Address;
  currency1: Address;
  fee: number;
  tickSpacing: number;
  hooks: Address;
}

// Type-safe wrapper for previewSavingsImpact function
async function getSavingsImpactQuote(
  publicClient: NonNullable<ReturnType<typeof usePublicClient>>,
  quoterAddress: Address,
  poolKey: PoolKey,
  zeroForOne: boolean,
  amountIn: bigint,
  savingsPercentage: number
): Promise<[bigint, bigint, bigint]> {
  // Use the raw contract call with proper typing
  const result = await publicClient.readContract({
    address: quoterAddress,
    abi: SpendSaveQuoterABI,
    functionName: 'previewSavingsImpact',
    args: [poolKey, zeroForOne, amountIn, BigInt(savingsPercentage * 100)],
  } as Parameters<typeof publicClient.readContract>[0]);
  
  return result as [bigint, bigint, bigint]; // [swapOutput, savedAmount, netOutput]
}

// Type-safe wrapper for getDCAQuote function (for DCA-specific quotes)
async function getDCAQuote(
  publicClient: NonNullable<ReturnType<typeof usePublicClient>>,
  quoterAddress: Address,
  poolKey: PoolKey,
  zeroForOne: boolean,
  amountIn: bigint
): Promise<[bigint, bigint]> {
  // Use the raw contract call with proper typing
  const result = await publicClient.readContract({
    address: quoterAddress,
    abi: SpendSaveQuoterABI,
    functionName: 'getDCAQuote',
    args: [poolKey, zeroForOne, amountIn],
  } as Parameters<typeof publicClient.readContract>[0]);
  
  return result as [bigint, bigint];
}

// Uniswap V4 fee tiers (basis points)
const FEE_TIERS = [500, 3000, 10000]; // 0.05%, 0.3%, 1%
const TICK_SPACINGS = [10, 60, 200]; // Corresponding tick spacings for each fee tier

interface UseSwapQuoteProps {
  inputToken: Token | null;
  outputToken: Token | null;
  swapAmount: bigint; // Amount after savings deduction
  savingsPercentage?: number; // Savings percentage (0-100)
  enabled?: boolean;
}

export function useSwapQuote({
  inputToken,
  outputToken,
  swapAmount,
  savingsPercentage = 0,
  enabled = true,
}: UseSwapQuoteProps) {
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  
  const publicClient = usePublicClient();
  const chainId = useActiveChainId();
  
  // Get token prices for price impact calculation
  const { priceUSD: inputPrice } = useTokenPrice({
    tokenAddress: inputToken?.address,
    enabled: !!inputToken,
  });
  
  const { priceUSD: outputPrice } = useTokenPrice({
    tokenAddress: outputToken?.address,
    enabled: !!outputToken,
  });
  
  const fetchQuote = useCallback(async () => {
    // Validation checks
    if (!enabled || !inputToken || !outputToken || swapAmount <= BigInt(0) || !publicClient) {
      setQuote(null);
      setIsLoading(false);
      return;
    }
    
    // Prevent same token swap
    if (inputToken.address.toLowerCase() === outputToken.address.toLowerCase()) {
      setError('Cannot swap same token');
      setQuote(null);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get SpendSaveQuoter address
      const quoterAddress = getContractAddress(chainId, 'Quoter');
      
      // Check if quoter is deployed
      if (!quoterAddress || quoterAddress === '0x0000000000000000000000000000000000000000') {
        const fallbackQuote = calculateFallbackQuote(
          swapAmount,
          inputToken,
          outputToken,
          inputPrice,
          outputPrice
        );
        setQuote(fallbackQuote);
        setLastFetchTime(Date.now());
        return;
      }
      
      // Get SpendSaveHook address for the pool key
      const hookAddress = getContractAddress(chainId, 'SpendSaveHook');
      
      // Determine token order (currency0 < currency1)
      const [currency0, currency1] = sortTokens(inputToken.address, outputToken.address);
      const zeroForOne = inputToken.address.toLowerCase() === currency0.toLowerCase();
      
      // Real SpendSaveQuoter integration
      let bestQuote: SwapQuote | null = null;
      let bestOutputAmount = BigInt(0);
      
      // Try different fee tiers to find best quote
      for (let i = 0; i < FEE_TIERS.length; i++) {
        const fee = FEE_TIERS[i];
        const tickSpacing = TICK_SPACINGS[i];
        
        try {
          const poolKey = {
            currency0,
            currency1,
            fee,
            tickSpacing,
            hooks: hookAddress,
          };
          
          // Use savings impact quote if savings percentage > 0, otherwise use DCA quote
          let amountOut: bigint;
          let gasEstimate: bigint;
          let savedAmount: bigint = BigInt(0);
          
          if (savingsPercentage > 0) {
            const [swapOutput, saved, netOutput] = await getSavingsImpactQuote(
              publicClient,
              quoterAddress,
              poolKey,
              zeroForOne,
              BigInt(swapAmount),
              savingsPercentage
            );
            amountOut = swapOutput; // Amount user receives from swap
            savedAmount = saved; // Amount saved
            gasEstimate = BigInt(0); // Gas estimate not available from this function
          } else {
            const [output, gas] = await getDCAQuote(
              publicClient,
              quoterAddress,
              poolKey,
              zeroForOne,
              BigInt(swapAmount)
            );
            amountOut = output;
            gasEstimate = gas;
          }
          
          if (amountOut > bestOutputAmount) {
            bestOutputAmount = amountOut;
            
            const priceImpact = calculatePriceImpact(
              swapAmount,
              amountOut,
              inputToken.decimals,
              outputToken.decimals,
              inputPrice,
              outputPrice
            );
            
            bestQuote = {
              outputAmount: amountOut,
              priceImpact,
              route: [inputToken.address, outputToken.address],
              fee: BigInt(fee),
              gas: gasEstimate,
              minOutputAmount: calculateMinOutput(amountOut, 50),
              savedAmount: savedAmount > BigInt(0) ? savedAmount : undefined,
            };
          }
        } catch (feeError) {
          console.warn(`No liquidity for fee tier ${fee}:`, feeError);
        }
      }
      
      if (bestQuote) {
        setQuote(bestQuote);
        setLastFetchTime(Date.now());
      } else {
        const fallbackQuote = calculateFallbackQuote(
          swapAmount,
          inputToken,
          outputToken,
          inputPrice,
          outputPrice
        );
        setQuote(fallbackQuote);
        setLastFetchTime(Date.now());
      }
      
    } catch (err) {
      console.error('Error fetching quote:', err);
      try {
        const fallbackQuote = calculateFallbackQuote(
          swapAmount,
          inputToken,
          outputToken,
          inputPrice,
          outputPrice
        );
        setQuote(fallbackQuote);
        setLastFetchTime(Date.now());
        setError(null);
      } catch (fallbackErr) {
        setError(err instanceof Error ? err.message : 'Failed to fetch quote');
        setQuote(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [inputToken, outputToken, swapAmount, enabled, publicClient, inputPrice, outputPrice, chainId]);
  
  // Debounced fetch on input change (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuote();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [fetchQuote]);
  
  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (!enabled || !quote) return;
    
    const interval = setInterval(() => {
      fetchQuote();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [enabled, quote, fetchQuote]);
  
  return {
    quote,
    isLoading,
    error,
    refetch: fetchQuote,
    lastFetchTime,
  };
}

/**
 * Sort token addresses (currency0 < currency1)
 */
function sortTokens(tokenA: Address, tokenB: Address): [Address, Address] {
  return tokenA.toLowerCase() < tokenB.toLowerCase() ? [tokenA, tokenB] : [tokenB, tokenA];
}

/**
 * Fallback quote calculation when Quoter is not available
 * Uses token prices to estimate output amount
 */
function calculateFallbackQuote(
  inputAmount: bigint,
  inputToken: Token,
  outputToken: Token,
  inputPrice: number,
  outputPrice: number
): SwapQuote {
  // Calculate based on USD values
  const inputValueUSD = (Number(inputAmount) / Math.pow(10, inputToken.decimals)) * inputPrice;
  const outputAmountFloat = inputValueUSD / outputPrice;
  const outputAmount = BigInt(Math.floor(outputAmountFloat * Math.pow(10, outputToken.decimals)));
  
  // Apply a 0.3% fee (Uniswap standard)
  const outputAfterFee = (outputAmount * BigInt(997)) / BigInt(1000);
  
  const priceImpact = calculatePriceImpact(
    inputAmount,
    outputAfterFee,
    inputToken.decimals,
    outputToken.decimals,
    inputPrice,
    outputPrice
  );
  
  return {
    outputAmount: outputAfterFee,
    priceImpact,
    route: [inputToken.address, outputToken.address],
    fee: BigInt(3000), // 0.3%
    gas: estimateSwapGas(false),
    minOutputAmount: calculateMinOutput(outputAfterFee, 50),
  };
}
