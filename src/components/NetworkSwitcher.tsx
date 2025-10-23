'use client';

import { useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CHAIN_IDS, 
  getNetworkDisplayName, 
  isSupportedChain,
  getCurrentNetworkConfig,
  isTestnet,
  isMainnet
} from '@/utils/network';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  ChevronDownIcon, 
  CheckIcon, 
  ExclamationTriangleIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface NetworkSwitcherProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
}

export function NetworkSwitcher({ 
  className = '', 
  showLabel = true,
  variant = 'default' 
}: NetworkSwitcherProps) {
  const { address, isConnected } = useAccount();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const chainId = useActiveChainId();
  const [isOpen, setIsOpen] = useState(false);

  const currentNetwork = getCurrentNetworkConfig();
  const isCurrentNetworkSupported = isSupportedChain(chainId);
  const isOnTestnet = isTestnet(chainId);
  const isOnMainnet = isMainnet(chainId);

  const networks = [
    {
      id: CHAIN_IDS.BASE_SEPOLIA,
      name: 'Base Sepolia',
      isTestnet: true,
      description: 'Test network for development'
    },
    {
      id: CHAIN_IDS.BASE_MAINNET,
      name: 'Base Mainnet',
      isTestnet: false,
      description: 'Production network'
    }
  ];

  const handleNetworkSwitch = async (targetChainId: number) => {
    if (targetChainId === chainId) {
      setIsOpen(false);
      return;
    }

    try {
      await switchChain({ chainId: targetChainId });
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  if (!isConnected) {
    return null;
  }

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`w-2 h-2 rounded-full ${
          isCurrentNetworkSupported 
            ? (isOnTestnet ? 'bg-yellow-500' : 'bg-green-500')
            : 'bg-red-500'
        }`} />
        <span className="text-sm font-medium">
          {getNetworkDisplayName(chainId)}
        </span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative ${className}`}
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            isCurrentNetworkSupported 
              ? (isOnTestnet ? 'bg-yellow-500' : 'bg-green-500')
              : 'bg-red-500'
          }`} />
          <span className="text-sm">
            {getNetworkDisplayName(chainId)}
          </span>
          <ChevronDownIcon className="w-4 h-4" />
        </div>
      </Button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${
            isCurrentNetworkSupported 
              ? (isOnTestnet ? 'bg-yellow-500' : 'bg-green-500')
              : 'bg-red-500'
          }`} />
          <div className="flex flex-col items-start">
            <span className="font-medium">
              {getNetworkDisplayName(chainId)}
            </span>
            {!isCurrentNetworkSupported && (
              <span className="text-xs text-red-500">
                Unsupported Network
              </span>
            )}
          </div>
        </div>
        <ChevronDownIcon className="w-5 h-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="p-2 space-y-1">
              {networks.map((network) => (
                <button
                  key={network.id}
                  onClick={() => handleNetworkSwitch(network.id)}
                  disabled={isSwitching}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    network.id === chainId
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      network.isTestnet ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{network.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {network.description}
                      </span>
                    </div>
                  </div>
                  {network.id === chainId && (
                    <CheckIcon className="w-5 h-5 text-primary" />
                  )}
                </button>
              ))}
              
              {!isCurrentNetworkSupported && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-600">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Unsupported Network
                    </span>
                  </div>
                  <p className="text-xs text-red-500 mt-1">
                    Please switch to Base Sepolia or Base Mainnet
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Network status indicator component
export function NetworkStatus({ className = '' }: { className?: string }) {
  const chainId = useActiveChainId();
  const isCurrentNetworkSupported = isSupportedChain(chainId);
  const isOnTestnet = isTestnet(chainId);
  const isOnMainnet = isMainnet(chainId);

  if (!isCurrentNetworkSupported) {
    return (
      <div className={`flex items-center gap-2 text-red-600 ${className}`}>
        <ExclamationTriangleIcon className="w-4 h-4" />
        <span className="text-sm font-medium">
          Unsupported Network
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${
        isOnTestnet ? 'bg-yellow-500' : 'bg-green-500'
      }`} />
      <span className="text-sm text-muted-foreground">
        {isOnTestnet ? 'Testnet' : 'Mainnet'}
      </span>
    </div>
  );
}

// Network warning component for unsupported networks
export function NetworkWarning({ className = '' }: { className?: string }) {
  const chainId = useActiveChainId();
  const isCurrentNetworkSupported = isSupportedChain(chainId);

  if (isCurrentNetworkSupported) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-center gap-3">
        <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
        <div>
          <h3 className="font-medium text-red-800">
            Unsupported Network
          </h3>
          <p className="text-sm text-red-600 mt-1">
            Please switch to Base Sepolia or Base Mainnet to use OneSeed
          </p>
        </div>
      </div>
    </motion.div>
  );
}
