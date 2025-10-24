'use client';

import { useQuery } from '@tanstack/react-query';
import { Address } from 'viem';

export interface EnhancedTokenData {
  priceUSD: number;
  priceChange24h: number;
  volume24h?: number;
  marketCap?: number;
  liquidity?: number;
  holders?: number;
  verified?: boolean;
}

/**
 * Hook to fetch enhanced token data from external APIs
 * Uses DexScreener for Base chain tokens
 */
export function useEnhancedTokenData(tokenAddress?: Address) {
  return useQuery({
    queryKey: ['enhancedTokenData', tokenAddress],
    queryFn: async (): Promise<EnhancedTokenData | null> => {
      if (!tokenAddress) return null;
      
      try {
        // Try DexScreener API for Base chain
        const response = await fetch(
          `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch token data');
        }
        
        const data = await response.json();
        
        // Find the pair with highest liquidity on Base
        const basePairs = data.pairs?.filter((pair: any) => 
          pair.chainId === 'base' || pair.chainId === 'base-sepolia'
        );
        
        if (!basePairs || basePairs.length === 0) {
          return null;
        }
        
        // Get the most liquid pair
        const mainPair = basePairs.sort((a: any, b: any) => 
          (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
        )[0];
        
        return {
          priceUSD: parseFloat(mainPair.priceUsd || '0'),
          priceChange24h: parseFloat(mainPair.priceChange?.h24 || '0'),
          volume24h: parseFloat(mainPair.volume?.h24 || '0'),
          liquidity: parseFloat(mainPair.liquidity?.usd || '0'),
          marketCap: parseFloat(mainPair.fdv || '0'),
          // Note: holder count not available from DexScreener
        };
      } catch (error) {
        console.error('Error fetching enhanced token data:', error);
        return null;
      }
    },
    enabled: !!tokenAddress,
    staleTime: 30000, // 30 seconds
    cacheTime: 60000, // 1 minute
  });
}

