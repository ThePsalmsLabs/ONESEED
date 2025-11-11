'use client';

import { motion } from 'framer-motion';
import { Target, TrendingUp, Shield } from 'lucide-react';
import { Button } from '../ui/Button';

interface DailySavingsEmptyStateProps {
  onConfigure?: () => void;
}

export function DailySavingsEmptyState({ onConfigure }: DailySavingsEmptyStateProps) {
  return (
    <motion.div
      className="glass-solid-dark rounded-2xl p-8 border border-border text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-md mx-auto space-y-6">
        {/* Icon */}
        <motion.div
          className="w-20 h-20 mx-auto rounded-full bg-primary-400/10 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Target className="w-10 h-10 text-primary-400" />
        </motion.div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-text-primary">
            No Daily Savings Goals
          </h3>
          <p className="text-text-secondary">
            Set up your first daily savings goal to start building wealth automatically.
            Save a fixed amount every day toward your financial goals.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-bg-tertiary/50">
            <TrendingUp className="w-6 h-6 text-primary-400" />
            <p className="text-sm font-medium text-text-primary">Automatic</p>
            <p className="text-xs text-text-secondary text-center">
              Save daily without thinking
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-bg-tertiary/50">
            <Target className="w-6 h-6 text-primary-400" />
            <p className="text-sm font-medium text-text-primary">Goal-Oriented</p>
            <p className="text-xs text-text-secondary text-center">
              Set targets and track progress
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-bg-tertiary/50">
            <Shield className="w-6 h-6 text-primary-400" />
            <p className="text-sm font-medium text-text-primary">Protected</p>
            <p className="text-xs text-text-secondary text-center">
              Early withdrawal penalties
            </p>
          </div>
        </div>

        {/* CTA */}
        <Button
          onClick={onConfigure}
          className="bg-gradient-to-r from-primary-400 to-accent-cyan hover:from-primary-500 hover:to-accent-cyan/90 mt-4"
          size="lg"
        >
          <Target className="w-4 h-4 mr-2" />
          Create Your First Goal
        </Button>
      </div>
    </motion.div>
  );
}
