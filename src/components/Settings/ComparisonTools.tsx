'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AnimatedCard, AnimatedButton, AnimatedInput } from '@/components/ui/AnimatedComponents';
import { 
  ChartBarIcon,
  PlusIcon,
  TrashIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  AdjustmentsHorizontalIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface ComparisonToolsProps {
  className?: string;
  onComparisonComplete?: (comparison: ComparisonResult) => void;
}

interface StrategyComparison {
  id: string;
  name: string;
  type: 'savings' | 'dca' | 'withdrawal' | 'trading';
  parameters: Record<string, any>;
  performance: {
    successRate: number;
    averageReturn: number;
    riskLevel: 'low' | 'medium' | 'high';
    volatility: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
  costs: {
    gasFees: number;
    slippage: number;
    penalties: number;
    totalCost: number;
  };
  timeline: Array<{
    date: string;
    value: number;
    return: number;
  }>;
}

interface ComparisonResult {
  strategies: StrategyComparison[];
  winner: string;
  analysis: {
    bestReturn: string;
    lowestRisk: string;
    lowestCost: string;
    mostStable: string;
  };
  recommendations: string[];
}

export function ComparisonTools({ className = '', onComparisonComplete }: ComparisonToolsProps) {
  const [strategies, setStrategies] = useState<StrategyComparison[]>([]);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [selectedStrategies, setSelectedStrategies] = useState<Set<string>>(new Set());
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisType, setAnalysisType] = useState<'performance' | 'costs' | 'risk' | 'timeline'>('performance');

  useEffect(() => {
    const mockStrategies: StrategyComparison[] = [
      {
        id: '1',
        name: 'Conservative Daily Savings',
        type: 'savings',
        parameters: { amount: 0.1, token: 'WETH', frequency: 'daily' },
        performance: {
          successRate: 95,
          averageReturn: 8.5,
          riskLevel: 'low',
          volatility: 2.1,
          maxDrawdown: 5.2,
          sharpeRatio: 1.8
        },
        costs: {
          gasFees: 0.02,
          slippage: 0.1,
          penalties: 0.5,
          totalCost: 0.62
        },
        timeline: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 1000 + (i * 2.5) + Math.sin(i * 0.3) * 10,
          return: (i * 0.28) + Math.sin(i * 0.2) * 0.5
        }))
      },
      {
        id: '2',
        name: 'Aggressive DCA Strategy',
        type: 'dca',
        parameters: { amount: 100, token: 'USDC', frequency: 'hourly' },
        performance: {
          successRate: 78,
          averageReturn: 15.2,
          riskLevel: 'high',
          volatility: 8.7,
          maxDrawdown: 18.3,
          sharpeRatio: 1.2
        },
        costs: {
          gasFees: 0.15,
          slippage: 0.8,
          penalties: 0.2,
          totalCost: 1.15
        },
        timeline: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 1000 + (i * 4.2) + Math.sin(i * 0.5) * 25,
          return: (i * 0.51) + Math.sin(i * 0.3) * 1.2
        }))
      },
      {
        id: '3',
        name: 'Smart Withdrawal Optimizer',
        type: 'withdrawal',
        parameters: { gasThreshold: 30, volatilityLimit: 5.0 },
        performance: {
          successRate: 92,
          averageReturn: 12.8,
          riskLevel: 'medium',
          volatility: 4.2,
          maxDrawdown: 8.7,
          sharpeRatio: 1.6
        },
        costs: {
          gasFees: 0.08,
          slippage: 0.3,
          penalties: 0.1,
          totalCost: 0.48
        },
        timeline: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: 1000 + (i * 3.1) + Math.sin(i * 0.4) * 15,
          return: (i * 0.43) + Math.sin(i * 0.25) * 0.8
        }))
      }
    ];
    setStrategies(mockStrategies);
  }, []);

  const handleStrategySelect = (strategyId: string) => {
    setSelectedStrategies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(strategyId)) {
        newSet.delete(strategyId);
      } else {
        newSet.add(strategyId);
      }
      return newSet;
    });
  };

  const handleCompare = () => {
    const selected = strategies.filter(s => selectedStrategies.has(s.id));
    if (selected.length < 2) return;

    // Find best performing strategy in each category
    const bestReturn = selected.reduce((best, current) => 
      current.performance.averageReturn > best.performance.averageReturn ? current : best
    );
    const lowestRisk = selected.reduce((best, current) => 
      current.performance.riskLevel === 'low' && best.performance.riskLevel !== 'low' ? current :
      current.performance.riskLevel === 'medium' && best.performance.riskLevel === 'high' ? current : best
    );
    const lowestCost = selected.reduce((best, current) => 
      current.costs.totalCost < best.costs.totalCost ? current : best
    );
    const mostStable = selected.reduce((best, current) => 
      current.performance.volatility < best.performance.volatility ? current : best
    );

    const winner = bestReturn.id;
    const recommendations = [
      `Best for returns: ${bestReturn.name} (${bestReturn.performance.averageReturn}% avg return)`,
      `Lowest risk: ${lowestRisk.name} (${lowestRisk.performance.riskLevel} risk)`,
      `Most cost-effective: ${lowestCost.name} ($${lowestCost.costs.totalCost} total cost)`,
      `Most stable: ${mostStable.name} (${mostStable.performance.volatility}% volatility)`
    ];

    const result: ComparisonResult = {
      strategies: selected,
      winner,
      analysis: {
        bestReturn: bestReturn.name,
        lowestRisk: lowestRisk.name,
        lowestCost: lowestCost.name,
        mostStable: mostStable.name
      },
      recommendations
    };

    setComparisonResult(result);
    setShowAnalysis(true);
    onComparisonComplete?.(result);
  };

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'savings': return AdjustmentsHorizontalIcon;
      case 'dca': return ChartBarIcon;
      case 'withdrawal': return CurrencyDollarIcon;
      case 'trading': return ArrowTrendingUpIcon;
      default: return ChartBarIcon;
    }
  };

  const renderPerformanceChart = () => {
    const selected = strategies.filter(s => selectedStrategies.has(s.id));
    const chartData = selected.map(strategy => ({
      name: strategy.name,
      return: strategy.performance.averageReturn,
      risk: strategy.performance.volatility,
      success: strategy.performance.successRate,
      cost: strategy.costs.totalCost
    }));

    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="return" fill="#3B82F6" />
            <Bar dataKey="risk" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderCostsChart = () => {
    const selected = strategies.filter(s => selectedStrategies.has(s.id));
    const chartData = selected.map(strategy => ({
      name: strategy.name,
      gasFees: strategy.costs.gasFees,
      slippage: strategy.costs.slippage,
      penalties: strategy.costs.penalties,
      total: strategy.costs.totalCost
    }));

    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="gasFees" fill="#8B5CF6" />
            <Bar dataKey="slippage" fill="#F59E0B" />
            <Bar dataKey="penalties" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderRiskChart = () => {
    const selected = strategies.filter(s => selectedStrategies.has(s.id));
    const chartData = selected.map(strategy => ({
      name: strategy.name,
      volatility: strategy.performance.volatility,
      maxDrawdown: strategy.performance.maxDrawdown,
      sharpeRatio: strategy.performance.sharpeRatio
    }));

    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="volatility" fill="#EF4444" />
            <Bar dataKey="maxDrawdown" fill="#F59E0B" />
            <Bar dataKey="sharpeRatio" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderTimelineChart = () => {
    const selected = strategies.filter(s => selectedStrategies.has(s.id));
    const chartData = selected[0]?.timeline || [];

    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
            <Line type="monotone" dataKey="return" stroke="#10B981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Strategy Comparison</h2>
          <p className="text-muted-foreground">Compare and analyze different strategies</p>
        </div>
        <div className="flex items-center gap-2">
          <AnimatedButton
            onClick={handleCompare}
            disabled={selectedStrategies.size < 2}
            className="flex items-center gap-2"
          >
            <ChartBarIcon className="w-4 h-4" />
            Compare ({selectedStrategies.size})
          </AnimatedButton>
        </div>
      </div>

      {/* Strategy Selection */}
      <AnimatedCard className="p-6">
        <h3 className="text-lg font-semibold mb-4">Select Strategies to Compare</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {strategies.map((strategy, index) => {
            const Icon = getTypeIcon(strategy.type);
            const isSelected = selectedStrategies.has(strategy.id);
            
            return (
              <motion.div
                key={strategy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`p-4 cursor-pointer transition-all ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleStrategySelect(strategy.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleStrategySelect(strategy.id)}
                        className="w-4 h-4 text-primary rounded focus:ring-primary"
                      />
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{strategy.name}</h4>
                        <p className="text-sm text-muted-foreground capitalize">{strategy.type}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Return</span>
                      <span className="font-semibold text-green-600">{strategy.performance.averageReturn}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Risk</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(strategy.performance.riskLevel)}`}>
                        {strategy.performance.riskLevel}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Success Rate</span>
                      <span className="font-semibold">{strategy.performance.successRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Cost</span>
                      <span className="font-semibold">${strategy.costs.totalCost}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </AnimatedCard>

      {/* Comparison Analysis */}
      <AnimatePresence>
        {showAnalysis && comparisonResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Analysis Tabs */}
            <AnimatedCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                {[
                  { id: 'performance', label: 'Performance', icon: ArrowTrendingUpIcon },
                  { id: 'costs', label: 'Costs', icon: CurrencyDollarIcon },
                  { id: 'risk', label: 'Risk', icon: ShieldCheckIcon },
                  { id: 'timeline', label: 'Timeline', icon: ClockIcon }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <AnimatedButton
                      key={tab.id}
                      variant={analysisType === tab.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAnalysisType(tab.id as 'performance' | 'costs' | 'risk' | 'timeline')}
                      className="flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </AnimatedButton>
                  );
                })}
              </div>

              {/* Chart */}
              <div className="mb-6">
                {analysisType === 'performance' && renderPerformanceChart()}
                {analysisType === 'costs' && renderCostsChart()}
                {analysisType === 'risk' && renderRiskChart()}
                {analysisType === 'timeline' && renderTimelineChart()}
              </div>

              {/* Analysis Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Key Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Best Return</span>
                      <span className="font-semibold text-green-600">{comparisonResult.analysis.bestReturn}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Lowest Risk</span>
                      <span className="font-semibold text-blue-600">{comparisonResult.analysis.lowestRisk}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Lowest Cost</span>
                      <span className="font-semibold text-purple-600">{comparisonResult.analysis.lowestCost}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Most Stable</span>
                      <span className="font-semibold text-orange-600">{comparisonResult.analysis.mostStable}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Recommendations</h4>
                  <div className="space-y-2">
                    {comparisonResult.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-600 mt-0.5" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedCard>

            {/* Winner Announcement */}
            <AnimatedCard className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Comparison Complete</h3>
                <p className="text-muted-foreground mb-4">
                  Based on the analysis, the best performing strategy is:
                </p>
                <div className="text-2xl font-bold text-primary mb-4">
                  {comparisonResult.strategies.find(s => s.id === comparisonResult.winner)?.name}
                </div>
                <div className="flex justify-center gap-2">
                  <AnimatedButton
                    onClick={() => {
                      setShowAnalysis(false);
                      setSelectedStrategies(new Set());
                    }}
                    variant="outline"
                  >
                    New Comparison
                  </AnimatedButton>
                  <AnimatedButton>
                    <CheckCircleIcon className="w-4 h-4" />
                    Use Recommended Strategy
                  </AnimatedButton>
                </div>
              </div>
            </AnimatedCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

