'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { useDailySavings } from '@/hooks/useDailySavings';
import { formatEther } from 'viem';
import { 
  Play, 
  Pause, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  Calendar,
  DollarSign,
  Target,
  TrendingUp,
  Shield
} from 'lucide-react';

interface DailySavingsExecutionProps {
  onBack?: () => void;
}

interface ExecutionItem {
  token: `0x${string}`;
  symbol: string;
  icon: string;
  amount: bigint;
  canExecute: boolean;
  daysPassed: number;
  reason?: string;
}

export function DailySavingsExecution({ onBack }: DailySavingsExecutionProps) {
  const { 
    hasPending,
    useDailyExecutionStatus,
    executeDailySavings,
    executeDailySavingsForToken,
    isExecuting,
    contractAddress,
    formatAmount
  } = useDailySavings();

  const [selectedTokens, setSelectedTokens] = useState<Set<`0x${string}`>>(new Set());

  // Mock execution data - in real implementation, this would come from contract
  const [executionItems] = useState<ExecutionItem[]>([
    {
      token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC
      symbol: 'USDC',
      icon: '💰',
      amount: BigInt('1000000000000000000'), // 1 USDC
      canExecute: true,
      daysPassed: 1
    },
    {
      token: '0x4200000000000000000000000000000000000006', // WETH
      symbol: 'ETH',
      icon: '🔷',
      amount: BigInt('500000000000000000'), // 0.5 ETH
      canExecute: true,
      daysPassed: 2
    },
    {
      token: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // USDbC
      symbol: 'USDbC',
      icon: '🏦',
      amount: BigInt('0'), // 0 USDbC
      canExecute: false,
      daysPassed: 0,
      reason: 'Not enough time passed since last execution'
    }
  ]);

  const formatTokenAmount = (value: bigint, symbol: string) => {
    const formatted = formatEther(value);
    return `${parseFloat(formatted).toFixed(4)} ${symbol}`;
  };

  const formatCurrency = (value: bigint) => {
    const formatted = formatEther(value);
    return `$${parseFloat(formatted).toFixed(2)}`;
  };

  const handleSelectToken = (token: `0x${string}`) => {
    const newSelected = new Set(selectedTokens);
    if (newSelected.has(token)) {
      newSelected.delete(token);
    } else {
      newSelected.add(token);
    }
    setSelectedTokens(newSelected);
  };

  const handleSelectAll = () => {
    const executableTokens = executionItems
      .filter(item => item.canExecute)
      .map(item => item.token);
    setSelectedTokens(new Set(executableTokens));
  };

  const handleDeselectAll = () => {
    setSelectedTokens(new Set());
  };

  const handleExecuteSelected = async () => {
    try {
      if (selectedTokens.size === 0) return;

      // Execute each selected token
      for (const token of selectedTokens) {
        await executeDailySavingsForToken({ token });
      }
      
      // Clear selection
      setSelectedTokens(new Set());
    } catch (error) {
      console.error('Failed to execute selected savings:', error);
    }
  };

  const handleExecuteAll = async () => {
    try {
      await executeDailySavings();
    } catch (error) {
      console.error('Failed to execute all savings:', error);
    }
  };

  const executableItems = executionItems.filter(item => item.canExecute);
  const totalExecutableAmount = executableItems.reduce((sum, item) => sum + item.amount, BigInt(0));
  const selectedAmount = executionItems
    .filter(item => selectedTokens.has(item.token))
    .reduce((sum, item) => sum + item.amount, BigInt(0));


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Daily Savings Execution</h2>
          <p className="text-gray-600">Execute your pending daily savings goals</p>
        </div>
        {onBack && (
          <Button variant="secondary" onClick={onBack}>
            Back to Dashboard
          </Button>
        )}
      </div>

      {/* Execution Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Execution Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {executableItems.length}
              </div>
              <div className="text-sm text-gray-600">Ready to Execute</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(totalExecutableAmount)}
              </div>
              <div className="text-sm text-gray-600">Total Amount</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {selectedTokens.size}
              </div>
              <div className="text-sm text-gray-600">Selected</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {formatCurrency(selectedAmount)}
              </div>
              <div className="text-sm text-gray-600">Selected Amount</div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Gas-free execution</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">Next execution: Tomorrow 12:00 AM</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selection Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Select Savings to Execute</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSelectAll}
                disabled={executableItems.length === 0}
              >
                Select All ({executableItems.length})
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDeselectAll}
                disabled={selectedTokens.size === 0}
              >
                Deselect All
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              {selectedTokens.size} of {executableItems.length} selected
            </div>
          </div>

          <div className="space-y-3">
            {executionItems.map((item, index) => {
              const isSelected = selectedTokens.has(item.token);
              const isExecutable = item.canExecute;

              return (
                <div
                  key={index}
                  className={`border rounded-lg p-4 transition-all duration-200 ${
                    isSelected
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  } ${!isExecutable ? 'opacity-50' : 'cursor-pointer'}`}
                  onClick={() => isExecutable && handleSelectToken(item.token)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => isExecutable && handleSelectToken(item.token)}
                          disabled={!isExecutable}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-2xl">{item.icon}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{item.symbol} Savings</div>
                        <div className="text-sm text-gray-600">
                          {formatTokenAmount(item.amount, item.symbol)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          {formatTokenAmount(item.amount, item.symbol)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {item.daysPassed} day{item.daysPassed !== 1 ? 's' : ''} passed
                        </div>
                      </div>
                      {isExecutable ? (
                        <Badge>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Ready
                        </Badge>
                      ) : (
                        <Badge>
                          <Clock className="w-3 h-3 mr-1" />
                          Waiting
                        </Badge>
                      )}
                    </div>
                  </div>

                  {!isExecutable && item.reason && (
                    <div className="mt-3 p-2 bg-yellow-50 rounded text-sm text-yellow-800">
                      <AlertTriangle className="w-4 h-4 inline mr-1" />
                      {item.reason}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Execution Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Play className="w-5 h-5" />
            <span>Execute Savings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={handleExecuteSelected}
                disabled={selectedTokens.size === 0 || isExecuting}
                className="w-full"
              >
                {isExecuting ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Execute Selected ({selectedTokens.size})
                  </>
                )}
              </Button>

              <Button
                variant="secondary"
                onClick={handleExecuteAll}
                disabled={executableItems.length === 0 || isExecuting}
                className="w-full"
              >
                {isExecuting ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                    Executing All...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Execute All ({executableItems.length})
                  </>
                )}
              </Button>
            </div>

            {selectedTokens.size > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-blue-900">
                      Selected: {formatCurrency(selectedAmount)}
                    </div>
                    <div className="text-sm text-blue-700">
                      {selectedTokens.size} savings goal{selectedTokens.size !== 1 ? 's' : ''} ready to execute
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Gas-free</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Execution History Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Recent Executions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { token: 'USDC', amount: '1.00', date: 'Today', time: '12:00 AM' },
              { token: 'ETH', amount: '0.50', date: 'Yesterday', time: '12:00 AM' },
              { token: 'USDbC', amount: '2.00', date: '2 days ago', time: '12:00 AM' }
            ].map((execution, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {execution.amount} {execution.token}
                    </div>
                    <div className="text-sm text-gray-600">
                      {execution.date} at {execution.time}
                    </div>
                  </div>
                </div>
                <Badge>Success</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}