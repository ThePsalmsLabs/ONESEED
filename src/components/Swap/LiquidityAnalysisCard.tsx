'use client';

import { motion } from 'framer-motion';
import { 
  CurrencyDollarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface LiquidityAnalysisCardProps {
  className?: string;
}

export function LiquidityAnalysisCard({ className = '' }: LiquidityAnalysisCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-strong rounded-2xl p-6 border border-blue-400/30 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChartBarIcon className="w-6 h-6 text-blue-400" />
        </motion.div>
        <div>
          <h3 className="text-lg font-bold text-white">Pool Liquidity Analysis</h3>
          <p className="text-sm text-gray-300">Current Base Sepolia Testnet Status</p>
        </div>
      </div>

      {/* Current Pool Status */}
      <div className="bg-white/5 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">Pool Status</span>
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">Active</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-400 mb-1">Total Liquidity</div>
            <div className="text-white font-medium">~1 USDC + WETH</div>
          </div>
          <div>
            <div className="text-gray-400 mb-1">Current Price</div>
            <div className="text-white font-medium">$0.985 USDC/WETH</div>
          </div>
        </div>
      </div>

      {/* Swap Size Recommendations */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-white mb-3">Recommended Swap Sizes</h4>
        
        {/* Micro Swaps */}
        <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircleIcon className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">Micro Swaps (Testing)</span>
          </div>
          <div className="text-sm text-white mb-1">0.001 - 0.01 USDC</div>
          <div className="text-xs text-green-300">Perfect for testing protocol functionality</div>
        </div>

        {/* Small Swaps */}
        <div className="bg-blue-400/10 border border-blue-400/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircleIcon className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Small Swaps (Recommended)</span>
          </div>
          <div className="text-sm text-white mb-1">0.01 - 0.1 USDC</div>
          <div className="text-xs text-blue-300">Optimal size with low slippage</div>
        </div>

        {/* Medium Swaps */}
        <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ExclamationTriangleIcon className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">Medium Swaps (Caution)</span>
          </div>
          <div className="text-sm text-white mb-1">0.1 - 0.5 USDC</div>
          <div className="text-xs text-yellow-300">Higher slippage expected</div>
        </div>

        {/* Large Swaps */}
        <div className="bg-red-400/10 border border-red-400/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-400">Large Swaps (Not Recommended)</span>
          </div>
          <div className="text-sm text-white mb-1">0.5+ USDC</div>
          <div className="text-xs text-red-300">Very high slippage - avoid</div>
        </div>
      </div>

      {/* Proven Safe Amount */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-400/10 to-green-400/10 border border-blue-400/30 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <CurrencyDollarIcon className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-semibold text-blue-400">💡 Proven Safe Amount</span>
        </div>
        <div className="text-lg font-bold text-white mb-1">0.01 USDC (10,000 units)</div>
        <div className="text-xs text-blue-300">
          Successfully tested in protocol verification with 10% savings extraction
        </div>
      </div>

      {/* Important Notes */}
      <div className="mt-6 p-4 bg-white/5 rounded-xl">
        <div className="flex items-start gap-2 mb-2">
          <InformationCircleIcon className="w-5 h-5 text-gray-400 mt-0.5" />
          <span className="text-sm font-medium text-gray-300">Important Notes</span>
        </div>
        <div className="space-y-2 text-xs text-gray-400">
          <div>• This is Base Sepolia testnet with limited liquidity</div>
          <div>• For mainnet, you&apos;ll need $10,000+ liquidity per side</div>
          <div>• All swaps automatically trigger SpendSave hook</div>
          <div>• Gas fees are sponsored (gasless transactions)</div>
          <div>• Price limits are properly configured to prevent errors</div>
        </div>
      </div>
    </motion.div>
  );
}
