'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDCA } from '@/hooks/useDCA';
import { useDCAAnalytics } from '@/hooks/useDCAAnalytics';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  PlayIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { formatUnits } from 'viem';

interface DCAExecutionMonitorProps {
  className?: string;
}

export function DCAExecutionMonitor({ className = '' }: DCAExecutionMonitorProps) {
  const {
    config,
    pending,
    executeDCA,
    isExecuting,
    executeError,
    isLoadingConfig,
    isLoadingPending
  } = useDCA();

  const { metrics, isLoading: isLoadingMetrics, refetch } = useDCAAnalytics();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleExecute = async () => {
    try {
      await executeDCA();
    } catch (error) {
      console.error('DCA execution failed:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const isLoading = isLoadingConfig || isLoadingPending || isLoadingMetrics;

  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!config?.enabled) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center py-12">
          <div className="text-5xl mb-3">📊</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">DCA Not Enabled</h3>
          <p className="text-gray-600 mb-6">
            Enable Dollar-Cost Averaging to start automatic token conversions
          </p>
          <Button variant="primary">Enable DCA</Button>
        </div>
      </Card>
    );
  }

  const hasPendingExecutions = pending && (pending.tokens.length > 0);
  const canExecute = hasPendingExecutions && !isExecuting;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">DCA Execution Monitor</h2>
          <p className="text-muted-foreground">Track your dollar-cost averaging strategy</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          {canExecute && (
            <Button
              variant="primary"
              onClick={handleExecute}
              disabled={isExecuting}
            >
              <PlayIcon className="w-4 h-4 mr-2" />
              {isExecuting ? 'Executing...' : 'Execute DCA'}
            </Button>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <ChartBarIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Executions</div>
              <div className="text-2xl font-bold">{metrics.executionCount}</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Volume</div>
              <div className="text-2xl font-bold">
                {Number(metrics.totalVolumeFormatted).toFixed(4)}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Avg Amount</div>
              <div className="text-2xl font-bold">
                {Number(metrics.averageAmount).toFixed(4)}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
              <div className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Current Configuration */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Current Configuration</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Status</div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${config.enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="font-medium">{config.enabled ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Target Token</div>
            <div className="font-medium">{config.targetToken.slice(0, 10)}...</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Min Amount</div>
            <div className="font-medium">{formatUnits(config.minAmount, 18)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Max Slippage</div>
            <div className="font-medium">{Number(config.maxSlippage) / 100}%</div>
          </div>
        </div>
      </Card>

      {/* Pending Executions */}
      {hasPendingExecutions && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Pending Executions</h3>
            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
              {pending.tokens.length} Pending
            </span>
          </div>
          <div className="space-y-3">
            {pending.tokens.map((token, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
              >
                <div>
                  <div className="font-medium">Token {index + 1}</div>
                  <div className="text-sm text-muted-foreground">
                    {token.slice(0, 10)}...{token.slice(-8)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {formatUnits(pending.amounts[index], 18)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    → {pending.targets[index].slice(0, 6)}...
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Execution Status */}
      {!hasPendingExecutions && metrics.executionCount === 0 && (
        <Card className="p-6">
          <div className="text-center py-8">
            <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No DCA executions yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Executions will appear here when conditions are met
            </p>
          </div>
        </Card>
      )}

      {/* Error Display */}
      {executeError && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-2 text-red-800">
            <ExclamationTriangleIcon className="w-5 h-5" />
            <span className="font-medium">Execution Error:</span>
            <span className="text-sm">{executeError.message}</span>
          </div>
        </Card>
      )}
    </div>
  );
}
