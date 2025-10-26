'use client';

import { useState, useEffect } from 'react';
import { Address } from 'viem';
import { useActiveChainId } from '@/hooks/useActiveChainId';

interface UseTokenPriceProps {
  tokenAddress?: Address;
  amount?: bigint; // Optional amount to get value for, defaults to 1 unit
  enabled?: boolean;
}

export function useTokenPrice({ tokenAddress, amount, enabled = true }: UseTokenPriceProps) {
  const chainId = useActiveChainId();
  
  const [priceUSD, setPriceUSD] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!enabled || !tokenAddress) {
      setPriceUSD(0);
      setIsLoading(false);
      return;
    }
    
    const fetchPrice = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // For stablecoins, return 1.00
        const isStablecoin = tokenAddress && (
          tokenAddress.toLowerCase() === '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' || // USDC
          tokenAddress.toLowerCase() === '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca' || // USDbC
          tokenAddress.toLowerCase() === '0x50c5725949a6f0c72e6c4a641f24049a917db0cb'    // DAI
        );
        
        if (isStablecoin) {
          setPriceUSD(1.00);
          setIsLoading(false);
          return;
        }
        
        // For other tokens, use a simple fallback
        // In production, this would integrate with real price feeds
        setPriceUSD(1.00); // Placeholder
        setIsLoading(false);
        
      } catch (err: any) {
        console.error('Error fetching token price:', err);
        setError(err.message || 'Failed to fetch price');
        setPriceUSD(0);
        setIsLoading(false);
      }
    };
    
    fetchPrice();
    // Refresh price every 30 seconds
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, [tokenAddress, amount, enabled]);
  
  return {
    priceUSD,
    isLoading,
    error,
  };
}