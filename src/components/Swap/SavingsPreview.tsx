'use client';

import { useMemo } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useSavingsStrategy } from '@/hooks/useSavingsStrategy';
import { useTokenPrice } from '@/hooks/swap/useTokenPrice';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { 
  BanknotesIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface SavingsPreviewProps {
  inputAmount: string;
  inputToken: {
    address: string;
    symbol: string;
    decimals: number;
  } | null;
  outputToken: {
    address: string;
    symbol: string;
    decimals: number;
  } | null;
  className?: string;
}

export function SavingsPreview({ 
  inputAmount, 
  inputToken, 
  outputToken, 
  className = '' 
}: SavingsPreviewProps) {
  const { strategy, hasStrategy, isLoading } = useSavingsStrategy();
  const { priceUSD: inputTokenPrice, isLoading: priceLoading } = useTokenPrice({ 
    tokenAddress: inputToken?.address as `0x${string}` 
  });

  const savingsCalculation = useMemo(() => {
    if (!inputAmount || !inputToken || !strategy || !hasStrategy || parseFloat(inputAmount) === 0) {
      return {
        inputAmount: 0,
        savingsAmount: 0,
        swapAmount: 0,
        savingsPercentage: 0,
        savingsFormatted: '0',
        swapFormatted: '0',
        savingsUSD: 0,
        swapUSD: 0,
        isCalculated: false
      };
    }

    try {
      const inputAmountBigInt = parseUnits(inputAmount, inputToken.decimals);
      const percentage = Number(strategy.percentage) / 100; // Convert basis points to percentage
      
      // Calculate savings amount
      const savingsAmountBigInt = (inputAmountBigInt * BigInt(Math.floor(percentage * 100))) / BigInt(10000);
      const swapAmountBigInt = inputAmountBigInt - savingsAmountBigInt;
      
      // Format amounts
      const savingsFormatted = formatUnits(savingsAmountBigInt, inputToken.decimals);
      const swapFormatted = formatUnits(swapAmountBigInt, inputToken.decimals);
      
      // Calculate USD values using real price feeds
      const inputAmountNum = parseFloat(inputAmount);
      const savingsUSD = inputAmountNum * percentage * inputTokenPrice;
      const swapUSD = inputAmountNum * (1 - percentage) * inputTokenPrice;

      return {
        inputAmount: inputAmountNum,
        savingsAmount: parseFloat(savingsFormatted),
        swapAmount: parseFloat(swapFormatted),
        savingsPercentage: percentage * 100,
        savingsFormatted,
        swapFormatted,
        savingsUSD,
        swapUSD,
        isCalculated: true
      };
    } catch (error) {
      console.error('Error calculating savings:', error);
      return {
        inputAmount: 0,
        savingsAmount: 0,
        swapAmount: 0,
        savingsPercentage: 0,
        savingsFormatted: '0',
        swapFormatted: '0',
        savingsUSD: 0,
        swapUSD: 0,
        isCalculated: false
      };
    }
  }, [inputAmount, inputToken, strategy, hasStrategy, inputTokenPrice]);

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
            <div className="h-5 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-2 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (!hasStrategy || !strategy || Number(strategy.percentage) === 0) {
    return (
      <Card className={`p-4 border-yellow-200 bg-yellow-50 ${className}`}>
        <div className="flex items-center gap-2 text-yellow-800">
          <BanknotesIcon className="w-5 h-5" />
          <div>
            <p className="font-medium">No Savings Strategy Configured</p>
            <p className="text-sm text-yellow-700">
              Configure your savings strategy to start saving automatically
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (!savingsCalculation.isCalculated || savingsCalculation.inputAmount === 0) {
    return (
      <Card className={`p-4 border-gray-200 bg-gray-50 ${className}`}>
        <div className="flex items-center gap-2 text-gray-600">
          <BanknotesIcon className="w-5 h-5" />
          <span className="text-sm">
            Enter amount to see savings preview
          </span>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="p-4 border-primary-200 bg-primary-50">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircleIcon className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-primary-800">
            💰 Savings Preview
          </h3>
        </div>

        <div className="space-y-3">
          {/* Input Amount */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">You&apos;re swapping:</span>
            <span className="font-medium">
              {inputAmount} {inputToken?.symbol}
            </span>
          </div>

          {/* Savings Split */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <span className="text-sm font-medium text-primary-700">
                  Savings ({savingsCalculation.savingsPercentage.toFixed(1)}%)
                </span>
              </div>
              <span className="font-semibold text-primary-800">
                {savingsCalculation.savingsFormatted} {inputToken?.symbol}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-sm font-medium text-gray-600">
                  For Swap
                </span>
              </div>
              <span className="font-medium text-gray-700">
                {savingsCalculation.swapFormatted} {inputToken?.symbol}
              </span>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="flex h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${savingsCalculation.savingsPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-primary-500"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${100 - savingsCalculation.savingsPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                className="bg-gray-400"
              />
            </div>
          </div>

          {/* Expected Output */}
          <div className="flex items-center justify-between pt-2 border-t border-primary-200">
            <span className="text-sm text-gray-600">Expected output:</span>
            <div className="flex items-center gap-1">
              <span className="font-medium">
                ~{savingsCalculation.swapFormatted} {outputToken?.symbol}
              </span>
              <ArrowRightIcon className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* USD Values */}
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>
                Savings: {priceLoading ? '...' : `~$${savingsCalculation.savingsUSD.toFixed(2)}`}
              </span>
              <span>
                Swap: {priceLoading ? '...' : `~$${savingsCalculation.swapUSD.toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Compact version for smaller spaces
export function SavingsPreviewCompact({ 
  inputAmount, 
  inputToken, 
  className = '' 
}: Omit<SavingsPreviewProps, 'outputToken'>) {
  const { strategy, hasStrategy } = useSavingsStrategy();
  const { priceUSD, isLoading: priceLoading } = useTokenPrice({ 
    tokenAddress: inputToken?.address as `0x${string}` 
  });

  const savingsAmount = useMemo(() => {
    if (!inputAmount || !inputToken || !strategy || !hasStrategy || parseFloat(inputAmount) === 0) {
      return '0';
    }

    try {
      const inputAmountBigInt = parseUnits(inputAmount, inputToken.decimals);
      const percentage = Number(strategy.percentage) / 100;
      const savingsAmountBigInt = (inputAmountBigInt * BigInt(Math.floor(percentage * 100))) / BigInt(10000);
      return formatUnits(savingsAmountBigInt, inputToken.decimals);
    } catch {
      return '0';
    }
  }, [inputAmount, inputToken, strategy, hasStrategy]);

  const savingsUSD = useMemo(() => {
    if (!inputAmount || !strategy || !hasStrategy || parseFloat(inputAmount) === 0) {
      return 0;
    }
    const percentage = Number(strategy.percentage) / 100;
    return parseFloat(inputAmount) * percentage * priceUSD;
  }, [inputAmount, strategy, hasStrategy, priceUSD]);

  if (!hasStrategy || !strategy || Number(strategy.percentage) === 0) {
    return null;
  }

  if (parseFloat(inputAmount) === 0) {
    return null;
  }

  return (
    <div className={`text-sm text-primary-600 ${className}`}>
      💰 Will save: {savingsAmount} {inputToken?.symbol} 
      {priceLoading ? ' (loading...)' : ` (~$${savingsUSD.toFixed(2)})`}
    </div>
  );
}
