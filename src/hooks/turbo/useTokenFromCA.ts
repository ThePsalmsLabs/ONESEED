'use client';

import { useState, useCallback, useEffect } from 'react';
import { Address } from 'viem';
import { useTokenMetadata, TokenMetadata } from '@/hooks/useTokenMetadata';
import { validateAndNormalizeAddress, looksLikeERC20Address } from '@/utils/tokenValidation';
import { getCachedToken, cacheToken, CachedToken } from '@/utils/tokenCache';

export interface TokenFromCA {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  isCommon?: boolean;
}

export interface UseTokenFromCAResult {
  token: TokenFromCA | null;
  isLoading: boolean;
  error: string | null;
  fetchToken: (address: string) => Promise<void>;
  clearToken: () => void;
}

/**
 * Hook to fetch token metadata from contract address
 * Optimized for speed with caching
 */
export function useTokenFromCA(): UseTokenFromCAResult {
  const [address, setAddress] = useState<Address | null>(null);
  const [token, setToken] = useState<TokenFromCA | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { metadata, isLoading: isLoadingMetadata, error: metadataError } = useTokenMetadata(
    address as `0x${string}` | undefined
  );
  
  const fetchToken = useCallback(async (inputAddress: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      // Validate address
      const validAddress = validateAndNormalizeAddress(inputAddress);
      
      if (!validAddress) {
        throw new Error('Invalid address format');
      }
      
      if (!looksLikeERC20Address(validAddress)) {
        throw new Error('Address does not appear to be a valid ERC20 token');
      }
      
      // Check cache first
      const cached = getCachedToken(validAddress);
      if (cached) {
        setToken({
          address: cached.address,
          symbol: cached.symbol,
          name: cached.name,
          decimals: cached.decimals,
          logoURI: cached.logoURI,
          isCommon: false,
        });
        setIsLoading(false);
        return;
      }
      
      // If not cached, trigger metadata fetch
      setAddress(validAddress);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch token');
      setIsLoading(false);
      setToken(null);
    }
  }, []);
  
  // Handle metadata loading
  useEffect(() => {
    if (!address) return;
    
    if (metadataError) {
      setError('Failed to fetch token metadata from blockchain');
      setIsLoading(false);
      setToken(null);
      return;
    }
    
    if (metadata && !isLoadingMetadata) {
      const typedMetadata = metadata as TokenMetadata;
      const tokenData: TokenFromCA = {
        address: typedMetadata.address,
        symbol: typedMetadata.symbol,
        name: typedMetadata.name,
        decimals: typedMetadata.decimals,
        logoURI: typedMetadata.logoURI,
        isCommon: false,
      };
      
      setToken(tokenData);
      setIsLoading(false);
      
      // Cache the token
      cacheToken({
        address: typedMetadata.address,
        symbol: typedMetadata.symbol,
        name: typedMetadata.name,
        decimals: typedMetadata.decimals,
        logoURI: typedMetadata.logoURI,
      });
    }
  }, [metadata, isLoadingMetadata, metadataError, address]);
  
  const clearToken = useCallback(() => {
    setToken(null);
    setAddress(null);
    setError(null);
    setIsLoading(false);
  }, []);
  
  return {
    token,
    isLoading: isLoading || isLoadingMetadata,
    error,
    fetchToken,
    clearToken,
  };
}

