'use client';

import { Address } from 'viem';
import { useEnhancedTokenData, EnhancedTokenData } from '@/hooks/turbo/useEnhancedTokenData';
import { formatAddress } from '@/utils/tokenValidation';

interface TokenInfoCardProps {
  tokenAddress: Address;
  tokenSymbol: string;
}

export function TokenInfoCard({ tokenAddress, tokenSymbol }: TokenInfoCardProps) {
  const { data: enhancedData, isLoading } = useEnhancedTokenData(tokenAddress);
  
  if (isLoading) {
    return (
      <div className="glass-subtle rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-white/10 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-white/10 rounded w-1/3"></div>
      </div>
    );
  }
  
  if (!enhancedData) {
    return null;
  }
  
  // Type assertion to ensure we have the correct type
  const data = enhancedData as EnhancedTokenData;
  const priceChangePositive = (data.priceChange24h ?? 0) >= 0;
  
  return (
    <div className="glass-subtle rounded-xl p-4 space-y-3">
      {/* Price Info */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-white">
            ${(data.priceUSD ?? 0).toFixed((data.priceUSD ?? 0) < 0.01 ? 6 : 4)}
          </div>
          <div className="text-xs text-gray-400">
            {formatAddress(tokenAddress)}
          </div>
        </div>
        <div className={`text-lg font-semibold ${priceChangePositive ? 'text-green-400' : 'text-red-400'}`}>
          {priceChangePositive ? '+' : ''}{(data.priceChange24h ?? 0).toFixed(2)}%
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {data.volume24h !== undefined && (
          <div>
            <div className="text-xs text-gray-400">24h Volume</div>
            <div className="text-sm font-semibold text-white">
              ${((data.volume24h ?? 0) / 1000).toFixed(1)}K
            </div>
          </div>
        )}
        
        {data.liquidity !== undefined && (
          <div>
            <div className="text-xs text-gray-400">Liquidity</div>
            <div className="text-sm font-semibold text-white">
              ${((data.liquidity ?? 0) / 1000).toFixed(1)}K
            </div>
          </div>
        )}
        
        {data.marketCap !== undefined && (data.marketCap ?? 0) > 0 && (
          <div>
            <div className="text-xs text-gray-400">Market Cap</div>
            <div className="text-sm font-semibold text-white">
              ${(data.marketCap ?? 0) > 1000000
                ? `${((data.marketCap ?? 0) / 1000000).toFixed(2)}M`
                : `${((data.marketCap ?? 0) / 1000).toFixed(1)}K`
              }
            </div>
          </div>
        )}
      </div>
      
      {/* Warnings */}
      {data.liquidity !== undefined && (data.liquidity ?? 0) < 10000 && (
        <div className="flex items-start gap-2 p-2 glass-subtle rounded-lg border border-yellow-500/30">
          <svg className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-xs font-medium text-yellow-400">Low Liquidity</p>
            <p className="text-xs text-yellow-400/70">High slippage expected</p>
          </div>
        </div>
      )}
    </div>
  );
}
