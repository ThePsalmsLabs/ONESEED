'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlippageControl } from '@/hooks/useSlippageControl';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ErrorState, LoadingState, NoHistoryEmptyState } from '@/components/ui';
import { 
  BellIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

interface SlippageAlertsProps {
  className?: string;
}

interface Alert {
  id: string;
  timestamp: number;
  type: 'warning' | 'critical' | 'info' | 'success';
  title: string;
  message: string;
  token: string;
  slippagePercentage: number;
  expectedAmount: string;
  actualAmount: string;
  resolved: boolean;
  dismissed: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface AlertFilters {
  type: 'all' | 'warning' | 'critical' | 'info' | 'success';
  status: 'all' | 'active' | 'resolved' | 'dismissed';
  priority: 'all' | 'low' | 'medium' | 'high' | 'critical';
  timeRange: '1h' | '24h' | '7d' | '30d' | 'all';
}

export function SlippageAlerts({ className = '' }: SlippageAlertsProps) {
  const {
    userSlippageTolerance,
    calculateSlippagePercent,
    isSlippageWithinTolerance,
    formatSlippage
  } = useSlippageControl();

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filters, setFilters] = useState<AlertFilters>({
    type: 'all',
    status: 'all',
    priority: 'all',
    timeRange: '24h'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Process real slippage alerts
  useEffect(() => {
    const processSlippageAlerts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real implementation, this would fetch alerts from:
        // 1. Contract events (SlippageExceeded events)
        // 2. Real-time monitoring of transactions
        // 3. The Graph protocol for historical alerts
        
        // For now, we'll show empty state since we don't have real alert data
        setAlerts([]);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load slippage alerts');
      } finally {
        setIsLoading(false);
      }
    };

    processSlippageAlerts();
  }, [filters.timeRange]);

  const refetch = () => {
    setIsLoading(true);
    setError(null);
    // Trigger data refetch
    setTimeout(() => setIsLoading(false), 1000);
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    ));
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  const filteredAlerts = alerts.filter(alert => {
    const now = Date.now();
    const alertTime = alert.timestamp;
    const timeDiff = now - alertTime;

    let timeMatch = true;
    switch (filters.timeRange) {
      case '1h': timeMatch = timeDiff <= 60 * 60 * 1000; break;
      case '24h': timeMatch = timeDiff <= 24 * 60 * 60 * 1000; break;
      case '7d': timeMatch = timeDiff <= 7 * 24 * 60 * 60 * 1000; break;
      case '30d': timeMatch = timeDiff <= 30 * 24 * 60 * 60 * 1000; break;
      case 'all': timeMatch = true; break;
    }

    const typeMatch = filters.type === 'all' || alert.type === filters.type;
    const statusMatch = filters.status === 'all' || 
      (filters.status === 'active' && !alert.resolved && !alert.dismissed) ||
      (filters.status === 'resolved' && alert.resolved) ||
      (filters.status === 'dismissed' && alert.dismissed);
    const priorityMatch = filters.priority === 'all' || alert.priority === filters.priority;

    return timeMatch && typeMatch && statusMatch && priorityMatch;
  });

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'warning': return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />;
      case 'critical': return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
      case 'info': return <InformationCircleIcon className="w-5 h-5 text-blue-600" />;
      case 'success': return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
    }
  };

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'critical': return 'border-red-200 bg-red-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      case 'success': return 'border-green-200 bg-green-50';
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Slippage Alerts</h2>
            <p className="text-muted-foreground">Monitor slippage protection alerts</p>
          </div>
        </div>
        <LoadingState message="Loading slippage alerts..." />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Slippage Alerts</h2>
            <p className="text-muted-foreground">Monitor slippage protection alerts</p>
          </div>
        </div>
        <ErrorState
          title="Failed to load alerts"
          message="Unable to fetch slippage alerts. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  // Show empty state if no alerts
  if (alerts.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Slippage Alerts</h2>
            <p className="text-muted-foreground">Monitor slippage protection alerts</p>
          </div>
        </div>
        <NoHistoryEmptyState onAction={() => window.location.href = '/swap'} />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Slippage Alerts</h2>
          <p className="text-muted-foreground">Monitor slippage protection alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refetch}>
            <FunnelIcon className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          {alerts.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearAllAlerts}>
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as AlertFilters['type'] }))}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">All Types</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as AlertFilters['status'] }))}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value as AlertFilters['priority'] }))}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Time Range</label>
            <select
              value={filters.timeRange}
              onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value as AlertFilters['timeRange'] }))}
              className="w-full p-2 border rounded-md"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Alerts</p>
              <p className="text-2xl font-bold">{alerts.length}</p>
            </div>
            <BellIcon className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">
                {alerts.filter(a => !a.resolved && !a.dismissed).length}
              </p>
            </div>
            <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Critical</p>
              <p className="text-2xl font-bold">
                {alerts.filter(a => a.type === 'critical' && !a.resolved && !a.dismissed).length}
              </p>
            </div>
            <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Resolved</p>
              <p className="text-2xl font-bold">
                {alerts.filter(a => a.resolved).length}
              </p>
            </div>
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`border rounded-lg p-4 ${getAlertColor(alert.type)} ${
                alert.dismissed ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{alert.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        alert.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        alert.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {alert.priority}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        Token: {alert.token}
                      </span>
                      <span className="text-muted-foreground">
                        Slippage: {alert.slippagePercentage.toFixed(2)}%
                      </span>
                      <span className="text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-muted-foreground">
                        Expected: {alert.expectedAmount}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Actual: {alert.actualAmount}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!alert.resolved && !alert.dismissed && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resolveAlert(alert.id)}
                    >
                      Resolve
                    </Button>
                  )}
                  {!alert.dismissed && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredAlerts.length === 0 && alerts.length > 0 && (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            No alerts match the current filters
          </div>
        </Card>
      )}
    </div>
  );
}