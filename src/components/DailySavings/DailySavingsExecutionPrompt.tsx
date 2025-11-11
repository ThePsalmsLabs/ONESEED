'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { useDailySavings } from '@/hooks/useDailySavings';
import { useDailySavingsSummary } from '@/hooks/useDailySavingsSummary';
import { useState } from 'react';

interface DailySavingsExecutionPromptProps {
  onDismiss?: () => void;
}

export function DailySavingsExecutionPrompt({ onDismiss }: DailySavingsExecutionPromptProps) {
  const { executeDailySavings, isExecuting, hasPending } = useDailySavings();
  const summary = useDailySavingsSummary();
  const [isDismissed, setIsDismissed] = useState(false);

  const handleExecute = async () => {
    try {
      await executeDailySavings();
      // Auto-dismiss after successful execution
      setTimeout(() => {
        setIsDismissed(true);
      }, 2000);
    } catch (error) {
      console.error('Failed to execute daily savings:', error);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  // Don't show if no pending or dismissed
  if (!hasPending || summary.pendingExecutions === 0 || isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
      >
        <div className="glass-solid-dark rounded-xl p-4 border border-warning/30 bg-warning/5 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-text-primary mb-1">
                Pending Daily Savings
              </h4>
              <p className="text-sm text-text-secondary mb-3">
                You have {summary.pendingExecutions} pending execution{summary.pendingExecutions !== 1 ? 's' : ''} ready to process.
              </p>
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
                    Execute All Now
                  </>
                )}
              </Button>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-text-secondary hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

