'use client';

import { motion } from 'framer-motion';
import { formatEther } from 'viem';
import { Play, Pause, Clock, Target, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { useDailySavings } from '@/hooks/useDailySavings';

interface DailySavingsGoalCardProps {
  token: `0x${string}`;
  symbol: string;
  name: string;
  icon: string;
  enabled: boolean;
  dailyAmount: bigint;
  goalAmount: bigint;
  currentAmount: bigint;
  remainingAmount: bigint;
  penaltyAmount: bigint;
  estimatedCompletionDate: bigint;
  canExecute: boolean;
  daysPassed: bigint;
  amountToSave: bigint;
  progress: number;
  daysRemaining: number;
  onExecute?: () => void;
  onDisable?: () => void;
}

export function DailySavingsGoalCard({
  token,
  symbol,
  name,
  icon,
  dailyAmount,
  goalAmount,
  currentAmount,
  remainingAmount,
  penaltyAmount,
  canExecute,
  amountToSave,
  progress,
  daysRemaining,
  onExecute,
  onDisable
}: DailySavingsGoalCardProps) {
  const { executeDailySavingsForToken, disableDailySavings, isExecuting, isDisabling } = useDailySavings();

  const handleExecute = async () => {
    if (onExecute) {
      onExecute();
    } else {
      try {
        await executeDailySavingsForToken({ token });
      } catch (error) {
        console.error('Failed to execute token savings:', error);
      }
    }
  };

  const handleDisable = async () => {
    if (onDisable) {
      onDisable();
    } else {
      try {
        await disableDailySavings({ token });
      } catch (error) {
        console.error('Failed to disable daily savings:', error);
      }
    }
  };

  const formatAmount = (value: bigint) => {
    const formatted = formatEther(value);
    return parseFloat(formatted).toFixed(2);
  };

  return (
    <motion.div
      className="glass-solid-dark rounded-xl p-5 border border-border hover:border-primary-400/30 transition-all"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary-400/10 flex items-center justify-center text-2xl">
              {icon}
            </div>
            <div>
              <h4 className="font-semibold text-text-primary">{symbol} Savings</h4>
              <p className="text-xs text-text-secondary">{name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={canExecute ? 'default' : 'secondary'}>
              {canExecute ? 'Ready' : 'Active'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDisable}
              disabled={isDisabling}
              className="h-8 w-8 p-0"
            >
              {isDisabling ? (
                <div className="w-4 h-4 border-2 border-text-secondary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-muted">Progress</span>
            <span className="text-sm font-semibold text-text-primary">{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-text-secondary">
            <span>${formatAmount(currentAmount)}</span>
            <span>${formatAmount(goalAmount)}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
          <div>
            <p className="text-xs text-text-muted mb-1">Daily Amount</p>
            <p className="text-sm font-semibold text-text-primary">
              ${formatAmount(dailyAmount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Days Left</p>
            <p className="text-sm font-semibold text-text-primary flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {daysRemaining}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Remaining</p>
            <p className="text-sm font-semibold text-text-primary">
              ${formatAmount(remainingAmount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Penalty</p>
            <p className="text-sm font-semibold text-warning">
              ${formatAmount(penaltyAmount)}
            </p>
          </div>
        </div>

        {/* Execute Button */}
        {canExecute && (
          <Button
            onClick={handleExecute}
            disabled={isExecuting}
            className="w-full bg-gradient-to-r from-primary-400 to-accent-cyan hover:from-primary-500 hover:to-accent-cyan/90"
            size="sm"
          >
            {isExecuting ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Execute {formatAmount(amountToSave)} {symbol}
              </>
            )}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

