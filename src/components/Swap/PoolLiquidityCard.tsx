'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { formatUnits, Address } from 'viem';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { getContractAddress } from '@/contracts/addresses';
import { usePoolStatusEnhanced } from '@/hooks/usePoolStatusEnhanced';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface PoolLiquidityCardProps {
  token0Address?: string;
  token1Address?: string;
  className?: string;
}

interface PoolMetrics {
  sqrtPriceX96: bigint;
  tick: number;
  liquidity: bigint;
  protocolFee: number;
  lpFee: number;
  price: number;
  priceChange24h: number;
  volume24h: number;
  swapsCount: number;
}

export function PoolLiquidityCard({ 
  token0Address, 
  token1Address, 
  className = '' 
}: PoolLiquidityCardProps) {
  const { address } = useAccount();
  
  // Use the enhanced pool status hook
  const { poolStatus, isLoading, error, poolInfo } = usePoolStatusEnhanced(token0Address, token1Address);

  // Calculate price from sqrtPriceX96
  const calculatePrice = (sqrtPriceX96: bigint): number => {
    // For USDC (6 decimals) / WETH (18 decimals)
    // Price = (sqrtPriceX96^2 * 10^6) / (2^192 * 10^18)
    const sqrtPrice = Number(sqrtPriceX96);
    const priceX192 = sqrtPrice * sqrtPrice;
    return (priceX192 * 1e6) / (2**192) / 1e18;
  };

  // Calculate pool metrics
  const poolMetrics = useMemo(() => {
    if (!poolStatus.exists || !poolStatus.sqrtPriceX96) return null;
    
    const price = calculatePrice(poolStatus.sqrtPriceX96);
    
    return {
      sqrtPriceX96: poolStatus.sqrtPriceX96,
      tick: poolStatus.tick || 0,
      liquidity: poolStatus.liquidity || BigInt(0),
      protocolFee: 0, // Would need separate call
      lpFee: 3000, // 0.3% fee tier
      price,
      priceChange24h: 0, // Would need historical data
      volume24h: 0, // Would need event logs
      swapsCount: 0 // Would need event logs
    };
  }, [poolStatus]);

  // Loading state
  if (isLoading) {
    return (
      <div className={`glass-strong rounded-2xl p-6 border border-white/20 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-white/10 rounded-lg mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-white/5 rounded"></div>
            <div className="h-4 bg-white/5 rounded w-3/4"></div>
            <div className="h-4 bg-white/5 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !poolStatus.exists) {
    return (
      <div className={`glass-strong rounded-2xl p-6 border border-red-400/30 ${className}`}>
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-bold text-red-400 mb-2">Pool Not Initialized</h3>
            <p className="text-sm text-gray-300 mb-4">
              The USDC/WETH pool with SpendSave hook needs to be initialized before swaps can occur.
            </p>
            <div className="space-y-2 text-xs text-gray-400">
              <div>❌ Pool not found</div>
              <div>❌ No liquidity available</div>
              <div>❌ Swaps not possible</div>
            </div>
            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Pool ID:</div>
              <div className="font-mono text-xs text-white break-all">
                {poolInfo.poolId}
              </div>
              <div className="text-xs text-gray-400 mt-2 mb-1">Hook Address:</div>
              <div className="font-mono text-xs text-white break-all">
                {poolInfo.spendSaveHookAddress}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state - pool is ready
  if (!poolMetrics) {
    return (
      <div className={`glass-strong rounded-2xl p-6 border border-white/20 ${className}`}>
        <div className="text-center text-gray-400">
          Loading pool metrics...
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-strong rounded-2xl p-6 border border-green-400/30 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <CheckCircleIcon className="w-6 h-6 text-green-400" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-white">Pool Ready</h3>
            <p className="text-sm text-gray-300">USDC/WETH with SpendSave Hook</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Fee Tier</div>
          <div className="text-sm font-semibold text-white">0.3%</div>
        </div>
      </div>

      {/* Pool Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Current Price */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CurrencyDollarIcon className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Current Price</span>
          </div>
          <div className="text-lg font-bold text-white">
            ${poolMetrics.price.toFixed(4)}
          </div>
          <div className="text-xs text-gray-300">
            USDC per WETH
          </div>
        </div>

        {/* Liquidity */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ChartBarIcon className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">Liquidity</span>
          </div>
          <div className="text-lg font-bold text-white">
            {formatUnits(poolMetrics.liquidity, 18)}
          </div>
          <div className="text-xs text-gray-300">
            Active Liquidity
          </div>
        </div>

        {/* Tick */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowTrendingUpIcon className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">Current Tick</span>
          </div>
          <div className="text-lg font-bold text-white">
            {poolMetrics.tick}
          </div>
          <div className="text-xs text-gray-300">
            Price Range
          </div>
        </div>

        {/* Status */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircleIcon className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">Status</span>
          </div>
          <div className="text-lg font-bold text-green-400">
            Active
          </div>
          <div className="text-xs text-gray-300">
            Ready to Swap
          </div>
        </div>
      </div>

      {/* Pool Information */}
      <div className="bg-white/5 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-white mb-3">Pool Information</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Pool ID:</span>
            <span className="font-mono text-white text-right break-all">
              {poolInfo.poolId.slice(0, 20)}...
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Hook Address:</span>
            <span className="font-mono text-white text-right break-all">
              {poolInfo.spendSaveHookAddress.slice(0, 20)}...
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Tick Spacing:</span>
            <span className="text-white">60</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Protocol Fee:</span>
            <span className="text-white">{poolMetrics.protocolFee}%</span>
          </div>
        </div>
      </div>

      {/* Ready to Swap Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 p-4 bg-green-400/10 border border-green-400/30 rounded-xl"
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <CheckCircleIcon className="w-5 h-5 text-green-400" />
          </motion.div>
          <div>
            <div className="text-sm font-semibold text-green-400">✅ Ready to Swap</div>
            <div className="text-xs text-gray-300">
              Pool is initialized with liquidity. Users can now swap USDC/WETH through the SpendSave hook.
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}