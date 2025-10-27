'use client';

import { Token } from '@/hooks/swap/useTokenList';
import { useState } from 'react';
import { TokenSelector } from '@/components/Swap/TokenSelector';
import { useTokenPrice } from '@/hooks/swap/useTokenPrice';

interface TokenOutputProps {
  label: string;
  token: Token | null;
  amount: string;
  onTokenSelect: (token: Token) => void;
  isLoading?: boolean;
}

export function TokenOutput({
  label,
  token,
  amount,
  onTokenSelect,
  isLoading = false,
}: TokenOutputProps) {
  const [showSelector, setShowSelector] = useState(false);
  
  // Fetch real price
  const { priceUSD, isLoading: isLoadingPrice } = useTokenPrice({
    tokenAddress: token?.address,
    enabled: !!token && !!amount && parseFloat(amount) > 0,
  });
  
  // Calculate USD value
  const usdValue = amount && parseFloat(amount) > 0 ? parseFloat(amount) * priceUSD : 0;
  
  // Format USD value with appropriate precision
  const formatUSDValue = (value: number) => {
    if (value >= 1) return value.toFixed(2);
    if (value >= 0.01) return value.toFixed(4);
    if (value >= 0.001) return value.toFixed(6);
    return value.toFixed(8);
  };

  return (
    <>
      <div className="glass-subtle rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-400">{label}</label>
        </div>

        <div className="flex items-center gap-3">
          {/* Token Selector Button */}
          <button
            onClick={() => setShowSelector(true)}
            className="flex items-center gap-2 px-3 py-2 glass-medium hover:glass-strong rounded-xl transition-all duration-200 hover-lift"
          >
            {token ? (
              <>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-accent-cyan flex items-center justify-center text-sm font-bold">
                  {token.symbol.charAt(0)}
                </div>
                <span className="font-semibold text-white">{token.symbol}</span>
              </>
            ) : (
              <span className="text-gray-400">Select token</span>
            )}
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Amount Display */}
          <div className="flex-1 text-right">
            {isLoading ? (
              <div className="inline-flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-lg text-gray-300">Loading...</span>
              </div>
            ) : amount && parseFloat(amount) > 0 ? (
              <div className="text-2xl md:text-3xl font-bold text-white">
                ≈ {parseFloat(amount).toFixed(6)}
              </div>
            ) : (
              <div className="text-2xl md:text-3xl font-bold text-gray-600">
                0.00
              </div>
            )}
          </div>
        </div>

        {/* USD Value */}
        {amount && parseFloat(amount) > 0 && !isLoading && (
          <div className="text-right text-sm text-gray-300 mt-2">
            {isLoadingPrice ? (
              <span>Loading price...</span>
            ) : (
              <span>≈ ${formatUSDValue(usdValue)} USD</span>
            )}
          </div>
        )}
      </div>

      {/* Token Selector Modal */}
      {showSelector && (
        <TokenSelector
          onSelect={(selected) => {
            onTokenSelect(selected);
            setShowSelector(false);
          }}
          onClose={() => setShowSelector(false)}
          selectedToken={token}
        />
      )}
    </>
  );
}

