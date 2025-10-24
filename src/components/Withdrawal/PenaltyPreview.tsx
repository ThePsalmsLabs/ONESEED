'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AnimatedCard, AnimatedButton, AnimatedProgress } from '@/components/ui/AnimatedComponents';
import { 
  ExclamationTriangleIcon,
  CalculatorIcon,
  InformationCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowTrendingDownIcon,
  ShieldCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { formatEther, parseEther } from 'viem';

interface PenaltyPreviewProps {
  className?: string;
  withdrawals: Array<{
    token: string;
    symbol: string;
    amount: bigint;
    penaltyRate: number;
  }>;
  onConfirm?: (confirmed: boolean) => void;
}

interface PenaltyBreakdown {
  token: string;
  symbol: string;
  amount: bigint;
  penaltyRate: number;
  penalty: bigint;
  netAmount: bigint;
  penaltyPercentage: number;
}

interface PenaltySummary {
  totalAmount: bigint;
  totalPenalty: bigint;
  totalNetAmount: bigint;
  averagePenaltyRate: number;
  maxPenaltyRate: number;
  minPenaltyRate: number;
  estimatedGasCost: bigint;
  totalCost: bigint;
  savings: bigint;
}

export function PenaltyPreview({ className = '', withdrawals, onConfirm }: PenaltyPreviewProps) {
  const [penaltyBreakdown, setPenaltyBreakdown] = useState<PenaltyBreakdown[]>([]);
  const [penaltySummary, setPenaltySummary] = useState<PenaltySummary | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const breakdown: PenaltyBreakdown[] = withdrawals.map(withdrawal => {
      const penalty = (withdrawal.amount * BigInt(Math.floor(withdrawal.penaltyRate * 10000))) / BigInt(10000);
      const netAmount = withdrawal.amount - penalty;
      const penaltyPercentage = (withdrawal.penaltyRate * 100);

      return {
        token: withdrawal.token,
        symbol: withdrawal.symbol,
        amount: withdrawal.amount,
        penaltyRate: withdrawal.penaltyRate,
        penalty,
        netAmount,
        penaltyPercentage
      };
    });

    setPenaltyBreakdown(breakdown);

    // Calculate summary
    const totalAmount = breakdown.reduce((sum, b) => sum + b.amount, BigInt(0));
    const totalPenalty = breakdown.reduce((sum, b) => sum + b.penalty, BigInt(0));
    const totalNetAmount = breakdown.reduce((sum, b) => sum + b.netAmount, BigInt(0));
    const averagePenaltyRate = breakdown.reduce((sum, b) => sum + b.penaltyRate, 0) / breakdown.length;
    const maxPenaltyRate = Math.max(...breakdown.map(b => b.penaltyRate));
    const minPenaltyRate = Math.min(...breakdown.map(b => b.penaltyRate));
    
    // Mock gas cost calculation
    const estimatedGasCost = BigInt(withdrawals.length * 150000); // 150k gas per withdrawal
    const totalCost = totalPenalty + estimatedGasCost;
    const savings = BigInt(withdrawals.length * 100000); // Estimated savings from batching

    setPenaltySummary({
      totalAmount,
      totalPenalty,
      totalNetAmount,
      averagePenaltyRate,
      maxPenaltyRate,
      minPenaltyRate,
      estimatedGasCost,
      totalCost,
      savings
    });
  }, [withdrawals]);

  const handleConfirm = () => {
    setIsConfirmed(true);
    onConfirm?.(true);
  };

  const handleCancel = () => {
    onConfirm?.(false);
  };

  const getPenaltySeverity = (rate: number): 'low' | 'medium' | 'high' | 'critical' => {
    if (rate <= 0.02) return 'low';
    if (rate <= 0.05) return 'medium';
    if (rate <= 0.10) return 'high';
    return 'critical';
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high' | 'critical') => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
    }
  };

  if (!penaltySummary) return null;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
          <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Penalty Preview</h2>
          <p className="text-muted-foreground">Review withdrawal penalties before confirming</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AnimatedCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <CurrencyDollarIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{formatEther(penaltySummary.totalAmount)}</div>
              <div className="text-sm text-muted-foreground">Total Amount</div>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{formatEther(penaltySummary.totalPenalty)}</div>
              <div className="text-sm text-muted-foreground">Total Penalty</div>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <ShieldCheckIcon className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{formatEther(penaltySummary.totalNetAmount)}</div>
              <div className="text-sm text-muted-foreground">Net Amount</div>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <ChartBarIcon className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {(penaltySummary.averagePenaltyRate * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Penalty Rate</div>
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Penalty Breakdown */}
      <AnimatedCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Penalty Breakdown</h3>
          <AnimatedButton
            variant="outline"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2"
          >
            <InformationCircleIcon className="w-4 h-4" />
            {showDetails ? 'Hide' : 'Show'} Details
          </AnimatedButton>
        </div>

        <div className="space-y-4">
          {penaltyBreakdown.map((breakdown, index) => {
            const severity = getPenaltySeverity(breakdown.penaltyRate);
            return (
              <motion.div
                key={breakdown.token}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border border-border"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="font-medium">{breakdown.symbol}</div>
                    <div className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(severity)}`}>
                      {breakdown.penaltyPercentage.toFixed(1)}% penalty
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatEther(breakdown.amount)} {breakdown.symbol}</div>
                    <div className="text-sm text-muted-foreground">Amount</div>
                  </div>
                </div>

                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-red-600">
                            {formatEther(breakdown.penalty)} {breakdown.symbol}
                          </div>
                          <div className="text-sm text-muted-foreground">Penalty</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">
                            {formatEther(breakdown.netAmount)} {breakdown.symbol}
                          </div>
                          <div className="text-sm text-muted-foreground">Net Amount</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-blue-600">
                            {breakdown.penaltyPercentage.toFixed(1)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Penalty Rate</div>
                        </div>
                      </div>

                      <AnimatedProgress
                        value={breakdown.penaltyPercentage}
                        max={100}
                        label={`Penalty: ${breakdown.penaltyPercentage.toFixed(1)}%`}
                        className="w-full"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </AnimatedCard>

      {/* Cost Analysis */}
      <AnimatedCard className="p-6">
        <h3 className="text-lg font-semibold mb-4">Cost Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-semibold">{formatEther(penaltySummary.totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Penalty</span>
              <span className="font-semibold text-red-600">{formatEther(penaltySummary.totalPenalty)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Estimated Gas Cost</span>
              <span className="font-semibold">{formatEther(penaltySummary.estimatedGasCost)}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-4">
              <span className="font-medium">Total Cost</span>
              <span className="font-semibold text-orange-600">{formatEther(penaltySummary.totalCost)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Net Amount</span>
              <span className="font-semibold text-green-600">{formatEther(penaltySummary.totalNetAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Gas Savings</span>
              <span className="font-semibold text-blue-600">{formatEther(penaltySummary.savings)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Penalty Range</span>
              <span className="font-semibold">
                {(penaltySummary.minPenaltyRate * 100).toFixed(1)}% - {(penaltySummary.maxPenaltyRate * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center border-t pt-4">
              <span className="font-medium">Efficiency</span>
              <span className="font-semibold text-purple-600">
                {((Number(penaltySummary.totalNetAmount) / Number(penaltySummary.totalAmount)) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Warning Messages */}
      <AnimatedCard className="p-6">
        <h3 className="text-lg font-semibold mb-4">Important Considerations</h3>
        <div className="space-y-3">
          {penaltySummary.averagePenaltyRate > 0.05 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <div className="font-medium text-red-800">High Penalty Warning</div>
                <div className="text-sm text-red-700">
                  Your average penalty rate is {(penaltySummary.averagePenaltyRate * 100).toFixed(1)}%, which is above the recommended 5%. Consider waiting for better conditions.
                </div>
              </div>
            </motion.div>
          )}

          {penaltySummary.totalPenalty > penaltySummary.totalAmount / BigInt(10) && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <ClockIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-800">Timing Consideration</div>
                <div className="text-sm text-yellow-700">
                  Penalties represent {(Number(penaltySummary.totalPenalty) / Number(penaltySummary.totalAmount) * 100).toFixed(1)}% of your total amount. Consider if this is the right time to withdraw.
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <div className="font-medium text-blue-800">Batch Withdrawal Benefits</div>
              <div className="text-sm text-blue-700">
                By batching these withdrawals, you&apos;ll save approximately {formatEther(penaltySummary.savings)} in gas costs compared to individual transactions.
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatedCard>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <AnimatedButton
          variant="outline"
          onClick={handleCancel}
          className="flex items-center gap-2"
        >
          <ArrowTrendingDownIcon className="w-4 h-4" />
          Cancel Withdrawal
        </AnimatedButton>

        <AnimatedButton
          onClick={handleConfirm}
          disabled={isConfirmed}
          className="flex items-center gap-2"
        >
          <ShieldCheckIcon className="w-4 h-4" />
          {isConfirmed ? 'Confirmed' : 'Confirm Withdrawal'}
        </AnimatedButton>
      </div>
    </div>
  );
}

