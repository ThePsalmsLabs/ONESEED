'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  TargetIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  EyeIcon,
  DownloadIcon
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
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [metricComparisons, setMetricComparisons] = useState<MetricComparison[]>([]);
  const [goalProgress, setGoalProgress] = useState<GoalProgress[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'portfolio' | 'savings' | 'dca' | 'growth'>('portfolio');

  // Mock data generation
  useEffect(() => {
    const generateMockData = () => {
      // Mock performance data
      const mockPerformance: PerformanceData[] = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
        const baseValue = 10000 + Math.sin(i * 0.3) * 2000 + Math.random() * 1000;
        const savings = baseValue * 0.7;
        const dca = baseValue * 0.3;
        const withdrawals = baseValue * 0.1;
        const growth = baseValue * 0.12;
        const roi = 12 + Math.sin(i * 0.2) * 5 + Math.random() * 3;
        const slippage = Math.random() * 2;
        const fees = baseValue * 0.001;

        return {
          date: date.toISOString().split('T')[0],
          portfolioValue: baseValue,
          savings: savings,
          dca: dca,
          withdrawals: withdrawals,
          growth: growth,
          roi: roi,
          slippage: slippage,
          fees: fees
        };
      });

      // Mock metric comparisons
      const mockComparisons: MetricComparison[] = [
        {
          metric: 'Portfolio Value',
          current: 12547.32,
          previous: 11892.15,
          change: 655.17,
          changePercentage: 5.5,
          trend: 'up'
        },
        {
          metric: 'Total Savings',
          current: 8932.15,
          previous: 8456.78,
          change: 475.37,
          changePercentage: 5.6,
          trend: 'up'
        },
        {
          metric: 'DCA Volume',
          current: 3615.17,
          previous: 3435.37,
          change: 179.80,
          changePercentage: 5.2,
          trend: 'up'
        },
        {
          metric: 'ROI',
          current: 12.4,
          previous: 11.8,
          change: 0.6,
          changePercentage: 5.1,
          trend: 'up'
        },
        {
          metric: 'Average Slippage',
          current: 0.34,
          previous: 0.42,
          change: -0.08,
          changePercentage: -19.0,
          trend: 'down'
        },
        {
          metric: 'Success Rate',
          current: 94.2,
          previous: 91.5,
          change: 2.7,
          changePercentage: 3.0,
          trend: 'up'
        }
      ];

      // Mock goal progress
      const mockGoals: GoalProgress[] = [
        {
          goal: 'Save 1.0 ETH',
          target: 1.0,
          current: 0.85,
          progress: 85,
          deadline: '2024-03-15',
          status: 'on-track'
        },
        {
          goal: 'DCA $5000 USDC',
          target: 5000,
          current: 3200,
          progress: 64,
          deadline: '2024-04-01',
          status: 'behind'
        },
        {
          goal: 'Achieve 15% ROI',
          target: 15,
          current: 12.4,
          progress: 83,
          deadline: '2024-06-30',
          status: 'on-track'
        },
        {
          goal: 'Complete 100 DCA Executions',
          target: 100,
          current: 100,
          progress: 100,
          deadline: '2024-02-28',
          status: 'completed'
        }
      ];

      setPerformanceData(mockPerformance);
      setMetricComparisons(mockComparisons);
      setGoalProgress(mockGoals);
    };

    generateMockData();
  }, []);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return ArrowTrendingUpIcon;
      case 'down': return ArrowTrendingDownIcon;
      default: return ChartBarIcon;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getGoalStatusColor = (status: GoalProgress['status']) => {
    switch (status) {
      case 'on-track': return 'text-green-600 bg-green-100';
      case 'behind': return 'text-red-600 bg-red-100';
      case 'ahead': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getGoalStatusIcon = (status: GoalProgress['status']) => {
    switch (status) {
      case 'on-track': return CheckCircleIcon;
      case 'behind': return ExclamationTriangleIcon;
      case 'ahead': return ArrowTrendingUpIcon;
      case 'completed': return CheckCircleIcon;
      default: return InformationCircleIcon;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Performance Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Metrics</h2>
          <p className="text-muted-foreground">Detailed performance analysis and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <DownloadIcon className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Metric Comparisons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metricComparisons.map((metric, index) => {
          const TrendIcon = getTrendIcon(metric.trend);
          return (
            <motion.div
              key={metric.metric}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">{metric.metric}</div>
                  <div className={`flex items-center gap-1 ${getTrendColor(metric.trend)}`}>
                    <TrendIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {metric.changePercentage > 0 ? '+' : ''}{metric.changePercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {metric.metric.includes('ROI') || metric.metric.includes('Rate') || metric.metric.includes('Slippage') 
                    ? `${metric.current.toFixed(1)}%` 
                    : `$${metric.current.toLocaleString()}`}
                </div>
                <div className="text-sm text-muted-foreground">
                  {metric.metric.includes('ROI') || metric.metric.includes('Rate') || metric.metric.includes('Slippage')
                    ? `Previous: ${metric.previous.toFixed(1)}%`
                    : `Previous: $${metric.previous.toLocaleString()}`}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Time Range Selector */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Performance Analysis</h3>
          <div className="flex items-center gap-2">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <Button
                key={range}
                variant={selectedTimeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Value Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Portfolio Value Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Portfolio Value']} />
                <Area 
                  type="monotone" 
                  dataKey="portfolioValue" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* ROI Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">ROI Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'ROI']} />
                <Line 
                  type="monotone" 
                  dataKey="roi" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Savings vs DCA Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Savings vs DCA Breakdown</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name === 'savings' ? 'Savings' : 'DCA']} />
              <Area 
                type="monotone" 
                dataKey="savings" 
                stackId="1"
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="dca" 
                stackId="1"
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Slippage and Fees Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Slippage Analysis</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, 'Slippage']} />
                <Scatter 
                  dataKey="slippage" 
                  fill="#EF4444" 
                  r={4}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Fees Analysis</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Fees']} />
                <Bar dataKey="fees" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Goal Progress */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Goal Progress</h3>
        <div className="space-y-4">
          {goalProgress.map((goal, index) => {
            const StatusIcon = getGoalStatusIcon(goal.status);
            return (
              <motion.div
                key={goal.goal}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-muted/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <StatusIcon className="w-5 h-5" />
                    <span className="font-medium">{goal.goal}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${getGoalStatusColor(goal.status)}`}>
                    {goal.status}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">
                    {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                  </div>
                  <div className="text-sm font-semibold">{goal.progress}%</div>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${goal.progress}%`,
                      backgroundColor: goal.status === 'completed' ? '#10B981' : 
                                    goal.status === 'behind' ? '#EF4444' : '#3B82F6'
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Deadline: {goal.deadline}</span>
                  <span>
                    {goal.status === 'completed' ? 'Completed' : 
                     goal.status === 'behind' ? 'Behind schedule' :
                     goal.status === 'ahead' ? 'Ahead of schedule' : 'On track'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Performance Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">+12.4%</div>
            <div className="text-sm text-muted-foreground">Total ROI</div>
            <div className="text-xs text-muted-foreground mt-1">
              $2,547.32 net growth
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">94.2%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
            <div className="text-xs text-muted-foreground mt-1">
              127 successful transactions
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">0.34%</div>
            <div className="text-sm text-muted-foreground">Avg Slippage</div>
            <div className="text-xs text-muted-foreground mt-1">
              Below 0.5% target
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">$89.45</div>
            <div className="text-sm text-muted-foreground">Total Fees</div>
            <div className="text-xs text-muted-foreground mt-1">
              0.71% of portfolio value
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
