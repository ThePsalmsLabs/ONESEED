import { base, baseSepolia } from 'viem/chains';

// Supported networks
export type SupportedNetwork = 'base' | 'base-sepolia';

// Chain IDs
export const CHAIN_IDS = {
  BASE_MAINNET: 8453,
  BASE_SEPOLIA: 84532,
} as const;

export type SupportedChainId = typeof CHAIN_IDS[keyof typeof CHAIN_IDS];

// Network to chain mapping
export const NETWORK_TO_CHAIN = {
  'base': base,
  'base-sepolia': baseSepolia,
} as const;

export const NETWORK_TO_CHAIN_ID = {
  'base': CHAIN_IDS.BASE_MAINNET,
  'base-sepolia': CHAIN_IDS.BASE_SEPOLIA,
} as const;

// Default RPC URLs (fallback)
const DEFAULT_RPC_URLS = {
  'base': 'https://mainnet.base.org',
  'base-sepolia': 'https://sepolia.base.org',
} as const;

/**
 * Get the active network from environment variables
 */
export function getActiveNetwork(): SupportedNetwork {
  const network = process.env.NEXT_PUBLIC_NETWORK;
  
  if (!network) {
    throw new Error(
      'NEXT_PUBLIC_NETWORK environment variable is required. ' +
      'Set it to either "base" or "base-sepolia" in your .env file.'
    );
  }
  
  if (network !== 'base' && network !== 'base-sepolia') {
    throw new Error(
      `Invalid NEXT_PUBLIC_NETWORK value: "${network}". ` +
      'Must be either "base" or "base-sepolia".'
    );
  }
  
  return network;
}

/**
 * Get the active chain ID from environment variables
 */
export function getActiveChainId(): SupportedChainId {
  const network = getActiveNetwork();
  return NETWORK_TO_CHAIN_ID[network];
}

/**
 * Get the active chain object from environment variables
 */
export function getActiveChain() {
  const network = getActiveNetwork();
  return NETWORK_TO_CHAIN[network];
}

/**
 * Get RPC URL for a specific network, with environment variable override
 */
export function getRPCUrl(network: SupportedNetwork): string {
  const envVar = network === 'base' 
    ? 'NEXT_PUBLIC_BASE_RPC_URL' 
    : 'NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL';
  
  return process.env[envVar] || DEFAULT_RPC_URLS[network];
}

/**
 * Get the active RPC URL from environment variables
 */
export function getActiveRPCUrl(): string {
  const network = getActiveNetwork();
  return getRPCUrl(network);
}

/**
 * Validate network configuration
 */
export function validateNetworkConfig(): void {
  try {
    getActiveNetwork();
    getActiveChainId();
    getActiveChain();
    getActiveRPCUrl();
  } catch (error) {
    throw new Error(
      `Network configuration validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Check if a chain ID is supported
 */
export function isSupportedChainId(chainId: number): chainId is SupportedChainId {
  return Object.values(CHAIN_IDS).includes(chainId as SupportedChainId);
}

/**
 * Get network name from chain ID
 */
export function getNetworkFromChainId(chainId: number): SupportedNetwork | null {
  switch (chainId) {
    case CHAIN_IDS.BASE_MAINNET:
      return 'base';
    case CHAIN_IDS.BASE_SEPOLIA:
      return 'base-sepolia';
    default:
      return null;
  }
}

/**
 * Check if current network is testnet
 */
export function isTestnet(): boolean {
  return getActiveNetwork() === 'base-sepolia';
}

/**
 * Check if current network is mainnet
 */
export function isMainnet(): boolean {
  return getActiveNetwork() === 'base';
}

/**
 * Get network display name
 */
export function getNetworkDisplayName(network?: SupportedNetwork): string {
  const activeNetwork = network || getActiveNetwork();
  return activeNetwork === 'base' ? 'Base Mainnet' : 'Base Sepolia';
}

/**
 * Get block explorer URL for a network
 */
export function getBlockExplorerUrl(network?: SupportedNetwork): string {
  const activeNetwork = network || getActiveNetwork();
  return activeNetwork === 'base' 
    ? 'https://basescan.org' 
    : 'https://sepolia.basescan.org';
}

/**
 * Get all supported networks (for UI components)
 */
export function getSupportedNetworks(): Array<{
  id: SupportedChainId;
  name: string;
  network: SupportedNetwork;
  isTestnet: boolean;
  rpcUrl: string;
  blockExplorer: string;
}> {
  return [
    {
      id: CHAIN_IDS.BASE_MAINNET,
      name: 'Base Mainnet',
      network: 'base',
      isTestnet: false,
      rpcUrl: getRPCUrl('base'),
      blockExplorer: getBlockExplorerUrl('base'),
    },
    {
      id: CHAIN_IDS.BASE_SEPOLIA,
      name: 'Base Sepolia',
      network: 'base-sepolia',
      isTestnet: true,
      rpcUrl: getRPCUrl('base-sepolia'),
      blockExplorer: getBlockExplorerUrl('base-sepolia'),
    },
  ];
}

/**
 * Get network configuration for the active network
 */
export function getActiveNetworkConfig() {
  const network = getActiveNetwork();
  const chainId = getActiveChainId();
  const chain = getActiveChain();
  const rpcUrl = getActiveRPCUrl();
  
  return {
    network,
    chainId,
    chain,
    rpcUrl,
    blockExplorer: getBlockExplorerUrl(network),
    isTestnet: isTestnet(),
    isMainnet: isMainnet(),
    displayName: getNetworkDisplayName(network),
  };
}
