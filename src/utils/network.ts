import { base, baseSepolia } from 'viem/chains';

export const SUPPORTED_CHAINS = {
  base: base,
  baseSepolia: baseSepolia
} as const;

export const CHAIN_IDS = {
  BASE_MAINNET: 8453,
  BASE_SEPOLIA: 84532
} as const;

export type SupportedChain = keyof typeof SUPPORTED_CHAINS;
export type SupportedChainId = typeof CHAIN_IDS[keyof typeof CHAIN_IDS];

export const DEFAULT_CHAIN_ID = CHAIN_IDS.BASE_SEPOLIA; // Default to testnet
export const PRODUCTION_CHAIN_ID = CHAIN_IDS.BASE_MAINNET;

// Environment-based chain selection
export function getDefaultChainId(): SupportedChainId {
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction ? PRODUCTION_CHAIN_ID : DEFAULT_CHAIN_ID;
}

// Chain ID to chain name mapping
export function getChainName(chainId: number): SupportedChain | null {
  switch (chainId) {
    case CHAIN_IDS.BASE_MAINNET:
      return 'base';
    case CHAIN_IDS.BASE_SEPOLIA:
      return 'baseSepolia';
    default:
      return null;
  }
}

// Chain name to chain ID mapping
export function getChainId(chainName: SupportedChain): SupportedChainId {
  switch (chainName) {
    case 'base':
      return CHAIN_IDS.BASE_MAINNET;
    case 'baseSepolia':
      return CHAIN_IDS.BASE_SEPOLIA;
    default:
      return DEFAULT_CHAIN_ID;
  }
}

// Check if chain is supported
export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return Object.values(CHAIN_IDS).includes(chainId as SupportedChainId);
}

// Get chain info
export function getChainInfo(chainId: number) {
  const chainName = getChainName(chainId);
  if (!chainName) return null;
  
  const chain = SUPPORTED_CHAINS[chainName];
  return {
    id: chain.id,
    name: chain.name,
    network: chain.network,
    nativeCurrency: chain.nativeCurrency,
    rpcUrls: chain.rpcUrls,
    blockExplorers: chain.blockExplorers,
    testnet: chain.testnet
  };
}

// Network switching utilities
export function getNetworkSwitchParams(targetChainId: SupportedChainId) {
  const chainInfo = getChainInfo(targetChainId);
  if (!chainInfo) return null;
  
  return {
    chainId: `0x${targetChainId.toString(16)}`,
    chainName: chainInfo.name,
    rpcUrls: [chainInfo.rpcUrls.default.http[0]],
    nativeCurrency: chainInfo.nativeCurrency,
    blockExplorerUrls: chainInfo.blockExplorers ? [chainInfo.blockExplorers.default.url] : undefined
  };
}

// Environment variables for network configuration
export const NETWORK_CONFIG = {
  baseMainnet: {
    chainId: CHAIN_IDS.BASE_MAINNET,
    name: 'Base Mainnet',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
    isTestnet: false
  },
  baseSepolia: {
    chainId: CHAIN_IDS.BASE_SEPOLIA,
    name: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
    blockExplorer: 'https://sepolia.basescan.org',
    isTestnet: true
  }
} as const;

// Get current network configuration
export function getCurrentNetworkConfig() {
  const defaultChainId = getDefaultChainId();
  return defaultChainId === CHAIN_IDS.BASE_MAINNET 
    ? NETWORK_CONFIG.baseMainnet 
    : NETWORK_CONFIG.baseSepolia;
}

// Network validation
export function validateNetwork(chainId: number): boolean {
  return isSupportedChain(chainId);
}

// Get network display name
export function getNetworkDisplayName(chainId: number): string {
  const chainInfo = getChainInfo(chainId);
  return chainInfo?.name || 'Unknown Network';
}

// Check if network is testnet
export function isTestnet(chainId: number): boolean {
  return chainId === CHAIN_IDS.BASE_SEPOLIA;
}

// Check if network is mainnet
export function isMainnet(chainId: number): boolean {
  return chainId === CHAIN_IDS.BASE_MAINNET;
}
