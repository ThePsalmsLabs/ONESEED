'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { useDCA } from '@/hooks/useDCA';
import { formatEther } from 'viem';
import { 
  History, 
  Download, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign
} from 'lucide-react';

interface DCAExecutionHistoryProps {
  onBack?: () => void;
}

interface ExecutionWithDetails {
  fromToken: `0x${string}`;
  toToken: `0x${string}`;
  amount: bigint;
  timestamp: bigint;
  executedPrice: bigint;
  status: 'Success' | 'Failed' | 'Pending';
  gasSaved: number;
  hash?: `0x${string}`;
}

export function DCAExecutionHistory({ onBack }: DCAExecutionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const { history, isLoadingHistory, refetchHistory } = useDCA();

  // Use real history data from the hook
  const executionHistory = history || [];

  const formatCurrency = (value: bigint) => {
    const formatted = formatEther(value);
    return `$${parseFloat(formatted).toFixed(2)}`;
  };

  const formatTokenAmount = (value: bigint, symbol: string = 'ETH') => {
    const formatted = formatEther(value);
    return `${parseFloat(formatted).toFixed(4)} ${symbol}`;
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (timestamp: bigint) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - Number(timestamp);
    
    const hours = Math.floor(diff / 3600);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success':
        return 'bg-green-100 text-green-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredHistory = executionHistory.filter(execution => {
    const matchesSearch = searchTerm === '' || 
      execution.fromToken.toLowerCase().includes(searchTerm.toLowerCase()) ||
      execution.toToken.toLowerCase().includes(searchTerm.toLowerCase());
    
    // All executions in history are successful (failed ones don't get stored)
    const matchesStatus = statusFilter === 'all' || statusFilter === 'success';
    
    const matchesDate = dateFilter === 'all' || (() => {
      const now = Math.floor(Date.now() / 1000);
      const executionTime = Number(execution.timestamp);
      const diff = now - executionTime;
      
      switch (dateFilter) {
        case 'today':
          return diff < 24 * 60 * 60;
        case 'week':
          return diff < 7 * 24 * 60 * 60;
        case 'month':
          return diff < 30 * 24 * 60 * 60;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalVolume = executionHistory.reduce((sum, execution) => sum + execution.amount, BigInt(0));
  const successRate = executionHistory.length > 0 ? 100 : 0; // All executions in history are successful

  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'From Token', 'To Token', 'Amount', 'Price', 'Status'],
      ...filteredHistory.map(execution => [
        formatDate(execution.timestamp),
        execution.fromToken,
        execution.toToken,
        formatTokenAmount(execution.amount),
        formatCurrency(execution.executedPrice),
        'Success' // All executions in history are successful
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dca-execution-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoadingHistory) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">DCA Execution History</h2>
          <p className="text-gray-600">Track your automated investment executions</p>
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

      {/* Summary Stats - Only show if we have real data */}
      {executionHistory.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{executionHistory.length}</div>
              <div className="text-sm text-gray-600">Total Executions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{successRate}%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{formatTokenAmount(totalVolume)}</div>
              <div className="text-sm text-gray-600">Total Volume</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by token address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
            </select>
            <select 
              value={dateFilter} 
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Execution List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="w-5 h-5" />
            <span>Execution Timeline</span>
            <Badge variant="info">{filteredHistory.length} executions</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Executions Found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : 'Your DCA execution history will appear here once you start auto-investing.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((execution, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="font-medium">
                            Bought {formatTokenAmount(execution.amount)} {execution.toToken}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatDate(execution.timestamp)} • {formatTimeAgo(execution.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(execution.executedPrice)}</div>
                        <div className="text-sm text-gray-600">Price</div>
                      </div>
                      <Badge variant="success">
                        Success
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
