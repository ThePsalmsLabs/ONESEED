'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { ErrorState, LoadingState, NoHistoryEmptyState } from '@/components/ui';
import { useAdvancedDCA } from '@/hooks/useAdvancedDCA';
import { useAccount } from 'wagmi';
import {
  Layers,
  Users,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  Activity,
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
  const { address } = useAccount();
  const [batchOperations, setBatchOperations] = useState<BatchOperation[]>([]);
  const [selectedPreset, setSelectedPreset] = useState('Medium Batch');
  const [batchSize, setBatchSize] = useState(50);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResults, setExecutionResults] = useState<BatchExecutionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    batchExecuteDCA,
    isBatchExecuting,
    formatAmount
  } = useAdvancedDCA();

  // Process real batch DCA data
  useEffect(() => {
    const processBatchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real implementation, this would fetch batch operations from:
        // 1. Contract events (BatchDCAExecuted events)
        // 2. Historical batch execution data
        // 3. The Graph protocol for batch analytics
        
        // For now, we'll show empty state since we don't have real batch data
        setBatchOperations([]);
        setExecutionResults([]);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load batch operations');
      } finally {
        setIsLoading(false);
      }
    };

    processBatchData();
  }, []);

  const refetch = () => {
    setIsLoading(true);
    setError(null);
    // Trigger data refetch
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleBatchExecution = async () => {
    if (!address) return;

    setIsExecuting(true);
    try {
      // In a real implementation, this would call the batch DCA contract
      // await batchExecuteDCA(batchSize, selectedPreset);
      
      // For now, we'll simulate the execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add a mock operation result
      const newOperation: BatchOperation = {
        id: `batch-${Date.now()}`,
        type: 'execute',
        users: [address],
        tokens: ['WETH', 'USDC'],
        totalAmount: BigInt(1000000000000000000), // 1 ETH
        status: 'completed',
        progress: 100,
        startTime: Date.now() - 120000, // 2 minutes ago
        endTime: Date.now(),
        results: {
          successful: 1,
          failed: 0,
          totalGasSaved: BigInt(50000000000000000) // 0.05 ETH
        }
      };

      setBatchOperations(prev => [newOperation, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Batch execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  const getStatusColor = (status: BatchOperation['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'executing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
    }
  };

  const getStatusIcon = (status: BatchOperation['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'executing': return <Activity className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Batch DCA Operations</h2>
            <p className="text-muted-foreground">Execute DCA strategies for multiple users</p>
          </div>
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
        </div>
        <LoadingState message="Loading batch operations..." />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Batch DCA Operations</h2>
            <p className="text-muted-foreground">Execute DCA strategies for multiple users</p>
          </div>
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
        </div>
        <ErrorState
          title="Failed to load batch operations"
          message="Unable to fetch batch DCA data. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  // Show empty state if no operations
  if (batchOperations.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Batch DCA Operations</h2>
            <p className="text-muted-foreground">Execute DCA strategies for multiple users</p>
          </div>
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
        </div>
        <NoHistoryEmptyState onAction={() => window.location.href = '/dca'} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Batch DCA Operations</h2>
          <p className="text-muted-foreground">Execute DCA strategies for multiple users</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refetch}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
        </div>
      </div>

      {/* Batch Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Batch Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Batch Preset</label>
              <select
                value={selectedPreset}
                onChange={(e) => setSelectedPreset(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {BATCH_PRESETS.map((preset) => (
                  <option key={preset.name} value={preset.name}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Batch Size</label>
              <input
                type="number"
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                min="1"
                max="100"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleBatchExecution}
              disabled={isExecuting || isBatchExecuting}
              className="flex-1"
            >
              {isExecuting || isBatchExecuting ? (
                <>
                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                  Executing Batch...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Execute Batch DCA
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Batch Operations History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Batch Operations History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {batchOperations.length > 0 ? (
            <div className="space-y-4">
              {batchOperations.map((operation) => (
                <div key={operation.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={operation.status === 'completed' ? 'success' : operation.status === 'failed' ? 'error' : operation.status === 'executing' ? 'info' : 'warning'}>
                        {getStatusIcon(operation.status)}
                        <span className="ml-1">{operation.status}</span>
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(operation.startTime).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ID: {operation.id}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {operation.users.length} users
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {operation.tokens.join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {formatAmount(operation.totalAmount)} total
                      </span>
                    </div>
                  </div>

                  {operation.status === 'executing' && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {operation.progress}%
                        </span>
                      </div>
                      <Progress value={operation.progress} className="h-2" />
                    </div>
                  )}

                  {operation.results && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {operation.results.successful}
                        </div>
                        <div className="text-sm text-muted-foreground">Successful</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {operation.results.failed}
                        </div>
                        <div className="text-sm text-muted-foreground">Failed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatAmount(operation.results.totalGasSaved)}
                        </div>
                        <div className="text-sm text-muted-foreground">Gas Saved</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No batch operations found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Execution Results */}
      {executionResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Latest Execution Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {executionResults.slice(0, 10).map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      result.success ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {result.success ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">
                        {result.fromToken} → {result.toToken}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(result.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {formatAmount(result.amount)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Gas Saved: {formatAmount(result.gasSaved)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}