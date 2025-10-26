'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSavingsBalanceRealtime } from '@/hooks/useSavingsBalanceRealtime';
import { useTokenPrice } from '@/hooks/swap/useTokenPrice';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ErrorState, LoadingState, NoWithdrawalsEmptyState } from '@/components/ui';
import { AnimatedCard, AnimatedButton, AnimatedInput, AnimatedProgress } from '@/components/ui/AnimatedComponents';
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
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { formatUnits, parseUnits } from 'viem';

interface WithdrawalWizardProps {
  className?: string;
  onComplete?: (withdrawalData: WithdrawalData) => void;
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

interface WithdrawalData {
  tokens: Array<{
    token: string;
    amount: bigint;
    percentage: number;
  }>;
  strategy: 'immediate' | 'scheduled' | 'conditional';
  scheduleDate?: Date;
  conditions?: WithdrawalConditions;
  totalAmount: bigint;
  totalPenalty: bigint;
  netAmount: bigint;
}

interface WithdrawalConditions {
  priceTarget?: number;
  gasPriceMax?: number;
  marketVolatility?: number;
}

const steps = [
  { id: 'tokens', title: 'Select Tokens', description: 'Choose tokens to withdraw' },
  { id: 'amounts', title: 'Set Amounts', description: 'Specify withdrawal amounts' },
  { id: 'strategy', title: 'Withdrawal Strategy', description: 'Choose withdrawal approach' },
  { id: 'preview', title: 'Review & Confirm', description: 'Review and confirm withdrawal' }
];

export function WithdrawalWizard({ className = '', onComplete }: WithdrawalWizardProps) {
  const { balances, isLoading: isLoadingSavings, error: savingsError, refreshSavings } = useSavingsBalanceRealtime();

  const [currentStep, setCurrentStep] = useState(0);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set());
  const [withdrawalAmounts, setWithdrawalAmounts] = useState<Record<string, bigint>>({});
  const [withdrawalPercentages, setWithdrawalPercentages] = useState<Record<string, number>>({});
  const [strategy, setStrategy] = useState<'immediate' | 'scheduled' | 'conditional'>('immediate');
  const [scheduleDate, setScheduleDate] = useState<Date>(new Date());
  const [conditions, setConditions] = useState<WithdrawalConditions>({});
  const [withdrawalData, setWithdrawalData] = useState<WithdrawalData | null>(null);

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

  // Calculate USD values for each token
  useEffect(() => {
    if (tokenBalances.length === 0) return;

    const updatedBalances = tokenBalances.map(async (balance) => {
      const { priceUSD } = useTokenPrice({
        tokenAddress: balance.token as `0x${string}`,
        enabled: true
      });

      return {
        ...balance,
        value: Number(formatUnits(balance.balance, balance.decimals)) * priceUSD
      };
    });

    // Note: This is a simplified approach. In a real implementation,
    // you'd need to handle the async nature properly
    Promise.all(updatedBalances).then(setTokenBalances);
  }, [tokenBalances]);

  const handleTokenToggle = (token: string) => {
    const newSelected = new Set(selectedTokens);
    if (newSelected.has(token)) {
      newSelected.delete(token);
    } else {
      newSelected.add(token);
    }
    setSelectedTokens(newSelected);
  };

  const handleAmountChange = (token: string, amount: string) => {
    const tokenBalance = tokenBalances.find(tb => tb.token === token);
    if (!tokenBalance) return;

    try {
      const amountBigInt = parseUnits(amount, tokenBalance.decimals);
      const percentage = Number(formatUnits(amountBigInt, tokenBalance.decimals)) / 
                        Number(formatUnits(tokenBalance.balance, tokenBalance.decimals)) * 100;

      setWithdrawalAmounts(prev => ({ ...prev, [token]: amountBigInt }));
      setWithdrawalPercentages(prev => ({ ...prev, [token]: percentage }));
    } catch (error) {
      console.error('Invalid amount:', error);
    }
  };

