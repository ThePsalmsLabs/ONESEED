'use client';

import { motion } from 'framer-motion';
import { useDailySavingsSummary } from '@/hooks/useDailySavingsSummary';
import { DailySavingsGoalCard } from '../DailySavings/DailySavingsGoalCard';
import { DailySavingsEmptyState } from '../DailySavings/DailySavingsEmptyState';
import { Target } from 'lucide-react';

interface DailySavingsGoalsProps {
  onConfigure?: () => void;
}

export function DailySavingsGoals({ onConfigure }: DailySavingsGoalsProps) {
  const summary = useDailySavingsSummary();

  if (summary.isLoading) {
    return (
      <motion.div
        className="glass-solid-dark rounded-2xl p-6 border border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-bg-tertiary rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="h-48 bg-bg-tertiary rounded-xl" />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (summary.tokens.length === 0) {
    return (
      <DailySavingsEmptyState onConfigure={onConfigure} />
    );
  }

  return (
    <motion.div
      className="glass-solid-dark rounded-2xl p-6 border border-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-400/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Your Savings Goals
            </h3>
            <p className="text-sm text-text-secondary">
              {summary.activeGoals} active goal{summary.activeGoals !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {summary.tokens.map((tokenData, index) => (
          <motion.div
            key={tokenData.token}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <DailySavingsGoalCard
              token={tokenData.token}
              symbol={tokenData.symbol}
              name={tokenData.name}
              icon={tokenData.icon}
              enabled={tokenData.enabled}
              dailyAmount={tokenData.dailyAmount}
              goalAmount={tokenData.goalAmount}
              currentAmount={tokenData.currentAmount}
              remainingAmount={tokenData.remainingAmount}
              penaltyAmount={tokenData.penaltyAmount}
              estimatedCompletionDate={tokenData.estimatedCompletionDate}
              canExecute={tokenData.canExecute}
              daysPassed={tokenData.daysPassed}
              amountToSave={tokenData.amountToSave}
              progress={tokenData.progress}
              daysRemaining={tokenData.daysRemaining}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

