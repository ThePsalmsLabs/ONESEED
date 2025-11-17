'use client';

import { useChainId as useWagmiChainId } from 'wagmi';
import { getActiveChainId, getActiveNetwork, getNetworkDisplayName } from '@/config/network';
import { useEffect, useState } from 'react';

/**
 * Hook that returns the wallet's current chain ID
 * This ensures balance checks and contract calls use the wallet's actual network
 * For Base Sepolia testing, we want to use the wallet's current network, not env config
 *
 * @returns {number} The wallet's current chain ID
 */
export function useActiveChainId(): number {
  const envChainId = getActiveChainId();
  const walletChainId = useWagmiChainId();
  const [hasWarned, setHasWarned] = useState(false);

  // For Base Sepolia testing, prioritize wallet's actual network
  const activeChainId = walletChainId || envChainId;

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
        `  Using wallet's network: ${walletNetworkName}.\n` +
        `  Please switch your wallet to ${envNetworkName} for optimal experience.`
      );
      setHasWarned(true);
    }
  }, [walletChainId, envChainId, hasWarned]);

  console.log('🔍 useActiveChainId Debug:', {
    walletChainId,
    envChainId,
    activeChainId,
    isWalletConnected: !!walletChainId
  });

  return activeChainId;
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
