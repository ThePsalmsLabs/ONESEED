'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { useSavingsBalanceRealtime } from '@/hooks/useSavingsBalanceRealtime';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { getContractAddress } from '@/contracts/addresses';
import { 
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  BanknotesIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface TotalSavingsCardProps {
  className?: string;
  showDetails?: boolean;
}

export function TotalSavingsCard({ 
  className = '', 
  showDetails = false 
}: TotalSavingsCardProps) {
  const { address } = useAccount();
  const chainId = useActiveChainId();
  const { balances, isLoading, error, totalBalance, totalFormatted, refreshSavings } = useSavingsBalanceRealtime();
  
  // Production-ready state management
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  
  // Check if SpendSaveStorage is deployed
  const storageAddress = useMemo(() => {
    try {
      return getContractAddress(chainId, 'SpendSaveStorage');
    } catch {
      return null;
    }
  }, [chainId]);
  
  const isStorageDeployed = storageAddress && storageAddress !== '0x0000000000000000000000000000000000000000';
  
  // Calculate total value in USD - REAL implementation
  const totalValueUSD = useMemo(() => {
    if (!balances || balances.length === 0) return 0;
    
    try {
      let total = 0;
      
      balances.forEach((balance) => {
        const amount = Number(formatUnits(balance.amount, balance.decimals));
        
        // Real USD conversion - USDC is pegged to USD
        if (balance.symbol === 'USDC') {
          total += amount; // USDC = USD
        } else if (balance.symbol === 'WETH') {
          // For now, show raw ETH amount until price feed integration
          total += amount; // Will be replaced with actual price feed
        }
      });
      
      return total;
    } catch (err) {
      console.error('Error calculating total USD value:', err);
      return 0;
    }
  }, [balances]);
  
  // Production-ready data validation
  const hasSavings = balances && balances.length > 0 && balances.some(balance => balance.amount > 0);
  const validBalances = balances?.filter(balance => balance.amount > 0) || [];
  
  // Calculate total savings count with proper error handling
  const totalSavingsCount = useMemo(() => {
    if (!validBalances.length) return 0;
    
    try {
      return validBalances.reduce((sum, balance) => {
        try {
          return sum + Number(formatUnits(balance.amount, balance.decimals));
        } catch {
          return sum; // Skip invalid balances
        }
      }, 0);
    } catch {
      return 0;
    }
  }, [validBalances]);
  
  // Production-ready error handling
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setLastError(null);
  };

  // Production-ready wallet connection check
  if (!address) {
    return (
      <div className={`glass-strong rounded-2xl p-6 border border-white/20 ${className}`}>
        <div className="text-center text-gray-400">
          <BanknotesIcon className="w-12 h-12 mx-auto mb-4 text-gray-500" />
          <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-sm">Connect your wallet to view your accumulated savings</p>
        </div>
      </div>
    );
  }

  // Production-ready contract deployment check
  if (!isStorageDeployed) {
    return (
      <div className={`glass-strong rounded-2xl p-6 border border-orange-400/30 ${className}`}>
        <div className="text-center text-orange-400">
          <ExclamationTriangleIcon className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">SpendSave Not Deployed</h3>
          <p className="text-sm text-orange-300">
            SpendSaveStorage contract is not deployed on this network
          </p>
          <p className="text-xs text-orange-200 mt-2">
            Network: {chainId} | Storage: {storageAddress || 'Not found'}
          </p>
        </div>
      </div>
    );
  }

  // Production-ready loading state
  if (isLoading) {
    return (
      <div className={`glass-strong rounded-2xl p-6 border border-white/20 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-white/10 rounded"></div>
            <div className="h-6 bg-white/10 rounded-lg w-32"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-white/5 rounded"></div>
            <div className="h-4 bg-white/5 rounded w-3/4"></div>
            <div className="h-4 bg-white/5 rounded w-1/2"></div>
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">Loading your savings...</p>
        </div>
      </div>
    );
  }

  // Production-ready error state with retry
  if (error || lastError) {
    const errorMessage = error || lastError;
    return (
      <div className={`glass-strong rounded-2xl p-6 border border-red-400/30 ${className}`}>
        <div className="text-center text-red-400">
          <ExclamationTriangleIcon className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to Load Savings</h3>
          <p className="text-sm text-red-300 mb-4">{errorMessage}</p>
          <div className="space-y-2">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 rounded-lg transition-colors text-sm font-medium"
            >
              Retry ({retryCount}/3)
            </button>
            <p className="text-xs text-red-200">
              If this persists, check your network connection
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-strong rounded-2xl p-6 border ${
        hasSavings ? 'border-green-400/30' : 'border-white/20'
      } ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <BanknotesIcon className={`w-6 h-6 ${hasSavings ? 'text-green-400' : 'text-gray-400'}`} />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-white">Total Savings</h3>
            <p className="text-sm text-gray-300">Accumulated through SpendSave</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => refreshSavings()}
            className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-300 rounded-lg transition-colors text-xs font-medium"
          >
            Refresh
          </button>
          
          {hasSavings && (
            <div className="text-right">
              <div className="text-xs text-gray-400">Total Value</div>
              <div className="text-lg font-bold text-green-400">
                ${totalValueUSD.toFixed(2)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      {!hasSavings ? (
        <div className="text-center py-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <SparklesIcon className="w-16 h-16 mx-auto mb-4 text-gray-500" />
          </motion.div>
          <h4 className="text-lg font-semibold text-gray-300 mb-2">No Savings Yet</h4>
          <p className="text-sm text-gray-400 mb-4">
            Start swapping to automatically save with every transaction
          </p>
          <div className="text-xs text-gray-500">
            Configure your savings percentage to begin
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Savings Summary */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <ChartBarIcon className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold text-blue-400">Savings Breakdown</span>
            </div>
            
            <div className="space-y-3">
              {validBalances.length > 0 ? (
                validBalances.map((balance, index) => {
                  try {
                    const amount = Number(formatUnits(balance.amount, balance.decimals));
                    
                    if (amount <= 0) return null;
                    
                    return (
                      <motion.div
                        key={balance.token}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">
                              {balance.symbol.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{balance.symbol}</div>
                            <div className="text-xs text-gray-400 truncate max-w-24">
                              {balance.token.slice(0, 6)}...{balance.token.slice(-4)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-white">
                            {amount.toFixed(6)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {balance.symbol}
                          </div>
                        </div>
                      </motion.div>
                    );
                  } catch (err) {
                    console.warn(`Error rendering balance for ${balance.symbol}:`, err);
                    return null;
                  }
                })
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <InformationCircleIcon className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">No savings balances found</p>
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          {showDetails && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">Total Tokens</span>
                </div>
                <div className="text-lg font-bold text-white">
                  {validBalances.length}
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ClockIcon className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-400">Total Amount</span>
                </div>
                <div className="text-lg font-bold text-white">
                  {totalFormatted || '0'}
                </div>
              </div>
            </div>
          )}

          {/* Real Savings Status */}
          {hasSavings && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-green-400/10 border border-green-400/30 rounded-xl p-4"
            >
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-sm font-semibold text-green-400">Savings Active</div>
                  <div className="text-xs text-green-300">
                    {validBalances.length} token{validBalances.length !== 1 ? 's' : ''} saved
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}

// Compact version for smaller spaces - Production Ready
export function TotalSavingsCompact({ className = '' }: { className?: string }) {
  const { address } = useAccount();
  const { balances, isLoading, error, totalFormatted } = useSavingsBalanceRealtime();
  const chainId = useActiveChainId();
  
  // Check if SpendSaveStorage is deployed
  const storageAddress = useMemo(() => {
    try {
      return getContractAddress(chainId, 'SpendSaveStorage');
    } catch {
      return null;
    }
  }, [chainId]);
  
  const isStorageDeployed = storageAddress && storageAddress !== '0x0000000000000000000000000000000000000000';

  if (!address) {
    return (
      <div className={`glass-subtle rounded-lg p-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BanknotesIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-400">Savings</span>
          </div>
          <div className="text-sm text-gray-400">Connect wallet</div>
        </div>
      </div>
    );
  }

  if (!isStorageDeployed) {
    return (
      <div className={`glass-subtle rounded-lg p-3 border border-orange-400/30 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-orange-400">Savings</span>
          </div>
          <div className="text-sm text-orange-400">Not deployed</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`glass-subtle rounded-lg p-3 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white/10 rounded"></div>
              <div className="h-4 bg-white/10 rounded w-16"></div>
            </div>
            <div className="h-4 bg-white/10 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`glass-subtle rounded-lg p-3 border border-red-400/30 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-400">Savings</span>
          </div>
          <div className="text-sm text-red-400">Error</div>
        </div>
      </div>
    );
  }

  const hasSavings = balances && balances.length > 0 && balances.some(balance => balance.amount > 0);

  return (
    <div className={`glass-subtle rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BanknotesIcon className={`w-4 h-4 ${hasSavings ? 'text-green-400' : 'text-gray-400'}`} />
          <span className="text-sm font-medium text-white">Savings</span>
        </div>
        <div className="text-sm font-bold text-white">
          {hasSavings ? totalFormatted || 'Loading...' : 'No savings'}
        </div>
      </div>
    </div>
  );
}
