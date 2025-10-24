'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSavingsBalance } from '@/hooks/useSavingsBalance';
import { useWithdraw } from '@/hooks/useWithdraw';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
import { formatEther, parseEther } from 'viem';

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
  const { tokenBalances: savingsBalances, isLoading: isLoadingSavings } = useSavingsBalance();
  const { withdraw, isPending: isLoadingWithdraw } = useWithdraw();

  const [currentStep, setCurrentStep] = useState(0);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set());
  const [withdrawalAmounts, setWithdrawalAmounts] = useState<Record<string, bigint>>({});
  const [withdrawalPercentages, setWithdrawalPercentages] = useState<Record<string, number>>({});
  const [strategy, setStrategy] = useState<'immediate' | 'scheduled' | 'conditional'>('immediate');
  const [scheduleDate, setScheduleDate] = useState<Date>(new Date());
  const [conditions, setConditions] = useState<WithdrawalConditions>({});
  const [withdrawalData, setWithdrawalData] = useState<WithdrawalData | null>(null);

  // Mock token balances
  useEffect(() => {
    const mockBalances: TokenBalance[] = [
      {
        token: '0x4200000000000000000000000000000000000006',
        symbol: 'WETH',
        balance: parseEther('2.5'),
        value: 6250.00,
        penaltyRate: 0.05, // 5% penalty
        minWithdrawal: parseEther('0.1')
      },
      {
        token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        symbol: 'USDC',
        balance: parseEther('5000'),
        value: 5000.00,
        penaltyRate: 0.02, // 2% penalty
        minWithdrawal: parseEther('100')
      },
      {
        token: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
        symbol: 'DAI',
        balance: parseEther('1297.32'),
        value: 1297.32,
        penaltyRate: 0.03, // 3% penalty
        minWithdrawal: parseEther('50')
      }
    ];
    setTokenBalances(mockBalances);
  }, []);

  const handleTokenSelect = (token: string) => {
    setSelectedTokens(prev => {
      const newSet = new Set(prev);
      if (newSet.has(token)) {
        newSet.delete(token);
      } else {
        newSet.add(token);
      }
      return newSet;
    });
  };

  const handleAmountChange = (token: string, amount: string) => {
    const parsedAmount = parseEther(amount);
    setWithdrawalAmounts(prev => ({
      ...prev,
      [token]: parsedAmount
    }));
  };

  const handlePercentageChange = (token: string, percentage: number) => {
    setWithdrawalPercentages(prev => ({
      ...prev,
      [token]: percentage
    }));
    
    const tokenBalance = tokenBalances.find(t => t.token === token);
    if (tokenBalance) {
      const amount = (tokenBalance.balance * BigInt(percentage)) / BigInt(100);
      setWithdrawalAmounts(prev => ({
        ...prev,
        [token]: amount
      }));
    }
  };

  const calculateWithdrawalPreview = () => {
    const tokens = Array.from(selectedTokens).map(token => {
      const amount = withdrawalAmounts[token] || BigInt(0);
      const tokenBalance = tokenBalances.find(t => t.token === token);
      const percentage = tokenBalance ? Number((amount * BigInt(100)) / tokenBalance.balance) : 0;
      
      return { token, amount, percentage };
    });

    const totalAmount = tokens.reduce((sum, t) => sum + t.amount, BigInt(0));
    const totalPenalty = tokens.reduce((sum, t) => {
      const tokenBalance = tokenBalances.find(tb => tb.token === t.token);
      return sum + (t.amount * BigInt(Math.floor(tokenBalance?.penaltyRate || 0 * 10000))) / BigInt(10000);
    }, BigInt(0));
    const netAmount = totalAmount - totalPenalty;

    return {
      tokens,
      strategy,
      scheduleDate,
      conditions,
      totalAmount,
      totalPenalty,
      netAmount
    };
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const data = calculateWithdrawalPreview();
      setWithdrawalData(data);
      onComplete?.(data);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawalData) return;
    
    try {
      // Execute withdrawal logic here
      console.log('Executing withdrawal:', withdrawalData);
      // await withdraw(withdrawalData);
    } catch (error) {
      console.error('Withdrawal failed:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Select Tokens to Withdraw</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tokenBalances.map((token, index) => (
                <motion.div
                  key={token.token}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={`p-4 cursor-pointer transition-all ${
                      selectedTokens.has(token.token) 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleTokenSelect(token.token)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedTokens.has(token.token)}
                          onChange={() => handleTokenSelect(token.token)}
                          className="w-4 h-4 text-primary rounded focus:ring-primary"
                        />
                        <div>
                          <div className="font-medium">{token.symbol}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatEther(token.balance)} {token.symbol}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${token.value.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {token.penaltyRate * 100}% penalty
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Set Withdrawal Amounts</h3>
            {Array.from(selectedTokens).map((token, index) => {
              const tokenBalance = tokenBalances.find(t => t.token === token);
              if (!tokenBalance) return null;

              return (
                <motion.div
                  key={token}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="font-medium">{tokenBalance.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          Available: {formatEther(tokenBalance.balance)} {tokenBalance.symbol}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${tokenBalance.value.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {tokenBalance.penaltyRate * 100}% penalty
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Withdrawal Amount</label>
                        <AnimatedInput
                          type="number"
                          value={formatEther(withdrawalAmounts[token] || BigInt(0))}
                          onChange={(e) => handleAmountChange(token, e.target.value)}
                          placeholder="0.0"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Percentage</label>
                        <AnimatedProgress
                          value={withdrawalPercentages[token] || 0}
                          max={100}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-1">
                          <span>0%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold">
                            {formatEther(withdrawalAmounts[token] || BigInt(0))} {tokenBalance.symbol}
                          </div>
                          <div className="text-muted-foreground">Amount</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-red-600">
                            {formatEther((withdrawalAmounts[token] || BigInt(0)) * BigInt(Math.floor(tokenBalance.penaltyRate * 10000)) / BigInt(10000))} {tokenBalance.symbol}
                          </div>
                          <div className="text-muted-foreground">Penalty</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-green-600">
                            {formatEther((withdrawalAmounts[token] || BigInt(0)) - ((withdrawalAmounts[token] || BigInt(0)) * BigInt(Math.floor(tokenBalance.penaltyRate * 10000)) / BigInt(10000)))} {tokenBalance.symbol}
                          </div>
                          <div className="text-muted-foreground">Net Amount</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Choose Withdrawal Strategy</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card 
                className={`p-4 cursor-pointer transition-all ${
                  strategy === 'immediate' ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => setStrategy('immediate')}
              >
                <div className="text-center">
                  <ArrowTrendingDownIcon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-semibold">Immediate</h4>
                  <p className="text-sm text-muted-foreground">Withdraw now</p>
                </div>
              </Card>

              <Card 
                className={`p-4 cursor-pointer transition-all ${
                  strategy === 'scheduled' ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => setStrategy('scheduled')}
              >
                <div className="text-center">
                  <ClockIcon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-semibold">Scheduled</h4>
                  <p className="text-sm text-muted-foreground">Withdraw at specific time</p>
                </div>
              </Card>

              <Card 
                className={`p-4 cursor-pointer transition-all ${
                  strategy === 'conditional' ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => setStrategy('conditional')}
              >
                <div className="text-center">
                  <InformationCircleIcon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-semibold">Conditional</h4>
                  <p className="text-sm text-muted-foreground">Withdraw when conditions are met</p>
                </div>
              </Card>
            </div>

            {strategy === 'scheduled' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4"
              >
                <Card className="p-4">
                  <label className="block text-sm font-medium mb-2">Schedule Date</label>
                  <input
                    type="datetime-local"
                    value={scheduleDate.toISOString().slice(0, 16)}
                    onChange={(e) => setScheduleDate(new Date(e.target.value))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </Card>
              </motion.div>
            )}

            {strategy === 'conditional' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4"
              >
                <Card className="p-4">
                  <h4 className="font-semibold mb-4">Withdrawal Conditions</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Price Target (Optional)</label>
                      <AnimatedInput
                        type="number"
                        placeholder="0.0"
                        value={conditions.priceTarget || ''}
                        onChange={(e) => setConditions(prev => ({ ...prev, priceTarget: parseFloat(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Max Gas Price (Gwei)</label>
                      <AnimatedInput
                        type="number"
                        placeholder="50"
                        value={conditions.gasPriceMax || ''}
                        onChange={(e) => setConditions(prev => ({ ...prev, gasPriceMax: parseFloat(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Max Market Volatility (%)</label>
                      <AnimatedInput
                        type="number"
                        placeholder="5.0"
                        value={conditions.marketVolatility || ''}
                        onChange={(e) => setConditions(prev => ({ ...prev, marketVolatility: parseFloat(e.target.value) }))}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        );

      case 3:
        const preview = calculateWithdrawalPreview();
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Review Withdrawal</h3>
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Strategy</span>
                  <span className="capitalize">{strategy}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount</span>
                  <span className="font-semibold">{formatEther(preview.totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Penalty</span>
                  <span className="font-semibold text-red-600">{formatEther(preview.totalPenalty)}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="font-medium">Net Amount</span>
                  <span className="font-semibold text-green-600">{formatEther(preview.netAmount)}</span>
                </div>
              </div>
            </Card>

            <div className="space-y-2">
              {preview.tokens.map((token, index) => {
                const tokenBalance = tokenBalances.find(t => t.token === token.token);
                return (
                  <motion.div
                    key={token.token}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{tokenBalance?.symbol}</div>
                          <div className="text-sm text-muted-foreground">{token.percentage}% of balance</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatEther(token.amount)} {tokenBalance?.symbol}</div>
                          <div className="text-sm text-muted-foreground">
                            Penalty: {formatEther((token.amount * BigInt(Math.floor((tokenBalance?.penaltyRate || 0) * 10000))) / BigInt(10000))} {tokenBalance?.symbol}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              index <= currentStep 
                ? 'bg-primary text-white' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {index + 1}
            </div>
            <div className="ml-3">
              <div className="font-medium">{step.title}</div>
              <div className="text-sm text-muted-foreground">{step.description}</div>
            </div>
            {index < steps.length - 1 && (
              <ArrowRightIcon className="w-4 h-4 mx-4 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatedCard className="p-6">
        {renderStepContent()}
      </AnimatedCard>

      {/* Navigation */}
      <div className="flex justify-between">
        <AnimatedButton
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Previous
        </AnimatedButton>

        <AnimatedButton
          onClick={currentStep === steps.length - 1 ? handleWithdraw : handleNext}
          disabled={selectedTokens.size === 0 || isLoadingWithdraw}
          className="flex items-center gap-2"
        >
          {currentStep === steps.length - 1 ? (
            <>
              <BanknotesIcon className="w-4 h-4" />
              Execute Withdrawal
            </>
          ) : (
            <>
              Next
              <ArrowRightIcon className="w-4 h-4" />
            </>
          )}
        </AnimatedButton>
      </div>
    </div>
  );
}

