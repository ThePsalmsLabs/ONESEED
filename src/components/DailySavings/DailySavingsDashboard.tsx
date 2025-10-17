'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDailySavings } from '@/hooks/useDailySavings';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  PlayIcon,
  PauseIcon,
  CurrencyDollarIcon,
  TargetIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { formatEther, parseEther } from 'viem';

interface DailySavingsDashboardProps {
  className?: string;
}

export function DailySavingsDashboard({ className = '' }: DailySavingsDashboardProps) {
  const {
    config,
    status,
    hasPending,
    executionStatus,
    executeDailySavings,
    executeDailySavingsForToken,
    withdrawDailySavings,
    disableDailySavings,
    isExecuting,
    isWithdrawing,
    isDisabling
  } = useDailySavings();

  const [selectedToken, setSelectedToken] = useState<`0x${string}` | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  if (!config || !status) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <CalendarIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Daily Savings Configured</h3>
        <p className="text-muted-foreground mb-4">
          Set up daily savings to start building your wealth automatically
        </p>
        <Button>Configure Daily Savings</Button>
      </div>
    );
  }

  const progressPercentage = status.goalAmount > 0n 
    ? Number((status.currentAmount * 100n) / status.goalAmount)
    : 0;

  const daysRemaining = status.estimatedCompletionDate > 0n
    ? Math.ceil((Number(status.estimatedCompletionDate) - Date.now() / 1000) / (24 * 60 * 60))
    : 0;

  const handleExecute = async () => {
    try {
      await executeDailySavings();
    } catch (error) {
      console.error('Failed to execute daily savings:', error);
    }
  };

  const handleWithdraw = async () => {
    if (!selectedToken || !withdrawAmount) return;
    
    try {
      await withdrawDailySavings({
        token: selectedToken,
        amount: withdrawAmount
      });
      setWithdrawAmount('');
    } catch (error) {
      console.error('Failed to withdraw:', error);
    }
  };

  const handleDisable = async () => {
    if (!selectedToken) return;
    
    try {
      await disableDailySavings(selectedToken);
    } catch (error) {
      console.error('Failed to disable daily savings:', error);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <CurrencyDollarIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Current Savings</h3>
              <p className="text-2xl font-bold">
                {formatEther(status.currentAmount)} ETH
              </p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {status.enabled ? 'Active' : 'Inactive'}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <TargetIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Goal Progress</h3>
              <p className="text-2xl font-bold">
                {progressPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <ClockIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Days Remaining</h3>
              <p className="text-2xl font-bold">
                {daysRemaining}
              </p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Estimated completion
          </div>
        </Card>
      </div>

      {/* Daily Savings Details */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Daily Savings Details</h2>
          <div className="flex items-center gap-2">
            {status.enabled ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircleIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Active</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <PauseIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Paused</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Daily Amount
              </label>
              <p className="text-lg font-semibold">
                {formatEther(status.dailyAmount)} ETH
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Goal Amount
              </label>
              <p className="text-lg font-semibold">
                {formatEther(status.goalAmount)} ETH
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Remaining Amount
              </label>
              <p className="text-lg font-semibold">
                {formatEther(status.remainingAmount)} ETH
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Penalty Amount
              </label>
              <p className="text-lg font-semibold text-red-600">
                {formatEther(status.penaltyAmount)} ETH
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Estimated Completion
              </label>
              <p className="text-lg font-semibold">
                {status.estimatedCompletionDate > 0n 
                  ? new Date(Number(status.estimatedCompletionDate) * 1000).toLocaleDateString()
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Execution Status */}
      {executionStatus && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Execution Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Can Execute</span>
              <div className={`px-3 py-1 rounded-full text-sm ${
                executionStatus.canExecute 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {executionStatus.canExecute ? 'Yes' : 'No'}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Days Passed</span>
              <span className="text-sm font-semibold">
                {executionStatus.daysPassed.toString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Amount to Save</span>
              <span className="text-sm font-semibold">
                {formatEther(executionStatus.amountToSave)} ETH
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {executionStatus?.canExecute && (
          <Button
            onClick={handleExecute}
            disabled={isExecuting}
            className="flex items-center gap-2"
          >
            {isExecuting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <PlayIcon className="w-4 h-4" />
            )}
            Execute Daily Savings
          </Button>
        )}

        <Button
          variant="outline"
          onClick={() => setSelectedToken('0x4200000000000000000000000000000000000006')}
          className="flex items-center gap-2"
        >
          <CurrencyDollarIcon className="w-4 h-4" />
          Withdraw
        </Button>

        <Button
          variant="outline"
          onClick={handleDisable}
          disabled={isDisabling}
          className="flex items-center gap-2 text-red-600 hover:text-red-700"
        >
          <PauseIcon className="w-4 h-4" />
          Disable
        </Button>
      </div>

      {/* Withdrawal Modal */}
      <AnimatePresence>
        {selectedToken && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-lg font-semibold mb-4">Withdraw Savings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Amount to Withdraw
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Penalty Warning</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    Early withdrawal will incur a penalty fee.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedToken(null);
                    setWithdrawAmount('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleWithdraw}
                  disabled={isWithdrawing || !withdrawAmount}
                  className="flex-1"
                >
                  {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
