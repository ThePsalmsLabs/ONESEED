'use client';

import { motion } from 'framer-motion';
import { formatUnits } from 'viem';

interface WithdrawBalanceCardProps {
  token: string;
  symbol: string;
  amount: bigint;
  decimals: number;
  usdValue?: number;
  onSelect: () => void;
  isSelected: boolean;
}

export function WithdrawBalanceCard({
  token,
  symbol,
  amount,
  decimals,
  usdValue,
  onSelect,
  isSelected,
}: WithdrawBalanceCardProps) {
  const formattedAmount = parseFloat(formatUnits(amount, decimals)).toFixed(4);

  return (
    <motion.button
      onClick={onSelect}
      className={`relative w-full p-4 rounded-xl text-left transition-all duration-300 ${
        isSelected
          ? 'bg-primary-400/10 border-2 border-primary-400'
          : 'bg-bg-tertiary/50 border border-border hover:border-primary-400/30'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between">
        {/* Token Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-cyan flex items-center justify-center text-white font-bold text-sm">
            {symbol.charAt(0)}
          </div>
          <div>
            <div className="text-base font-semibold text-text-primary">{symbol}</div>
            <div className="text-xs text-text-muted truncate max-w-[120px]">{token.slice(0, 6)}...{token.slice(-4)}</div>
          </div>
        </div>

        {/* Balance */}
        <div className="text-right">
          <motion.div
            key={formattedAmount}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-lg font-bold text-text-primary"
          >
            {formattedAmount}
          </motion.div>
          {usdValue && (
            <div className="text-sm text-text-muted">
              ${usdValue.toFixed(2)}
            </div>
          )}
        </div>
      </div>

      {isSelected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-3 right-3 w-5 h-5 bg-primary-400 rounded-full flex items-center justify-center"
        >
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
}



