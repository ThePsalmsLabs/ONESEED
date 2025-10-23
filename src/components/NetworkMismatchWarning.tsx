'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNetworkMismatch } from '@/hooks/useActiveChainId';
import { Button } from '@/components/ui/Button';

interface NetworkMismatchWarningProps {
  className?: string;
  onDismiss?: () => void;
}

export function NetworkMismatchWarning({ 
  className = '', 
  onDismiss 
}: NetworkMismatchWarningProps) {
  const { isMismatch, envNetworkName, walletNetworkName } = useNetworkMismatch();

  if (!isMismatch) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`bg-amber-50 border border-amber-200 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-amber-800 mb-1">
              Network Mismatch Detected
            </h3>
            <p className="text-sm text-amber-700 mb-3">
              Your wallet is connected to <strong>{walletNetworkName}</strong>, but this app is configured for <strong>{envNetworkName}</strong>. 
              All transactions will use {envNetworkName}, but you may want to switch your wallet for the best experience.
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://docs.base.org/using-base/network-faucets', '_blank')}
                className="text-amber-700 border-amber-300 hover:bg-amber-100"
              >
                Get Testnet Tokens
              </Button>
              {onDismiss && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDismiss}
                  className="text-amber-600 hover:bg-amber-100"
                >
                  Dismiss
                </Button>
              )}
            </div>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-amber-400 hover:text-amber-600 transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Persistent banner version that shows at the top of the app
export function NetworkMismatchBanner() {
  const { isMismatch, envNetworkName, walletNetworkName } = useNetworkMismatch();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isMismatch || isDismissed) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Network Mismatch: Wallet on {walletNetworkName}, App configured for {envNetworkName}
              </p>
              <p className="text-xs text-amber-700">
                All transactions will use {envNetworkName}. Switch your wallet for optimal experience.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-amber-400 hover:text-amber-600 transition-colors p-1"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
