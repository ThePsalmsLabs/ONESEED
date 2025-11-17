'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSavingsBalanceRealtime } from '@/hooks/useSavingsBalanceRealtime';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ErrorState, LoadingState, NoWithdrawalsEmptyState } from '@/components/ui';
import { AnimatedCard, AnimatedButton, AnimatedProgress } from '@/components/ui/AnimatedComponents';
import { 
  CurrencyDollarIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CalculatorIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { formatUnits, parseUnits } from 'viem';

interface BatchWithdrawalManagerProps {
  className?: string;
  onComplete?: (withdrawals: BatchWithdrawal[]) => void;
}

interface TokenBalance {
  token: string;
  symbol: string;
  balance: bigint;
  value: number;
  penaltyRate: number;
  minWithdrawal: bigint;
  decimals: number;
}

interface BatchWithdrawal {
  id: string;
  token: string;
  symbol: string;
  amount: bigint;
  percentage: number;
  penalty: bigint;
  netAmount: bigint;
  strategy: 'immediate' | 'scheduled' | 'conditional';
  scheduleDate?: Date;
  conditions?: WithdrawalConditions;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
}

interface WithdrawalConditions {
  priceTarget?: number;
  gasPriceMax?: number;
  marketVolatility?: number;
}

interface BatchSummary {
  totalWithdrawals: number;
  totalAmount: bigint;
  totalPenalty: bigint;
  totalNetAmount: bigint;
  estimatedGasCost: bigint;
  totalCost: bigint;
  savings: bigint;
}

export function BatchWithdrawalManager({ className = '', onComplete }: BatchWithdrawalManagerProps) {
  const { balances, isLoading, error, refreshSavings } = useSavingsBalanceRealtime();

  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [withdrawals, setWithdrawals] = useState<BatchWithdrawal[]>([]);
  const [selectedWithdrawals, setSelectedWithdrawals] = useState<Set<string>>(new Set());
  const [showSummary, setShowSummary] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  // Process real savings balances into token balances
  useEffect(() => {
    if (!balances || balances.length === 0) return;

    const processedBalances: TokenBalance[] = balances.map(balance => ({
      token: balance.token,
      symbol: balance.symbol || 'UNK',
      balance: balance.amount,
      value: 0, // Will be calculated with price
      penaltyRate: 0.05, // 5% penalty - would need to get from contract
      minWithdrawal: balance.amount / BigInt(10), // 10% of balance as minimum
      decimals: balance.decimals
    }));

    setTokenBalances(processedBalances);
  }, [balances]);

  const addWithdrawal = (token: string, amount: bigint, strategy: 'immediate' | 'scheduled' | 'conditional' = 'immediate') => {
    const tokenBalance = tokenBalances.find(tb => tb.token === token);
    if (!tokenBalance) return;

    const penalty = (amount * BigInt(Math.floor(tokenBalance.penaltyRate * 100))) / BigInt(10000);
    const netAmount = amount - penalty;
    const percentage = Number(formatUnits(amount, tokenBalance.decimals)) / 
                      Number(formatUnits(tokenBalance.balance, tokenBalance.decimals)) * 100;

    const withdrawal: BatchWithdrawal = {
      id: `withdrawal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      token,
      symbol: tokenBalance.symbol,
      amount,
      percentage,
      penalty,
      netAmount,
      strategy,
      status: 'pending',
      createdAt: new Date()
    };

    setWithdrawals(prev => [...prev, withdrawal]);
  };

  const removeWithdrawal = (id: string) => {
    setWithdrawals(prev => prev.filter(w => w.id !== id));
    setSelectedWithdrawals(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleWithdrawalToggle = (id: string) => {
    const newSelected = new Set(selectedWithdrawals);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedWithdrawals(newSelected);
  };

  const calculateBatchSummary = (): BatchSummary => {
    const selectedWithdrawalData = withdrawals.filter(w => selectedWithdrawals.has(w.id));
    
    const totalWithdrawals = selectedWithdrawalData.length;
    const totalAmount = selectedWithdrawalData.reduce((sum, w) => sum + w.amount, BigInt(0));
    const totalPenalty = selectedWithdrawalData.reduce((sum, w) => sum + w.penalty, BigInt(0));
    const totalNetAmount = selectedWithdrawalData.reduce((sum, w) => sum + w.netAmount, BigInt(0));
    
    // Estimate gas cost (simplified - would need real gas estimation)
    const estimatedGasCost = BigInt(selectedWithdrawalData.length * 50000); // 50k gas per withdrawal
    const totalCost = totalPenalty + estimatedGasCost;
    
    // Calculate savings from batch execution
    const individualGasCost = BigInt(selectedWithdrawalData.length * 100000); // Higher gas for individual
    const savings = individualGasCost - estimatedGasCost;

    return {
      totalWithdrawals,
      totalAmount,
      totalPenalty,
      totalNetAmount,
      estimatedGasCost,
      totalCost,
      savings
    };
  };

  const executeBatch = async () => {
    setIsExecuting(true);
    
    try {
      // Simulate batch execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update withdrawal statuses
      setWithdrawals(prev => prev.map(w => 
        selectedWithdrawals.has(w.id) 
          ? { ...w, status: 'completed' as const }
          : w
      ));
      
      const completedWithdrawals = withdrawals.filter(w => selectedWithdrawals.has(w.id));
      onComplete?.(completedWithdrawals);
      
    } catch (error) {
      console.error('Batch execution failed:', error);
      // Update withdrawal statuses to failed
      setWithdrawals(prev => prev.map(w => 
        selectedWithdrawals.has(w.id) 
          ? { ...w, status: 'failed' as const }
          : w
      ));
    } finally {
      setIsExecuting(false);
      setSelectedWithdrawals(new Set());
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Batch Withdrawal Manager</h2>
            <p className="text-muted-foreground">Manage multiple withdrawals efficiently</p>
          </div>
        </div>
        <LoadingState message="Loading your savings balances..." />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Batch Withdrawal Manager</h2>
            <p className="text-muted-foreground">Manage multiple withdrawals efficiently</p>
          </div>
        </div>
        <ErrorState
          title="Failed to load balances"
          message="Unable to fetch your savings balances. Please try again."
          onRetry={refreshSavings}
        />
      </div>
    );
  }

  // Show empty state if no balances
  if (!balances || balances.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Batch Withdrawal Manager</h2>
            <p className="text-muted-foreground">Manage multiple withdrawals efficiently</p>
          </div>
        </div>
        <NoWithdrawalsEmptyState onAction={() => window.location.href = '/configure'} />
      </div>
    );
  }

  const batchSummary = calculateBatchSummary();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Batch Withdrawal Manager</h2>
          <p className="text-muted-foreground">Manage multiple withdrawals efficiently</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowSummary(true)}
            disabled={selectedWithdrawals.size === 0}
          >
            <CalculatorIcon className="w-4 h-4 mr-2" />
            View Summary
          </Button>
          <Button
            onClick={executeBatch}
            disabled={selectedWithdrawals.size === 0 || isExecuting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isExecuting ? (
              <>
                <ArrowRightIcon className="w-4 h-4 mr-2 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                Execute Batch
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Available Balances */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Available Balances</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tokenBalances.map((balance) => (
            <div key={balance.token} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-semibold">{balance.symbol}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatUnits(balance.balance, balance.decimals)} {balance.symbol}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${balance.value.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">
                    {balance.penaltyRate * 100}% penalty
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addWithdrawal(balance.token, balance.balance / BigInt(2))}
                >
                  50%
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addWithdrawal(balance.token, balance.balance)}
                >
                  100%
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addWithdrawal(balance.token, balance.minWithdrawal)}
                >
                  Min
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Withdrawals List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Pending Withdrawals</h3>
          <div className="text-sm text-muted-foreground">
            {withdrawals.length} withdrawal{withdrawals.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        {withdrawals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No withdrawals added yet. Select amounts from available balances above.
          </div>
        ) : (
          <div className="space-y-3">
            {withdrawals.map((withdrawal) => (
              <div
                key={withdrawal.id}
                className={`p-4 border rounded-lg transition-all duration-200 ${
                  selectedWithdrawals.has(withdrawal.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedWithdrawals.has(withdrawal.id)
                        ? 'bg-primary border-primary'
                        : 'border-gray-300'
                    }`}>
                      {selectedWithdrawals.has(withdrawal.id) && (
                        <CheckCircleIcon className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">{withdrawal.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatUnits(withdrawal.amount, tokenBalances.find(tb => tb.token === withdrawal.token)?.decimals || 18)} {withdrawal.symbol}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold">
                        ${(Number(formatUnits(withdrawal.netAmount, tokenBalances.find(tb => tb.token === withdrawal.token)?.decimals || 18)) * 1).toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {withdrawal.percentage.toFixed(1)}% • {withdrawal.strategy}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleWithdrawalToggle(withdrawal.id)}
                      >
                        {selectedWithdrawals.has(withdrawal.id) ? (
                          <EyeSlashIcon className="w-4 h-4" />
                        ) : (
                          <EyeIcon className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeWithdrawal(withdrawal.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Batch Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSummary(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Batch Withdrawal Summary</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSummary(false)}
                >
                  Close
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Withdrawals</div>
                    <div className="text-2xl font-bold">{batchSummary.totalWithdrawals}</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Amount</div>
                    <div className="text-2xl font-bold text-blue-700">
                      ${(Number(formatUnits(batchSummary.totalAmount, 18)) * 1).toFixed(2)}
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Penalty</div>
                    <div className="text-2xl font-bold text-red-700">
                      ${(Number(formatUnits(batchSummary.totalPenalty, 18)) * 1).toFixed(2)}
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Net Amount</div>
                    <div className="text-2xl font-bold text-green-700">
                      ${(Number(formatUnits(batchSummary.totalNetAmount, 18)) * 1).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Estimated Gas Savings</div>
                  <div className="text-lg font-bold text-yellow-700">
                    ${(Number(formatUnits(batchSummary.savings, 18)) * 1).toFixed(2)}
                  </div>
                  <div className="text-sm text-yellow-600">
                    Batch execution saves gas compared to individual withdrawals
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}