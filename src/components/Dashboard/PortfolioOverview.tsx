'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useTokenMetadataBatch } from '@/hooks/useTokenMetadata';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  TargetIcon,
  RefreshIcon
} from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface PortfolioOverviewProps {
  className?: string;
}

export function PortfolioOverview({ className = '' }: PortfolioOverviewProps) {
  const { portfolioData, tokenAllocations, performanceData, isLoading, hasData } = usePortfolio();
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get token metadata for all allocations
  const tokenAddresses = tokenAllocations.map(t => t.token as `0x${string}`);
  const { metadata: tokenMetadata } = useTokenMetadataBatch(tokenAddresses);

  // Enhance allocations with metadata
  const enhancedAllocations = tokenAllocations.map(allocation => ({
    ...allocation,
    symbol: tokenMetadata[allocation.token]?.symbol || allocation.symbol,
    name: tokenMetadata[allocation.token]?.name || 'Unknown'
  }));

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Portfolio Data Yet</h3>
          <p className="text-gray-600 mb-6">
            Start saving to see your portfolio analytics
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Portfolio Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Portfolio Overview</h2>
          <p className="text-muted-foreground">Your savings and investment performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <CurrencyDollarIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Portfolio Value</div>
              <div className="text-2xl font-bold">${portfolioData.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>
          {portfolioData.growthPercentage !== 0 && (
            <div className="flex items-center gap-2">
              <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">+{portfolioData.growthPercentage.toFixed(1)}%</span>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <TargetIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Savings</div>
              <div className="text-2xl font-bold">${portfolioData.totalSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {portfolioData.activeStrategies} active {portfolioData.activeStrategies === 1 ? 'strategy' : 'strategies'}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <ChartBarIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">DCA Volume</div>
              <div className="text-2xl font-bold">${portfolioData.totalDCA.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {portfolioData.completedGoals} goal{portfolioData.completedGoals !== 1 ? 's' : ''} completed
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Net Growth</div>
              <div className="text-2xl font-bold">${portfolioData.netGrowth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>
          {portfolioData.totalWithdrawn > 0 && (
            <div className="text-sm text-muted-foreground">
              ${portfolioData.totalWithdrawn.toLocaleString()} withdrawn
            </div>
          )}
        </Card>
      </div>

      {/* Performance Chart - Only show if we have historical data */}
      {performanceData.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Portfolio Performance</h3>
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
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Portfolio Value']} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Token Allocation */}
      {enhancedAllocations.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Token Allocation</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={enhancedAllocations}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ symbol, percentage }) => `${symbol} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {enhancedAllocations.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value}%`, 'Allocation']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Token Details</h3>
            <div className="space-y-4">
              {enhancedAllocations.map((token, index) => (
                <motion.div
                  key={token.token}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: token.color }}
                    />
                    <div>
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        {token.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })} {token.symbol}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${token.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div className="text-sm text-muted-foreground">{token.percentage}%</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Savings vs DCA Breakdown - Only if we have performance data */}
      {performanceData.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Savings vs DCA Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: any, name: any) => [`$${value.toLocaleString()}`, name === 'savings' ? 'Savings' : 'DCA']} />
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
      )}

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="flex items-center gap-2 h-16">
            <TargetIcon className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Start Daily Savings</div>
              <div className="text-sm opacity-80">Set up automated savings</div>
            </div>
          </Button>
          <Button variant="outline" className="flex items-center gap-2 h-16">
            <ChartBarIcon className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Configure DCA</div>
              <div className="text-sm opacity-80">Set up dollar-cost averaging</div>
            </div>
          </Button>
          <Button variant="outline" className="flex items-center gap-2 h-16">
            <CurrencyDollarIcon className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">View Analytics</div>
              <div className="text-sm opacity-80">Detailed performance metrics</div>
            </div>
          </Button>
        </div>
      </Card>
    </div>
  );
}
