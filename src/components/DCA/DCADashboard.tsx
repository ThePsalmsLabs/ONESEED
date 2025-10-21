'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useDCA } from '@/hooks/useDCA';
import { useTokenMetadata } from '@/hooks/useTokenMetadata';
import { formatEther } from 'viem';
import { 
  TrendingUp, 
  Clock, 
  Play, 
  Pause, 
  Settings, 
  History,
  DollarSign,
  Target,
  Zap,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface DCADashboardProps {
  onConfigure?: () => void;
  onViewHistory?: () => void;
}

export function DCADashboard({ onConfigure, onViewHistory }: DCADashboardProps) {
  const { 
    config, 
    pending, 
    history, 
    isLoadingConfig, 
    isLoadingPending, 
    isLoadingHistory,
    executeDCA,
    disableDCA,
    isExecuting,
    isDisabling,
    contractAddress
  } = useDCA();

  // Token metadata hook - not used in this component currently
  // const { getTokenMetadata } = useTokenMetadata();

  // Calculate real metrics from contract data
  const totalInvested = history?.reduce((sum, execution) => sum + execution.amount, BigInt(0)) || BigInt(0);
  const executions = history?.length || 0;
  const successRate = executions > 0 ? 100 : 0; // All executions in history are successful

  const formatCurrency = (value: bigint, decimals: number = 18) => {
    const formatted = formatEther(value);
    return `$${parseFloat(formatted).toFixed(2)}`;
  };

  const formatTokenAmount = (value: bigint, symbol: string = 'ETH') => {
    const formatted = formatEther(value);
    return `${parseFloat(formatted).toFixed(4)} ${symbol}`;
  };

  // Check if there are pending DCA executions
  const hasPendingExecutions = pending && pending.tokens.length > 0;
  const nextExecutionStatus = hasPendingExecutions ? 'Ready to execute' : 'No pending executions';

  // Get target token info from config
  const targetToken = config?.targetToken;
  const targetTokenSymbol = targetToken ? 'TOKEN' : 'N/A'; // In real implementation, get from token metadata


  if (isLoadingConfig) {
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

  if (!config?.enabled) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Auto-Invest Not Set Up</h3>
          <p className="text-gray-600 mb-6">
            Set up automated dollar-cost averaging to invest in your favorite tokens automatically.
          </p>
          <Button onClick={onConfigure} className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
            <Settings className="w-4 h-4 mr-2" />
            Set Up Auto-Invest
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview - Only show if we have real data */}
      {executions > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Your Auto-Invest Portfolio</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formatTokenAmount(totalInvested, targetTokenSymbol)}
                </div>
                <div className="text-sm text-gray-600">Total Invested</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {executions}
                </div>
                <div className="text-sm text-gray-600">Executions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {successRate}%
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Target Token:</span>
                  <div className="font-medium">{targetTokenSymbol}</div>
                </div>
                <div>
                  <span className="text-gray-600">Min Amount:</span>
                  <div className="font-medium">{config ? formatTokenAmount(config.minAmount) : 'N/A'}</div>
                </div>
                <div>
                  <span className="text-gray-600">Max Slippage:</span>
                  <div className="font-medium">{config ? `${Number(config.maxSlippage) / 100}%` : 'N/A'}</div>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <div className="font-medium text-green-600">{config?.enabled ? 'Active' : 'Inactive'}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Execution & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Execution Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {nextExecutionStatus}
                </div>
                <div className="text-sm text-gray-600">
                  {hasPendingExecutions ? 'Pending executions available' : 'No pending executions'}
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-800">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Status: {config?.enabled ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="text-sm text-blue-700 mt-1">
                  {executions} executions completed
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => executeDCA()}
                  disabled={isExecuting || !hasPendingExecutions}
                  className="flex-1"
                >
                  {isExecuting ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Execute Now
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => disableDCA()}
                  disabled={isDisabling || !config?.enabled}
                  className="flex-1"
                >
                  {isDisabling ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                      Disabling...
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                variant="secondary"
                onClick={onConfigure}
                className="w-full justify-start"
              >
                <Settings className="w-4 h-4 mr-2" />
                Modify Settings
              </Button>
              <Button
                variant="secondary"
                onClick={onViewHistory}
                className="w-full justify-start"
              >
                <History className="w-4 h-4 mr-2" />
                View Execution History
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start"
                disabled
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Withdraw Funds
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Queue */}
      {pending && pending.tokens.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Pending Executions</span>
                  <Badge variant="info">{pending.tokens.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pending.tokens.map((token, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Target className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">DCA Execution</div>
                      <div className="text-sm text-gray-600">
                        {formatTokenAmount(pending.amounts[index])} → {pending.targets[index]}
                      </div>
                    </div>
                  </div>
                  <Badge variant="warning">Pending</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Executions */}
      {history && history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="w-5 h-5" />
              <span>Recent Executions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.slice(0, 5).map((execution, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">
                        Bought {formatTokenAmount(execution.amount)} {execution.toToken}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(Number(execution.timestamp) * 1000).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(execution.executedPrice)}</div>
                    <div className="text-sm text-gray-600">Price</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="secondary" onClick={onViewHistory}>
                View All History
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
