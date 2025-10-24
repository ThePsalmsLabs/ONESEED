'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
import { formatEther, parseEther } from 'viem';

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
  const [strategies, setStrategies] = useState<WithdrawalStrategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [marketConditions, setMarketConditions] = useState<MarketConditions>({
    gasPrice: 25,
    marketVolatility: 2.5,
    tokenPrices: {
      'WETH': 2500,
      'USDC': 1,
      'DAI': 1
    },
    networkCongestion: 0.3
  });
  const [recommendation, setRecommendation] = useState<StrategyRecommendation | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const mockStrategies: WithdrawalStrategy[] = [
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
          'Predictable execution'
        ],
        risks: [
          'Market conditions may change',
          'Requires planning',
          'Potential delays'
        ],
        estimatedSavings: 15,
        complexity: 'medium',
        recommended: true
      },
      {
        id: 'conditional',
        name: 'Conditional Withdrawal',
        description: 'Withdraw when specific market conditions are met',
        type: 'conditional',
        icon: ChartBarIcon,
        benefits: [
          'Optimized execution',
          'Market-based timing',
          'Maximum savings potential'
        ],
        risks: [
          'May never execute',
          'Complex setup',
          'Requires monitoring'
        ],
        estimatedSavings: 35,
        complexity: 'high',
        recommended: true
      },
      {
        id: 'optimized',
        name: 'AI-Optimized Withdrawal',
        description: 'AI-powered strategy that finds the best execution time',
        type: 'optimized',
        icon: ChartBarIcon,
        benefits: [
          'Maximum efficiency',
          'AI-powered optimization',
          'Continuous monitoring'
        ],
        risks: [
          'Requires trust in AI',
          'Complex algorithm',
          'Potential over-optimization'
        ],
        estimatedSavings: 45,
        complexity: 'high',
        recommended: true
      }
    ];

    setStrategies(mockStrategies);

    // Generate recommendation based on market conditions
    const recommendedStrategy = mockStrategies.find(s => s.id === 'optimized');
    if (recommendedStrategy) {
      setRecommendation({
        strategy: recommendedStrategy,
        confidence: 85,
        reasoning: 'Current market conditions favor AI-optimized withdrawal with low gas prices and stable volatility',
        expectedSavings: 45,
        riskLevel: 'low'
      });
    }
  }, []);

  const handleStrategySelect = (strategy: WithdrawalStrategy) => {
    setSelectedStrategy(strategy.id);
    onStrategySelect?.(strategy);
  };

  const getComplexityColor = (complexity: 'low' | 'medium' | 'high') => {
    switch (complexity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
    }
  };

  const getRiskLevelColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
          <ChartBarIcon className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Withdrawal Strategies</h2>
          <p className="text-muted-foreground">Choose the best strategy for your withdrawal</p>
        </div>
      </div>

      {/* Market Conditions */}
      <AnimatedCard className="p-6">
        <h3 className="text-lg font-semibold mb-4">Current Market Conditions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{marketConditions.gasPrice} Gwei</div>
            <div className="text-sm text-muted-foreground">Gas Price</div>
            <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
              marketConditions.gasPrice < 30 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {marketConditions.gasPrice < 30 ? 'Low' : 'High'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{marketConditions.marketVolatility}%</div>
            <div className="text-sm text-muted-foreground">Volatility</div>
            <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
              marketConditions.marketVolatility < 3 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {marketConditions.marketVolatility < 3 ? 'Stable' : 'Volatile'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(marketConditions.networkCongestion * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Network Congestion</div>
            <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
              marketConditions.networkCongestion < 0.5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {marketConditions.networkCongestion < 0.5 ? 'Low' : 'High'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">Optimal</div>
            <div className="text-sm text-muted-foreground">Withdrawal Window</div>
            <div className="text-xs px-2 py-1 rounded-full mt-1 bg-green-100 text-green-800">
              Now
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* AI Recommendation */}
      {recommendation && (
        <AnimatedCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <ChartBarIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">AI Recommendation</h3>
              <p className="text-sm text-muted-foreground">
                Based on current market conditions and your portfolio
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="font-medium">{recommendation.strategy.name}</div>
              <div className={`px-2 py-1 rounded-full text-xs ${getRiskLevelColor(recommendation.riskLevel)}`}>
                {recommendation.riskLevel} risk
              </div>
              <div className="text-sm text-muted-foreground">
                {recommendation.confidence}% confidence
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-green-600">
                Save {recommendation.expectedSavings}%
              </div>
              <div className="text-sm text-muted-foreground">vs immediate</div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">{recommendation.reasoning}</p>
          
          <AnimatedButton
            onClick={() => handleStrategySelect(recommendation.strategy)}
            className="w-full"
          >
            <CheckCircleIcon className="w-4 h-4" />
            Use Recommended Strategy
          </AnimatedButton>
        </AnimatedCard>
      )}

      {/* Strategy Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {strategies.map((strategy, index) => {
          const Icon = strategy.icon;
          const isSelected = selectedStrategy === strategy.id;
          
          return (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div onClick={() => handleStrategySelect(strategy)}>
                <AnimatedCard
                  className={`p-6 cursor-pointer transition-all ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{strategy.name}</h4>
                      <p className="text-sm text-muted-foreground">{strategy.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {strategy.recommended && (
                      <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Recommended
                      </div>
                    )}
                    <div className={`px-2 py-1 text-xs rounded-full ${getComplexityColor(strategy.complexity)}`}>
                      {strategy.complexity}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Estimated Savings</span>
                    <span className="font-semibold text-green-600">{strategy.estimatedSavings}%</span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Benefits:</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {strategy.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircleIcon className="w-3 h-3 text-green-600" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Risks:</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {strategy.risks.map((risk, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <ExclamationTriangleIcon className="w-3 h-3 text-orange-600" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t"
                    >
                      <div className="space-y-3">
                        <div className="text-sm font-medium">Strategy Details:</div>
                        <div className="text-sm text-muted-foreground">
                          This strategy will optimize your withdrawal based on current market conditions
                          and your specific requirements. The AI will continuously monitor the market
                          and execute when conditions are optimal.
                        </div>
                        <AnimatedButton
                          size="sm"
                          onClick={() => setShowDetails(!showDetails)}
                          className="w-full"
                        >
                          <InformationCircleIcon className="w-4 h-4" />
                          {showDetails ? 'Hide' : 'Show'} Advanced Settings
                        </AnimatedButton>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                </AnimatedCard>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Advanced Settings */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <AnimatedCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Advanced Strategy Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Gas Price Threshold (Gwei)</label>
                    <input
                      type="number"
                      placeholder="30"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Market Volatility Limit (%)</label>
                    <input
                      type="number"
                      placeholder="5.0"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Execution Time Window (hours)</label>
                    <input
                      type="number"
                      placeholder="24"
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Priority Level</label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option value="low">Low (Maximum Savings)</option>
                      <option value="medium">Medium (Balanced)</option>
                      <option value="high">High (Fast Execution)</option>
                    </select>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      {selectedStrategy && (
        <div className="flex justify-between">
          <AnimatedButton
            variant="outline"
            onClick={() => setSelectedStrategy(null)}
            className="flex items-center gap-2"
          >
            <ArrowTrendingDownIcon className="w-4 h-4" />
            Clear Selection
          </AnimatedButton>

          <AnimatedButton
            onClick={() => {
              const strategy = strategies.find(s => s.id === selectedStrategy);
              if (strategy) handleStrategySelect(strategy);
            }}
            className="flex items-center gap-2"
          >
            <ShieldCheckIcon className="w-4 h-4" />
            Configure Strategy
          </AnimatedButton>
        </div>
      )}
    </div>
  );
}