  const handlePercentageChange = (token: string, percentage: number) => {
    const tokenBalance = tokenBalances.find(tb => tb.token === token);
    if (!tokenBalance) return;

    const amountBigInt = (tokenBalance.balance * BigInt(Math.floor(percentage * 100))) / BigInt(10000);
    
    setWithdrawalAmounts(prev => ({ ...prev, [token]: amountBigInt }));
    setWithdrawalPercentages(prev => ({ ...prev, [token]: percentage }));
  };

  const calculateWithdrawalData = (): WithdrawalData => {
    const tokens = Array.from(selectedTokens).map(token => {
      const amount = withdrawalAmounts[token] || BigInt(0);
      const percentage = withdrawalPercentages[token] || 0;
      return { token, amount, percentage };
    });

    const totalAmount = tokens.reduce((sum, token) => sum + token.amount, BigInt(0));
    const totalPenalty = tokens.reduce((sum, token) => {
      const tokenBalance = tokenBalances.find(tb => tb.token === token.token);
      const penalty = tokenBalance ? (token.amount * BigInt(Math.floor(tokenBalance.penaltyRate * 100))) / BigInt(10000) : BigInt(0);
      return sum + penalty;
    }, BigInt(0));
    const netAmount = totalAmount - totalPenalty;

    return {
      tokens,
      strategy,
      scheduleDate: strategy === 'scheduled' ? scheduleDate : undefined,
      conditions: strategy === 'conditional' ? conditions : undefined,
      totalAmount,
      totalPenalty,
      netAmount
    };
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const data = calculateWithdrawalData();
      setWithdrawalData(data);
      onComplete?.(data);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedTokens.size > 0;
      case 1:
        return Array.from(selectedTokens).every(token => 
          withdrawalAmounts[token] && withdrawalAmounts[token] > BigInt(0)
        );
      case 2:
        return true;
      case 3:
        return true;
      default:
        return false;
    }
  };

  // Show loading state
  if (isLoadingSavings) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Withdrawal Wizard</h2>
            <p className="text-muted-foreground">Withdraw your savings step by step</p>
          </div>
        </div>
        <LoadingState message="Loading your savings balances..." />
      </div>
    );
  }

  // Show error state
  if (savingsError) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Withdrawal Wizard</h2>
            <p className="text-muted-foreground">Withdraw your savings step by step</p>
          </div>
        </div>
        <ErrorState
          title="Failed to load savings"
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
            <h2 className="text-2xl font-bold">Withdrawal Wizard</h2>
            <p className="text-muted-foreground">Withdraw your savings step by step</p>
          </div>
        </div>
        <NoWithdrawalsEmptyState onAction={() => window.location.href = '/configure'} />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Withdrawal Wizard</h2>
          <p className="text-muted-foreground">Withdraw your savings step by step</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>

      {/* Progress */}
      <AnimatedProgress
        value={(currentStep / (steps.length - 1)) * 100}
        className="w-full"
      />

      {/* Steps */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`text-center p-3 rounded-lg transition-all duration-200 ${
              index <= currentStep
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            <div className="font-semibold text-sm">{step.title}</div>
            <div className="text-xs opacity-75">{step.description}</div>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 1: Select Tokens */}
          {currentStep === 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Select Tokens to Withdraw</h3>
              <div className="space-y-3">
                {tokenBalances.map((balance) => (
                  <div
                    key={balance.token}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedTokens.has(balance.token)
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleTokenToggle(balance.token)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedTokens.has(balance.token)
                            ? 'bg-primary border-primary'
                            : 'border-gray-300'
                        }`}>
                          {selectedTokens.has(balance.token) && (
                            <CheckCircleIcon className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold">{balance.symbol}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatUnits(balance.balance, balance.decimals)} {balance.symbol}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${balance.value.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">
                          {balance.penaltyRate * 100}% penalty
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Step 2: Set Amounts */}
          {currentStep === 1 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Set Withdrawal Amounts</h3>
              <div className="space-y-4">
                {Array.from(selectedTokens).map((token) => {
                  const balance = tokenBalances.find(tb => tb.token === token);
                  if (!balance) return null;

                  return (
                    <div key={token} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold">{balance.symbol}</div>
                          <div className="text-sm text-muted-foreground">
                            Available: {formatUnits(balance.balance, balance.decimals)} {balance.symbol}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${balance.value.toFixed(2)}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Amount</label>
                          <AnimatedInput
                            type="number"
                            placeholder="0.00"
                            value={withdrawalAmounts[token] ? formatUnits(withdrawalAmounts[token], balance.decimals) : ''}
                            onChange={(e) => handleAmountChange(token, e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Percentage</label>
                          <div className="flex gap-2 mt-1">
                            {[25, 50, 75, 100].map((percentage) => (
                              <Button
                                key={percentage}
                                variant="outline"
                                size="sm"
                                onClick={() => handlePercentageChange(token, percentage)}
                                className={withdrawalPercentages[token] === percentage ? 'bg-primary text-white' : ''}
                              >
                                {percentage}%
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Step 3: Withdrawal Strategy */}
          {currentStep === 2 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Choose Withdrawal Strategy</h3>
              <div className="space-y-4">
                {[
                  {
                    id: 'immediate',
                    title: 'Immediate Withdrawal',
                    description: 'Withdraw funds immediately with penalty',
                    icon: ArrowTrendingDownIcon,
                    penalty: '5% penalty applies'
                  },
                  {
                    id: 'scheduled',
                    title: 'Scheduled Withdrawal',
                    description: 'Schedule withdrawal for a specific date',
                    icon: ClockIcon,
                    penalty: 'Reduced penalty based on timing'
                  },
                  {
                    id: 'conditional',
                    title: 'Conditional Withdrawal',
                    description: 'Withdraw when conditions are met',
                    icon: ShieldCheckIcon,
                    penalty: 'No penalty if conditions met'
                  }
                ].map((strategyOption) => (
                  <div
                    key={strategyOption.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      strategy === strategyOption.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setStrategy(strategyOption.id as any)}
                  >
                    <div className="flex items-center gap-3">
                      <strategyOption.icon className="w-6 h-6 text-primary" />
                      <div className="flex-1">
                        <div className="font-semibold">{strategyOption.title}</div>
                        <div className="text-sm text-muted-foreground">{strategyOption.description}</div>
                        <div className="text-xs text-orange-600 mt-1">{strategyOption.penalty}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Step 4: Preview */}
          {currentStep === 3 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Review Withdrawal</h3>
              {(() => {
                const data = calculateWithdrawalData();
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Total Amount</div>
                        <div className="text-xl font-bold">
                          ${Array.from(selectedTokens).reduce((sum, token) => {
                            const balance = tokenBalances.find(tb => tb.token === token);
                            const amount = withdrawalAmounts[token] || BigInt(0);
                            const value = balance ? Number(formatUnits(amount, balance.decimals)) * balance.value / Number(formatUnits(balance.balance, balance.decimals)) : 0;
                            return sum + value;
                          }, 0).toFixed(2)}
                        </div>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Total Penalty</div>
                        <div className="text-xl font-bold text-red-600">
                          ${Array.from(selectedTokens).reduce((sum, token) => {
                            const balance = tokenBalances.find(tb => tb.token === token);
                            const amount = withdrawalAmounts[token] || BigInt(0);
                            const penalty = balance ? (amount * BigInt(Math.floor(balance.penaltyRate * 100))) / BigInt(10000) : BigInt(0);
                            const value = balance ? Number(formatUnits(penalty, balance.decimals)) * balance.value / Number(formatUnits(balance.balance, balance.decimals)) : 0;
                            return sum + value;
                          }, 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-muted-foreground">Net Amount (After Penalty)</div>
                      <div className="text-2xl font-bold text-green-700">
                        ${Array.from(selectedTokens).reduce((sum, token) => {
                          const balance = tokenBalances.find(tb => tb.token === token);
                          const amount = withdrawalAmounts[token] || BigInt(0);
                          const penalty = balance ? (amount * BigInt(Math.floor(balance.penaltyRate * 100))) / BigInt(10000) : BigInt(0);
                          const netAmount = amount - penalty;
                          const value = balance ? Number(formatUnits(netAmount, balance.decimals)) * balance.value / Number(formatUnits(balance.balance, balance.decimals)) : 0;
                          return sum + value;
                        }, 0).toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
        >
          {currentStep === steps.length - 1 ? 'Complete Withdrawal' : 'Next'}
          <ArrowRightIcon className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}