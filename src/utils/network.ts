import { base, baseSepolia } from 'viem/chains';
import {
  getActiveChainId,
  getActiveNetworkConfig,
  isSupportedChainId as isSupportedChainIdFromConfig,
  getNetworkFromChainId,
  CHAIN_IDS as CONFIG_CHAIN_IDS,
  getPreferredNetwork,
  isPreferredNetwork,
  getBaseSepoliaConfig,
  SupportedNetwork
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
    network: chain.name,
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

// Strict network validation with error details
export function validateNetworkStrict(chainId: number): {
  isValid: boolean;
  isSupported: boolean;
  networkName: string;
  error?: string;
} {
  const supportedChains = [CHAIN_IDS.BASE_MAINNET, CHAIN_IDS.BASE_SEPOLIA];
  
  if (supportedChains.includes(chainId as SupportedChainId)) {
    const networkName = chainId === CHAIN_IDS.BASE_MAINNET ? 'Base Mainnet' : 'Base Sepolia';
    return {
      isValid: true,
      isSupported: true,
      networkName
    };
  }
  
  if (chainId === 31337) {
    return {
      isValid: false,
      isSupported: false,
      networkName: 'Localhost',
      error: 'Localhost is not supported. Please switch to Base Sepolia or Base Mainnet.'
    };
  }
  
  return {
    isValid: false,
    isSupported: false,
    networkName: `Chain ${chainId}`,
    error: `Chain ${chainId} is not supported. Please switch to Base Sepolia (${CHAIN_IDS.BASE_SEPOLIA}) or Base Mainnet (${CHAIN_IDS.BASE_MAINNET}).`
  };
}

// Auto-reject unsupported networks
export function rejectUnsupportedNetwork(chainId: number): void {
  const validation = validateNetworkStrict(chainId);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Unsupported network');
  }
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

// Get preferred network for testing (Base Sepolia)
export function getPreferredNetworkForTesting(): SupportedNetwork {
  return getPreferredNetwork();
}

// Check if chain ID is the preferred testing network
export function isPreferredTestingNetwork(chainId: number): boolean {
  return isPreferredNetwork(chainId);
}

// Get Base Sepolia configuration
export function getBaseSepoliaNetworkConfig() {
  return getBaseSepoliaConfig();
}
