'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDCA } from '@/hooks/useDCA';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ErrorState, LoadingState, NoHistoryEmptyState } from '@/components/ui';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { formatUnits } from 'viem';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface DCAHistoryProps {
  className?: string;
}

interface HistoryFilters {
  timeRange: '7d' | '30d' | '90d' | '1y' | 'all';
  status: 'all' | 'success' | 'failed';
  token: 'all' | string;
}

interface ChartData {
  date: string;
  executions: number;
  volume: number;
  successRate: number;
  avgPrice: number;
}

interface TokenStats {
  token: string;
  executions: number;
  volume: number;
  successRate: number;
  color: string;
}

export function DCAHistory({ className = '' }: DCAHistoryProps) {
  const { history, isLoadingHistory, refetchHistory } = useDCA();
  
  const [filters, setFilters] = useState<HistoryFilters>({
    timeRange: '30d',
    status: 'all',
    token: 'all'
  });

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [tokenStats, setTokenStats] = useState<TokenStats[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d');

  // Process real DCA history data
  useEffect(() => {
    if (!history || history.length === 0) {
      setChartData([]);
      setTokenStats([]);
      return;
    }

    // Group executions by date
    const executionsByDate = new Map<string, any[]>();
    history.forEach(execution => {
      const date = new Date(Number(execution.timestamp) * 1000).toISOString().split('T')[0];
      if (!executionsByDate.has(date)) {
        executionsByDate.set(date, []);
      }
      executionsByDate.get(date)!.push(execution);
    });

    // Generate chart data from real executions
    const processedChartData: ChartData[] = Array.from(executionsByDate.entries()).map(([date, executions]) => {
      const totalVolume = executions.reduce((sum, exec) => sum + Number(formatUnits(exec.amount, 18)), 0);
      const successfulExecutions = executions.filter(exec => exec.executedPrice > BigInt(0));
      const successRate = executions.length > 0 ? (successfulExecutions.length / executions.length) * 100 : 0;
      const avgPrice = successfulExecutions.length > 0 
        ? successfulExecutions.reduce((sum, exec) => sum + Number(formatUnits(exec.executedPrice, 18)), 0) / successfulExecutions.length
        : 0;

      return {
        date,
        executions: executions.length,
        volume: totalVolume,
        successRate,
        avgPrice
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setChartData(processedChartData);

    // Generate token statistics
    const tokenMap = new Map<string, { executions: any[], volume: number }>();
    history.forEach(execution => {
      const token = execution.toToken;
      if (!tokenMap.has(token)) {
        tokenMap.set(token, { executions: [], volume: 0 });
      }
      const tokenData = tokenMap.get(token)!;
      tokenData.executions.push(execution);
      tokenData.volume += Number(formatUnits(execution.amount, 18));
    });

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    const processedTokenStats: TokenStats[] = Array.from(tokenMap.entries()).map(([token, data], index) => {
      const successfulExecutions = data.executions.filter(exec => exec.executedPrice > BigInt(0));
      const successRate = data.executions.length > 0 ? (successfulExecutions.length / data.executions.length) * 100 : 0;

      return {
        token: token.slice(0, 6) + '...', // Truncate token address
        executions: data.executions.length,
        volume: data.volume,
        successRate,
        color: colors[index % colors.length]
      };
    });

    setTokenStats(processedTokenStats);

  }, [history]);

  const filteredHistory = history?.filter(item => {
    const date = new Date(Number(item.timestamp) * 1000);
    const now = new Date();
    const daysDiff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

    let timeMatch = true;
    switch (filters.timeRange) {
      case '7d': timeMatch = daysDiff <= 7; break;
      case '30d': timeMatch = daysDiff <= 30; break;
      case '90d': timeMatch = daysDiff <= 90; break;
      case '1y': timeMatch = daysDiff <= 365; break;
      case 'all': timeMatch = true; break;
    }

    const statusMatch = filters.status === 'all' || 
      (filters.status === 'success' && item.executedPrice > BigInt(0)) ||
      (filters.status === 'failed' && item.executedPrice === BigInt(0));

    const tokenMatch = filters.token === 'all' || item.toToken === filters.token;

    return timeMatch && statusMatch && tokenMatch;
  }) || [];

  // Show loading state
  if (isLoadingHistory) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">DCA History</h2>
            <p className="text-muted-foreground">Track your dollar-cost averaging performance</p>
          </div>
        </div>
        <LoadingState message="Loading DCA execution history..." />
      </div>
    );
  }

  // Show error state
  if (false) { // No error property available
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">DCA History</h2>
            <p className="text-muted-foreground">Track your dollar-cost averaging performance</p>
          </div>
        </div>
        <ErrorState
          title="Failed to load DCA history"
          message="Unable to fetch your DCA execution history. Please try again."
          onRetry={refetchHistory}
        />
      </div>
    );
  }

  // Show empty state if no history
  if (!history || history.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">DCA History</h2>
            <p className="text-muted-foreground">Track your dollar-cost averaging performance</p>
          </div>
        </div>
        <NoHistoryEmptyState onAction={() => window.location.href = '/configure'} />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">DCA History</h2>
          <p className="text-muted-foreground">Track your dollar-cost averaging performance</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredHistory.length} execution{filteredHistory.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Time Range:</span>
            {['7d', '30d', '90d', '1y', 'all'].map((range) => (
              <Button
                key={range}
                variant={filters.timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, timeRange: range as any }))}
              >
                {range}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            {['all', 'success', 'failed'].map((status) => (
              <Button
                key={status}
                variant={filters.status === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, status: status as any }))}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Execution Volume Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Execution Volume</h3>
          {chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="volume" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="executions" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No execution data available
            </div>
          )}
        </Card>

        {/* Token Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Token Distribution</h3>
          {tokenStats.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tokenStats as any}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.token} (${entry.executions})`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="executions"
                  >
                    {tokenStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No token data available
            </div>
          )}
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Executions</p>
              <p className="text-2xl font-bold">{filteredHistory.length}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <ChartBarIcon className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold">
                {filteredHistory.length > 0 
                  ? Math.round((filteredHistory.filter(h => h.executedPrice > BigInt(0)).length / filteredHistory.length) * 100)
                  : 0}%
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircleIcon className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Volume</p>
              <p className="text-2xl font-bold">
                {filteredHistory.reduce((sum, h) => sum + Number(formatUnits(h.amount, 18)), 0).toFixed(2)}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <CurrencyDollarIcon className="w-4 h-4 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Price</p>
              <p className="text-2xl font-bold">
                {(() => {
                  const successfulExecutions = filteredHistory.filter(h => h.executedPrice > BigInt(0));
                  return successfulExecutions.length > 0
                    ? (successfulExecutions.reduce((sum, h) => sum + Number(formatUnits(h.executedPrice, 18)), 0) / successfulExecutions.length).toFixed(2)
                    : '0.00';
                })()}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-4 h-4 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Executions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Executions</h3>
        {filteredHistory.length > 0 ? (
          <div className="space-y-3">
            {filteredHistory.slice(0, 10).map((execution, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    execution.executedPrice > BigInt(0) ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {execution.executedPrice > BigInt(0) ? (
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    ) : (
                      <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">
                      {formatUnits(execution.amount, 18)} → {execution.toToken.slice(0, 6)}...
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(Number(execution.timestamp) * 1000).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {execution.executedPrice > BigInt(0) 
                      ? `${formatUnits(execution.executedPrice, 18)}`
                      : 'Failed'
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {execution.executedPrice > BigInt(0) ? 'Executed' : 'Failed'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No executions found for the selected filters
          </div>
        )}
      </Card>
    </div>
  );
}