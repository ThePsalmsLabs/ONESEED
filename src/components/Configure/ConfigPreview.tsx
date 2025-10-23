'use client';

import { motion } from 'framer-motion';
import { SavingsTokenType } from '@/contracts/types';

interface ConfigPreviewProps {
  percentage: number;
  tokenType: SavingsTokenType;
  autoIncrement: number;
  maxPercentage: number;
  roundUp: boolean;
}

export function ConfigPreview({
  percentage,
  tokenType,
  autoIncrement,
  maxPercentage,
  roundUp,
}: ConfigPreviewProps) {
  const getTokenTypeLabel = () => {
    switch (tokenType) {
      case SavingsTokenType.INPUT:
        return 'Input Token';
      case SavingsTokenType.OUTPUT:
        return 'Output Token';
      case SavingsTokenType.SPECIFIC:
        return 'Specific Token';
      default:
        return 'Not Set';
    }
  };

  return (
    <div className="glass-solid-dark rounded-2xl p-8 border border-border sticky top-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-accent-cyan rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💰</span>
          </div>
          <h3 className="text-2xl font-bold text-text-primary mb-2">
            Your Strategy
          </h3>
          <p className="text-sm text-text-muted">
            Preview of your savings configuration
          </p>
        </div>

        {/* Main Percentage Display */}
        <motion.div
          className="relative mb-8"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="glass-effect-dark rounded-xl p-6 text-center border border-primary-400/30">
            <p className="text-sm text-text-muted mb-2">Savings Rate</p>
            <motion.div
              key={percentage}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-5xl font-black text-primary-400 mb-2"
            >
              {(percentage / 100).toFixed(2)}%
            </motion.div>
            <p className="text-xs text-text-muted">
              Per transaction
            </p>
          </div>
        </motion.div>

        {/* Configuration Details */}
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-sm text-text-muted">Save in</span>
            <span className="text-sm font-semibold text-text-primary">
              {getTokenTypeLabel()}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-sm text-text-muted">Auto-Increment</span>
            <span className="text-sm font-semibold text-text-primary">
              {autoIncrement > 0 ? `+${(autoIncrement / 100).toFixed(2)}%` : 'Disabled'}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-sm text-text-muted">Max Rate</span>
            <span className="text-sm font-semibold text-text-primary">
              {(maxPercentage / 100).toFixed(2)}%
            </span>
          </div>

          <div className="flex justify-between items-center py-3">
            <span className="text-sm text-text-muted">Round Up</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text-primary">
                {roundUp ? 'Enabled' : 'Disabled'}
              </span>
              {roundUp && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 bg-primary-400 rounded-full"
                />
              )}
            </div>
          </div>
        </div>

        {/* Example Calculation */}
        <div className="mt-8 glass-subtle rounded-xl p-4">
          <p className="text-xs text-text-muted mb-3 text-center">Example</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Swap Amount:</span>
              <span className="text-text-primary font-semibold">$1,000</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">You Save:</span>
              <span className="text-primary-400 font-bold">
                ${((1000 * percentage) / 10000).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">You Receive:</span>
              <span className="text-text-primary font-semibold">
                ${(1000 - (1000 * percentage) / 10000).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <motion.div
          className="mt-6 p-4 rounded-lg bg-accent-blue/10 border border-accent-blue/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-text-secondary">
            💡 Your settings will apply to all future swaps. You can change them anytime.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}



