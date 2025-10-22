import { useMemo } from 'react';
import { Address } from 'viem';

export interface Token {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  isCommon?: boolean;
}

// Common tokens on Base
const COMMON_TOKENS: Token[] = [
  {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address,
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    isCommon: true,
  },
  {
    address: '0x4200000000000000000000000000000000000006' as Address,
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    isCommon: true,
  },
  {
    address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb' as Address,
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    isCommon: true,
  },
  {
    address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA' as Address,
    symbol: 'USDbC',
    name: 'USD Base Coin',
    decimals: 6,
    isCommon: true,
  },
];

export function useTokenList() {
  const tokens = useMemo(() => COMMON_TOKENS, []);
  
  const getTokenByAddress = (address: Address): Token | undefined => {
    return tokens.find(t => t.address.toLowerCase() === address.toLowerCase());
  };
  
  const getTokenBySymbol = (symbol: string): Token | undefined => {
    return tokens.find(t => t.symbol.toLowerCase() === symbol.toLowerCase());
  };

  return {
    tokens,
    commonTokens: tokens.filter(t => t.isCommon),
    getTokenByAddress,
    getTokenBySymbol,
  };
}

