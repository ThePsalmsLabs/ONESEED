'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlippageControl } from '@/hooks/useSlippageControl';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
    settings,
    effectiveTolerance,
    calculateSlippagePercentage,
    isSlippageWithinTolerance,
    getSlippageWarningLevel
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

  // Mock data generation
  useEffect(() => {
    const generateMockData = () => {
      const days = timeRanges.find(r => r.id === selectedTimeRange)?.days || 7;
      const dataPoints: SlippageDataPoint[] = [];
      const chartDataPoints: any[] = [];
      const tokenStatsData: any[] = [];
      
      const tokens = ['WETH', 'USDC', 'DAI', 'WBTC'];
      const tokenSlippageData: Record<string, number[]> = {};
      
      // Initialize token data
      tokens.forEach(token => {
        tokenSlippageData[token] = [];
      });

      // Generate data for the selected time range
      for (let i = 0; i < days * 24; i++) {
        const timestamp = Date.now() - (days * 24 - i) * 3600000;
        const slippage = Math.random() * 3; // 0-3% slippage
        const tolerance = 0.5 + Math.random() * 1.5; // 0.5-2% tolerance
        const exceeded = slippage > tolerance;
        const token = tokens[Math.floor(Math.random() * tokens.length)];
        const amount = Math.random() * 10 + 0.1;

        dataPoints.push({
          timestamp,
          slippage,
          tolerance,
          exceeded,
          token,
          amount
        });

        chartDataPoints.push({
          time: new Date(timestamp).toISOString().split('T')[0],
          slippage: slippage,
          tolerance: tolerance,
          exceeded: exceeded ? 1 : 0
        });

        tokenSlippageData[token].push(slippage);
      }

      // Calculate token statistics
      Object.entries(tokenSlippageData).forEach(([token, slippages]) => {
        if (slippages.length > 0) {
          const avgSlippage = slippages.reduce((sum, s) => sum + s, 0) / slippages.length;
          const volatility = Math.sqrt(slippages.reduce((sum, s) => sum + Math.pow(s - avgSlippage, 2), 0) / slippages.length);
          
          tokenStatsData.push({
            token,
            averageSlippage: avgSlippage,
            volatility,
            transactions: slippages.length,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`
          });
        }
      });

      setSlippageData(dataPoints);
      setChartData(chartDataPoints);
      setTokenStats(tokenStatsData);

      // Calculate metrics
      const totalTransactions = dataPoints.length;
      const averageSlippage = dataPoints.reduce((sum, d) => sum + d.slippage, 0) / totalTransactions;
      const maxSlippage = Math.max(...dataPoints.map(d => d.slippage));
      const minSlippage = Math.min(...dataPoints.map(d => d.slippage));
      const slippageExceededCount = dataPoints.filter(d => d.exceeded).length;
      const successRate = ((totalTransactions - slippageExceededCount) / totalTransactions) * 100;
      const averageTolerance = dataPoints.reduce((sum, d) => sum + d.tolerance, 0) / totalTransactions;

      // Find most/least volatile tokens
      const sortedTokens = tokenStatsData.sort((a, b) => b.volatility - a.volatility);
      const mostVolatile = sortedTokens[0]?.token || '';
      const leastVolatile = sortedTokens[sortedTokens.length - 1]?.token || '';

      setMetrics({
        totalTransactions,
        averageSlippage,
        maxSlippage,
        minSlippage,
        slippageExceededCount,
        successRate,
        averageTolerance,
        mostVolatileToken: mostVolatile,
        leastVolatileToken: leastVolatile
      });
    };

    generateMockData();
  }, [selectedTimeRange]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Time Range Selector */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Slippage Statistics</h3>
          <div className="flex items-center gap-2">
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
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <ChartBarIcon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{metrics.totalTransactions}</div>
              <div className="text-sm text-muted-foreground">Total Transactions</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircleIcon className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{metrics.averageSlippage.toFixed(2)}%</div>
              <div className="text-sm text-muted-foreground">Avg Slippage</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{metrics.slippageExceededCount}</div>
              <div className="text-sm text-muted-foreground">Exceeded Tolerance</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Slippage Trend Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Slippage Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="slippage" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3}
                />
                <Line 
                  type="monotone" 
                  dataKey="tolerance" 
                  stroke="#EF4444" 
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Slippage Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Slippage Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="slippage" fill="#3B82F6" />
                <Bar dataKey="tolerance" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Token Slippage Comparison */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Token Slippage Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tokenStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="token" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="averageSlippage" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Token Volatility */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Token Volatility</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tokenStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ token, volatility }) => `${token} ${volatility.toFixed(2)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="volatility"
                >
                  {tokenStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Slippage Range</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Minimum Slippage</span>
              <span className="text-2xl font-bold text-green-600">{metrics.minSlippage.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Average Slippage</span>
              <span className="text-2xl font-bold text-blue-600">{metrics.averageSlippage.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Maximum Slippage</span>
              <span className="text-2xl font-bold text-red-600">{metrics.maxSlippage.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Average Tolerance</span>
              <span className="text-2xl font-bold text-purple-600">{metrics.averageTolerance.toFixed(2)}%</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Token Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Most Volatile</span>
              <span className="text-lg font-semibold text-red-600">{metrics.mostVolatileToken}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Least Volatile</span>
              <span className="text-lg font-semibold text-green-600">{metrics.leastVolatileToken}</span>
            </div>
            <div className="space-y-2">
              {tokenStats.map((token, index) => (
                <div key={token.token} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{token.token}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {token.averageSlippage.toFixed(2)}%
                    </span>
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${(token.averageSlippage / metrics.maxSlippage) * 100}%`,
                          backgroundColor: token.color
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{metrics.successRate.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
            <div className="text-xs text-muted-foreground mt-1">
              {metrics.totalTransactions - metrics.slippageExceededCount} of {metrics.totalTransactions} transactions
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{metrics.averageSlippage.toFixed(2)}%</div>
            <div className="text-sm text-muted-foreground">Average Slippage</div>
            <div className="text-xs text-muted-foreground mt-1">
              {metrics.averageSlippage < metrics.averageTolerance ? 'Within tolerance' : 'Above tolerance'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{metrics.averageTolerance.toFixed(2)}%</div>
            <div className="text-sm text-muted-foreground">Average Tolerance</div>
            <div className="text-xs text-muted-foreground mt-1">
              User-defined slippage limits
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
