'use client';

import { Token } from '@/hooks/swap/useTokenList';
import { useState } from 'react';
import { TokenSelector } from '@/components/Swap/TokenSelector';
import { useTokenBalance } from '@/hooks/swap/useTokenBalance';
import { useTokenPrice } from '@/hooks/swap/useTokenPrice';

interface TokenInputProps {
  label: string;
  token: Token | null;
  amount: string;
  onAmountChange: (amount: string) => void;
  onTokenSelect: (token: Token) => void;
}

export function TokenInput({
  label,
  token,
  amount,
  onAmountChange,
  onTokenSelect,
}: TokenInputProps) {
  const [showSelector, setShowSelector] = useState(false);
  
  // Fetch real balance
  const { formatted: balance, isLoading: isLoadingBalance } = useTokenBalance({
    tokenAddress: token?.address,
    decimals: token?.decimals,
  });
  
  // Fetch real price
  const { priceUSD, isLoading: isLoadingPrice } = useTokenPrice({
    tokenAddress: token?.address,
    enabled: !!token && !!amount && parseFloat(amount) > 0,
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      onAmountChange(value);
    }
  };

  const handleMaxClick = () => {
    if (balance) {
      onAmountChange(balance);
    }
  };
  
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
          {token && (
            <div className="flex items-center gap-2">
              {isLoadingBalance ? (
                <span className="text-xs text-gray-300">Loading...</span>
              ) : (
                <>
                  <span className="text-xs text-gray-300">
                    Balance: {parseFloat(balance).toFixed(token.decimals === 6 ? 2 : 4)}
                  </span>
                  {parseFloat(balance) > 0 && (
                    <button
                      onClick={handleMaxClick}
                      className="text-xs text-primary-400 hover:text-primary-300 font-medium transition-colors"
                    >
                      MAX
                    </button>
                  )}
                </>
              )}
            </div>
          )}
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

          {/* Amount Input */}
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
            className="flex-1 bg-transparent text-right text-2xl md:text-3xl font-bold text-white placeholder-gray-600 focus:outline-none"
          />
        </div>

        {/* USD Value */}
        {amount && parseFloat(amount) > 0 && (
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

