'use client';

import { useState, useEffect, useCallback } from 'react';
import { Address, formatUnits } from 'viem';
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
import { UniswapV4QuoterABI } from '@/contracts/abis/UniswapV4Quoter';
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

// Use official UniswapV4Quoter for real market quotes
async function getUniswapV4Quote(
  publicClient: NonNullable<ReturnType<typeof usePublicClient>>,
  quoterAddress: Address,
  poolKey: PoolKey,
  zeroForOne: boolean,
  amountIn: bigint
): Promise<[bigint, bigint]> {
  console.log('🔍 Calling UniswapV4Quoter:', {
    quoterAddress,
    poolKey,
    zeroForOne,
    amountIn: amountIn.toString()
  });
  
  // Use the official UniswapV4Quoter for real market prices
  const result = await publicClient.readContract({
    address: quoterAddress,
    abi: UniswapV4QuoterABI,
    functionName: 'quoteExactInputSingle',
    args: [{
      poolKey,
      zeroForOne,
      exactAmount: amountIn,
      hookData: '0x' // Empty hook data for basic quotes
    }],
  } as Parameters<typeof publicClient.readContract>[0]);
  
  console.log('✅ UniswapV4Quoter result:', result);
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
      console.log('⚠️ Quote disabled:', {
        enabled,
        inputToken: !!inputToken,
        outputToken: !!outputToken,
        swapAmount: swapAmount?.toString(),
        publicClient: !!publicClient,
        reason: !enabled ? 'disabled' : !inputToken ? 'no input token' : !outputToken ? 'no output token' : swapAmount <= BigInt(0) ? 'swap amount <= 0' : 'no public client'
      });
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
      // Try UniswapV4Quoter first (official quoter for real market prices)
      const uniswapV4QuoterAddress = getContractAddress(chainId, 'UniswapV4Quoter');
      const spendSaveQuoterAddress = getContractAddress(chainId, 'Quoter');
      
    console.log('🔍 Quote process started:', {
      chainId,
      uniswapV4QuoterAddress,
      spendSaveQuoterAddress,
      inputToken: inputToken?.symbol,
      outputToken: outputToken?.symbol,
      swapAmount: swapAmount.toString(),
      swapAmountFormatted: swapAmount > BigInt(0) ? formatUnits(swapAmount, inputToken?.decimals || 18) : '0',
      savingsPercentage,
      inputPrice,
      outputPrice
    });
      
      // Check if UniswapV4Quoter is deployed
      if (!uniswapV4QuoterAddress || uniswapV4QuoterAddress === '0x0000000000000000000000000000000000000000') {
        console.log('⚠️ UniswapV4Quoter not deployed, using fallback calculation');
        const fallbackQuote = calculateFallbackQuote(
          swapAmount,
          inputToken,
          outputToken,
          inputPrice,
          outputPrice
        );
        console.log('📊 Fallback quote calculated:', {
          outputAmount: fallbackQuote.outputAmount.toString(),
          priceImpact: fallbackQuote.priceImpact,
          fee: fallbackQuote.fee.toString()
        });
        setQuote(fallbackQuote);
        setLastFetchTime(Date.now());
        return;
      }
      
      // Get SpendSaveHook address for the pool key
      const hookAddress = getContractAddress(chainId, 'SpendSaveHook');
      
      // Determine token order (currency0 < currency1)
      const [currency0, currency1] = sortTokens(inputToken.address, outputToken.address);
      const zeroForOne = inputToken.address.toLowerCase() === currency0.toLowerCase();
      
      console.log('🔍 Pool configuration:', {
        hookAddress,
        inputTokenAddress: inputToken.address,
        outputTokenAddress: outputToken.address,
        currency0,
        currency1,
        zeroForOne
      });
      
      // Try UniswapV4Quoter first for real market prices
      let bestQuote: SwapQuote | null = null;
      let bestOutputAmount = BigInt(0);
      
      // Try different fee tiers to find best quote using UniswapV4Quoter
      for (let i = 0; i < FEE_TIERS.length; i++) {
        const fee = FEE_TIERS[i];
        const tickSpacing = TICK_SPACINGS[i];
        
        try {
          const poolKey = {
            currency0,
            currency1,
            fee,
            tickSpacing,
            hooks: '0x0000000000000000000000000000000000000000' as `0x${string}`, // No hooks for basic quotes
          };
          
          console.log('🔍 Attempting UniswapV4Quoter quote:', {
            uniswapV4QuoterAddress,
            poolKey,
            zeroForOne,
            swapAmount: swapAmount.toString(),
            fee,
            tickSpacing
          });
          
          const [amountOut, gasEstimate] = await getUniswapV4Quote(
            publicClient,
            uniswapV4QuoterAddress,
            poolKey,
            zeroForOne,
            BigInt(swapAmount)
          );
          
          console.log('✅ UniswapV4Quoter quote successful:', {
            amountOut: amountOut.toString(),
            gasEstimate: gasEstimate.toString()
          });
          
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
            
            // Calculate savings amount if savings percentage > 0
            const savedAmount = savingsPercentage > 0 ? 
              (BigInt(swapAmount) * BigInt(savingsPercentage * 100)) / BigInt(10000) : 
              BigInt(0);
            
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
        } catch (uniswapQuoteError) {
          console.error(`❌ UniswapV4Quoter failed for fee ${fee}:`, {
            error: uniswapQuoteError,
            uniswapV4QuoterAddress,
            poolKey: {
              currency0,
              currency1,
              fee,
              tickSpacing,
              hooks: '0x0000000000000000000000000000000000000000' as `0x${string}`
            },
            zeroForOne,
            swapAmount: swapAmount.toString()
          });
        }
      }
      
      if (bestQuote) {
        console.log('✅ Best quote found:', {
          outputAmount: bestQuote.outputAmount.toString(),
          priceImpact: bestQuote.priceImpact,
          fee: bestQuote.fee.toString(),
          savedAmount: bestQuote.savedAmount?.toString()
        });
        setQuote(bestQuote);
        setLastFetchTime(Date.now());
      } else {
        console.log('⚠️ No quotes succeeded, using fallback calculation');
        const fallbackQuote = calculateFallbackQuote(
          swapAmount,
          inputToken,
          outputToken,
          inputPrice,
          outputPrice
        );
        console.log('📊 Final fallback quote:', {
          outputAmount: fallbackQuote.outputAmount.toString(),
          priceImpact: fallbackQuote.priceImpact,
          fee: fallbackQuote.fee.toString()
        });
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
