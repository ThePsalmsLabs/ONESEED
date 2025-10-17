'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlippageControl } from '@/hooks/useSlippageControl';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  BellIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  FunnelIcon,
  ClockIcon,
  ShieldCheckIcon
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
    settings,
    effectiveTolerance,
    calculateSlippagePercentage,
    isSlippageWithinTolerance,
    getSlippageWarningLevel
  } = useSlippageControl();

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filters, setFilters] = useState<AlertFilters>({
    type: 'all',
    status: 'all',
    priority: 'all',
    timeRange: '24h'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set());

  // Mock alerts data
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: '1',
        timestamp: Date.now() - 300000, // 5 minutes ago
        type: 'critical',
        title: 'Slippage Exceeded Critical Threshold',
        message: 'Transaction slippage exceeded 2.5% tolerance limit',
        token: 'WETH/USDC',
        slippagePercentage: 3.2,
        expectedAmount: '1.0000',
        actualAmount: '0.9680',
        resolved: false,
        dismissed: false,
        priority: 'critical'
      },
      {
        id: '2',
        timestamp: Date.now() - 900000, // 15 minutes ago
        type: 'warning',
        title: 'High Slippage Detected',
        message: 'Slippage approaching tolerance limit',
        token: 'DAI/USDC',
        slippagePercentage: 1.8,
        expectedAmount: '100.0000',
        actualAmount: '98.2000',
        resolved: false,
        dismissed: false,
        priority: 'high'
      },
      {
        id: '3',
        timestamp: Date.now() - 1800000, // 30 minutes ago
        type: 'success',
        title: 'Slippage Within Tolerance',
        message: 'Transaction executed within acceptable slippage range',
        token: 'USDC/DAI',
        slippagePercentage: 0.3,
        expectedAmount: '500.0000',
        actualAmount: '498.5000',
        resolved: true,
        dismissed: false,
        priority: 'low'
      },
      {
        id: '4',
        timestamp: Date.now() - 3600000, // 1 hour ago
        type: 'info',
        title: 'Slippage Monitoring Started',
        message: 'Real-time slippage monitoring has been activated',
        token: 'All',
        slippagePercentage: 0,
        expectedAmount: '0',
        actualAmount: '0',
        resolved: true,
        dismissed: false,
        priority: 'low'
      }
    ];
    setAlerts(mockAlerts);
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    const now = Date.now();
    const alertTime = alert.timestamp;
    const timeDiff = now - alertTime;

    let timeMatch = true;
    switch (filters.timeRange) {
      case '1h': timeMatch = timeDiff <= 3600000; break;
      case '24h': timeMatch = timeDiff <= 86400000; break;
      case '7d': timeMatch = timeDiff <= 604800000; break;
      case '30d': timeMatch = timeDiff <= 2592000000; break;
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

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    ));
  };

  const handleResolveSelected = () => {
    selectedAlerts.forEach(alertId => {
      handleResolveAlert(alertId);
    });
    setSelectedAlerts(new Set());
  };

  const handleDismissSelected = () => {
    selectedAlerts.forEach(alertId => {
      handleDismissAlert(alertId);
    });
    setSelectedAlerts(new Set());
  };

  const handleSelectAlert = (alertId: string) => {
    setSelectedAlerts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(alertId)) {
        newSet.delete(alertId);
      } else {
        newSet.add(alertId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedAlerts.size === filteredAlerts.length) {
      setSelectedAlerts(new Set());
    } else {
      setSelectedAlerts(new Set(filteredAlerts.map(alert => alert.id)));
    }
  };

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'success': return 'text-green-600 bg-green-100 border-green-200';
      case 'info': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical': return ExclamationTriangleIcon;
      case 'warning': return ExclamationTriangleIcon;
      case 'success': return CheckCircleIcon;
      case 'info': return InformationCircleIcon;
      default: return InformationCircleIcon;
    }
  };

  const getPriorityColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.resolved && !alert.dismissed);
  const criticalAlerts = activeAlerts.filter(alert => alert.type === 'critical');
  const warningAlerts = activeAlerts.filter(alert => alert.type === 'warning');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <BellIcon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{activeAlerts.length}</div>
              <div className="text-sm text-muted-foreground">Active Alerts</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{criticalAlerts.length}</div>
              <div className="text-sm text-muted-foreground">Critical</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{warningAlerts.length}</div>
              <div className="text-sm text-muted-foreground">Warnings</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircleIcon className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {alerts.filter(a => a.resolved).length}
              </div>
              <div className="text-sm text-muted-foreground">Resolved</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Slippage Alerts</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <FunnelIcon className="w-4 h-4" />
              Filters
            </Button>
            {selectedAlerts.size > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleResolveSelected}
                  className="flex items-center gap-2"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  Resolve Selected
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDismissSelected}
                  className="flex items-center gap-2"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Dismiss Selected
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-muted/50 rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="critical">Critical</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="info">Info</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Priorities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Time Range</label>
                  <select
                    value={filters.timeRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="1h">Last Hour</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="all">All Time</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Select All */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedAlerts.size === filteredAlerts.length && filteredAlerts.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 text-primary rounded focus:ring-primary"
            />
            <span className="text-sm font-medium">
              {selectedAlerts.size > 0 ? `${selectedAlerts.size} selected` : 'Select All'}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredAlerts.length} alerts
          </div>
        </div>
      </Card>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <Card className="p-8 text-center">
            <BellIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Alerts Found</h3>
            <p className="text-muted-foreground">
              No alerts match your current filters
            </p>
          </Card>
        ) : (
          filteredAlerts.map((alert) => {
            const AlertIcon = getAlertIcon(alert.type);
            const isSelected = selectedAlerts.has(alert.id);
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border transition-all ${
                  isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                } ${getAlertColor(alert.type)} ${
                  alert.resolved || alert.dismissed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectAlert(alert.id)}
                    className="w-4 h-4 text-primary rounded focus:ring-primary mt-1"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertIcon className="w-5 h-5" />
                      <h4 className="font-semibold">{alert.title}</h4>
                      <div className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(alert.priority)}`}>
                        {alert.priority}
                      </div>
                      {alert.resolved && (
                        <div className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          Resolved
                        </div>
                      )}
                      {alert.dismissed && (
                        <div className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                          Dismissed
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{alert.message}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Token</div>
                        <div className="font-medium">{alert.token}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Slippage</div>
                        <div className="font-medium">{alert.slippagePercentage.toFixed(2)}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Expected</div>
                        <div className="font-medium">{alert.expectedAmount}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Actual</div>
                        <div className="font-medium">{alert.actualAmount}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                      
                      {!alert.resolved && !alert.dismissed && (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleResolveAlert(alert.id)}
                            className="flex items-center gap-1"
                          >
                            <CheckCircleIcon className="w-3 h-3" />
                            Resolve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDismissAlert(alert.id)}
                            className="flex items-center gap-1"
                          >
                            <XMarkIcon className="w-3 h-3" />
                            Dismiss
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
