'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSlippageControl } from '@/hooks/useSlippageControl';
import { useSlippageAnalytics } from '@/hooks/useSlippageAnalytics';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface SlippageMonitorProps {
  className?: string;
}

export function SlippageMonitor({ className = '' }: SlippageMonitorProps) {
  const {
    userSlippageTolerance,
    setSlippageTolerance,
    isSettingTolerance
  } = useSlippageControl();

  const {
    events,
    statistics,
    alerts,
    isLoading: isLoadingAnalytics,
    refetch
  } = useSlippageAnalytics();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newTolerance, setNewTolerance] = useState('');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleUpdateTolerance = async () => {
    if (!newTolerance) return;
    try {
      const bps = Math.floor(parseFloat(newTolerance) * 100); // Convert percentage to basis points
      await setSlippageTolerance({ tolerance: bps });
      setNewTolerance('');
    } catch (error) {
      console.error('Failed to update tolerance:', error);
    }
  };

  const isLoading = isLoadingAnalytics;
  const currentTolerance = userSlippageTolerance ? Number(userSlippageTolerance) / 100 : 3; // Default 3%
  const recentEvents = events.slice(0, 5);

  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Slippage Monitor</h2>
          <p className="text-muted-foreground">Real-time slippage protection and monitoring</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Current Tolerance</div>
              <div className="text-2xl font-bold">{currentTolerance.toFixed(2)}%</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Exceeded Events</div>
              <div className="text-2xl font-bold">{statistics.exceededCount}</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Within Tolerance</div>
              <div className="text-2xl font-bold">{statistics.withinToleranceCount}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Statistics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Slippage Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total Events</div>
            <div className="text-xl font-bold">{statistics.totalEvents}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Average Slippage</div>
            <div className="text-xl font-bold">{statistics.averageSlippage.toFixed(2)}%</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Max Slippage</div>
            <div className="text-xl font-bold text-red-600">{statistics.maxSlippage.toFixed(2)}%</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Min Slippage</div>
            <div className="text-xl font-bold text-green-600">{statistics.minSlippage.toFixed(2)}%</div>
          </div>
        </div>
      </Card>

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-lg ${
                  alert.type === 'critical'
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-yellow-50 border border-yellow-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {alert.type === 'critical' ? (
                    <XCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className={`font-medium ${
                      alert.type === 'critical' ? 'text-red-900' : 'text-yellow-900'
                    }`}>
                      {alert.message}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Slippage: {alert.details.slippagePercentage.toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(alert.timestamp * 1000).toLocaleString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Events */}
      {recentEvents.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Slippage Events</h3>
          <div className="space-y-3">
            {recentEvents.map((event, index) => (
              <motion.div
                key={event.hash}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
              >
                <div>
                  <div className="font-medium">
                    Slippage: {event.slippagePercentage.toFixed(2)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(event.timestamp * 1000).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    event.slippagePercentage > currentTolerance
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {event.slippagePercentage > currentTolerance ? 'Exceeded' : 'Within'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Update Tolerance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Update Slippage Tolerance</h3>
        <div className="flex gap-3">
          <input
            type="number"
            value={newTolerance}
            onChange={(e) => setNewTolerance(e.target.value)}
            placeholder={`Current: ${currentTolerance}%`}
            step="0.1"
            min="0"
            max="100"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <Button
            onClick={handleUpdateTolerance}
            disabled={isSettingTolerance || !newTolerance}
          >
            {isSettingTolerance ? 'Updating...' : 'Update'}
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Set the maximum acceptable slippage percentage for your transactions
        </p>
      </Card>

      {/* Empty State */}
      {statistics.totalEvents === 0 && (
        <Card className="p-6">
          <div className="text-center py-8">
            <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No slippage events recorded yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Slippage data will appear here as you make transactions
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
