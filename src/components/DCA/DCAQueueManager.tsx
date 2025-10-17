'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDCA } from '@/hooks/useDCA';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  QueueListIcon,
  PlayIcon,
  PauseIcon,
  TrashIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { formatEther, parseEther } from 'viem';

interface DCAQueueManagerProps {
  className?: string;
}

interface QueueItem {
  id: string;
  fromToken: `0x${string}`;
  toToken: `0x${string}`;
  amount: string;
  timestamp: number;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  priority: number;
}

export function DCAQueueManager({ className = '' }: DCAQueueManagerProps) {
  const {
    config,
    pending,
    executeDCA,
    queueDCAExecution,
    isExecuting,
    isQueueing,
    executeError,
    queueError
  } = useDCA();

  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isAutoExecuting, setIsAutoExecuting] = useState(false);
  const [executionHistory, setExecutionHistory] = useState<Array<{
    timestamp: number;
    success: boolean;
    amount: string;
    txHash?: string;
  }>>([]);

  // Mock queue items for demonstration
  useEffect(() => {
    const mockItems: QueueItem[] = [
      {
        id: '1',
        fromToken: '0x4200000000000000000000000000000000000006' as `0x${string}`,
        toToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`,
        amount: '0.1',
        timestamp: Date.now() - 3600000, // 1 hour ago
        status: 'pending',
        priority: 1
      },
      {
        id: '2',
        fromToken: '0x4200000000000000000000000000000000000006' as `0x${string}`,
        toToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`,
        amount: '0.05',
        timestamp: Date.now() - 1800000, // 30 minutes ago
        status: 'pending',
        priority: 2
      },
      {
        id: '3',
        fromToken: '0x4200000000000000000000000000000000000006' as `0x${string}`,
        toToken: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb' as `0x${string}`,
        amount: '0.2',
        timestamp: Date.now() - 900000, // 15 minutes ago
        status: 'executing',
        priority: 3
      }
    ];
    setQueueItems(mockItems);
  }, []);

  const handleExecuteAll = async () => {
    try {
      await executeDCA();
      setExecutionHistory(prev => [...prev, {
        timestamp: Date.now(),
        success: true,
        amount: queueItems.reduce((sum, item) => sum + parseFloat(item.amount), 0).toString()
      }]);
    } catch (error) {
      setExecutionHistory(prev => [...prev, {
        timestamp: Date.now(),
        success: false,
        amount: '0'
      }]);
    }
  };

  const handleExecuteSelected = async () => {
    const selectedItemsList = queueItems.filter(item => selectedItems.has(item.id));
    // Execute selected items logic here
    console.log('Executing selected items:', selectedItemsList);
  };

  const handleQueueNew = async (fromToken: `0x${string}`, toToken: `0x${string}`, amount: string) => {
    try {
      await queueDCAExecution({
        fromToken,
        toToken,
        amount
      });
    } catch (error) {
      console.error('Failed to queue DCA:', error);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setQueueItems(prev => prev.filter(item => item.id !== itemId));
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const allPendingIds = queueItems
      .filter(item => item.status === 'pending')
      .map(item => item.id);
    
    if (selectedItems.size === allPendingIds.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(allPendingIds));
    }
  };

  const getStatusColor = (status: QueueItem['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'executing': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: QueueItem['status']) => {
    switch (status) {
      case 'pending': return ClockIcon;
      case 'executing': return PlayIcon;
      case 'completed': return CheckCircleIcon;
      case 'failed': return ExclamationTriangleIcon;
      default: return ClockIcon;
    }
  };

  const pendingItems = queueItems.filter(item => item.status === 'pending');
  const executingItems = queueItems.filter(item => item.status === 'executing');
  const completedItems = queueItems.filter(item => item.status === 'completed');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Queue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <QueueListIcon className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{pendingItems.length}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <PlayIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{executingItems.length}</div>
              <div className="text-sm text-muted-foreground">Executing</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircleIcon className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{completedItems.length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <CurrencyDollarIcon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {queueItems.reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Total ETH</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Queue Actions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Queue Management</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleSelectAll}
              className="text-sm"
            >
              {selectedItems.size === pendingItems.length ? 'Deselect All' : 'Select All'}
            </Button>
            <Button
              onClick={handleExecuteAll}
              disabled={isExecuting || pendingItems.length === 0}
              className="flex items-center gap-2"
            >
              {isExecuting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <PlayIcon className="w-4 h-4" />
              )}
              Execute All
            </Button>
          </div>
        </div>

        {selectedItems.size > 0 && (
          <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedItems.size} item(s) selected
              </span>
              <Button
                size="sm"
                onClick={handleExecuteSelected}
                disabled={isExecuting}
              >
                Execute Selected
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Queue Items */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Queue Items</h3>
        <div className="space-y-3">
          {queueItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <QueueListIcon className="w-8 h-8 mx-auto mb-2" />
              <p>No items in queue</p>
            </div>
          ) : (
            queueItems.map((item) => {
              const StatusIcon = getStatusIcon(item.status);
              const isSelected = selectedItems.has(item.id);
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border transition-all ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectItem(item.id)}
                        disabled={item.status !== 'pending'}
                        className="w-4 h-4 text-primary rounded focus:ring-primary"
                      />
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(item.status)}`}>
                          <StatusIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {formatEther(parseEther(item.amount))} ETH
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(item.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                        {item.status}
                      </div>
                      {item.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </Card>

      {/* Execution History */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Execution History</h3>
        <div className="space-y-3">
          {executionHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ClockIcon className="w-8 h-8 mx-auto mb-2" />
              <p>No executions yet</p>
            </div>
          ) : (
            executionHistory.slice(-10).reverse().map((execution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    execution.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {execution.success ? (
                      <CheckCircleIcon className="w-4 h-4" />
                    ) : (
                      <ExclamationTriangleIcon className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">
                      {formatEther(parseEther(execution.amount))} ETH
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(execution.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  execution.success 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {execution.success ? 'Success' : 'Failed'}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>

      {/* Error Display */}
      <AnimatePresence>
        {(executeError || queueError) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center gap-2 text-red-800">
              <ExclamationTriangleIcon className="w-4 h-4" />
              <span className="font-medium">Execution Error</span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              {executeError?.message || queueError?.message || 'Failed to execute DCA'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
