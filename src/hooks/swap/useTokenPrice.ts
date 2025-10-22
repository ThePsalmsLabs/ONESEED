'use client';

import { useState, useEffect } from 'react';
import { Address } from 'viem';
import { useChainId } from 'wagmi';

// Mock prices for testnet and initial development
const MOCK_PRICES: Record<string, number> = {
  // Base Sepolia test tokens
  '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913': 1.00,  // USDC
  '0x4200000000000000000000000000000000000006': 1800.00, // WETH
  '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb': 1.00,  // DAI
  '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA': 1.00,  // USDbC
  // Native ETH
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE': 1800.00,
  '0x0000000000000000000000000000000000000000': 1800.00,
};

interface UseTokenPriceProps {
  tokenAddress?: Address;
  enabled?: boolean;
}

export function useTokenPrice({ tokenAddress, enabled = true }: UseTokenPriceProps) {
  const chainId = useChainId();
  const [priceUSD, setPriceUSD] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isTestnet = chainId === 84532; // Base Sepolia
  
  useEffect(() => {
    if (!enabled || !tokenAddress) {
      setIsLoading(false);
      return;
    }
    
    const fetchPrice = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // For testnet, always use mock prices
        if (isTestnet) {
          const price = MOCK_PRICES[tokenAddress.toLowerCase()] || 1;
          setPriceUSD(price);
          setIsLoading(false);
          return;
        }
        
        // For mainnet: Attempt to fetch from CoinGecko API
        // Note: This is rate-limited on free tier (10-50 calls/min)
        try {
          const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/token_price/base?contract_addresses=${tokenAddress}&vs_currencies=usd`,
            { 
              headers: { 'Accept': 'application/json' },
              signal: AbortSignal.timeout(5000), // 5 second timeout
            }
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch price');
          }
          
          const data = await response.json();
          const price = data[tokenAddress.toLowerCase()]?.usd;
          
          if (price) {
            setPriceUSD(price);
          } else {
            // Fallback to mock price if not found
            setPriceUSD(MOCK_PRICES[tokenAddress.toLowerCase()] || 1);
          }
        } catch (apiError) {
          console.warn('CoinGecko API error, using mock price:', apiError);
          // Fallback to mock prices
          setPriceUSD(MOCK_PRICES[tokenAddress.toLowerCase()] || 1);
        }
      } catch (err) {
        console.error('Error fetching token price:', err);
        setError('Failed to fetch price');
        setPriceUSD(1); // Default fallback
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrice();
    
    // Refresh price every 30 seconds
    const interval = setInterval(fetchPrice, 30000);
    
    return () => clearInterval(interval);
  }, [tokenAddress, enabled, isTestnet]);
  
  return {
    priceUSD,
    isLoading,
    error,
  };
}

