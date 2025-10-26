'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { SwapStatus } from '@/hooks/swap/useSwapExecution';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { Button } from '@/components/ui/Button';
import { getBlockExplorerUrl, getNetworkFromChainId } from '@/config/network';

interface SwapStatusModalProps {
  isOpen: boolean;
  status: SwapStatus;
  txHash: string | null;
  userOpHash?: string | null;
  error: string | null;
  savingsAmount?: bigint;
  tokenSymbol?: string;
  tokenDecimals?: number;
  onClose: () => void;
}

interface StatusStep {
  key: SwapStatus;
  label: string;
  icon: string;
  description: string;
}

const STATUS_STEPS: StatusStep[] = [
  {
    key: 'checking_approval',
    label: 'Checking Approval',
    icon: '🔍',
    description: 'Verifying token allowance',
  },
  {
    key: 'approving',
    label: 'Approving Token',
    icon: '✅',
    description: 'Granting permission to swap',
  },
  {
    key: 'building',
    label: 'Building Transaction',
    icon: '🔨',
    description: 'Preparing your swap with savings',
  },
  {
    key: 'executing',
    label: 'Executing Swap',
    icon: '⚡',
    description: 'Processing gasless transaction',
  },
  {
    key: 'confirming',
    label: 'Confirming',
    icon: '⏳',
    description: 'Waiting for blockchain confirmation',
  },
  {
    key: 'success',
    label: 'Complete!',
    icon: '🎉',
    description: 'Swap successful, savings captured',
  },
];

