'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { useDailySavings } from '@/hooks/useDailySavings';
import { formatEther } from 'viem';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Target, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

interface DailySavingsAnalyticsProps {
  onBack?: () => void;
}

interface AnalyticsData {
  totalSaved: bigint;
  totalGoals: number;
  completedGoals: number;
  activeGoals: number;
  averageDailyAmount: bigint;
  totalExecutions: number;
  successRate: number;
  totalPenalties: bigint;
  averageGoalDuration: number;
  topPerformingToken: string;
}

interface ExecutionHistory {
  date: string;
  token: string;
  amount: bigint;
  success: boolean;
  penalty: bigint;
}

interface GoalProgress {
  token: string;
  icon: string;
  currentAmount: bigint;
  goalAmount: bigint;
  startDate: string;
  expectedEndDate: string;
  daysRemaining: number;
  progress: number;
}

export function DailySavingsAnalytics({ onBack }: DailySavingsAnalyticsProps) {
  const { 
    contractAddress,
    formatAmount,
    calculateProgress
  } = useDailySavings();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedToken, setSelectedToken] = useState<string>('all');

  // Mock analytics data - in real implementation, this would come from contract
  const [analyticsData] = useState<AnalyticsData>({
    totalSaved: BigInt('50000000000000000000'), // 50 tokens
    totalGoals: 8,
    completedGoals: 3,
    activeGoals: 5,
    averageDailyAmount: BigInt('1000000000000000000'), // 1 token
    totalExecutions: 45,
    successRate: 95.6,
    totalPenalties: BigInt('500000000000000000'), // 0.5 tokens
    averageGoalDuration: 67,
    topPerformingToken: 'USDC'
  });

  const [executionHistory] = useState<ExecutionHistory[]>([
    { date: '2024-01-15', token: 'USDC', amount: BigInt('1000000000000000000'), success: true, penalty: BigInt(0) },
    { date: '2024-01-14', token: 'ETH', amount: BigInt('500000000000000000'), success: true, penalty: BigInt(0) },
    { date: '2024-01-13', token: 'USDbC', amount: BigInt('2000000000000000000'), success: true, penalty: BigInt(0) },
    { date: '2024-01-12', token: 'USDC', amount: BigInt('1000000000000000000'), success: true, penalty: BigInt(0) },
    { date: '2024-01-11', token: 'ETH', amount: BigInt('500000000000000000'), success: false, penalty: BigInt('50000000000000000') },
    { date: '2024-01-10', token: 'USDbC', amount: BigInt('2000000000000000000'), success: true, penalty: BigInt(0) },
    { date: '2024-01-09', token: 'USDC', amount: BigInt('1000000000000000000'), success: true, penalty: BigInt(0) },
    { date: '2024-01-08', token: 'ETH', amount: BigInt('500000000000000000'), success: true, penalty: BigInt(0) }
  ]);

  const [goalProgress] = useState<GoalProgress[]>([
    {
      token: 'USDC',
      icon: '💰',
      currentAmount: BigInt('5000000000000000000'),
      goalAmount: BigInt('10000000000000000000'),
      startDate: '2024-01-01',
      expectedEndDate: '2024-03-01',
      daysRemaining: 45,
      progress: 50
    },
    {
      token: 'ETH',
      icon: '🔷',
      currentAmount: BigInt('2000000000000000000'),
      goalAmount: BigInt('5000000000000000000'),
      startDate: '2024-01-15',
      expectedEndDate: '2024-04-15',
      daysRemaining: 60,
      progress: 40
    },
    {
      token: 'USDbC',
      icon: '🏦',
      currentAmount: BigInt('10000000000000000000'),
      goalAmount: BigInt('10000000000000000000'),
      startDate: '2023-12-01',
      expectedEndDate: '2024-02-01',
      daysRemaining: 0,
      progress: 100
    }
  ]);

  const formatTokenAmount = (value: bigint, symbol: string = '') => {
    const formatted = formatEther(value);
    return `${parseFloat(formatted).toFixed(4)} ${symbol}`.trim();
  };

  const formatCurrency = (value: bigint) => {
    const formatted = formatEther(value);
    return `$${parseFloat(formatted).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'Token', 'Amount', 'Success', 'Penalty'],
      ...executionHistory.map(execution => [
        execution.date,
        execution.token,
        formatTokenAmount(execution.amount, execution.token),
        execution.success ? 'Yes' : 'No',
        formatTokenAmount(execution.penalty, execution.token)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-savings-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Daily Savings Analytics</h2>
          <p className="text-gray-600">Track your savings performance and progress</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="secondary" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          {onBack && (
            <Button variant="secondary" onClick={onBack}>
              Back to Dashboard
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Time Range:</span>
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Token:</span>
              <select 
                value={selectedToken} 
                onChange={(e) => setSelectedToken(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All tokens</option>
                <option value="USDC">USDC</option>
                <option value="ETH">ETH</option>
                <option value="USDbC">USDbC</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {formatCurrency(analyticsData.totalSaved)}
            </div>
            <div className="text-sm text-gray-600">Total Saved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {analyticsData.completedGoals}
            </div>
            <div className="text-sm text-gray-600">Goals Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className={`text-3xl font-bold ${getSuccessRateColor(analyticsData.successRate)}`}>
              {analyticsData.successRate}%
            </div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {analyticsData.totalExecutions}
            </div>
            <div className="text-sm text-gray-600">Total Executions</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Goals Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{analyticsData.totalGoals}</div>
                <div className="text-sm text-gray-600">Total Goals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{analyticsData.activeGoals}</div>
                <div className="text-sm text-gray-600">Active Goals</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion Rate</span>
                <span>{((analyticsData.completedGoals / analyticsData.totalGoals) * 100).toFixed(1)}%</span>
              </div>
              <Progress value={(analyticsData.completedGoals / analyticsData.totalGoals) * 100} className="h-2" />
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {analyticsData.averageGoalDuration} days
              </div>
              <div className="text-sm text-gray-600">Average Goal Duration</div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Performance Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average Daily Amount:</span>
                <span className="font-medium">{formatTokenAmount(analyticsData.averageDailyAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Top Performing Token:</span>
                <Badge>{analyticsData.topPerformingToken}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Penalties:</span>
                <span className="font-medium text-red-600">{formatCurrency(analyticsData.totalPenalties)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Success Rate:</span>
                <span className={`font-medium ${getSuccessRateColor(analyticsData.successRate)}`}>
                  {analyticsData.successRate}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goal Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Current Goals Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goalProgress.map((goal, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{goal.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900">{goal.token} Savings Goal</div>
                        <div className="text-sm text-gray-600">
                          Started {formatDate(goal.startDate)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {goal.progress.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">
                        {goal.daysRemaining} days left
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <Progress value={goal.progress} className="h-3" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{formatTokenAmount(goal.currentAmount, goal.token)}</span>
                      <span>{formatTokenAmount(goal.goalAmount, goal.token)}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Start Date:</span>
                      <div className="font-medium">{formatDate(goal.startDate)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Expected End:</span>
                      <div className="font-medium">{formatDate(goal.expectedEndDate)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Days Remaining:</span>
                      <div className="font-medium">{goal.daysRemaining}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <div className="font-medium">
                        {goal.progress === 100 ? (
                          <Badge>Completed</Badge>
                        ) : (
                          <Badge>In Progress</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Execution History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Execution History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {executionHistory.map((execution, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {execution.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">
                        {formatTokenAmount(execution.amount, execution.token)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(execution.date)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{execution.token}</div>
                    {execution.penalty > 0 && (
                      <div className="text-sm text-red-600">
                        Penalty: {formatTokenAmount(execution.penalty, execution.token)}
                      </div>
                    )}
                  </div>
                  <Badge>
                    {execution.success ? 'Success' : 'Failed'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
