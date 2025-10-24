'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSavingsBalance } from '@/hooks/useSavingsBalance';
import { useWithdraw } from '@/hooks/useWithdraw';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
import { formatEther, parseEther } from 'viem';

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
  const { tokenBalances: savingsBalances, isLoading: isLoadingSavings } = useSavingsBalance();
  const { withdraw, isPending: isLoadingWithdraw } = useWithdraw();

  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [withdrawals, setWithdrawals] = useState<BatchWithdrawal[]>([]);
  const [selectedWithdrawals, setSelectedWithdrawals] = useState<Set<string>>(new Set());
  const [showSummary, setShowSummary] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  // Mock token balances
  useEffect(() => {
    const mockBalances: TokenBalance[] = [
      {
        token: '0x4200000000000000000000000000000000000006',
        symbol: 'WETH',
        balance: parseEther('2.5'),
        value: 6250.00,
        penaltyRate: 0.05,
        minWithdrawal: parseEther('0.1')
      },
      {
        token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        symbol: 'USDC',
        balance: parseEther('5000'),
        value: 5000.00,
        penaltyRate: 0.02,
        minWithdrawal: parseEther('100')
      },
      {
        token: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
        symbol: 'DAI',
        balance: parseEther('1297.32'),
        value: 1297.32,
        penaltyRate: 0.03,
        minWithdrawal: parseEther('50')
      }
    ];
    setTokenBalances(mockBalances);
  }, []);

  const addWithdrawal = (token: string, amount: bigint, percentage: number, strategy: 'immediate' | 'scheduled' | 'conditional' = 'immediate') => {
    const tokenBalance = tokenBalances.find(t => t.token === token);
    if (!tokenBalance) return;

    const penalty = (amount * BigInt(Math.floor(tokenBalance.penaltyRate * 10000))) / BigInt(10000);
    const netAmount = amount - penalty;

    const newWithdrawal: BatchWithdrawal = {
      id: Date.now().toString(),
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

    setWithdrawals(prev => [...prev, newWithdrawal]);
  };

  const removeWithdrawal = (id: string) => {
    setWithdrawals(prev => prev.filter(w => w.id !== id));
    setSelectedWithdrawals(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const updateWithdrawal = (id: string, updates: Partial<BatchWithdrawal>) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const toggleWithdrawalSelection = (id: string) => {
    setSelectedWithdrawals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAllWithdrawals = () => {
    setSelectedWithdrawals(new Set(withdrawals.map(w => w.id)));
  };

  const clearSelection = () => {
    setSelectedWithdrawals(new Set());
  };

  const calculateBatchSummary = (): BatchSummary => {
    const selected = withdrawals.filter(w => selectedWithdrawals.has(w.id));
    
    const totalWithdrawals = selected.length;
    const totalAmount = selected.reduce((sum, w) => sum + w.amount, BigInt(0));
    const totalPenalty = selected.reduce((sum, w) => sum + w.penalty, BigInt(0));
    const totalNetAmount = selected.reduce((sum, w) => sum + w.netAmount, BigInt(0));
    
    // Mock gas cost calculation
    const estimatedGasCost = BigInt(selected.length * 150000); // 150k gas per withdrawal
    const totalCost = totalPenalty + estimatedGasCost;
    const savings = BigInt(selected.length * 100000); // Estimated savings from batching

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

  const executeBatchWithdrawal = async () => {
    setIsExecuting(true);
    
    try {
      const selected = withdrawals.filter(w => selectedWithdrawals.has(w.id));
      
      // Update status to processing
      selected.forEach(w => {
        updateWithdrawal(w.id, { status: 'processing' });
      });

      // Simulate batch execution
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Update status to completed
      selected.forEach(w => {
        updateWithdrawal(w.id, { status: 'completed' });
      });

      onComplete?.(selected);
    } catch (error) {
      console.error('Batch withdrawal failed:', error);
      
      // Update status to failed
      withdrawals.filter(w => selectedWithdrawals.has(w.id)).forEach(w => {
        updateWithdrawal(w.id, { status: 'failed' });
      });
    } finally {
      setIsExecuting(false);
    }
  };

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
          <AnimatedButton
            variant="outline"
            onClick={() => setShowSummary(!showSummary)}
            className="flex items-center gap-2"
          >
            {showSummary ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
            {showSummary ? 'Hide' : 'Show'} Summary
          </AnimatedButton>
        </div>
      </div>

      {/* Batch Summary */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Batch Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{batchSummary.totalWithdrawals}</div>
                  <div className="text-sm text-muted-foreground">Withdrawals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${(Number(formatEther(batchSummary.totalNetAmount)) * 2000).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Net Amount</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    ${(Number(formatEther(batchSummary.totalPenalty)) * 2000).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Penalty</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    ${(Number(formatEther(batchSummary.savings)) * 2000).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Gas Savings</div>
                </div>
              </div>
            </AnimatedCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Add Withdrawals */}
      <AnimatedCard className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Add Withdrawals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tokenBalances.map((token, index) => (
            <motion.div
              key={token.token}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatEther(token.balance)} {token.symbol}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${token.value.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">
                      {token.penaltyRate * 100}% penalty
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <AnimatedButton
                    size="sm"
                    onClick={() => addWithdrawal(token.token, token.balance / BigInt(2), 50)}
                    className="w-full"
                  >
                    Add 50%
                  </AnimatedButton>
                  <AnimatedButton
                    size="sm"
                    variant="outline"
                    onClick={() => addWithdrawal(token.token, token.balance, 100)}
                    className="w-full"
                  >
                    Add 100%
                  </AnimatedButton>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatedCard>

      {/* Withdrawals List */}
      <AnimatedCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Pending Withdrawals</h3>
          <div className="flex items-center gap-2">
            <AnimatedButton
              size="sm"
              variant="outline"
              onClick={selectAllWithdrawals}
              disabled={withdrawals.length === 0}
            >
              Select All
            </AnimatedButton>
            <AnimatedButton
              size="sm"
              variant="outline"
              onClick={clearSelection}
              disabled={selectedWithdrawals.size === 0}
            >
              Clear
            </AnimatedButton>
          </div>
        </div>

        {withdrawals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BanknotesIcon className="w-12 h-12 mx-auto mb-4" />
            <p>No withdrawals added yet</p>
            <p className="text-sm">Use the quick add buttons above to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {withdrawals.map((withdrawal, index) => (
              <motion.div
                key={withdrawal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border transition-all ${
                  selectedWithdrawals.has(withdrawal.id) 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedWithdrawals.has(withdrawal.id)}
                      onChange={() => toggleWithdrawalSelection(withdrawal.id)}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <div>
                      <div className="font-medium">{withdrawal.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        {withdrawal.percentage}% • {withdrawal.strategy}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatEther(withdrawal.amount)} {withdrawal.symbol}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Net: {formatEther(withdrawal.netAmount)} {withdrawal.symbol}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        withdrawal.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        withdrawal.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {withdrawal.status}
                      </div>
                      
                      <AnimatedButton
                        size="sm"
                        variant="outline"
                        onClick={() => removeWithdrawal(withdrawal.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </AnimatedButton>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatedCard>

      {/* Execute Batch */}
      {withdrawals.length > 0 && (
        <AnimatedCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Execute Batch Withdrawal</h3>
              <p className="text-sm text-muted-foreground">
                {selectedWithdrawals.size} of {withdrawals.length} withdrawals selected
              </p>
            </div>
            <AnimatedButton
              onClick={executeBatchWithdrawal}
              disabled={selectedWithdrawals.size === 0 || isExecuting}
              className="flex items-center gap-2"
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <BanknotesIcon className="w-4 h-4" />
                  Execute Batch ({selectedWithdrawals.size})
                </>
              )}
            </AnimatedButton>
          </div>
        </AnimatedCard>
      )}
    </div>
  );
}

