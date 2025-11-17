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
  EyeIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter } from 'recharts';

interface AnalyticsDashboardProps {
  className?: string;
}

interface AnalyticsMetrics {
  totalSavings: number;
  totalDCA: number;
  totalWithdrawn: number;
  netGrowth: number;
  averageDailySave: number;
  dcaExecutions: number;
  successRate: number;
  averageSlippage: number;
  totalFees: number;
  roi: number;
}

interface TimeSeriesData {
  date: string;
  savings: number;
  dca: number;
  withdrawals: number;
  netValue: number;
  growth: number;
}

interface TokenPerformance {
  token: string;
  symbol: string;
  totalSaved: number;
  totalDCA: number;
  currentValue: number;
  growth: number;
  growthPercentage: number;
  color: string;
}

interface SlippageAnalysis {
  date: string;
  slippage: number;
  tolerance: number;
  exceeded: boolean;
  amount: number;
}

export function AnalyticsDashboard({ className = '' }: AnalyticsDashboardProps) {
  const { address } = useAccount();
  const { portfolio, isLoadingPortfolio, portfolioError, refetchPortfolio } = useAnalytics();
  
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    totalSavings: 0,
    totalDCA: 0,
    totalWithdrawn: 0,
    netGrowth: 0,
    averageDailySave: 0,
    dcaExecutions: 0,
    successRate: 0,
    averageSlippage: 0,
    totalFees: 0,
    roi: 0
  });

  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [tokenPerformance, setTokenPerformance] = useState<TokenPerformance[]>([]);
  const [slippageAnalysis, setSlippageAnalysis] = useState<SlippageAnalysis[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'savings' | 'dca' | 'growth'>('savings');

  // Process portfolio data into metrics
  useEffect(() => {
    if (!portfolio) return;

    const totalSavingsUSD = Number(formatUnits(portfolio.totalValueUSD, 6)); // USDC decimals
    const totalSavings = portfolio.savings.reduce((sum, amount, index) => {
      // Convert savings amounts to USD (simplified - would need token pricing)
      return sum + Number(formatUnits(amount, 18)); // Assume 18 decimals for now
    }, 0);
    
    const totalDCA = portfolio.dcaAmounts.reduce((sum, amount) => {
      return sum + Number(formatUnits(amount, 18)); // Assume 18 decimals for now
    }, 0);

    // Calculate derived metrics
    const netGrowth = totalSavingsUSD - totalSavings - totalDCA;
    const averageDailySave = totalSavings / 30; // Simplified calculation
    const dcaExecutions = portfolio.dcaAmounts.filter(amount => amount > 0).length;
    const successRate = dcaExecutions > 0 ? 95 : 0; // Placeholder - would need real execution data
    const averageSlippage = 0.34; // Placeholder - would need real slippage data
    const totalFees = totalSavingsUSD * 0.01; // 1% of total value as fees
    const roi = totalSavingsUSD > 0 ? (netGrowth / totalSavingsUSD) * 100 : 0;

    setMetrics({
      totalSavings: totalSavingsUSD,
      totalDCA,
      totalWithdrawn: 0, // Would need withdrawal history
      netGrowth,
      averageDailySave,
      dcaExecutions,
      successRate,
      averageSlippage,
      totalFees,
      roi
    });

    // Generate token performance from portfolio data
    const tokenPerf: TokenPerformance[] = portfolio.tokens.map((token, index) => {
      const savings = portfolio.savings[index];
      const dca = portfolio.dcaAmounts[index];
      const totalSaved = Number(formatUnits(savings, 18));
      const totalDCA = Number(formatUnits(dca, 18));
      const currentValue = totalSaved + totalDCA;
      
      return {
        token,
        symbol: `Token${index + 1}`, // Would need token metadata
        totalSaved,
        totalDCA,
        currentValue,
        growth: 0, // Would need historical data
        growthPercentage: 0, // Would need historical data
        color: COLORS[index % COLORS.length]
      };
    });

    setTokenPerformance(tokenPerf);

    // For now, show empty arrays for time series and slippage data
    // These will be populated from The Graph in Phase 8
    setTimeSeriesData([]);
    setSlippageAnalysis([]);

  }, [portfolio]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Show loading state
  if (isLoadingPortfolio) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
            <p className="text-muted-foreground">Comprehensive performance insights</p>
          </div>
        </div>
        <LoadingState message="Loading analytics data..." />
      </div>
    );
  }

  // Show error state
  if (portfolioError) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
            <p className="text-muted-foreground">Comprehensive performance insights</p>
          </div>
        </div>
        <ErrorState
          title="Failed to load analytics"
          message="Unable to fetch your portfolio data. Please try again."
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
            <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
            <p className="text-muted-foreground">Comprehensive performance insights</p>
          </div>
        </div>
        <NoAnalyticsEmptyState onAction={() => window.location.href = '/configure'} />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Analytics Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive performance insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Savings</p>
              <p className="text-2xl font-bold">${metrics.totalSavings.toFixed(2)}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <CurrencyDollarIcon className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <ArrowTrendingUpIcon className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600">+{metrics.roi.toFixed(1)}%</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">DCA Volume</p>
              <p className="text-2xl font-bold">${metrics.totalDCA.toFixed(2)}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <ChartBarIcon className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-sm text-muted-foreground">{metrics.dcaExecutions} executions</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Net Growth</p>
              <p className="text-2xl font-bold">${metrics.netGrowth.toFixed(2)}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-sm text-muted-foreground">ROI: {metrics.roi.toFixed(1)}%</span>
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
          <div className="flex items-center mt-2">
            <span className="text-sm text-muted-foreground">Avg slippage: {metrics.averageSlippage}%</span>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Value Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Portfolio Value</h3>
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
          {timeSeriesData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="netValue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Historical data will be available soon
            </div>
          )}
        </Card>

        {/* Token Performance */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Token Performance</h3>
            <Button variant="outline" size="sm">
              <EyeIcon className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>
          {tokenPerformance.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tokenPerformance as any}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.symbol} $${entry.currentValue.toFixed(0)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="currentValue"
                  >
                    {tokenPerformance.map((entry, index) => (
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

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Slippage Analysis */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Slippage Analysis</h3>
            <Button variant="outline" size="sm">
              <FunnelIcon className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          {slippageAnalysis.length > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={slippageAnalysis}>
                  <CartesianGrid />
                  <XAxis dataKey="amount" />
                  <YAxis dataKey="slippage" />
                  <Tooltip />
                  <Scatter dataKey="slippage" fill="#3B82F6" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              Slippage data will be available soon
            </div>
          )}
        </Card>

        {/* Performance Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Average Daily Save</span>
              <span className="font-medium">${metrics.averageDailySave.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Fees Paid</span>
              <span className="font-medium">${metrics.totalFees.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">DCA Executions</span>
              <span className="font-medium">{metrics.dcaExecutions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Success Rate</span>
              <span className="font-medium text-green-600">{metrics.successRate.toFixed(1)}%</span>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button className="w-full" variant="outline">
              Configure Savings
            </Button>
            <Button className="w-full" variant="outline">
              Setup DCA
            </Button>
            <Button className="w-full" variant="outline">
              View Transactions
            </Button>
            <Button className="w-full" variant="outline">
              Export Report
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}