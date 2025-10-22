// Contract constants matching Solidity contracts

export const PERCENTAGE_DENOMINATOR = 10000; // 10000 = 100%
export const TREASURY_FEE_DENOMINATOR = 10000;
export const EARLY_WITHDRAWAL_PENALTY = 1000; // 10%

export const MAX_SAVINGS_PERCENTAGE = 10000; // 100%
export const DEFAULT_SLIPPAGE_TOLERANCE = 50; // 0.5%

// Token decimals for common tokens
export const TOKEN_DECIMALS: Record<string, number> = {
  ETH: 18,
  WETH: 18,
  USDC: 6,
  USDT: 6,
  DAI: 18,
};

// Deprecated: Use centralized network config from @/config/network
// Network configurations
export const SUPPORTED_CHAINS = {
  BASE_SEPOLIA: 84532,
  BASE: 8453,
  LOCALHOST: 31337,
} as const;

export const CHAIN_NAMES: Record<number, string> = {
  84532: 'Base Sepolia',
  8453: 'Base',
  31337: 'Localhost',
};

// Deprecation notice
console.warn(
  'SUPPORTED_CHAINS and CHAIN_NAMES from @/utils/constants are deprecated. ' +
  'Use the centralized network configuration from @/config/network instead.'
);

