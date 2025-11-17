'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlippageControl } from '@/hooks/useSlippageControl';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ErrorState, LoadingState, NoHistoryEmptyState } from '@/components/ui';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  EyeIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

interface SlippageStatisticsProps {
  className?: string;
}

interface SlippageDataPoint {
  timestamp: number;
  slippage: number;
  tolerance: number;
  exceeded: boolean;
  token: string;
  amount: number;
}

interface SlippageMetrics {
  totalTransactions: number;
  averageSlippage: number;
  maxSlippage: number;
  minSlippage: number;
  slippageExceededCount: number;
  successRate: number;
  averageTolerance: number;
  mostVolatileToken: string;
  leastVolatileToken: string;
}

interface TimeRange {
  id: string;
  name: string;
  days: number;
}

const timeRanges: TimeRange[] = [
  { id: '1d', name: 'Last 24 Hours', days: 1 },
  { id: '7d', name: 'Last 7 Days', days: 7 },
  { id: '30d', name: 'Last 30 Days', days: 30 },
  { id: '90d', name: 'Last 90 Days', days: 90 }
];

export function SlippageStatistics({ className = '' }: SlippageStatisticsProps) {
  const {
    userSlippageTolerance,
    calculateSlippagePercent,
    isSlippageWithinTolerance,
    formatSlippage
  } = useSlippageControl();

  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('7d');
  const [slippageData, setSlippageData] = useState<SlippageDataPoint[]>([]);
  const [metrics, setMetrics] = useState<SlippageMetrics>({
    totalTransactions: 0,
    averageSlippage: 0,
    maxSlippage: 0,
    minSlippage: 0,
    slippageExceededCount: 0,
    successRate: 0,
    averageTolerance: 0,
    mostVolatileToken: '',
    leastVolatileToken: ''
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [tokenStats, setTokenStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Process real slippage data
  useEffect(() => {
    const processSlippageData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real implementation, this would fetch slippage data from:
        // 1. Contract events (SlippageExceeded events)
        // 2. Transaction history analysis
        // 3. The Graph protocol for historical data
        
        // For now, we'll show empty state since we don't have real slippage data
        setSlippageData([]);
        setChartData([]);
        setTokenStats([]);
        
        setMetrics({
          totalTransactions: 0,
          averageSlippage: 0,
          maxSlippage: 0,
          minSlippage: 0,
          slippageExceededCount: 0,
          successRate: 0,
          averageTolerance: userSlippageTolerance || 0.5,
          mostVolatileToken: 'N/A',
          leastVolatileToken: 'N/A'
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load slippage data');
      } finally {
        setIsLoading(false);
      }
    };

    processSlippageData();
  }, [selectedTimeRange, userSlippageTolerance]);

  const refetch = () => {
    setIsLoading(true);
    setError(null);
    // Trigger data refetch
    setTimeout(() => setIsLoading(false), 1000);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Slippage Statistics</h2>
            <p className="text-muted-foreground">Track slippage performance and protection</p>
          </div>
        </div>
        <LoadingState message="Loading slippage statistics..." />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Slippage Statistics</h2>
            <p className="text-muted-foreground">Track slippage performance and protection</p>
          </div>
        </div>
        <ErrorState
          title="Failed to load slippage data"
          message="Unable to fetch slippage statistics. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  // Show empty state if no data
  if (slippageData.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Slippage Statistics</h2>
            <p className="text-muted-foreground">Track slippage performance and protection</p>
          </div>
        </div>
        <NoHistoryEmptyState onAction={() => window.location.href = '/swap'} />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Slippage Statistics</h2>
          <p className="text-muted-foreground">Track slippage performance and protection</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refetch}>
            <FunnelIcon className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Time Range:</span>
          {timeRanges.map((range) => (
            <Button
              key={range.id}
              variant={selectedTimeRange === range.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange(range.id)}
            >
              {range.name}
            </Button>
          ))}
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
              <p className="text-2xl font-bold">{metrics.totalTransactions}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <ChartBarIcon className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Slippage</p>
              <p className="text-2xl font-bold">{metrics.averageSlippage.toFixed(2)}%</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <ArrowTrendingDownIcon className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircleIcon className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Slippage Exceeded</p>
              <p className="text-2xl font-bold">{metrics.slippageExceededCount}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Slippage Over Time */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Slippage Over Time</h3>
          {chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="slippage" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="tolerance" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No slippage data available
            </div>
          )}
        </Card>

        {/* Token Slippage Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Token Slippage Distribution</h3>
          {tokenStats.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tokenStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="token" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgSlippage" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No token data available
            </div>
          )}
        </Card>
      </div>

      {/* Detailed Statistics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Detailed Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Max Slippage</span>
              <span className="font-semibold">{metrics.maxSlippage.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Min Slippage</span>
              <span className="font-semibold">{metrics.minSlippage.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Average Tolerance</span>
              <span className="font-semibold">{metrics.averageTolerance.toFixed(2)}%</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Most Volatile Token</span>
              <span className="font-semibold">{metrics.mostVolatileToken}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Least Volatile Token</span>
              <span className="font-semibold">{metrics.leastVolatileToken}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Tolerance</span>
              <span className="font-semibold">{userSlippageTolerance?.toFixed(2) || '0.50'}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Slippage Events */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Slippage Events</h3>
        {slippageData.length > 0 ? (
          <div className="space-y-3">
            {slippageData.slice(0, 10).map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    event.exceeded ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    {event.exceeded ? (
                      <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
                    ) : (
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">{event.token}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {event.slippage.toFixed(2)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Tolerance: {event.tolerance.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No slippage events found
          </div>
        )}
      </Card>
    </div>
  );
}