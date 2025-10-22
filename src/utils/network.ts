import { base, baseSepolia } from 'viem/chains';
import { 
  getActiveNetwork, 
  getActiveChainId, 
  getActiveChain,
  getActiveNetworkConfig,
  isSupportedChainId as isSupportedChainIdFromConfig,
  getNetworkFromChainId,
  CHAIN_IDS as CONFIG_CHAIN_IDS
} from '@/config/network';

// Re-export from centralized config for backward compatibility
export const SUPPORTED_CHAINS = {
  base: base,
  baseSepolia: baseSepolia
} as const;

export const CHAIN_IDS = CONFIG_CHAIN_IDS;

export type SupportedChain = keyof typeof SUPPORTED_CHAINS;
export type SupportedChainId = typeof CHAIN_IDS[keyof typeof CHAIN_IDS];

// Deprecated: Use getActiveChainId() from network config instead
export function getDefaultChainId(): SupportedChainId {
  console.warn('getDefaultChainId() is deprecated. Use getActiveChainId() from @/config/network instead.');
  return getActiveChainId();
}

// Chain ID to chain name mapping
export function getChainName(chainId: number): SupportedChain | null {
  const network = getNetworkFromChainId(chainId);
  if (!network) return null;
  
  switch (network) {
    case 'base':
      return 'base';
    case 'base-sepolia':
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
      return getActiveChainId();
  }
}

// Check if chain is supported
export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return isSupportedChainIdFromConfig(chainId);
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
  return getActiveNetworkConfig();
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
