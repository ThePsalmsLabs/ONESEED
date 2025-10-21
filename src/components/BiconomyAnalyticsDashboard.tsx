'use client';

import React from 'react';
import { useBiconomyAnalytics } from '@/hooks/useBiconomyAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  HiArrowPath, 
  HiArrowTrendingUp, 
  HiCurrencyDollar, 
  HiChartBar, 
  HiCalendar 
} from 'react-icons/hi2';
import { formatEther } from 'viem';

export function BiconomyAnalyticsDashboard() {
  const { analyticsData, isLoading, error, loadAnalytics } = useBiconomyAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <HiArrowPath className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading analytics: {error}</p>
        <Button onClick={loadAnalytics} variant="secondary">
          <HiArrowPath className="h-4 w-4 mr-2" />
          Retry
        </Button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No analytics data available</p>
        <Button onClick={loadAnalytics} variant="secondary" className="mt-4">
          <HiArrowPath className="h-4 w-4 mr-2" />
          Load Analytics
        </Button>
      </div>
    );
  }

  const { gasSavings, userOpHistory, topOperations, monthlyBreakdown } = analyticsData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Your Gas Savings</h2>
          <p className="text-gray-500">Track your Biconomy gas savings and transaction history</p>
        </div>
        <Button onClick={loadAnalytics} variant="secondary">
          <HiArrowPath className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gas Saved</CardTitle>
            <HiCurrencyDollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${gasSavings.usdValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatEther(gasSavings.totalGasSaved)} ETH
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <HiChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gasSavings.transactionCount}</div>
            <p className="text-xs text-muted-foreground">
              {formatEther(gasSavings.averagePerTx)} ETH avg per tx
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Savings</CardTitle>
            <HiArrowTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${gasSavings.monthlySavings.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Projected monthly savings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yearly Projection</CardTitle>
            <HiCalendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ${gasSavings.yearlyProjection.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Projected yearly savings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Operations */}
      <Card>
        <CardHeader>
          <CardTitle>Top Operations by Gas Savings</CardTitle>
          <CardDescription>Your most gas-efficient operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topOperations.map((op, index) => (
              <div key={op.operation} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="info">#{index + 1}</Badge>
                  <span className="font-medium">{op.operation}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    ${(Number(op.totalSavings) / 1e18 * 2000).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {op.count} transactions
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Breakdown</CardTitle>
          <CardDescription>Gas savings by month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyBreakdown.map((month) => (
              <div key={month.month} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{month.month}</div>
                  <div className="text-sm text-gray-500">
                    {month.transactions} transactions
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    ${month.usdValue.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatEther(month.gasSaved)} ETH
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest gasless transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userOpHistory.slice(0, 10).map((tx) => (
              <div key={tx.hash} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant={tx.status === 'success' ? 'success' : 'error'}
                  >
                    {tx.status}
                  </Badge>
                  <span className="font-medium">{tx.operation}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-600">
                    Saved ${(Number(tx.savings) / 1e18 * 2000).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