export function SwapStatusModal({
  isOpen,
  status,
  txHash,
  userOpHash,
  error,
  savingsAmount,
  tokenSymbol,
  tokenDecimals = 18,
  onClose,
}: SwapStatusModalProps) {
  const chainId = useActiveChainId();
  
  const currentStepIndex = STATUS_STEPS.findIndex((step) => step.key === status);
  
  // Get explorer URL based on chainId
  const getExplorerUrl = (chainId?: number) => {
    if (!chainId) return 'https://basescan.org';
    
    const network = getNetworkFromChainId(chainId);
    return network ? getBlockExplorerUrl(network) : 'https://basescan.org';
  };
  
  const explorerUrl = txHash ? `${getExplorerUrl(chainId)}/tx/${txHash}` : null;
  
  const isComplete = status === 'success';
  const hasError = status === 'error';
  
  // Debug logging
  console.log('🔍 SwapStatusModal props:', {
    status,
    savingsAmount: savingsAmount?.toString(),
    tokenSymbol,
    tokenDecimals,
    isComplete,
    hasError,
    isZero: savingsAmount === BigInt(0),
    isUndefined: savingsAmount === undefined,
  });
  
  // Calculate formatted amount for debugging
  const formattedAmount = savingsAmount !== undefined 
    ? (Number(savingsAmount) / Math.pow(10, tokenDecimals)).toFixed(6)
    : 'undefined';
  
  console.log('🧮 Savings amount calculation:', {
    rawAmount: savingsAmount?.toString(),
    tokenDecimals,
    formattedAmount,
    isRealValue: savingsAmount !== undefined && savingsAmount > BigInt(0),
  });
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={isComplete || hasError ? onClose : undefined}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-strong rounded-3xl p-8 max-w-lg w-full border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {hasError ? 'Transaction Failed' : isComplete ? 'Swap Complete!' : 'Processing Swap'}
                </h2>
                {(isComplete || hasError) && (
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors p-2"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                )}
              </div>

              {/* Error State */}
              {hasError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <ExclamationCircleIcon className="w-8 h-8 text-red-400" />
                    <div className="text-xl font-bold text-red-400">Error</div>
                  </div>
                  <p className="text-gray-300">{error || 'Transaction failed. Please try again.'}</p>
                </div>
              )}

              {/* Success State with Savings */}
              {isComplete && savingsAmount !== undefined && savingsAmount > BigInt(0) && (
                <div className="glass-neon rounded-xl p-6 mb-6 border border-primary-400/30">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircleIcon className="w-8 h-8 text-primary-400" />
                    <div className="text-xl font-bold text-white">Swap Successful!</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Savings Captured</div>
                    <div className="text-3xl font-bold text-primary-400">
                      {(Number(savingsAmount) / Math.pow(10, tokenDecimals)).toFixed(4)} {tokenSymbol || 'tokens'}
                    </div>
                    {/* Debug info - remove in production */}
                    <div className="text-xs text-gray-500 mt-1">
                      Raw: {savingsAmount.toString()} | Decimals: {tokenDecimals} | 
                      Calculation: {savingsAmount.toString()} ÷ 10^{tokenDecimals} = {(Number(savingsAmount) / Math.pow(10, tokenDecimals)).toFixed(6)}
                    </div>
                    <div className="text-xs text-gray-300 mt-2">
                      Automatically deposited to your savings vault
                    </div>
                  </div>
                </div>
              )}

              {/* No Savings Captured */}
              {isComplete && (savingsAmount === undefined || savingsAmount === BigInt(0)) && (
                <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircleIcon className="w-8 h-8 text-green-400" />
                    <div className="text-xl font-bold text-white">Swap Successful!</div>
                  </div>
                  <div className="text-sm text-gray-400">
                    No savings were captured in this transaction. This could be because:
                    <ul className="mt-2 ml-4 list-disc text-xs">
                      <li>Savings percentage was set to 0%</li>
                      <li>Savings strategy not configured</li>
                      <li>Amount too small to capture savings</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Progress Steps */}
              {!hasError && !isComplete && (
                <div className="space-y-3 mb-6">
                  {STATUS_STEPS.map((step, index) => {
                    const isActive = index === currentStepIndex;
                    const isCompleted = index < currentStepIndex;
                    const isPending = index > currentStepIndex;
                    
                    return (
                      <motion.div
                        key={step.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-primary-500/20 border border-primary-400/30'
                            : isCompleted
                            ? 'bg-white/5 border border-white/10'
                            : 'bg-white/5 border border-transparent opacity-50'
                        }`}
                      >
                        <div className="text-3xl">
                          {isCompleted ? '✓' : step.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-white">{step.label}</div>
                          <div className="text-sm text-gray-400">{step.description}</div>
                        </div>
                        {isActive && (
                          <div className="w-5 h-5 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Transaction Details */}
              {(txHash || userOpHash) && (
                <div className="mb-6 space-y-3">
                  {/* UserOp Hash */}
                  {userOpHash && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="text-xs text-gray-400 mb-2">UserOp Hash (Biconomy)</div>
                      <div className="font-mono text-sm text-gray-300 break-all">{userOpHash}</div>
                      <a 
                        href={`${getExplorerUrl(chainId)}/tx/${userOpHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-400 hover:text-primary-300 mt-2 inline-block"
                      >
                        View UserOp →
                      </a>
                    </div>
                  )}
                  
                  {/* Transaction Hash */}
                  {txHash && txHash !== userOpHash && (
                    <div className="bg-white/5 rounded-xl p-4 border border-primary-400/30">
                      <div className="text-xs text-gray-400 mb-2">Transaction Hash</div>
                      <div className="font-mono text-sm text-white break-all">{txHash}</div>
                      <a 
                        href={`${getExplorerUrl(chainId)}/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-400 hover:text-primary-300 mt-2 inline-block"
                      >
                        View on Block Explorer →
                      </a>
                    </div>
                  )}
                  
                  {/* Loading state for transaction hash */}
                  {userOpHash && !txHash && status === 'confirming' && (
                    <div className="text-xs text-gray-400 text-center">
                      Waiting for blockchain transaction hash...
                    </div>
                  )}
                </div>
              )}

              {/* Legacy Explorer Link (fallback) */}
              {explorerUrl && !userOpHash && !txHash && (
                <div className="mb-6">
                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-gray-300 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20"
                  >
                    <span>View on {getExplorerUrl(chainId)?.includes('basescan') ? 'BaseScan' : 'Explorer'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              {(isComplete || hasError) && (
                <Button
                  onClick={onClose}
                  variant="primary"
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary-500 to-accent-cyan hover:from-primary-600 hover:to-accent-cyan/90"
                >
                  {hasError ? 'Try Again' : 'Close'}
                </Button>
              )}

              {/* Processing Note */}
              {!isComplete && !hasError && (
                <div className="text-center text-sm text-gray-300">
                  Please don&apos;t close this window while the transaction is processing
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

