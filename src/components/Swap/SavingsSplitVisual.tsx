'use client';

import { Token } from '@/hooks/swap/useTokenList';
import { SwapQuote } from '@/utils/quoteHelpers';
import { formatUnits } from 'viem';

interface SavingsSplit {
  savingsAmount: bigint;
  swapAmount: bigint;
  savingsUSD: number;
  swapUSD: number;
  percentage: number;
}

interface SavingsSplitVisualProps {
  inputAmount: string;
  inputToken: Token | null;
  savingsSplit: SavingsSplit;
  outputToken: Token | null;
  outputAmount: string;
  quote: SwapQuote | null;
}

export function SavingsSplitVisual({
  inputAmount,
  inputToken,
  savingsSplit,
  outputToken,
  outputAmount,
  quote,
}: SavingsSplitVisualProps) {
  const swapPercentage = 100 - savingsSplit.percentage;

  if (!inputToken) return null;

  const swapAmountFormatted = formatUnits(savingsSplit.swapAmount, inputToken.decimals);
  const savingsAmountFormatted = formatUnits(savingsSplit.savingsAmount, inputToken.decimals);
  
  // Show price impact warning if available
  const showPriceImpactWarning = quote && quote.priceImpact > 0.5;

  return (
    <div className="glass-strong rounded-2xl p-6 border border-white/20">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">💫</span>
        <h3 className="text-white font-bold text-lg">OneSeed Magic</h3>
      </div>

      <div className="space-y-4">
        {/* Input Summary */}
        <div className="text-center pb-4 border-b border-white/10">
          <div className="text-sm text-gray-400 mb-1">Your Input</div>
          <div className="text-2xl font-bold text-white">
            {parseFloat(inputAmount).toFixed(4)} {inputToken.symbol}
          </div>
          <div className="text-sm text-gray-500">
            ≈ ${(savingsSplit.swapUSD + savingsSplit.savingsUSD).toFixed(2)}
          </div>
        </div>

        {/* Swap Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔄</span>
              <span className="text-gray-300">To Swap</span>
            </div>
            <span className="text-accent-blue font-semibold">{swapPercentage}%</span>
          </div>
          
          <div className="relative h-12 glass-subtle rounded-xl overflow-hidden border border-accent-blue/30">
            <div
              className="absolute inset-0 bg-gradient-to-r from-accent-blue to-accent-cyan transition-all duration-500"
              style={{ width: `${swapPercentage}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <span className="text-sm font-bold text-white z-10">
                {parseFloat(swapAmountFormatted).toFixed(4)} {inputToken.symbol}
              </span>
              {outputToken && outputAmount && (
                <span className="text-sm font-bold text-white z-10">
                  → ~{parseFloat(outputAmount).toFixed(4)} {outputToken.symbol}
                </span>
              )}
            </div>
          </div>
          
          <div className="text-xs text-gray-500 text-right">
            ≈ ${savingsSplit.swapUSD.toFixed(2)}
          </div>
        </div>

        {/* Savings Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌱</span>
              <span className="text-gray-300">To Savings</span>
            </div>
            <span className="text-primary-400 font-semibold">{savingsSplit.percentage}%</span>
          </div>
          
          <div className="relative h-12 glass-subtle rounded-xl overflow-hidden border border-primary-400/30">
            <div
              className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
              style={{ width: `${savingsSplit.percentage * 5}%` }} // Scale to fill visual space
            />
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <span className="text-sm font-bold text-white z-10">
                {parseFloat(savingsAmountFormatted).toFixed(4)} {inputToken.symbol}
              </span>
              <span className="text-sm font-bold text-white z-10">
                → Vault 🌱
              </span>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 text-right">
            ≈ ${savingsSplit.savingsUSD.toFixed(2)}
          </div>
        </div>

        {/* Price Impact Info */}
        {quote && showPriceImpactWarning && (
          <div className="glass-subtle rounded-lg p-3 border border-yellow-500/30">
            <div className="flex items-center gap-2 text-yellow-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-xs">Price impact: {quote.priceImpact.toFixed(2)}%</span>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="pt-4 border-t border-white/10">
          <div className="glass-neon rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">✨</div>
              <div className="flex-1">
                <div className="text-white font-semibold mb-1">
                  You receive
                </div>
                <div className="space-y-1 text-sm">
                  {outputToken && outputAmount && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Swapped tokens:</span>
                      <span className="text-white font-semibold">
                        ~{parseFloat(outputAmount).toFixed(4)} {outputToken.symbol}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Savings deposited:</span>
                    <span className="text-primary-400 font-semibold">
                      +${savingsSplit.savingsUSD.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

