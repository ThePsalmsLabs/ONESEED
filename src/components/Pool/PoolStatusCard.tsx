'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
// Inline Badge component to avoid import issues
const Badge = ({ children, variant = 'default', className = '' }: { 
  children: React.ReactNode; 
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'secondary' | 'outline';
  className?: string;
}) => {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    secondary: 'bg-gray-200 text-gray-800',
    outline: 'border border-gray-300 text-gray-700 bg-transparent',
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${variantStyles[variant]} ${className}
    `}>
      {children}
    </span>
  );
};
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { usePoolStatusEnhanced, usePoolActivity, usePoolInitializedBy } from '@/hooks/usePoolStatusEnhanced';
import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';

interface PoolStatusCardProps {
  className?: string;
  token0Address?: string;
  token1Address?: string;
  showDetails?: boolean;
}

export function PoolStatusCard({ 
  className = '', 
  token0Address, 
  token1Address,
  showDetails = false 
}: PoolStatusCardProps) {
  const { address } = useAccount();
  const { poolStatus, isLoading, poolInfo } = usePoolStatusEnhanced(token0Address, token1Address);
  const { data: poolActivity } = usePoolActivity();
  const { data: initInfo } = usePoolInitializedBy(address);
  const [showFullDetails, setShowFullDetails] = useState(showDetails);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={className}
      >
        <Card className="p-6 border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <ArrowPathIcon className="w-6 h-6 text-gray-400 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-800">
              Checking Pool Status...
            </h3>
          </div>
          <p className="text-gray-600">
            Verifying pool initialization and liquidity status...
          </p>
        </Card>
      </motion.div>
    );
  }

  // Pool not initialized
  if (!poolStatus.exists) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={className}
      >
        <Card className="p-6 border-orange-200 bg-orange-50">
          <div className="flex items-center gap-3 mb-4">
            <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
            <h3 className="text-lg font-semibold text-orange-800">
              Pool Not Initialized
            </h3>
          </div>
          
          <p className="text-orange-700 mb-4">
            The USDC/WETH pool with SpendSave hook needs to be initialized before swaps can occur.
          </p>
          
          <div className="text-sm text-orange-600 mb-4">
            <p>❌ Pool not found</p>
            <p>❌ No liquidity available</p>
            <p>❌ Swaps not possible</p>
          </div>

          <div className="text-xs text-orange-500">
            <p><strong>Pool ID:</strong> {poolInfo.poolId}</p>
            <p><strong>Hook Address:</strong> {poolInfo.spendSaveHookAddress}</p>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Pool exists but no liquidity
  if (poolStatus.exists && !poolStatus.hasLiquidity) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={className}
      >
        <Card className="p-6 border-yellow-200 bg-yellow-50">
          <div className="flex items-center gap-3 mb-4">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-800">
              Pool Initialized, No Liquidity
            </h3>
          </div>
          
          <p className="text-yellow-700 mb-4">
            The pool exists but has no liquidity. Liquidity needs to be added before swaps can occur.
          </p>
          
          <div className="text-sm text-yellow-600 mb-4">
            <p>✅ Pool initialized</p>
            <p>❌ No liquidity available</p>
            <p>❌ Swaps not possible</p>
          </div>

          {showFullDetails && (
            <div className="text-xs text-yellow-500">
              <p><strong>Price:</strong> {poolStatus.sqrtPriceX96?.toString()}</p>
              <p><strong>Tick:</strong> {poolStatus.tick}</p>
              <p><strong>Liquidity:</strong> {poolStatus.liquidity?.toString() || '0'}</p>
            </div>
          )}
        </Card>
      </motion.div>
    );
  }

  // Pool ready for trading
  if (poolStatus.isReady) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={className}
      >
        <Card className="p-6 border-green-200 bg-green-50">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-800">
              Pool Ready for Trading
            </h3>
          </div>
          
          <p className="text-green-700 mb-4">
            The USDC/WETH pool with SpendSave hook is active and ready for swaps.
          </p>
          
          <div className="text-sm text-green-600 mb-4">
            <p>✅ Pool initialized</p>
            <p>✅ Liquidity available</p>
            <p>✅ Savings extraction enabled</p>
          </div>

          {poolActivity && (
            <div className="mb-4">
              <div className="flex gap-2 mb-2">
                <Badge variant="outline" className="text-green-600 border-green-300">
                  {poolActivity.recentSwaps} recent swaps
                </Badge>
                <Badge variant="outline" className="text-green-600 border-green-300">
                  {poolActivity.recentLiquidityChanges} liquidity changes
                </Badge>
              </div>
              {poolActivity.isActive && (
                <p className="text-xs text-green-500">
                  Pool is actively being used
                </p>
              )}
            </div>
          )}

          {showFullDetails && (
            <div className="text-xs text-green-500">
              <p><strong>Price:</strong> {poolStatus.sqrtPriceX96?.toString()}</p>
              <p><strong>Tick:</strong> {poolStatus.tick}</p>
              <p><strong>Liquidity:</strong> {poolStatus.liquidity?.toString()}</p>
              {poolStatus.lastSwapBlock && (
                <p><strong>Last Swap:</strong> Block {poolStatus.lastSwapBlock}</p>
              )}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFullDetails(!showFullDetails)}
            className="mt-2"
          >
            <EyeIcon className="w-4 h-4 mr-2" />
            {showFullDetails ? 'Hide' : 'Show'} Details
          </Button>
        </Card>
      </motion.div>
    );
  }

  // Error state
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={className}
    >
      <Card className="p-6 border-red-200 bg-red-50">
        <div className="flex items-center gap-3 mb-4">
          <XCircleIcon className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-800">
            Pool Status Error
          </h3>
        </div>
        
        <p className="text-red-700 mb-4">
          Unable to determine pool status: {poolStatus.error}
        </p>
        
        <div className="text-xs text-red-500">
          <p><strong>Pool ID:</strong> {poolInfo.poolId}</p>
          <p><strong>Manager:</strong> {poolInfo.poolManagerAddress}</p>
        </div>
      </Card>
    </motion.div>
  );
}

/**
 * Compact pool status indicator for use in other components
 */
export function PoolStatusIndicator({ 
  token0Address, 
  token1Address,
  className = ''
}: {
  token0Address?: string;
  token1Address?: string;
  className?: string;
}) {
  const { poolStatus, isLoading } = usePoolStatusEnhanced(token0Address, token1Address);

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <ArrowPathIcon className="w-4 h-4 text-gray-400 animate-spin" />
        <span className="text-sm text-gray-600">Checking pool...</span>
      </div>
    );
  }

  if (!poolStatus.exists) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <XCircleIcon className="w-4 h-4 text-red-500" />
        <span className="text-sm text-red-600">Pool not initialized</span>
      </div>
    );
  }

  if (!poolStatus.hasLiquidity) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
        <span className="text-sm text-yellow-600">No liquidity</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <CheckCircleIcon className="w-4 h-4 text-green-500" />
      <span className="text-sm text-green-600">Pool ready</span>
    </div>
  );
}
