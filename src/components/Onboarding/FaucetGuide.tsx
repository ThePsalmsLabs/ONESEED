'use client';

import { useState } from 'react';
import { useNeedsTestTokens } from '@/hooks/useBalanceCheck';
import { FAUCET_URLS } from '@/config/network';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NetworkDebugInfo } from '@/components/Debug/NetworkDebugInfo';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BanknotesIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface FaucetGuideProps {
  className?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export function FaucetGuide({ 
  className = '', 
  onClose, 
  showCloseButton = true 
}: FaucetGuideProps) {
  const { needsTokens, needsETH, needsUSDC, isReady, ethFormatted, usdcFormatted, isLoading } = useNeedsTestTokens();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Trigger a refetch of balances
    window.location.reload();
  };

  const handleFaucetClick = (url: string, token: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Don't show if user has sufficient tokens
  if (isReady && !isLoading) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="p-6 border-blue-200 bg-blue-50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <BanknotesIcon className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-blue-800">
                🚰 Need Test Tokens?
              </h3>
              <p className="text-sm text-blue-600">
                Get free test tokens to try SpendSave on Base Sepolia
              </p>
            </div>
          </div>
          
          {showCloseButton && onClose && (
            <button
              onClick={onClose}
              className="text-blue-400 hover:text-blue-600"
            >
              ✕
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 text-blue-600">
            <ArrowPathIcon className="w-4 h-4 animate-spin" />
            <span className="text-sm">Checking balances...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Current Balances */}
            <div className="bg-white/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-3">Current Balances:</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">ETH (for gas):</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${needsETH ? 'text-red-600' : 'text-green-600'}`}>
                      {ethFormatted} ETH
                    </span>
                    {needsETH ? (
                      <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                    ) : (
                      <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">USDC (to swap):</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${needsUSDC ? 'text-red-600' : 'text-green-600'}`}>
                      {usdcFormatted} USDC
                    </span>
                    {needsUSDC ? (
                      <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                    ) : (
                      <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Faucet Links */}
            <div className="space-y-3">
              {needsETH && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 font-bold">E</span>
                    </div>
                    <div>
                      <p className="font-medium text-yellow-800">Get ETH for Gas</p>
                      <p className="text-xs text-yellow-600">Need at least 0.001 ETH for transactions</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleFaucetClick(FAUCET_URLS.ETH, 'ETH')}
                    size="sm"
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    <ArrowTopRightOnSquareIcon className="w-4 h-4 mr-1" />
                    Get ETH
                  </Button>
                </div>
              )}

              {needsUSDC && (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">U</span>
                    </div>
                    <div>
                      <p className="font-medium text-green-800">Get USDC to Swap</p>
                      <p className="text-xs text-green-600">Need USDC to test savings extraction</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleFaucetClick(FAUCET_URLS.USDC, 'USDC')}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <ArrowTopRightOnSquareIcon className="w-4 h-4 mr-1" />
                    Get USDC
                  </Button>
                </div>
              )}
            </div>

            {/* Alternative Faucet */}
            <div className="text-center">
              <button
                onClick={() => handleFaucetClick(FAUCET_URLS.ALTERNATIVE, 'Both')}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Alternative: Alchemy Faucet (ETH + tokens)
              </button>
            </div>

            {/* Debug Info - Temporary for troubleshooting */}
            <div className="mt-4">
              <NetworkDebugInfo />
            </div>

            {/* Refresh Button */}
            <div className="flex justify-center pt-2">
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                {isRefreshing ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <ArrowPathIcon className="w-4 h-4 mr-2" />
                    Check Balance
                  </>
                )}
              </Button>
            </div>

            {/* Success Message */}
            {isReady && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircleIcon className="w-5 h-5" />
                  <span className="font-medium">Ready to test SpendSave!</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  You have sufficient test tokens to start swapping and saving.
                </p>
              </motion.div>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
}

// Compact version for smaller spaces
export function FaucetGuideCompact({ className = '' }: { className?: string }) {
  const { needsTokens, needsETH, needsUSDC } = useNeedsTestTokens();

  if (!needsTokens) {
    return null;
  }

  return (
    <div className={`text-sm ${className}`}>
      <div className="flex items-center gap-2 text-yellow-600">
        <BanknotesIcon className="w-4 h-4" />
        <span>
          Need test tokens? 
          {needsETH && <span className="ml-1">Get ETH for gas</span>}
          {needsUSDC && <span className="ml-1">Get USDC to swap</span>}
        </span>
      </div>
    </div>
  );
}
