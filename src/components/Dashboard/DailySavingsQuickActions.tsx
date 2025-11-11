'use client';

import { motion } from 'framer-motion';
import { Play, Settings, BarChart3 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useDailySavings } from '@/hooks/useDailySavings';
import { useDailySavingsSummary } from '@/hooks/useDailySavingsSummary';

interface DailySavingsQuickActionsProps {
  onConfigure?: () => void;
  onViewAnalytics?: () => void;
  onExecuteAll?: () => void;
}

export function DailySavingsQuickActions({ 
  onConfigure, 
  onViewAnalytics,
  onExecuteAll 
}: DailySavingsQuickActionsProps) {
  const { executeDailySavings, isExecuting, hasPending } = useDailySavings();
  const summary = useDailySavingsSummary();

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

  return (
    <motion.div
      className="glass-solid-dark rounded-xl p-4 border border-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row gap-2">
        {hasPending && summary.pendingExecutions > 0 && (
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
                Execute All ({summary.pendingExecutions})
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
          Configure Goal
        </Button>
        <Button
          onClick={onViewAnalytics}
          variant="secondary"
          className="flex-1"
          size="sm"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Analytics
        </Button>
      </div>
    </motion.div>
  );
}

