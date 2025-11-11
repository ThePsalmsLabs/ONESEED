'use client';

import { motion } from 'framer-motion';
import { useDailySavingsSummary } from '@/hooks/useDailySavingsSummary';
import { useDailySavings } from '@/hooks/useDailySavings';
import { formatEther } from 'viem';
import { Target, Play, Settings, Zap } from 'lucide-react';
import { Button } from '../ui/Button';

interface DailySavingsOverviewProps {
  onConfigure?: () => void;
  onExecuteAll?: () => void;
}

export function DailySavingsOverview({ onConfigure, onExecuteAll }: DailySavingsOverviewProps) {
  const summary = useDailySavingsSummary();
  const { executeDailySavings, isExecuting, hasPending } = useDailySavings();

  const handleExecuteAll = async () => {
    if (onExecuteAll) {
      onExecuteAll();
    } else {
      try {
        await executeDailySavings();
      } catch (error) {
        console.error('Failed to execute daily savings:', error);
      }
    }
  };

  if (summary.isLoading) {
    return (
      <motion.div
        className="glass-solid-dark rounded-2xl p-6 border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-bg-tertiary rounded w-1/3" />
          <div className="h-12 bg-bg-tertiary rounded w-1/2" />
          <div className="h-10 bg-bg-tertiary rounded w-full" />
        </div>
      </motion.div>
    );
  }

  // If no active goals, show empty state
  if (summary.activeGoals === 0) {
    return (
      <motion.div
        className="glass-solid-dark rounded-2xl p-6 border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary-400/10 flex items-center justify-center">
            <Target className="w-8 h-8 text-primary-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary mb-2">
              No Daily Savings Goals
            </h3>
            <p className="text-text-secondary text-sm mb-4">
              Set up your first daily savings goal to start building wealth automatically.
            </p>
          </div>
          <Button
            onClick={onConfigure}
            className="bg-gradient-to-r from-primary-400 to-accent-cyan hover:from-primary-500 hover:to-accent-cyan/90"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configure Daily Savings
          </Button>
        </div>
      </motion.div>
    );
  }

  const totalSaved = summary.totalSaved;
  const hasPendingExecutions = hasPending || summary.pendingExecutions > 0;

  return (
    <motion.div
      className="glass-solid-dark rounded-2xl p-6 border border-border relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-400/5 to-accent-cyan/5" />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">
              Daily Savings Progress
            </h3>
            <p className="text-sm text-text-secondary">
              {summary.activeGoals} active goal{summary.activeGoals !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-400/10 flex items-center justify-center">
            <Target className="w-6 h-6 text-primary-400" />
          </div>
        </div>

        {/* Total Saved */}
        <div>
          <p className="text-sm text-text-muted mb-1">Total Saved</p>
          <motion.p
            className="text-3xl font-bold gradient-text"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            ${totalSaved.toFixed(2)}
          </motion.p>
          <p className="text-xs text-text-secondary mt-1">
            of ${summary.totalGoalAmount.toFixed(2)} goal
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Overall Progress</span>
            <span className="text-text-primary font-medium">
              {summary.averageProgress.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-400 to-accent-cyan"
              initial={{ width: 0 }}
              animate={{ width: `${summary.averageProgress}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          {hasPendingExecutions && (
            <Button
              onClick={handleExecuteAll}
              disabled={isExecuting}
              className="flex-1 bg-gradient-to-r from-primary-400 to-accent-cyan hover:from-primary-500 hover:to-accent-cyan/90"
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
                  Execute All ({summary.pendingExecutions || 1})
                </>
              )}
            </Button>
          )}
          <Button
            onClick={onConfigure}
            variant="secondary"
            className="flex-1"
            size="sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-text-primary">
              {summary.activeGoals}
            </p>
            <p className="text-xs text-text-muted">Active Goals</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${hasPendingExecutions ? 'text-warning' : 'text-text-primary'}`}>
              {hasPendingExecutions ? 'Yes' : 'No'}
            </p>
            <p className="text-xs text-text-muted">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-text-primary">
              {summary.averageProgress.toFixed(0)}%
            </p>
            <p className="text-xs text-text-muted">Avg Progress</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

