'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDCA } from '@/hooks/useDCA';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
import { formatEther, parseEther } from 'viem';
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
  const { history, isLoadingHistory, historyError } = useDCA();
  
  const [filters, setFilters] = useState<HistoryFilters>({
    timeRange: '30d',
    status: 'all',
    token: 'all'
  });

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [tokenStats, setTokenStats] = useState<TokenStats[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d');

  // Mock chart data for demonstration
  useEffect(() => {
    const mockData: ChartData[] = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      executions: Math.floor(Math.random() * 10) + 1,
      volume: Math.random() * 5 + 1,
      successRate: Math.random() * 20 + 80,
      avgPrice: 2000 + Math.sin(i * 0.3) * 100 + Math.random() * 50
    }));
    setChartData(mockData);

    const mockTokenStats: TokenStats[] = [
      { token: 'USDC', executions: 45, volume: 12.5, successRate: 95, color: '#3B82F6' },
      { token: 'DAI', executions: 32, volume: 8.2, successRate: 88, color: '#10B981' },
      { token: 'WETH', executions: 28, volume: 15.8, successRate: 92, color: '#F59E0B' }
    ];
    setTokenStats(mockTokenStats);
  }, []);

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
      (filters.status === 'success' && item.executedPrice > 0) ||
      (filters.status === 'failed' && item.executedPrice === 0);

    const tokenMatch = filters.token === 'all' || item.toToken === filters.token;

    return timeMatch && statusMatch && tokenMatch;
  }) || [];

  const totalExecutions = filteredHistory.length;
  const successfulExecutions = filteredHistory.filter(item => item.executedPrice > 0).length;
  const totalVolume = filteredHistory.reduce((sum, item) => sum + Number(item.amount), 0);
  const averagePrice = filteredHistory.length > 0 
    ? filteredHistory.reduce((sum, item) => sum + Number(item.executedPrice), 0) / filteredHistory.length
    : 0;
  const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0;

  const handleFilterChange = (key: keyof HistoryFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <ChartBarIcon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalExecutions}</div>
              <div className="text-sm text-muted-foreground">Total Executions</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircleIcon className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <CurrencyDollarIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{formatEther(parseEther(totalVolume.toString()))}</div>
              <div className="text-sm text-muted-foreground">Total Volume</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">${averagePrice.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Avg Price</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">History Filters</h3>
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter Results</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Time Range</label>
            <select
              value={filters.timeRange}
              onChange={(e) => handleFilterChange('timeRange', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
              <option value="all">All time</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All executions</option>
              <option value="success">Successful only</option>
              <option value="failed">Failed only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Token</label>
            <select
              value={filters.token}
              onChange={(e) => handleFilterChange('token', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All tokens</option>
              <option value="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913">USDC</option>
              <option value="0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb">DAI</option>
              <option value="0x4200000000000000000000000000000000000006">WETH</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Execution Volume Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Execution Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Success Rate Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Success Rate Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Success Rate']} />
                <Line 
                  type="monotone" 
                  dataKey="successRate" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Token Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Token Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tokenStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ token, percentage }) => `${token} ${percentage}%`}
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
        </Card>

        {/* Execution Count */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Daily Executions</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="executions" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Execution History Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Execution History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium">Date</th>
                <th className="text-left py-3 px-4 font-medium">From Token</th>
                <th className="text-left py-3 px-4 font-medium">To Token</th>
                <th className="text-left py-3 px-4 font-medium">Amount</th>
                <th className="text-left py-3 px-4 font-medium">Price</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">
                    <ClockIcon className="w-8 h-8 mx-auto mb-2" />
                    <p>No executions found</p>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="py-3 px-4">
                      {new Date(Number(item.timestamp) * 1000).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <CurrencyDollarIcon className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm font-medium">WETH</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <CurrencyDollarIcon className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-sm font-medium">USDC</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium">
                        {formatEther(item.amount)} ETH
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium">
                        ${Number(item.executedPrice).toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        item.executedPrice > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.executedPrice > 0 ? (
                          <CheckCircleIcon className="w-3 h-3" />
                        ) : (
                          <ExclamationTriangleIcon className="w-3 h-3" />
                        )}
                        {item.executedPrice > 0 ? 'Success' : 'Failed'}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Error Display */}
      <AnimatePresence>
        {historyError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center gap-2 text-red-800">
              <ExclamationTriangleIcon className="w-4 h-4" />
              <span className="font-medium">Error Loading History</span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              {historyError.message || 'Failed to load DCA history'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
