'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ErrorState, LoadingState, NoWithdrawalsEmptyState } from '@/components/ui';
import { useSavingsBalanceRealtime } from '@/hooks/useSavingsBalanceRealtime';
import { useAccount } from 'wagmi';
import { AnimatedCard, AnimatedButton, AnimatedProgress } from '@/components/ui/AnimatedComponents';
import { 
  ClockIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { formatUnits } from 'viem';

interface WithdrawalStrategiesProps {
  className?: string;
  onStrategySelect?: (strategy: WithdrawalStrategy) => void;
}

interface WithdrawalStrategy {
  id: string;
  name: string;
  description: string;
  type: 'immediate' | 'scheduled' | 'conditional' | 'optimized';
  icon: React.ComponentType<any>;
  benefits: string[];
  risks: string[];
  estimatedSavings: number;
  complexity: 'low' | 'medium' | 'high';
  recommended: boolean;
}

interface MarketConditions {
  gasPrice: number;
  marketVolatility: number;
  tokenPrices: Record<string, number>;
  networkCongestion: number;
}

interface StrategyRecommendation {
  strategy: WithdrawalStrategy;
  confidence: number;
  reasoning: string;
  expectedSavings: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export function WithdrawalStrategies({ className = '', onStrategySelect }: WithdrawalStrategiesProps) {
  const { address } = useAccount();
  const { balances, isLoading, error, refreshSavings } = useSavingsBalanceRealtime();
  
  const [strategies, setStrategies] = useState<WithdrawalStrategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [marketConditions, setMarketConditions] = useState<MarketConditions>({
    gasPrice: 25, // Placeholder - would need real gas price
    marketVolatility: 2.5, // Placeholder - would need real volatility data
    tokenPrices: {
      'WETH': 2500, // Placeholder - would need real prices
      'USDC': 1,
      'DAI': 1
    },
    networkCongestion: 0.3 // Placeholder - would need real congestion data
  });
  const [recommendation, setRecommendation] = useState<StrategyRecommendation | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Generate strategies based on user's savings data
  useEffect(() => {
    if (!balances || balances.length === 0) return;

    const totalValue = balances.reduce((sum, balance) => {
      // Simplified value calculation - would need real pricing
      return sum + Number(formatUnits(balance.amount, balance.decimals));
    }, 0);

    const hasMultipleTokens = balances.length > 1;
    const hasLargeAmounts = balances.some(balance => 
      Number(formatUnits(balance.amount, balance.decimals)) > 1000
    );

    const generatedStrategies: WithdrawalStrategy[] = [
      {
        id: 'immediate',
        name: 'Immediate Withdrawal',
        description: 'Execute withdrawal immediately with current market conditions',
        type: 'immediate',
        icon: ArrowTrendingDownIcon,
        benefits: [
          'Fast execution',
          'No waiting time',
          'Simple process'
        ],
        risks: [
          'Higher gas costs',
          'Market volatility',
          'No optimization'
        ],
        estimatedSavings: 0,
        complexity: 'low',
        recommended: false
      },
      {
        id: 'scheduled',
        name: 'Scheduled Withdrawal',
        description: 'Set a specific time for withdrawal execution',
        type: 'scheduled',
        icon: ClockIcon,
        benefits: [
          'Better timing control',
          'Lower gas costs during off-peak',
          'Reduced penalty rates'
        ],
        risks: [
          'Market changes during wait',
          'Opportunity cost',
          'Execution complexity'
        ],
        estimatedSavings: hasLargeAmounts ? 15 : 8,
        complexity: 'medium',
        recommended: hasLargeAmounts
      },
      {
        id: 'conditional',
        name: 'Conditional Withdrawal',
        description: 'Withdraw when specific market conditions are met',
        type: 'conditional',
        icon: ShieldCheckIcon,
        benefits: [
          'Optimal market timing',
          'Maximum savings potential',
          'Risk mitigation'
        ],
        risks: [
          'Complex setup',
          'May never execute',
          'Requires monitoring'
        ],
        estimatedSavings: hasLargeAmounts ? 25 : 15,
        complexity: 'high',
        recommended: hasLargeAmounts && hasMultipleTokens
      },
      {
        id: 'optimized',
        name: 'Optimized Batch Withdrawal',
        description: 'Withdraw multiple tokens in optimized batches',
        type: 'optimized',
        icon: ChartBarIcon,
        benefits: [
          'Reduced gas costs',
          'Better price execution',
          'Batch optimization'
        ],
        risks: [
          'Complex execution',
          'Requires multiple transactions',
          'Higher complexity'
        ],
        estimatedSavings: hasMultipleTokens ? 20 : 5,
        complexity: 'high',
        recommended: hasMultipleTokens
      }
    ];

    setStrategies(generatedStrategies);

    // Generate recommendation based on user's portfolio
    const recommendedStrategy = generatedStrategies.find(s => s.recommended) || generatedStrategies[0];
    const recommendation: StrategyRecommendation = {
      strategy: recommendedStrategy,
      confidence: hasLargeAmounts ? 85 : 70,
      reasoning: hasLargeAmounts 
        ? 'Large amounts benefit from optimization strategies'
        : 'Small amounts are best with simple immediate withdrawal',
      expectedSavings: recommendedStrategy.estimatedSavings,
      riskLevel: recommendedStrategy.complexity === 'high' ? 'medium' : 'low'
    };

    setRecommendation(recommendation);

  }, [balances]);

  // Show loading state
  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Withdrawal Strategies</h2>
            <p className="text-muted-foreground">Choose the best strategy for your withdrawal</p>
          </div>
        </div>
        <LoadingState message="Analyzing your savings for optimal strategies..." />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Withdrawal Strategies</h2>
            <p className="text-muted-foreground">Choose the best strategy for your withdrawal</p>
          </div>
        </div>
        <ErrorState
          title="Failed to load strategies"
          message="Unable to analyze your savings for withdrawal strategies. Please try again."
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
            <h2 className="text-2xl font-bold">Withdrawal Strategies</h2>
            <p className="text-muted-foreground">Choose the best strategy for your withdrawal</p>
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
          <h2 className="text-2xl font-bold">Withdrawal Strategies</h2>
          <p className="text-muted-foreground">Choose the best strategy for your withdrawal</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {balances.length} token{balances.length !== 1 ? 's' : ''} available
        </div>
      </div>

      {/* Recommendation */}
      {recommendation && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-blue-800">Recommended Strategy</h3>
          </div>
          <div className="mb-4">
            <div className="text-xl font-bold text-blue-700 mb-2">
              {recommendation.strategy.name}
            </div>
            <p className="text-blue-600 mb-3">{recommendation.strategy.description}</p>
            <div className="text-sm text-blue-600">
              <strong>Reasoning:</strong> {recommendation.reasoning}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-blue-600">Confidence: </span>
              <span className="font-semibold text-blue-700">{recommendation.confidence}%</span>
            </div>
            <div className="text-sm">
              <span className="text-blue-600">Expected Savings: </span>
              <span className="font-semibold text-blue-700">{recommendation.expectedSavings}%</span>
            </div>
            <div className="text-sm">
              <span className="text-blue-600">Risk Level: </span>
              <span className={`font-semibold ${
                recommendation.riskLevel === 'low' ? 'text-green-700' :
                recommendation.riskLevel === 'medium' ? 'text-yellow-700' :
                'text-red-700'
              }`}>
                {recommendation.riskLevel}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Market Conditions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Current Market Conditions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-muted-foreground">Gas Price</div>
            <div className="text-lg font-bold">{marketConditions.gasPrice} gwei</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-muted-foreground">Volatility</div>
            <div className="text-lg font-bold">{marketConditions.marketVolatility}%</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-muted-foreground">Network Congestion</div>
            <div className="text-lg font-bold">{Math.round(marketConditions.networkCongestion * 100)}%</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-muted-foreground">Your Tokens</div>
            <div className="text-lg font-bold">{balances.length}</div>
          </div>
        </div>
      </Card>

      {/* Strategies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {strategies.map((strategy) => (
            <div
              key={strategy.id}
              className={`p-6 cursor-pointer transition-all duration-200 border rounded-lg ${
                selectedStrategy === strategy.id
                  ? 'ring-2 ring-primary bg-primary/5'
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedStrategy(strategy.id)}
            >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <strategy.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">{strategy.name}</h3>
                  {strategy.recommended && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">{strategy.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-green-600 mb-1">Benefits</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {strategy.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircleIcon className="w-3 h-3 text-green-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-red-600 mb-1">Risks</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {strategy.risks.map((risk, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <ExclamationTriangleIcon className="w-3 h-3 text-red-500" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Savings: </span>
                      <span className="font-semibold text-green-600">
                        {strategy.estimatedSavings}%
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Complexity: </span>
                      <span className={`font-semibold ${
                        strategy.complexity === 'low' ? 'text-green-600' :
                        strategy.complexity === 'medium' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {strategy.complexity}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDetails(true);
                    }}
                  >
                    <InformationCircleIcon className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                </div>
              </div>
            </div>
            </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {selectedStrategy ? `Selected: ${strategies.find(s => s.id === selectedStrategy)?.name}` : 'Select a strategy to continue'}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowDetails(true)}
          >
            Compare All
          </Button>
          <Button
            onClick={() => {
              const strategy = strategies.find(s => s.id === selectedStrategy);
              if (strategy) {
                onStrategySelect?.(strategy);
              }
            }}
            disabled={!selectedStrategy}
          >
            Use Selected Strategy
          </Button>
        </div>
      </div>

      {/* Strategy Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Strategy Comparison</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                >
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {strategies.map((strategy) => (
                  <div key={strategy.id} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <strategy.icon className="w-6 h-6 text-primary" />
                      <h4 className="font-semibold">{strategy.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{strategy.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Estimated Savings:</span>
                        <span className="font-medium text-green-600">{strategy.estimatedSavings}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Complexity:</span>
                        <span className={`font-medium ${
                          strategy.complexity === 'low' ? 'text-green-600' :
                          strategy.complexity === 'medium' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {strategy.complexity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recommended:</span>
                        <span className={`font-medium ${strategy.recommended ? 'text-green-600' : 'text-gray-600'}`}>
                          {strategy.recommended ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}