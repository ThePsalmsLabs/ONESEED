'use client';

import { useState, useEffect } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const BASE_SEPOLIA_CHAIN_ID = 84532;

interface NetworkAutoSwitchProps {
  onClose?: () => void;
  showCloseButton?: boolean;
}

export function NetworkAutoSwitch({ onClose, showCloseButton = true }: NetworkAutoSwitchProps) {
  const { address, isConnected } = useAccount();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const chainId = useActiveChainId();
  const [hasPrompted, setHasPrompted] = useState(false);
  const [isAddingNetwork, setIsAddingNetwork] = useState(false);

  const isOnBaseSepolia = chainId === BASE_SEPOLIA_CHAIN_ID;
  const isOnUnsupportedNetwork = isConnected && !isOnBaseSepolia;

  // Check if we've already prompted this session
  useEffect(() => {
    const hasPromptedKey = `network-prompted-${address}`;
    const prompted = localStorage.getItem(hasPromptedKey);
    setHasPrompted(!!prompted);
  }, [address]);

  // Auto-show modal when on wrong network
  useEffect(() => {
    if (isOnUnsupportedNetwork && !hasPrompted && isConnected) {
      // Don't auto-show if user dismissed it
      const dismissedKey = `network-dismissed-${address}`;
      const dismissed = localStorage.getItem(dismissedKey);
      if (!dismissed) {
        // Modal will be shown by parent component
      }
    }
  }, [isOnUnsupportedNetwork, hasPrompted, isConnected, address]);

  const handleSwitchToBaseSepolia = async () => {
    try {
      setIsAddingNetwork(false);
      await switchChain({ chainId: BASE_SEPOLIA_CHAIN_ID });
      
      // Mark as prompted
      const hasPromptedKey = `network-prompted-${address}`;
      localStorage.setItem(hasPromptedKey, 'true');
      setHasPrompted(true);
      
      onClose?.();
    } catch (error: any) {
      console.error('Failed to switch network:', error);
      
      // If network not added, try to add it
      if (error.code === 4902) {
        await handleAddBaseSepoliaNetwork();
      }
    }
  };

  const handleAddBaseSepoliaNetwork = async () => {
    try {
      setIsAddingNetwork(true);
      
      if (!window.ethereum) {
        throw new Error('No Ethereum provider found');
      }
      
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x14a34', // 84532 in hex
          chainName: 'Base Sepolia',
          nativeCurrency: { 
            name: 'ETH', 
            symbol: 'ETH', 
            decimals: 18 
          },
          rpcUrls: [
            'https://sepolia.base.org',
            'https://base-sepolia.g.alchemy.com/v2/demo',
            'https://base-sepolia.infura.io/v3/demo'
          ],
          blockExplorerUrls: ['https://sepolia.basescan.org']
        }]
      });
      
      // After adding, try to switch
      await handleSwitchToBaseSepolia();
    } catch (addError) {
      console.error('Failed to add network:', addError);
      setIsAddingNetwork(false);
    }
  };

  const handleDismiss = () => {
    const dismissedKey = `network-dismissed-${address}`;
    localStorage.setItem(dismissedKey, 'true');
    onClose?.();
  };

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 1: return 'Ethereum Mainnet';
      case 8453: return 'Base Mainnet';
      case 84532: return 'Base Sepolia';
      default: return `Chain ${chainId}`;
    }
  };

  if (!isConnected || isOnBaseSepolia) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <Card className="max-w-md w-full p-6 relative">
            {showCloseButton && (
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Wrong Network Detected
              </h2>
              
              <p className="text-gray-600">
                SpendSave is deployed on <strong>Base Sepolia</strong> for testing.
                <br />
                You&apos;re currently on <strong>{getNetworkName(chainId)}</strong>.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Why Base Sepolia?</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Full protocol testing environment</li>
                      <li>• Proven savings extraction (TX: 0x9b4c9f...)</li>
                      <li>• Free test tokens available</li>
                      <li>• Real-time savings verification</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSwitchToBaseSepolia}
                  disabled={isSwitching || isAddingNetwork}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
                >
                  {isSwitching ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                      Switching...
                    </>
                  ) : isAddingNetwork ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                      Adding Network...
                    </>
                  ) : (
                    'Switch to Base Sepolia'
                  )}
                </Button>
                
                <Button
                  onClick={handleDismiss}
                  variant="outline"
                  className="px-4"
                >
                  Cancel
                </Button>
              </div>

              <div className="text-center">
                <button
                  onClick={handleAddBaseSepoliaNetwork}
                  disabled={isSwitching || isAddingNetwork}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Network not in wallet? Add Base Sepolia
                </button>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook to check if network switch is needed
export function useNetworkSwitchNeeded() {
  const { isConnected } = useAccount();
  const chainId = useActiveChainId();
  
  return {
    needsSwitch: isConnected && chainId !== BASE_SEPOLIA_CHAIN_ID,
    isOnBaseSepolia: chainId === BASE_SEPOLIA_CHAIN_ID,
    isConnected
  };
}
