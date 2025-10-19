'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDailySavings } from '@/hooks/useDailySavings';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { formatEther, parseEther } from 'viem';

interface DailySavingsExecutionProps {
  className?: string;
}

export function DailySavingsExecution({ className = '' }: DailySavingsExecutionProps) {
  const {
    config,
    status,
    hasPending,
    executionStatus,
    executeDailySavings,
    executeDailySavingsForToken,
    isExecuting,
    isExecutingToken,
    executeError,
    executeTokenError
  } = useDailySavings();

  const [isAutoExecuting, setIsAutoExecuting] = useState(false);
  const [executionHistory, setExecutionHistory] = useState<Array<{
    timestamp: number;
    amount: string;
    success: boolean;
    txHash?: string;
  }>>([]);

  // Auto-execution logic
  useEffect(() => {
    if (isAutoExecuting && executionStatus?.canExecute && !isExecuting) {
      const executeWithDelay = async () => {
        try {
          await executeDailySavings();
          setExecutionHistory(prev => [...prev, {
            timestamp: Date.now(),
            amount: executionStatus.amountToSave.toString(),
            success: true
          }]);
        } catch (error) {
          setExecutionHistory(prev => [...prev, {
            timestamp: Date.now(),
            amount: executionStatus.amountToSave.toString(),
            success: false
          }]);
        }
      };

      const timeout = setTimeout(executeWithDelay, 2000);
      return () => clearTimeout(timeout);
    }
  }, [isAutoExecuting, executionStatus, isExecuting, executeDailySavings]);

  const handleManualExecute = async () => {
    try {
      await executeDailySavings();
      setExecutionHistory(prev => [...prev, {
        timestamp: Date.now(),
        amount: executionStatus?.amountToSave.toString() || '0',
        success: true
      }]);
    } catch (error) {
      setExecutionHistory(prev => [...prev, {
        timestamp: Date.now(),
        amount: executionStatus?.amountToSave.toString() || '0',
        success: false
      }]);
    }
  };

  const handleAutoExecute = () => {
    setIsAutoExecuting(!isAutoExecuting);
  };

  if (!config || !status) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <CalendarIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Daily Savings Configured</h3>
        <p className="text-muted-foreground">
          Configure daily savings to start automatic execution
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Execution Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Daily Savings Execution</h2>
          <div className="flex items-center gap-2">
            {executionStatus?.canExecute ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircleIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Ready to Execute</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <ClockIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Not Ready</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {formatEther(executionStatus?.amountToSave || 0n)}
            </div>
            <div className="text-sm text-muted-foreground">Amount to Save</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {executionStatus?.daysPassed.toString() || '0'}
            </div>
            <div className="text-sm text-muted-foreground">Days Passed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {executionStatus?.canExecute ? 'Yes' : 'No'}
            </div>
            <div className="text-sm text-muted-foreground">Can Execute</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleManualExecute}
            disabled={!executionStatus?.canExecute || isExecuting}
            className="flex items-center gap-2"
          >
            {isExecuting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <PlayIcon className="w-4 h-4" />
            )}
            Execute Now
          </Button>

          <Button
            variant="outline"
            onClick={handleAutoExecute}
            disabled={!executionStatus?.canExecute}
            className={`flex items-center gap-2 ${
              isAutoExecuting ? 'bg-red-50 text-red-600 border-red-200' : ''
            }`}
          >
            {isAutoExecuting ? (
              <PauseIcon className="w-4 h-4" />
            ) : (
              <ArrowPathIcon className="w-4 h-4" />
            )}
            {isAutoExecuting ? 'Stop Auto-Execute' : 'Start Auto-Execute'}
          </Button>
        </div>

        {isAutoExecuting && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <ArrowPathIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Auto-Execution Active</span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              Daily savings will be executed automatically when conditions are met.
            </p>
          </div>
        )}
      </Card>

      {/* Execution History */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Execution History</h3>
        <div className="space-y-3">
          {executionHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ClockIcon className="w-8 h-8 mx-auto mb-2" />
              <p>No executions yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {executionHistory.slice(-10).reverse().map((execution, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      execution.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {execution.success ? (
                        <CheckCircleIcon className="w-4 h-4" />
                      ) : (
                        <ExclamationTriangleIcon className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        {formatEther(parseEther(execution.amount))} ETH
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(execution.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    execution.success 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {execution.success ? 'Success' : 'Failed'}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Error Display */}
      <AnimatePresence>
        {(executeError || executeTokenError) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center gap-2 text-red-800">
              <ExclamationTriangleIcon className="w-4 h-4" />
              <span className="font-medium">Execution Error</span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              {executeError?.message || executeTokenError?.message || 'Failed to execute daily savings'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Tracking */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Progress Tracking</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Current Progress</span>
              <span>{((Number(status.currentAmount) / Number(status.goalAmount)) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min((Number(status.currentAmount) / Number(status.goalAmount)) * 100, 100)}%` 
                }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Current Amount</div>
              <div className="font-semibold">{formatEther(status.currentAmount)} ETH</div>
            </div>
            <div>
              <div className="text-muted-foreground">Goal Amount</div>
              <div className="font-semibold">{formatEther(status.goalAmount)} ETH</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
