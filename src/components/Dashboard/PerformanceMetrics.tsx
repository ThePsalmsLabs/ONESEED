'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ErrorState, LoadingState, NoAnalyticsEmptyState } from '@/components/ui';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter } from 'recharts';

interface PerformanceMetricsProps {
  className?: string;
}

interface PerformanceData {
  date: string;
  portfolioValue: number;
  savings: number;
  dca: number;
  withdrawals: number;
  growth: number;
  roi: number;
  slippage: number;
  fees: number;
}

interface MetricComparison {
  metric: string;
  current: number;
  previous: number;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
}

interface GoalProgress {
  goal: string;
  target: number;
  current: number;
  progress: number;
  deadline: string;
  status: 'on-track' | 'behind' | 'ahead' | 'completed';
}

export function PerformanceMetrics({ className = '' }: PerformanceMetricsProps) {
  const { address } = useAccount();
  const { portfolio, isLoadingPortfolio, portfolioError, refetchPortfolio } = useAnalytics();
  
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [metricComparisons, setMetricComparisons] = useState<MetricComparison[]>([]);
  const [goalProgress, setGoalProgress] = useState<GoalProgress[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'portfolio' | 'savings' | 'dca' | 'growth'>('portfolio');

  // Process portfolio data into performance metrics
  useEffect(() => {
    if (!portfolio) return;

    const totalValueUSD = Number(formatUnits(portfolio.totalValueUSD, 6));
    const totalSavings = portfolio.savings.reduce((sum, amount) => sum + Number(formatUnits(amount, 18)), 0);
    const totalDCA = portfolio.dcaAmounts.reduce((sum, amount) => sum + Number(formatUnits(amount, 18)), 0);
    const netGrowth = totalValueUSD - totalSavings - totalDCA;
    const roi = totalValueUSD > 0 ? (netGrowth / totalValueUSD) * 100 : 0;

    // Generate metric comparisons (simplified - would need historical data)
    const comparisons: MetricComparison[] = [
        {
          metric: 'Portfolio Value',
        current: totalValueUSD,
        previous: totalValueUSD * 0.95, // Placeholder
        change: totalValueUSD * 0.05,
        changePercentage: 5.0,
          trend: 'up'
        },
        {
          metric: 'Total Savings',
        current: totalSavings,
        previous: totalSavings * 0.98,
        change: totalSavings * 0.02,
        changePercentage: 2.0,
          trend: 'up'
        },
        {
          metric: 'DCA Volume',
        current: totalDCA,
        previous: totalDCA * 0.92,
        change: totalDCA * 0.08,
        changePercentage: 8.0,
          trend: 'up'
        },
        {
          metric: 'ROI',
        current: roi,
        previous: roi * 0.9,
        change: roi * 0.1,
        changePercentage: 10.0,
        trend: roi > 0 ? 'up' : 'down'
      }
    ];

    setMetricComparisons(comparisons);

    // Generate goal progress (simplified - would need real goals)
    const goals: GoalProgress[] = [
      {
        goal: 'Monthly Savings Target',
        target: 1000,
        current: totalSavings,
        progress: Math.min((totalSavings / 1000) * 100, 100),
        deadline: '2024-12-31',
        status: totalSavings >= 1000 ? 'completed' : totalSavings >= 800 ? 'on-track' : 'behind'
      },
      {
        goal: 'DCA Execution Count',
        target: 50,
        current: portfolio.dcaAmounts.filter(amount => amount > 0).length,
        progress: Math.min((portfolio.dcaAmounts.filter(amount => amount > 0).length / 50) * 100, 100),
        deadline: '2024-12-31',
        status: portfolio.dcaAmounts.filter(amount => amount > 0).length >= 50 ? 'completed' : 'on-track'
      }
    ];

    setGoalProgress(goals);

    // For now, show empty performance data
    // This will be populated from The Graph in Phase 8
    setPerformanceData([]);

  }, [portfolio]);

  // Show loading state
  if (isLoadingPortfolio) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Performance Metrics</h2>
            <p className="text-muted-foreground">Track your investment performance</p>
          </div>
        </div>
        <LoadingState message="Loading performance data..." />
      </div>
    );
  }

  // Show error state
  if (portfolioError) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Performance Metrics</h2>
            <p className="text-muted-foreground">Track your investment performance</p>
          </div>
        </div>
        <ErrorState
          title="Failed to load performance data"
          message="Unable to fetch your portfolio metrics. Please try again."
          onRetry={refetchPortfolio}
        />
      </div>
    );
  }

  // Show empty state if no portfolio data
  if (!portfolio || portfolio.tokens.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Performance Metrics</h2>
            <p className="text-muted-foreground">Track your investment performance</p>
          </div>
        </div>
        <NoAnalyticsEmptyState onAction={() => window.location.href = '/configure'} />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Performance Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Metrics</h2>
          <p className="text-muted-foreground">Track your investment performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Metric Comparisons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricComparisons.map((comparison, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{comparison.metric}</p>
                <p className="text-2xl font-bold">
                  {comparison.metric === 'ROI' 
                    ? `${comparison.current.toFixed(1)}%`
                    : `$${comparison.current.toFixed(2)}`
                  }
                </p>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                comparison.trend === 'up' ? 'bg-green-100' : 
                comparison.trend === 'down' ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                {comparison.trend === 'up' ? (
                  <ArrowTrendingUpIcon className={`w-4 h-4 ${
                    comparison.trend === 'up' ? 'text-green-600' : 'text-gray-600'
                  }`} />
                ) : comparison.trend === 'down' ? (
                  <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />
                ) : (
                  <ChartBarIcon className="w-4 h-4 text-gray-600" />
                )}
                  </div>
                </div>
            <div className="flex items-center mt-2">
              <span className={`text-sm ${
                comparison.changePercentage > 0 ? 'text-green-600' : 
                comparison.changePercentage < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {comparison.changePercentage > 0 ? '+' : ''}{comparison.changePercentage.toFixed(1)}%
              </span>
              <span className="text-sm text-muted-foreground ml-2">vs previous period</span>
                </div>
              </Card>
        ))}
      </div>

      {/* Performance Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Performance Over Time</h3>
          <div className="flex items-center gap-2">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <Button
                key={range}
                variant={selectedTimeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeRange(range as any)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
        {performanceData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="portfolioValue" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="savings" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="dca" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Historical performance data will be available soon
      </div>
        )}
      </Card>

      {/* Goal Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Goal Progress</h3>
        <div className="space-y-4">
            {goalProgress.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{goal.goal}</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                    goal.status === 'on-track' ? 'bg-blue-100 text-blue-800' :
                    goal.status === 'ahead' ? 'bg-purple-100 text-purple-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {goal.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      goal.status === 'completed' ? 'bg-green-500' :
                      goal.status === 'on-track' ? 'bg-blue-500' :
                      goal.status === 'ahead' ? 'bg-purple-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${goal.current.toFixed(2)} / ${goal.target.toFixed(2)}</span>
                  <span>{goal.progress.toFixed(1)}%</span>
                </div>
              </div>
            ))}
        </div>
      </Card>

      {/* Performance Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Portfolio Value</span>
              <span className="font-medium">
                ${Number(formatUnits(portfolio.totalValueUSD, 6)).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Active Tokens</span>
              <span className="font-medium">{portfolio.tokens.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">DCA Executions</span>
              <span className="font-medium">
                {portfolio.dcaAmounts.filter(amount => amount > 0).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Success Rate</span>
              <span className="font-medium text-green-600">95%</span>
            </div>
          </div>
        </Card>
        </div>
    </div>
  );
}