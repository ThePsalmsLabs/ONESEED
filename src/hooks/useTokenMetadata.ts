'use client';

import { useQuery } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';
import { parseAbiItem } from 'viem';

export interface TokenMetadata {
  address: `0x${string}`;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

// Common Base network tokens
const KNOWN_TOKENS: Record<string, TokenMetadata> = {
  '0x4200000000000000000000000000000000000006': {
    address: '0x4200000000000000000000000000000000000006',
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    logoURI: 'https://ethereum-optimism.github.io/data/WETH/logo.png'
  },
  '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913': {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://ethereum-optimism.github.io/data/USDC/logo.png'
  },
  '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb': {
    address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    logoURI: 'https://ethereum-optimism.github.io/data/DAI/logo.png'
  },
  '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA': {
    address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
    symbol: 'USDbC',
    name: 'USD Base Coin',
    decimals: 6,
    logoURI: 'https://ethereum-optimism.github.io/data/USDC/logo.png'
  },
  '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22': {
    address: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',
    symbol: 'cbETH',
    name: 'Coinbase Wrapped Staked ETH',
    decimals: 18,
    logoURI: 'https://ethereum-optimism.github.io/data/cbETH/logo.png'
  }
};

export function useTokenMetadata(tokenAddress?: `0x${string}`) {
  const publicClient = usePublicClient();

  const getMetadata = useQuery({
    queryKey: ['tokenMetadata', tokenAddress],
    queryFn: async (): Promise<TokenMetadata | null> => {
      if (!tokenAddress || !publicClient) return null;

      // Check if token is in known list
      const knownToken = KNOWN_TOKENS[tokenAddress.toLowerCase()];
      if (knownToken) return knownToken;

      try {
        // Try to fetch from contract (ERC20 standard)
        const [symbol, name, decimals] = await Promise.all([
          publicClient.readContract({
            address: tokenAddress,
            abi: [parseAbiItem('function symbol() view returns (string)')],
            functionName: 'symbol'
          }).catch(() => 'UNKNOWN'),
          publicClient.readContract({
            address: tokenAddress,
            abi: [parseAbiItem('function name() view returns (string)')],
            functionName: 'name'
          }).catch(() => 'Unknown Token'),
          publicClient.readContract({
            address: tokenAddress,
            abi: [parseAbiItem('function decimals() view returns (uint8)')],
            functionName: 'decimals'
          }).catch(() => 18)
        ]);

        return {
          address: tokenAddress,
          symbol: symbol as string,
          name: name as string,
          decimals: decimals as number
        };
      } catch (error) {
        console.error('Error fetching token metadata:', error);
        // Return basic metadata
        return {
          address: tokenAddress,
          symbol: 'UNKNOWN',
          name: 'Unknown Token',
          decimals: 18
        };
      }
    },
    enabled: !!tokenAddress && !!publicClient,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - token metadata doesn't change
    gcTime: 1000 * 60 * 60 * 24 * 7 // Cache for 7 days
  });

  return {
    metadata: getMetadata.data,
    isLoading: getMetadata.isLoading,
    error: getMetadata.error
  };
}

// Hook to get multiple token metadata at once
export function useTokenMetadataBatch(tokenAddresses: `0x${string}`[]) {
  const publicClient = usePublicClient();

  const getMetadataBatch = useQuery({
    queryKey: ['tokenMetadataBatch', tokenAddresses.join(',')],
    queryFn: async (): Promise<Record<string, TokenMetadata>> => {
      if (!tokenAddresses.length || !publicClient) return {};

      const metadataMap: Record<string, TokenMetadata> = {};

      await Promise.all(
        tokenAddresses.map(async (address) => {
          // Check known tokens first
          const knownToken = KNOWN_TOKENS[address.toLowerCase()];
          if (knownToken) {
            metadataMap[address] = knownToken;
            return;
          }

          try {
            const [symbol, name, decimals] = await Promise.all([
              publicClient.readContract({
                address,
                abi: [parseAbiItem('function symbol() view returns (string)')],
                functionName: 'symbol'
              }).catch(() => 'UNKNOWN'),
              publicClient.readContract({
                address,
                abi: [parseAbiItem('function name() view returns (string)')],
                functionName: 'name'
              }).catch(() => 'Unknown Token'),
              publicClient.readContract({
                address,
                abi: [parseAbiItem('function decimals() view returns (uint8)')],
                functionName: 'decimals'
              }).catch(() => 18)
            ]);

            metadataMap[address] = {
              address,
              symbol: symbol as string,
              name: name as string,
              decimals: decimals as number
            };
          } catch (error) {
            console.error(`Error fetching metadata for ${address}:`, error);
            metadataMap[address] = {
              address,
              symbol: 'UNKNOWN',
              name: 'Unknown Token',
              decimals: 18
            };
          }
        })
      );

      return metadataMap;
    },
    enabled: tokenAddresses.length > 0 && !!publicClient,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7 // 7 days
  });

  return {
    metadata: getMetadataBatch.data || {},
    isLoading: getMetadataBatch.isLoading,
    error: getMetadataBatch.error
  };
}
