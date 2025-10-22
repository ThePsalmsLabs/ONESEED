'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { useAdvancedDCA } from '@/hooks/useAdvancedDCA';
import { formatEther } from 'viem';
import { 
  Layers, 
  Users, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Activity,
  Play,
  Pause,
  RefreshCw,
  BarChart3,
  Info,
  Target,
  TrendingUp
} from 'lucide-react';

interface BatchDCAOperationsProps {
  onBack?: () => void;
}

interface BatchOperation {
  id: string;
  type: 'execute' | 'queue' | 'process';
  users: string[];
  tokens: string[];
  totalAmount: bigint;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  progress: number;
  startTime: number;
  endTime?: number;
  results?: {
    successful: number;
    failed: number;
    totalGasSaved: bigint;
  };
}

interface BatchExecutionResult {
  user: string;
  fromToken: string;
  toToken: string;
  amount: bigint;
  executedPrice: bigint;
  timestamp: number;
  success: boolean;
  gasSaved: bigint;
}

const BATCH_PRESETS = [
  {
    name: 'Small Batch',
    maxUsers: 10,
    description: 'Execute DCA for up to 10 users',
    gasEstimate: 'Low',
    timeEstimate: '1-2 minutes'
  },
  {
    name: 'Medium Batch',
    maxUsers: 50,
    description: 'Execute DCA for up to 50 users',
    gasEstimate: 'Medium',
    timeEstimate: '3-5 minutes'
  },
  {
    name: 'Large Batch',
    maxUsers: 100,
    description: 'Execute DCA for up to 100 users',
    gasEstimate: 'High',
    timeEstimate: '5-10 minutes'
  },
  {
    name: 'Custom Batch',
    maxUsers: 0,
    description: 'Configure your own batch size',
    gasEstimate: 'Variable',
    timeEstimate: 'Variable'
  }
];

