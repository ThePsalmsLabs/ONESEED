'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { usePoolStatus, usePoolInitialization } from '@/hooks/usePoolStatus';
import { UniswapV4PoolManagerABI } from '@/contracts/abis/UniswapV4PoolManager';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

// Proper type definition matching the ABI struct
type PoolKeyStruct = {
  currency0: `0x${string}`;
  currency1: `0x${string}`;
  fee: number;
  tickSpacing: number;
  hooks: `0x${string}`;
};

interface PoolInitializerProps {
  className?: string;
  onInitialized?: () => void;
}

export function PoolInitializer({ className = '', onInitialized }: PoolInitializerProps) {
  const { address, isConnected } = useAccount();
  const { poolStatus, isLoading, poolKey, poolManagerAddress } = usePoolStatus();
  const { initializationParams } = usePoolInitialization();
  const [isInitializing, setIsInitializing] = useState(false);

  const { writeContract, data: hash, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleInitializePool = async () => {
    if (!initializationParams || !poolManagerAddress) {
      console.error('Missing initialization parameters');
      return;
    }

    try {
      setIsInitializing(true);
      
      // Convert PoolKey object to struct format expected by ABI
      const poolKeyStruct: PoolKeyStruct = {
        currency0: poolKey.currency0,
        currency1: poolKey.currency1,
        fee: poolKey.fee,
        tickSpacing: poolKey.tickSpacing,
        hooks: poolKey.hooks
      };

      await writeContract({
        address: poolManagerAddress as `0x${string}`,
        abi: UniswapV4PoolManagerABI,
        functionName: 'initialize',
        args: [
          poolKeyStruct,
          initializationParams.sqrtPriceX96
        ],
      });
    } catch (error) {
      console.error('Failed to initialize pool:', error);
      setIsInitializing(false);
    }
  };

  // Show success state
  if (isSuccess) {
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
              Pool Initialized Successfully!
            </h3>
          </div>
          
          <p className="text-green-700 mb-4">
            The USDC/WETH pool with SpendSave hook is now ready for trading.
          </p>
          
          <div className="text-sm text-green-600">
            <p>Transaction: {hash ? `${hash.slice(0, 10)}...${hash.slice(-8)}` : 'Pending'}</p>
            <p>Pool is now available for swaps with automatic savings extraction.</p>
          </div>
          
          {onInitialized && (
            <Button
              onClick={onInitialized}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white"
            >
              Continue to Swap
            </Button>
          )}
        </Card>
      </motion.div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={className}>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <ArrowPathIcon className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-gray-600">Checking pool status...</span>
          </div>
        </Card>
      </div>
    );
  }

  // Show initialization needed
  if (poolStatus.needsInit) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={className}
      >
        <Card className="p-6 border-yellow-200 bg-yellow-50">
          <div className="flex items-start gap-3 mb-4">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Pool Needs Initialization
              </h3>
              <p className="text-yellow-700">
                The USDC/WETH pool with SpendSave hook hasn&apos;t been created yet.
                This is a one-time setup required for trading.
              </p>
            </div>
          </div>

          <div className="bg-white/50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-800 mb-2">Pool Configuration:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Token Pair: USDC/WETH</p>
              <p>• Fee Tier: 0.3%</p>
              <p>• Hook: SpendSave (0x2400...c0cc)</p>
              <p>• Initial Price: 1:1</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleInitializePool}
              disabled={!isConnected || isInitializing || isConfirming || !initializationParams}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
            >
              {isInitializing || isConfirming ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                  {isInitializing ? 'Initializing...' : 'Confirming...'}
                </>
              ) : (
                <>
                  <PlayIcon className="w-4 h-4 mr-2" />
                  Initialize Pool (1-Click Setup)
                </>
              )}
            </Button>
          </div>

          {writeError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                Error: {writeError.message}
              </p>
            </div>
          )}

          {!isConnected && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-600">
                Please connect your wallet to initialize the pool.
              </p>
            </div>
          )}
        </Card>
      </motion.div>
    );
  }

  // Show pool ready state
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
          
          <div className="text-sm text-green-600">
            <p>✅ Pool initialized</p>
            <p>✅ Liquidity available</p>
            <p>✅ Savings extraction enabled</p>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Show error state
  if (poolStatus.error) {
    return (
      <div className={className}>
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Pool Status Error
              </h3>
              <p className="text-red-700 mb-2">
                {poolStatus.error}
              </p>
              <p className="text-sm text-red-600">
                Please try refreshing the page or contact support if the issue persists.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}

// Compact version for smaller spaces
export function PoolInitializerCompact({ className = '', onInitialized }: PoolInitializerProps) {
  const { poolStatus, isLoading } = usePoolStatus();

  if (isLoading) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        Checking pool...
      </div>
    );
  }

  if (poolStatus.needsInit) {
    return (
      <div className={`text-sm text-yellow-600 ${className}`}>
        ⚠️ Pool needs initialization
      </div>
    );
  }

  if (poolStatus.isReady) {
    return (
      <div className={`text-sm text-green-600 ${className}`}>
        ✅ Pool ready for trading
      </div>
    );
  }

  return null;
}
