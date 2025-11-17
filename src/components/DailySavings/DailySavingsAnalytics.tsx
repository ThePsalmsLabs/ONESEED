'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { ErrorState, LoadingState, NoHistoryEmptyState } from '@/components/ui';
import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';
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
  const { address } = useAccount();
  
  // Mock loading and error states for now
  const isLoading = false;
  const error = null;
  const refetch = () => {};

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedToken, setSelectedToken] = useState<string>('all');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalSaved: BigInt(0),
    totalGoals: 0,
    completedGoals: 0,
    activeGoals: 0,
    averageDailyAmount: BigInt(0),
    totalExecutions: 0,
    successRate: 0,
    totalPenalties: BigInt(0),
    averageGoalDuration: 0,
    topPerformingToken: 'N/A'
  });

  const [executionHistory, setExecutionHistory] = useState<ExecutionHistory[]>([]);
  const [goalProgress, setGoalProgress] = useState<GoalProgress[]>([]);

  // Process real daily savings data
  useEffect(() => {
    // This would process real data from the hooks
    // For now, we'll show empty state if no data is available
    if (isLoading) return;

    // Placeholder processing - would need real contract data
    setAnalyticsData({
      totalSaved: BigInt(0),
      totalGoals: 0,
      completedGoals: 0,
      activeGoals: 0,
      averageDailyAmount: BigInt(0),
      totalExecutions: 0,
      successRate: 0,
      totalPenalties: BigInt(0),
      averageGoalDuration: 0,
      topPerformingToken: 'N/A'
    });

    setExecutionHistory([]);
    setGoalProgress([]);
  }, [isLoading]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Daily Savings Analytics</h2>
            <p className="text-muted-foreground">Track your daily savings performance</p>
          </div>
        </div>
        <LoadingState message="Loading daily savings analytics..." />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Daily Savings Analytics</h2>
            <p className="text-muted-foreground">Track your daily savings performance</p>
          </div>
        </div>
        <ErrorState
          title="Failed to load analytics"
          message="Unable to fetch your daily savings analytics. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  // Show empty state if no data
  if (analyticsData.totalGoals === 0 && executionHistory.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Daily Savings Analytics</h2>
            <p className="text-muted-foreground">Track your daily savings performance</p>
          </div>
        </div>
        <NoHistoryEmptyState onAction={() => window.location.href = '/configure'} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Daily Savings Analytics</h2>
          <p className="text-muted-foreground">Track your daily savings performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Time Range:</span>
              {['7d', '30d', '90d', '1y'].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(range as any)}
                >
                  {range}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Token:</span>
              <Button
                variant={selectedToken === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedToken('all')}
              >
                All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Saved</p>
                <p className="text-2xl font-bold">
                  {Number(formatUnits(analyticsData.totalSaved, 18)).toFixed(2)}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Goals</p>
                <p className="text-2xl font-bold">{analyticsData.activeGoals}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Target className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{analyticsData.successRate.toFixed(1)}%</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Executions</p>
                <p className="text-2xl font-bold">{analyticsData.totalExecutions}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goal Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Goal Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          {goalProgress.length > 0 ? (
            <div className="space-y-4">
              {goalProgress.map((goal, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{goal.icon}</span>
                      <span className="font-semibold">{goal.token}</span>
                    </div>
                    <Badge variant={goal.progress >= 100 ? 'default' : 'secondary'}>
                      {goal.progress.toFixed(1)}%
                    </Badge>
                  </div>
                  <Progress value={goal.progress} className="mb-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      {Number(formatUnits(goal.currentAmount, 18)).toFixed(2)} / {Number(formatUnits(goal.goalAmount, 18)).toFixed(2)}
                    </span>
                    <span>{goal.daysRemaining} days remaining</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No active goals found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Execution History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Execution History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {executionHistory.length > 0 ? (
            <div className="space-y-3">
              {executionHistory.map((execution, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      execution.success ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {execution.success ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">{execution.token}</div>
                      <div className="text-sm text-muted-foreground">{execution.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {Number(formatUnits(execution.amount, 18)).toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {execution.success ? 'Success' : 'Failed'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No execution history available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average Daily Amount</span>
                <span className="font-semibold">
                  {Number(formatUnits(analyticsData.averageDailyAmount, 18)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Penalties</span>
                <span className="font-semibold text-red-600">
                  {Number(formatUnits(analyticsData.totalPenalties, 18)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average Goal Duration</span>
                <span className="font-semibold">{analyticsData.averageGoalDuration} days</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completed Goals</span>
                <span className="font-semibold">{analyticsData.completedGoals}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Top Performing Token</span>
                <span className="font-semibold">{analyticsData.topPerformingToken}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Goals</span>
                <span className="font-semibold">{analyticsData.totalGoals}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}