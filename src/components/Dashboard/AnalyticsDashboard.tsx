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
  ClockIcon,
  TargetIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  FunnelIcon,
  DownloadIcon
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

  // Mock data generation
  useEffect(() => {
    const generateMockData = () => {
      // Mock metrics
      const mockMetrics: AnalyticsMetrics = {
        totalSavings: 8932.15,
        totalDCA: 3615.17,
        totalWithdrawn: 2341.28,
        netGrowth: 10206.04,
        averageDailySave: 45.67,
        dcaExecutions: 127,
        successRate: 94.2,
        averageSlippage: 0.34,
        totalFees: 89.45,
        roi: 12.4
      };

      // Mock time series data
      const mockTimeSeries: TimeSeriesData[] = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
        const baseSavings = 8000 + Math.sin(i * 0.3) * 1000 + Math.random() * 500;
        const baseDCA = 3000 + Math.cos(i * 0.2) * 500 + Math.random() * 300;
        const baseWithdrawals = 2000 + Math.random() * 500;
        const netValue = baseSavings + baseDCA - baseWithdrawals;
        const growth = netValue * 0.12;

        return {
          date: date.toISOString().split('T')[0],
          savings: baseSavings,
          dca: baseDCA,
          withdrawals: baseWithdrawals,
          netValue: netValue,
          growth: growth
        };
      });

      // Mock token performance
      const mockTokenPerformance: TokenPerformance[] = [
        {
          token: '0x4200000000000000000000000000000000000006',
          symbol: 'WETH',
          totalSaved: 4500.00,
          totalDCA: 2000.00,
          currentValue: 6750.00,
          growth: 250.00,
          growthPercentage: 3.8,
          color: '#3B82F6'
        },
        {
          token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
          symbol: 'USDC',
          totalSaved: 3000.00,
          totalDCA: 1000.00,
          currentValue: 4000.00,
          growth: 0.00,
          growthPercentage: 0.0,
          color: '#10B981'
        },
        {
          token: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
          symbol: 'DAI',
          totalSaved: 1432.15,
          totalDCA: 615.17,
          currentValue: 2047.32,
          growth: 0.00,
          growthPercentage: 0.0,
          color: '#F59E0B'
        }
      ];

      // Mock slippage analysis
      const mockSlippageAnalysis: SlippageAnalysis[] = Array.from({ length: 50 }, (_, i) => {
        const date = new Date(Date.now() - (49 - i) * 24 * 60 * 60 * 1000);
        const slippage = Math.random() * 2;
        const tolerance = 0.5 + Math.random() * 1.5;
        const exceeded = slippage > tolerance;
        const amount = Math.random() * 5 + 0.1;

        return {
          date: date.toISOString().split('T')[0],
          slippage: slippage,
          tolerance: tolerance,
          exceeded: exceeded,
          amount: amount
        };
      });

      setMetrics(mockMetrics);
      setTimeSeriesData(mockTimeSeries);
      setTokenPerformance(mockTokenPerformance);
      setSlippageAnalysis(mockSlippageAnalysis);
    };

    generateMockData();
  }, []);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

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
            <DownloadIcon className="w-4 h-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <CurrencyDollarIcon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">${metrics.totalSavings.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Savings</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <ChartBarIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">${metrics.totalDCA.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">DCA Volume</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{metrics.roi.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">ROI</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <CheckCircleIcon className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <ClockIcon className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{metrics.dcaExecutions}</div>
              <div className="text-sm text-muted-foreground">DCA Executions</div>
            </div>
          </div>
        </Card>
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
        {/* Savings vs DCA Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Savings vs DCA Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData}>
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

        {/* Net Value Growth */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Net Value Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Net Value']} />
                <Line 
                  type="monotone" 
                  dataKey="netValue" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Token Performance Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Token Performance Analysis</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tokenPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="symbol" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Current Value']} />
                <Bar dataKey="currentValue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {tokenPerformance.map((token, index) => (
              <motion.div
                key={token.token}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-muted/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: token.color }}
                    />
                    <span className="font-medium">{token.symbol}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${token.currentValue.toLocaleString()}</div>
                    <div className={`text-sm ${
                      token.growthPercentage > 0 ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {token.growthPercentage > 0 ? '+' : ''}{token.growthPercentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>Saved: ${token.totalSaved.toLocaleString()}</div>
                  <div>DCA: ${token.totalDCA.toLocaleString()}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>

      {/* Slippage Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Slippage Analysis</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={slippageAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  `${value}%`, 
                  name === 'slippage' ? 'Slippage' : 'Tolerance'
                ]} />
                <Scatter 
                  dataKey="slippage" 
                  fill="#EF4444" 
                  r={4}
                />
                <Scatter 
                  dataKey="tolerance" 
                  fill="#3B82F6" 
                  r={4}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {slippageAnalysis.filter(s => s.exceeded).length}
                </div>
                <div className="text-sm text-muted-foreground">Exceeded Tolerance</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {slippageAnalysis.filter(s => !s.exceeded).length}
                </div>
                <div className="text-sm text-muted-foreground">Within Tolerance</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average Slippage</span>
                <span className="font-semibold">{metrics.averageSlippage.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Fees</span>
                <span className="font-semibold">${metrics.totalFees.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Success Rate</span>
                <span className="font-semibold">{metrics.successRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">+{metrics.roi.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Total ROI</div>
            <div className="text-xs text-muted-foreground mt-1">
              ${metrics.netGrowth.toLocaleString()} net growth
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{metrics.dcaExecutions}</div>
            <div className="text-sm text-muted-foreground">DCA Executions</div>
            <div className="text-xs text-muted-foreground mt-1">
              ${metrics.totalDCA.toLocaleString()} total volume
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{metrics.successRate.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
            <div className="text-xs text-muted-foreground mt-1">
              {metrics.averageSlippage.toFixed(2)}% avg slippage
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
