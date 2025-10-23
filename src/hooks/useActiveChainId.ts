'use client';

import { useChainId as useWagmiChainId } from 'wagmi';
import { getActiveChainId, getActiveNetwork, getNetworkDisplayName } from '@/config/network';
import { useEffect, useState } from 'react';

/**
 * Hook that returns the chain ID from environment configuration
 * This ensures all contract interactions use the configured network
 * regardless of which network the user's wallet is connected to.
 *
 * @returns {number} The active chain ID from NEXT_PUBLIC_NETWORK env var
 */
export function useActiveChainId(): number {
  const envChainId = getActiveChainId();
  const walletChainId = useWagmiChainId();
  const [hasWarned, setHasWarned] = useState(false);

  useEffect(() => {
    // Warn if wallet is connected to different network than configured
    if (walletChainId && walletChainId !== envChainId && !hasWarned) {
      const envNetwork = getActiveNetwork();
      const envNetworkName = getNetworkDisplayName(envNetwork);
      const walletNetworkName = walletChainId === 8453 ? 'Base Mainnet' :
                                walletChainId === 84532 ? 'Base Sepolia' :
                                `Chain ${walletChainId}`;

      console.warn(
        `⚠️ Network Mismatch:\n` +
        `  App configured for: ${envNetworkName} (${envChainId})\n` +
        `  Wallet connected to: ${walletNetworkName} (${walletChainId})\n` +
        `  All transactions will use ${envNetworkName}.\n` +
        `  Please switch your wallet to ${envNetworkName} for optimal experience.`
      );
      setHasWarned(true);
    }
  }, [walletChainId, envChainId, hasWarned]);

  return envChainId;
}

/**
 * Hook that returns network mismatch information
 * Useful for displaying warnings to the user
 */
export function useNetworkMismatch() {
  const envChainId = getActiveChainId();
  const walletChainId = useWagmiChainId();
  const envNetwork = getActiveNetwork();

  const isMismatch = walletChainId !== undefined && walletChainId !== envChainId;

  return {
    isMismatch,
    envChainId,
    walletChainId,
    envNetwork,
    envNetworkName: getNetworkDisplayName(envNetwork),
    walletNetworkName: walletChainId === 8453 ? 'Base Mainnet' :
                       walletChainId === 84532 ? 'Base Sepolia' :
                       walletChainId ? `Chain ${walletChainId}` : 'Not Connected',
  };
}
