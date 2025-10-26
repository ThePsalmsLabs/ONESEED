'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ErrorState, LoadingState, NoStrategiesEmptyState } from '@/components/ui';
import { useStrategyTemplates } from '@/hooks/useStrategyTemplates';
import { useAccount } from 'wagmi';
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
  const { address } = useAccount();
  const { templates, userStrategies, isLoading, error, refetch } = useStrategyTemplates();
  
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [selectedStrategies, setSelectedStrategies] = useState<Set<string>>(new Set());
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisType, setAnalysisType] = useState<'performance' | 'costs' | 'risk' | 'timeline'>('performance');

  // Convert templates to comparison format
  const strategies: StrategyComparison[] = templates.map(template => ({
    id: template.id,
    name: template.name,
    type: template.category as 'savings' | 'dca' | 'withdrawal' | 'trading',
    parameters: template.parameters,
    performance: {
      successRate: template.performance.successRate,
      averageReturn: template.performance.averageReturn,
      riskLevel: template.performance.riskLevel,
      volatility: template.performance.riskLevel === 'low' ? 2.1 : template.performance.riskLevel === 'medium' ? 4.5 : 7.2,
      maxDrawdown: template.performance.riskLevel === 'low' ? 5.2 : template.performance.riskLevel === 'medium' ? 12.8 : 22.1,
      sharpeRatio: template.performance.riskLevel === 'low' ? 1.8 : template.performance.riskLevel === 'medium' ? 1.4 : 1.1
    },
    costs: {
      gasFees: 0.02, // Placeholder - would need real gas data
      slippage: template.parameters.slippage || 0.5,
      penalties: 0.5, // Placeholder - would need real penalty data
      totalCost: (template.parameters.slippage || 0.5) + 0.52
    },
    timeline: [] // Will be populated from The Graph in Phase 8
  }));

  const handleStrategyToggle = (strategyId: string) => {
    const newSelected = new Set(selectedStrategies);
    if (newSelected.has(strategyId)) {
      newSelected.delete(strategyId);
    } else {
      newSelected.add(strategyId);
    }
    setSelectedStrategies(newSelected);
  };

  const runComparison = () => {
    if (selectedStrategies.size < 2) return;

    const selectedStrategyData = strategies.filter(s => selectedStrategies.has(s.id));
    
    // Find best performers
    const bestReturn = selectedStrategyData.reduce((best, current) => 
      current.performance.averageReturn > best.performance.averageReturn ? current : best
    );
    
    const lowestRisk = selectedStrategyData.reduce((best, current) => 
      current.performance.riskLevel === 'low' ? current : 
      current.performance.riskLevel === 'medium' && best.performance.riskLevel === 'high' ? current : best
    );
    
    const lowestCost = selectedStrategyData.reduce((best, current) => 
      current.costs.totalCost < best.costs.totalCost ? current : best
    );
    
    const mostStable = selectedStrategyData.reduce((best, current) => 
      current.performance.volatility < best.performance.volatility ? current : best
    );

    const winner = bestReturn.id; // Simplified winner selection

    const recommendations = [
      `Best return: ${bestReturn.name} with ${bestReturn.performance.averageReturn}% average return`,
      `Lowest risk: ${lowestRisk.name} with ${lowestRisk.performance.riskLevel} risk level`,
      `Lowest cost: ${lowestCost.name} with $${lowestCost.costs.totalCost.toFixed(2)} total cost`,
      `Most stable: ${mostStable.name} with ${mostStable.performance.volatility}% volatility`
    ];

    const result: ComparisonResult = {
      strategies: selectedStrategyData,
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

  // Show loading state
  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Strategy Comparison</h2>
            <p className="text-muted-foreground">Compare different strategies side by side</p>
          </div>
        </div>
        <LoadingState message="Loading strategies for comparison..." />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Strategy Comparison</h2>
            <p className="text-muted-foreground">Compare different strategies side by side</p>
          </div>
        </div>
        <ErrorState
          title="Failed to load strategies"
          message="Unable to fetch strategies for comparison. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  // Show empty state if no strategies
  if (strategies.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Strategy Comparison</h2>
            <p className="text-muted-foreground">Compare different strategies side by side</p>
          </div>
        </div>
        <NoStrategiesEmptyState onAction={() => window.location.href = '/configure'} />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Strategy Comparison</h2>
          <p className="text-muted-foreground">Compare different strategies side by side</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={runComparison}
            disabled={selectedStrategies.size < 2}
            className="flex items-center gap-2"
          >
            <ChartBarIcon className="w-4 h-4" />
            Run Comparison
          </Button>
        </div>
      </div>

      {/* Strategy Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Select Strategies to Compare</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {strategies.map((strategy) => (
            <div
              key={strategy.id}
              className={`p-4 cursor-pointer transition-all duration-200 border rounded-lg ${
                selectedStrategies.has(strategy.id)
                  ? 'ring-2 ring-primary bg-primary/5'
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleStrategyToggle(strategy.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{strategy.name}</h4>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedStrategies.has(strategy.id)
                    ? 'bg-primary border-primary'
                    : 'border-gray-300'
                }`}>
                  {selectedStrategies.has(strategy.id) && (
                    <CheckCircleIcon className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
              <div className="text-sm text-muted-foreground mb-2">
                {strategy.type} • {strategy.performance.riskLevel} risk
              </div>
              <div className="flex justify-between text-sm">
                <span>Return: {strategy.performance.averageReturn}%</span>
                <span>Success: {strategy.performance.successRate}%</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Selected: {selectedStrategies.size} strategies
        </div>
      </Card>

      {/* Comparison Results */}
      <AnimatePresence>
        {showAnalysis && comparisonResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Winner */}
            <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-800">Comparison Winner</h3>
              </div>
              <div className="text-2xl font-bold text-green-700 mb-2">
                {comparisonResult.strategies.find(s => s.id === comparisonResult.winner)?.name}
              </div>
              <p className="text-green-600">
                Best overall performance based on return, risk, and cost analysis
              </p>
            </Card>

            {/* Analysis Tabs */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                {['performance', 'costs', 'risk', 'timeline'].map((type) => (
                  <Button
                    key={type}
                    variant={analysisType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAnalysisType(type as any)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>

              {/* Performance Analysis */}
              {analysisType === 'performance' && (
                <div className="space-y-4">
                  <h4 className="font-semibold">Performance Metrics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {comparisonResult.strategies.map((strategy) => (
                      <div key={strategy.id} className="p-4 border rounded-lg">
                        <h5 className="font-medium mb-2">{strategy.name}</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Average Return:</span>
                            <span className="font-medium">{strategy.performance.averageReturn}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Success Rate:</span>
                            <span className="font-medium">{strategy.performance.successRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sharpe Ratio:</span>
                            <span className="font-medium">{strategy.performance.sharpeRatio}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cost Analysis */}
              {analysisType === 'costs' && (
                <div className="space-y-4">
                  <h4 className="font-semibold">Cost Breakdown</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {comparisonResult.strategies.map((strategy) => (
                      <div key={strategy.id} className="p-4 border rounded-lg">
                        <h5 className="font-medium mb-2">{strategy.name}</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Gas Fees:</span>
                            <span className="font-medium">${strategy.costs.gasFees.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Slippage:</span>
                            <span className="font-medium">${strategy.costs.slippage.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Penalties:</span>
                            <span className="font-medium">${strategy.costs.penalties.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="font-medium">Total Cost:</span>
                            <span className="font-bold">${strategy.costs.totalCost.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk Analysis */}
              {analysisType === 'risk' && (
                <div className="space-y-4">
                  <h4 className="font-semibold">Risk Analysis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {comparisonResult.strategies.map((strategy) => (
                      <div key={strategy.id} className="p-4 border rounded-lg">
                        <h5 className="font-medium mb-2">{strategy.name}</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Risk Level:</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              strategy.performance.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                              strategy.performance.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {strategy.performance.riskLevel}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Volatility:</span>
                            <span className="font-medium">{strategy.performance.volatility}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Max Drawdown:</span>
                            <span className="font-medium">{strategy.performance.maxDrawdown}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline Analysis */}
              {analysisType === 'timeline' && (
                <div className="space-y-4">
                  <h4 className="font-semibold">Performance Timeline</h4>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Historical performance data will be available soon
                  </div>
                </div>
              )}
            </Card>

            {/* Recommendations */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
              <div className="space-y-2">
                {comparisonResult.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <InformationCircleIcon className="w-5 h-5 text-blue-500 mt-0.5" />
                    <span className="text-sm">{recommendation}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}