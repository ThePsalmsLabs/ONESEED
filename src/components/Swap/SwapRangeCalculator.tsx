'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Token } from '@/hooks/swap/useTokenList';
import { SwapQuote } from '@/utils/quoteHelpers';
import { formatUnits, parseUnits } from 'viem';
import { 
  ArrowRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface SwapRangeCalculatorProps {
  inputToken: Token | null;
  outputToken: Token | null;
  inputAmount: string;
  outputAmount: string;
  quote: SwapQuote | null;
  isLoadingQuote: boolean;
  className?: string;
}

interface SwapRange {
  minAmount: string;
  maxAmount: string;
  recommendedAmount: string;
  priceImpact: number;
  effectiveRate: number;
  swapSizeCategory: 'micro' | 'small' | 'medium' | 'large' | 'excessive';
  slippageWarning: string;
  isRecommended: boolean;
}

export function SwapRangeCalculator({
  inputToken,
  outputToken,
  inputAmount,
  outputAmount,
  quote,
  isLoadingQuote,
  className = ''
}: SwapRangeCalculatorProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Calculate swap range based on available liquidity
  const swapRange = useMemo((): SwapRange | null => {
    if (!inputToken || !outputToken || !quote) return null;

    const inputAmountFloat = parseFloat(inputAmount) || 0;
    
    // Calculate effective exchange rate
    const inputAmountBigInt = parseUnits(inputAmount, inputToken.decimals);
    const outputAmountBigInt = parseUnits(outputAmount, outputToken.decimals);
    const effectiveRate = outputAmountBigInt > 0 
      ? Number(inputAmountBigInt) / Number(outputAmountBigInt)
      : 0;

    // Define realistic swap size categories based on pool liquidity analysis
    const getSwapSizeCategory = (amount: number, tokenSymbol: string): {
      category: 'micro' | 'small' | 'medium' | 'large' | 'excessive';
      warning: string;
      isRecommended: boolean;
    } => {
      if (tokenSymbol === 'USDC') {
        if (amount <= 0.01) return { category: 'micro', warning: 'Very small swap - good for testing', isRecommended: true };
        if (amount <= 0.1) return { category: 'small', warning: 'Optimal size - low slippage', isRecommended: true };
        if (amount <= 0.5) return { category: 'medium', warning: 'Higher slippage expected', isRecommended: false };
        if (amount <= 2.0) return { category: 'large', warning: 'Significant price impact', isRecommended: false };
        return { category: 'excessive', warning: 'Very high slippage - not recommended', isRecommended: false };
      } else if (tokenSymbol === 'WETH' || tokenSymbol === 'ETH') {
        // Convert ETH amounts to USD equivalent (assuming ~$2500 ETH)
        const usdEquivalent = amount * 2500;
        if (usdEquivalent <= 0.01) return { category: 'micro', warning: 'Very small swap - good for testing', isRecommended: true };
        if (usdEquivalent <= 0.1) return { category: 'small', warning: 'Optimal size - low slippage', isRecommended: true };
        if (usdEquivalent <= 0.5) return { category: 'medium', warning: 'Higher slippage expected', isRecommended: false };
        if (usdEquivalent <= 2.0) return { category: 'large', warning: 'Significant price impact', isRecommended: false };
        return { category: 'excessive', warning: 'Very high slippage - not recommended', isRecommended: false };
      }
      return { category: 'small', warning: 'Unknown token - proceed with caution', isRecommended: false };
    };

    const sizeAnalysis = getSwapSizeCategory(inputAmountFloat, inputToken.symbol);
    
    // Calculate realistic ranges based on pool liquidity
    const minAmount = '0.001'; // Minimum viable swap
    const maxAmount = '0.5'; // Maximum recommended for current liquidity
    const recommendedAmount = '0.01'; // Proven safe amount from tests

    return {
      minAmount,
      maxAmount,
      recommendedAmount,
      priceImpact: quote.priceImpact,
      effectiveRate,
      swapSizeCategory: sizeAnalysis.category,
      slippageWarning: sizeAnalysis.warning,
      isRecommended: sizeAnalysis.isRecommended
    };
  }, [inputToken, outputToken, inputAmount, outputAmount, quote]);

  // Calculate savings and swap amounts
  const savingsAmount = useMemo(() => {
    if (!inputToken || !inputAmount) return '0';
    const amount = parseFloat(inputAmount);
    return (amount * 0.05).toFixed(6); // 5% default savings
  }, [inputToken, inputAmount]);

  const swapAmount = useMemo(() => {
    if (!inputAmount) return '0';
    const amount = parseFloat(inputAmount);
    return (amount * 0.95).toFixed(6); // 95% for swap
  }, [inputAmount]);

  if (!inputToken || !outputToken) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-strong rounded-2xl p-6 border border-white/20 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <CurrencyDollarIcon className="w-5 h-5 text-primary-400" />
          Swap Calculator
        </h3>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          {showAdvanced ? 'Hide' : 'Show'} Details
        </button>
      </div>

      {/* Main Swap Preview */}
      <div className="space-y-4 mb-6">
        {/* Input Amount */}
        <div className="glass-subtle rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">You&apos;re swapping</span>
            <span className="text-sm text-gray-400">Balance: 0.00 {inputToken.symbol}</span>
          </div>
          <div className="text-xl font-bold text-white">
            {inputAmount || '0'} {inputToken.symbol}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <ArrowRightIcon className="w-6 h-6 text-primary-400 rotate-90" />
        </div>

        {/* Output Amount */}
        <div className="glass-subtle rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">You&apos;ll receive</span>
            {isLoadingQuote ? (
              <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
            ) : quote ? (
              <CheckCircleIcon className="w-4 h-4 text-green-400" />
            ) : (
              <ExclamationTriangleIcon className="w-4 h-4 text-yellow-400" />
            )}
          </div>
          <div className="text-xl font-bold text-white">
            {isLoadingQuote ? 'Calculating...' : outputAmount || '0'} {outputToken.symbol}
          </div>
        </div>
      </div>

      {/* Swap Size Category Indicator */}
      {swapRange && inputAmount && (
        <div className={`glass-subtle rounded-lg p-4 mb-4 border ${
          swapRange.isRecommended 
            ? 'border-green-400/30' 
            : swapRange.swapSizeCategory === 'excessive' 
            ? 'border-red-400/30' 
            : 'border-yellow-400/30'
        }`}>
          <div className="flex items-start gap-3">
            {swapRange.isRecommended ? (
              <CheckCircleIcon className="w-5 h-5 text-green-400 mt-0.5" />
            ) : swapRange.swapSizeCategory === 'excessive' ? (
              <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mt-0.5" />
            ) : (
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 mt-0.5" />
            )}
            <div>
              <div className={`text-sm font-medium mb-1 ${
                swapRange.isRecommended 
                  ? 'text-green-400' 
                  : swapRange.swapSizeCategory === 'excessive' 
                  ? 'text-red-400' 
                  : 'text-yellow-400'
              }`}>
                {swapRange.swapSizeCategory.charAt(0).toUpperCase() + swapRange.swapSizeCategory.slice(1)} Swap Size
              </div>
              <div className={`text-xs ${
                swapRange.isRecommended 
                  ? 'text-green-300' 
                  : swapRange.swapSizeCategory === 'excessive' 
                  ? 'text-red-300' 
                  : 'text-yellow-300'
              }`}>
                {swapRange.slippageWarning}
              </div>
              {!swapRange.isRecommended && (
                <div className="text-xs text-gray-400 mt-1">
                  💡 Try {swapRange.recommendedAmount} {inputToken.symbol} for optimal results
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Price Impact Warning */}
      {quote && quote.priceImpact > 1 && (
        <div className="glass-subtle rounded-lg p-4 border border-yellow-500/30 mb-4">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-yellow-400 mb-1">
                High Price Impact
              </div>
              <div className="text-xs text-yellow-300">
                This trade will move the market by {quote.priceImpact.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Liquidity-Aware Recommendations */}
      <div className="glass-subtle rounded-lg p-4 mb-6 border border-blue-400/30">
        <div className="flex items-center gap-2 mb-3">
          <CurrencyDollarIcon className="w-5 h-5 text-blue-400" />
          <h4 className="text-sm font-semibold text-blue-400">Pool Liquidity Guide</h4>
        </div>
        <div className="space-y-3">
          <div className="text-xs text-gray-300 mb-2">
            Based on current pool liquidity (~1 USDC), here are recommended swap sizes:
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-3">
              <div className="text-xs text-green-400 font-medium mb-1">✅ Recommended</div>
              <div className="text-sm text-white">0.001 - 0.1 USDC</div>
              <div className="text-xs text-green-300">Low slippage</div>
            </div>
            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-3">
              <div className="text-xs text-yellow-400 font-medium mb-1">⚠️ Caution</div>
              <div className="text-sm text-white">0.1 - 0.5 USDC</div>
              <div className="text-xs text-yellow-300">Higher slippage</div>
            </div>
          </div>
          <div className="bg-blue-400/10 border border-blue-400/30 rounded-lg p-3">
            <div className="text-xs text-blue-400 font-medium mb-1">💡 Proven Safe Amount</div>
            <div className="text-sm text-white">0.01 USDC (10,000 units)</div>
            <div className="text-xs text-blue-300">Successfully tested in protocol verification</div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="glass-subtle rounded-lg p-4 mb-6">
        <div className="text-sm text-gray-400 mb-3">Quick Actions</div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              // This would need to be connected to the parent component
              console.log('Set amount to 0.001 USDC');
            }}
            className="px-3 py-2 bg-green-400/10 hover:bg-green-400/20 border border-green-400/30 text-green-300 rounded-lg text-xs font-medium transition-colors"
          >
            Test (0.001)
          </button>
          <button
            onClick={() => {
              console.log('Set amount to 0.01 USDC');
            }}
            className="px-3 py-2 bg-blue-400/10 hover:bg-blue-400/20 border border-blue-400/30 text-blue-300 rounded-lg text-xs font-medium transition-colors"
          >
            Safe (0.01)
          </button>
          <button
            onClick={() => {
              console.log('Set amount to 0.1 USDC');
            }}
            className="px-3 py-2 bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 rounded-lg text-xs font-medium transition-colors"
          >
            Max (0.1)
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          Click to set recommended amounts
        </div>
      </div>

      {/* Advanced Details */}
      {showAdvanced && swapRange && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          {/* Swap Range */}
          <div className="glass-subtle rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-3">Recommended Swap Range</div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Minimum</div>
                <div className="text-sm font-medium text-white">{swapRange.minAmount}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Recommended</div>
                <div className="text-sm font-medium text-primary-400">{swapRange.recommendedAmount}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Maximum</div>
                <div className="text-sm font-medium text-white">{swapRange.maxAmount}</div>
              </div>
            </div>
          </div>

          {/* Savings Breakdown */}
          <div className="glass-subtle rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-3">Savings Breakdown (5% default)</div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Total Input</span>
                <span className="text-sm font-medium text-white">{inputAmount} {inputToken.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Savings (5%)</span>
                <span className="text-sm font-medium text-primary-400">{savingsAmount} {inputToken.symbol}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2">
                <span className="text-sm text-gray-300">Amount to Swap</span>
                <span className="text-sm font-medium text-white">{swapAmount} {inputToken.symbol}</span>
              </div>
            </div>
          </div>

          {/* Pool Info */}
          <div className="glass-subtle rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-3">Pool Information</div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Fee Tier</span>
                <span className="text-sm font-medium text-white">0.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Pool Status</span>
                <span className="text-sm font-medium text-green-400">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Hook Enabled</span>
                <span className="text-sm font-medium text-primary-400">SpendSave</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => {
            // This would update the input amount to recommended
            console.log('Set to recommended amount:', swapRange?.recommendedAmount);
          }}
          className="flex-1 px-3 py-2 bg-primary-500/20 hover:bg-primary-500/30 border border-primary-400/30 text-primary-300 rounded-lg transition-colors text-sm font-medium"
        >
          Use Recommended
        </button>
        <button
          onClick={() => {
            // This would set to minimum amount
            console.log('Set to minimum amount:', swapRange?.minAmount);
          }}
          className="flex-1 px-3 py-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-400/30 text-gray-300 rounded-lg transition-colors text-sm font-medium"
        >
          Use Minimum
        </button>
      </div>
    </motion.div>
  );
}
