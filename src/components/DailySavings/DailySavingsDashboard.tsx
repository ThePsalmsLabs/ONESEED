'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { useDailySavings } from '@/hooks/useDailySavings';
import { formatEther } from 'viem';
import {
  Target,
  Clock,
  Play,
  Pause,
  Settings,
  History,
  CheckCircle,
  Zap,
  BarChart3
} from 'lucide-react';

interface DailySavingsDashboardProps {
  onConfigure?: () => void;
  onViewHistory?: () => void;
}

interface TokenSavingsData {
  token: `0x${string}`;
  symbol: string;
  icon: string;
  status: {
    enabled: boolean;
    dailyAmount: bigint;
    goalAmount: bigint;
    currentAmount: bigint;
    remainingAmount: bigint;
    penaltyAmount: bigint;
    estimatedCompletionDate: bigint;
  } | null;
  executionStatus: {
    lastExecutionTime: bigint;
    canExecute: boolean;
    nextExecutionTime: bigint;
    amountToSave?: bigint;
  } | null;
  isLoading: boolean;
}

export function DailySavingsDashboard({ onConfigure, onViewHistory }: DailySavingsDashboardProps) {
  const {
    hasPending,
    useDailySavingsStatus,
    useDailyExecutionStatus,
    executeDailySavings,
    executeDailySavingsForToken,
    disableDailySavings,
    isExecuting,
    isDisabling,
    calculateProgress,
    calculateDaysRemaining
  } = useDailySavings();

  // Mock token data - in real implementation, this would come from token metadata
  const [activeTokens] = useState<Omit<TokenSavingsData, 'status' | 'executionStatus' | 'isLoading'>[]>([
    {
      token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC
      symbol: 'USDC',
      icon: '💰'
    },
    {
      token: '0x4200000000000000000000000000000000000006', // WETH
      symbol: 'ETH',
      icon: '🔷'
    }
  ]);

  // Call hooks for each token at the top level (hooks cannot be called in loops/conditionals)
  const usdcStatus = useDailySavingsStatus(activeTokens[0]?.token);
  const usdcExecutionStatus = useDailyExecutionStatus(activeTokens[0]?.token);
  const wethStatus = useDailySavingsStatus(activeTokens[1]?.token);
  const wethExecutionStatus = useDailyExecutionStatus(activeTokens[1]?.token);

  // Map statuses to tokens
  const tokenStatuses: TokenSavingsData[] = activeTokens.map((tokenData, index) => {
    const status = index === 0 ? usdcStatus : wethStatus;
    const executionStatus = index === 0 ? usdcExecutionStatus : wethExecutionStatus;

    // Transform tuple data to object
    const statusData = status.data ? {
      enabled: status.data[0],
      dailyAmount: status.data[1],
      goalAmount: status.data[2],
      currentAmount: status.data[3],
      remainingAmount: status.data[4],
      penaltyAmount: status.data[5],
      estimatedCompletionDate: status.data[6]
    } : null;

    const executionData = executionStatus.data ? {
      canExecute: executionStatus.data[0],
      lastExecutionTime: executionStatus.data[1],
      nextExecutionTime: BigInt(0),
      amountToSave: executionStatus.data[2]
    } : null;

    return {
      ...tokenData,
      status: statusData,
      executionStatus: executionData,
      isLoading: status.isLoading || executionStatus.isLoading
    };
  });

  const formatCurrency = (value: bigint) => {
    const formatted = formatEther(value);
    return `$${parseFloat(formatted).toFixed(2)}`;
  };

  const formatTokenAmount = (value: bigint, symbol: string) => {
    const formatted = formatEther(value);
    return `${parseFloat(formatted).toFixed(4)} ${symbol}`;
  };

  const getStatusBadge = (enabled: boolean, canExecute: boolean) => {
    if (!enabled) return <Badge>Inactive</Badge>;
    if (canExecute) return <Badge>Ready to Execute</Badge>;
    return <Badge>Active</Badge>;
  };

  const handleExecuteAll = async () => {
    try {
      await executeDailySavings();
    } catch (error) {
      console.error('Failed to execute daily savings:', error);
    }
  };

  const handleExecuteToken = async (token: `0x${string}`) => {
    try {
      await executeDailySavingsForToken({ token });
    } catch (error) {
      console.error('Failed to execute token savings:', error);
    }
  };

  const handleDisableToken = async (token: `0x${string}`) => {
    try {
      await disableDailySavings({ token });
    } catch (error) {
      console.error('Failed to disable daily savings:', error);
    }
  };


  const activeSavings = tokenStatuses.filter(t => t.status?.enabled);
  const totalGoalAmount = activeSavings.reduce((sum, t) => sum + (t.status?.goalAmount || BigInt(0)), BigInt(0));
  const totalCurrentAmount = activeSavings.reduce((sum, t) => sum + (t.status?.currentAmount || BigInt(0)), BigInt(0));
  const overallProgress = totalGoalAmount > 0 ? calculateProgress(totalCurrentAmount, totalGoalAmount) : 0;

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      {activeSavings.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Your Daily Savings Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(totalCurrentAmount)}
                </div>
                <div className="text-sm text-gray-600">
                  of {formatCurrency(totalGoalAmount)} goal
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{overallProgress.toFixed(1)}%</span>
                </div>
                <Progress value={overallProgress} className="h-3" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{activeSavings.length}</div>
                  <div className="text-sm text-gray-600">Active Goals</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {hasPending ? 'Yes' : 'No'}
                  </div>
                  <div className="text-sm text-gray-600">Pending Executions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(totalGoalAmount - totalCurrentAmount)}
                  </div>
                  <div className="text-sm text-gray-600">Remaining</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="secondary"
              onClick={handleExecuteAll}
              disabled={isExecuting || !hasPending}
              className="w-full justify-start"
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Execute All Pending
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={onConfigure}
              className="w-full justify-start"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configure New Goal
            </Button>
            <Button
              variant="secondary"
              onClick={onViewHistory}
              className="w-full justify-start"
            >
              <History className="w-4 h-4 mr-2" />
              View History
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Status Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Goals:</span>
                <Badge>{activeSavings.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Executions:</span>
                <Badge>
                  {hasPending ? 'Yes' : 'None'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Gas Cost:</span>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Free</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Next Execution:</span>
                <span className="text-sm font-medium">Tomorrow 12:00 AM</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Token Goals */}
      {tokenStatuses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Your Savings Goals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tokenStatuses.map((tokenData, index) => {
                const { token, symbol, icon, status, executionStatus, isLoading } = tokenData;

                if (isLoading) {
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-center h-20">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <p className="ml-4 text-gray-600">Loading {symbol} savings...</p>
                      </div>
                    </div>
                  );
                }

                if (!status?.enabled) {
                  return (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{icon}</span>
                          <div>
                            <div className="font-medium text-gray-900">{symbol} Savings</div>
                            <div className="text-sm text-gray-600">Not configured</div>
                          </div>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={onConfigure}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Setup
                        </Button>
                      </div>
                    </div>
                  );
                }

                const progress = calculateProgress(status.currentAmount, status.goalAmount);
                const daysRemaining = calculateDaysRemaining(status.estimatedCompletionDate);
                const canExecute = executionStatus?.canExecute || false;

                return (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{icon}</span>
                          <div>
                            <div className="font-medium text-gray-900">{symbol} Daily Savings</div>
                            <div className="text-sm text-gray-600">
                              {formatTokenAmount(status.dailyAmount, symbol)} daily
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(status.enabled, canExecute)}
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDisableToken(token)}
                            disabled={isDisabling}
                          >
                            {isDisabling ? (
                              <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Pause className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{formatTokenAmount(status.currentAmount, symbol)}</span>
                          <span>{formatTokenAmount(status.goalAmount, symbol)}</span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Goal:</span>
                          <div className="font-medium">{formatTokenAmount(status.goalAmount, symbol)}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Remaining:</span>
                          <div className="font-medium">{formatTokenAmount(status.remainingAmount, symbol)}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Days Left:</span>
                          <div className="font-medium">{daysRemaining}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Penalty:</span>
                          <div className="font-medium">{formatTokenAmount(status.penaltyAmount, symbol)}</div>
                        </div>
                      </div>

                      {/* Execution Status */}
                      {canExecute && (
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-yellow-600" />
                              <span className="text-sm font-medium text-yellow-800">
                                Ready to execute {executionStatus?.amountToSave ? formatTokenAmount(executionStatus.amountToSave, symbol) : '0'}
                              </span>
                            </div>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleExecuteToken(token)}
                              disabled={isExecuting}
                            >
                              {isExecuting ? (
                                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  Execute
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Active Goals */}
      {tokenStatuses.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Daily Savings Goals</h3>
            <p className="text-gray-600 mb-4">
              Set up your first daily savings goal to start building wealth automatically.
            </p>
            <Button onClick={onConfigure}>
              <Target className="w-4 h-4 mr-2" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