export function BatchDCAOperations({ onBack }: BatchDCAOperationsProps) {
  const [batchOperations, setBatchOperations] = useState<BatchOperation[]>([]);
  const [selectedPreset, setSelectedPreset] = useState('Medium Batch');
  const [batchSize, setBatchSize] = useState(50);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResults, setExecutionResults] = useState<BatchExecutionResult[]>([]);

  const {
    batchExecuteDCA,
    isBatchExecuting,
    contractAddress,
    formatAmount
  } = useAdvancedDCA();

  // Mock data for demonstration
  useEffect(() => {
    const mockOperations: BatchOperation[] = [
      {
        id: '1',
        type: 'execute',
        users: ['0x123...', '0x456...', '0x789...'],
        tokens: ['USDC', 'ETH'],
        totalAmount: BigInt('1000000000000000000000'), // 1000 tokens
        status: 'completed',
        progress: 100,
        startTime: Date.now() - 300000, // 5 minutes ago
        endTime: Date.now() - 240000, // 4 minutes ago
        results: {
          successful: 3,
          failed: 0,
          totalGasSaved: BigInt('500000000000000000') // 0.5 ETH
        }
      },
      {
        id: '2',
        type: 'execute',
        users: ['0xabc...', '0xdef...', '0xghi...', '0xjkl...'],
        tokens: ['USDC', 'ETH', 'USDbC'],
        totalAmount: BigInt('2500000000000000000000'), // 2500 tokens
        status: 'executing',
        progress: 65,
        startTime: Date.now() - 120000, // 2 minutes ago
        results: {
          successful: 3,
          failed: 0,
          totalGasSaved: BigInt('300000000000000000') // 0.3 ETH
        }
      }
    ];

    setBatchOperations(mockOperations);

    const mockResults: BatchExecutionResult[] = [
      {
        user: '0x123...',
        fromToken: 'USDC',
        toToken: 'ETH',
        amount: BigInt('100000000000000000000'), // 100 tokens
        executedPrice: BigInt('250000000000000000000'), // 250 ETH
        timestamp: Date.now() - 300000,
        success: true,
        gasSaved: BigInt('150000000000000000') // 0.15 ETH
      },
      {
        user: '0x456...',
        fromToken: 'USDC',
        toToken: 'ETH',
        amount: BigInt('200000000000000000000'), // 200 tokens
        executedPrice: BigInt('500000000000000000000'), // 500 ETH
        timestamp: Date.now() - 280000,
        success: true,
        gasSaved: BigInt('180000000000000000') // 0.18 ETH
      },
      {
        user: '0x789...',
        fromToken: 'USDC',
        toToken: 'ETH',
        amount: BigInt('150000000000000000000'), // 150 tokens
        executedPrice: BigInt('375000000000000000000'), // 375 ETH
        timestamp: Date.now() - 260000,
        success: false,
        gasSaved: BigInt('0')
      }
    ];

    setExecutionResults(mockResults);
  }, []);

  const handleBatchExecute = async () => {
    setIsExecuting(true);
    try {
      // Mock batch execution
      const mockUsers = Array.from({ length: batchSize }, (_, i) => `0x${i.toString().padStart(40, '0')}` as `0x${string}`);
      
      const result = await batchExecuteDCA({
        users: mockUsers
      });

      // Add new batch operation
      const newOperation: BatchOperation = {
        id: Date.now().toString(),
        type: 'execute',
        users: mockUsers,
        tokens: ['USDC', 'ETH'],
        totalAmount: BigInt('1000000000000000000000'), // Mock amount
        status: 'executing',
        progress: 0,
        startTime: Date.now()
      };

      setBatchOperations(prev => [newOperation, ...prev]);

      // Simulate progress updates
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setBatchOperations(prev => prev.map(op => 
          op.id === newOperation.id 
            ? { ...op, progress: i, status: i === 100 ? 'completed' : 'executing' }
            : op
        ));
      }

    } catch (error) {
      console.error('Failed to execute batch DCA:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const handlePresetSelect = (preset: typeof BATCH_PRESETS[0]) => {
    setSelectedPreset(preset.name);
    if (preset.name !== 'Custom Batch') {
      setBatchSize(preset.maxUsers);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'executing': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      case 'executing': return <Badge variant="info">Executing</Badge>;
      case 'completed': return <Badge variant="success">Completed</Badge>;
      case 'failed': return <Badge variant="error">Failed</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'executing': return <Activity className="w-4 h-4 text-blue-600" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTime = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const totalGasSaved = batchOperations.reduce((sum, op) => 
    sum + (op.results?.totalGasSaved || BigInt(0)), BigInt(0)
  );

  const totalExecutions = batchOperations.reduce((sum, op) => 
    sum + (op.results?.successful || 0), 0
  );

  const totalFailed = batchOperations.reduce((sum, op) => 
    sum + (op.results?.failed || 0), 0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Batch DCA Operations</h2>
          <p className="text-gray-600">Execute DCA for multiple users in gas-efficient batches</p>
        </div>
        {onBack && (
          <Button variant="secondary" onClick={onBack}>
            Back to Dashboard
          </Button>
        )}
      </div>

      {/* Batch Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Batch Operations Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {batchOperations.length}
              </div>
              <div className="text-sm text-gray-600">Total Batches</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {totalExecutions}
              </div>
              <div className="text-sm text-gray-600">Successful Executions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {totalFailed}
              </div>
              <div className="text-sm text-gray-600">Failed Executions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {formatAmount(totalGasSaved)}
              </div>
              <div className="text-sm text-gray-600">Total Gas Saved</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batch Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Batch Size Presets</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {BATCH_PRESETS.map((preset) => (
              <Card
                key={preset.name}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedPreset === preset.name
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handlePresetSelect(preset)}
              >
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 mb-2">{preset.name}</div>
                    <div className="text-sm text-gray-600 mb-3">{preset.description}</div>
                    
                    {preset.name !== 'Custom Batch' && (
                      <div className="space-y-1 text-xs">
                        <div>Max Users: {preset.maxUsers}</div>
                        <div>Gas: {preset.gasEstimate}</div>
                        <div>Time: {preset.timeEstimate}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedPreset === 'Custom Batch' && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Batch Size
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={batchSize}
                onChange={(e) => setBatchSize(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <div className="text-sm text-gray-600 mt-1">
                Maximum 1000 users per batch
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Execute Batch */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Execute Batch DCA</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-gray-900">
                Batch Size: {batchSize} Users
              </div>
              <div className="text-sm text-gray-600">
                {selectedPreset} configuration
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  {batchSize}
                </div>
                <div className="text-sm text-gray-600">Users</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  Gas-free
                </div>
                <div className="text-sm text-gray-600">Execution</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">
                  ~{Math.ceil(batchSize / 10)}min
                </div>
                <div className="text-sm text-gray-600">Est. Time</div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleBatchExecute}
                disabled={isExecuting || isBatchExecuting}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                {isExecuting || isBatchExecuting ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Executing Batch...
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4 mr-2" />
                    Execute Batch DCA
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batch Operations History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Batch Operations History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {batchOperations.map((operation) => (
              <div key={operation.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(operation.status)}
                      <div>
                        <div className="font-medium text-gray-900">
                          Batch #{operation.id} - {operation.type.toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {operation.users.length} users • {operation.tokens.join(', ')} • {formatTime(operation.startTime)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(operation.status)}
                    </div>
                  </div>

                  {/* Progress */}
                  {operation.status === 'executing' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{operation.progress}%</span>
                      </div>
                      <Progress value={operation.progress} className="h-2" />
                    </div>
                  )}

                  {/* Results */}
                  {operation.results && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Successful:</span>
                        <div className="font-medium text-green-600">{operation.results.successful}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Failed:</span>
                        <div className="font-medium text-red-600">{operation.results.failed}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Gas Saved:</span>
                        <div className="font-medium text-purple-600">{formatAmount(operation.results.totalGasSaved)}</div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button variant="secondary" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retry
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Info className="w-4 h-4 mr-2" />
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Execution Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Recent Execution Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {executionResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${result.success ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <div className="font-medium text-gray-900">
                        {result.fromToken} → {result.toToken}
                      </div>
                      <div className="text-sm text-gray-600">
                        {result.user} • {formatAmount(result.amount)} • {formatTime(result.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {formatAmount(result.executedPrice)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Gas Saved: {formatAmount(result.gasSaved)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-5 h-5" />
            <span>How Batch DCA Works</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <Layers className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <span className="font-medium">Batch Execution:</span> Execute DCA for multiple users in a single transaction to save gas
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Users className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <span className="font-medium">Scalable:</span> Process up to 1000 users per batch with automatic optimization
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Zap className="w-4 h-4 text-purple-600 mt-0.5" />
              <div>
                <span className="font-medium">Gas Efficient:</span> Significant gas savings compared to individual executions
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5" />
              <div>
                <span className="font-medium">Reliable:</span> Automatic retry mechanisms and error handling for failed executions
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
