'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useSlippageControl } from '@/hooks/useSlippageControl';
import { formatEther } from 'viem';
import { 
  AlertTriangle, 
  X, 
  CheckCircle, 
  Clock, 
  Zap, 
  Shield,
  TrendingDown,
  TrendingUp,
  Info,
  Settings
} from 'lucide-react';

interface SlippageAlertProps {
  onDismiss?: () => void;
  onConfigure?: () => void;
}

interface SlippageAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: number;
  fromToken: string;
  toToken: string;
  fromAmount: bigint;
  expectedAmount: bigint;
  actualAmount: bigint;
  slippagePercent: number;
  tolerancePercent: number;
  action?: string;
  dismissed?: boolean;
}

export function SlippageAlert({ onDismiss, onConfigure }: SlippageAlertProps) {
  const [alerts, setAlerts] = useState<SlippageAlert[]>([]);
  const [showAlerts, setShowAlerts] = useState(true);

  const {
    formatSlippage,
    calculateSlippagePercent,
    isSlippageWithinTolerance,
    handleSlippageExceeded,
    isHandlingSlippage
  } = useSlippageControl();

  // Mock alerts for demonstration
  useEffect(() => {
    const mockAlerts: SlippageAlert[] = [
      {
        id: '1',
        type: 'warning',
        title: 'Slippage Tolerance Exceeded',
        message: 'Your swap experienced higher slippage than your tolerance setting.',
        timestamp: Date.now() - 120000, // 2 minutes ago
        fromToken: 'ETH',
        toToken: 'USDC',
        fromAmount: BigInt('100000000000000000'), // 0.1 ETH
        expectedAmount: BigInt('250000000'), // 250 USDC
        actualAmount: BigInt('245000000'), // 245 USDC
        slippagePercent: 2.0,
        tolerancePercent: 1.0,
        action: 'Swap completed with reduced amount'
      },
      {
        id: '2',
        type: 'info',
        title: 'Slippage Protection Active',
        message: 'Your slippage protection is working correctly and prevented a high-slippage swap.',
        timestamp: Date.now() - 300000, // 5 minutes ago
        fromToken: 'USDC',
        toToken: 'ETH',
        fromAmount: BigInt('1000000000'), // 1000 USDC
        expectedAmount: BigInt('400000000000000000'), // 0.4 ETH
        actualAmount: BigInt('398000000000000000'), // 0.398 ETH
        slippagePercent: 0.5,
        tolerancePercent: 1.0,
        action: 'Swap executed successfully'
      },
      {
        id: '3',
        type: 'error',
        title: 'Critical Slippage Detected',
        message: 'Extremely high slippage detected. Consider adjusting your tolerance settings.',
        timestamp: Date.now() - 600000, // 10 minutes ago
        fromToken: 'USDbC',
        toToken: 'ETH',
        fromAmount: BigInt('5000000000000000000'), // 5000 USDbC
        expectedAmount: BigInt('2000000000000000000'), // 2 ETH
        actualAmount: BigInt('1800000000000000000'), // 1.8 ETH
        slippagePercent: 10.0,
        tolerancePercent: 3.0,
        action: 'Swap reverted due to high slippage'
      }
    ];

    setAlerts(mockAlerts);
  }, []);

  const formatTokenAmount = (value: bigint, symbol: string) => {
    const formatted = formatEther(value);
    return `${parseFloat(formatted).toFixed(4)} ${symbol}`;
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getSlippageIcon = (slippagePercent: number) => {
    if (slippagePercent <= 0.5) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (slippagePercent <= 2.0) return <TrendingDown className="w-4 h-4 text-yellow-600" />;
    return <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const dismissAllAlerts = () => {
    setAlerts([]);
    onDismiss?.();
  };

  const handleSlippageAction = async (alert: SlippageAlert) => {
    try {
      await handleSlippageExceeded({
        fromToken: alert.fromToken as `0x${string}`,
        toToken: alert.toToken as `0x${string}`,
        fromAmount: alert.fromAmount,
        receivedAmount: alert.actualAmount,
        expectedMinimum: alert.expectedAmount
      });
    } catch (error) {
      console.error('Failed to handle slippage:', error);
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.dismissed);

  if (!showAlerts || activeAlerts.length === 0) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">No Active Alerts</h3>
          <p className="text-green-700 mb-4">
            Your slippage protection is working correctly. No alerts at this time.
          </p>
          <Button variant="secondary" onClick={() => setShowAlerts(true)}>
            <Shield className="w-4 h-4 mr-2" />
            Show Alert History
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Slippage Alerts</h2>
          <p className="text-gray-600">
            {activeAlerts.length} active alert{activeAlerts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAlerts(false)}
          >
            <X className="w-4 h-4 mr-2" />
            Hide Alerts
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={dismissAllAlerts}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Dismiss All
          </Button>
        </div>
      </div>

      {activeAlerts.map((alert) => (
        <Card key={alert.id} className={`border-2 ${getAlertColor(alert.type)}`}>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getAlertIcon(alert.type)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    alert.type === 'warning' ? 'warning' :
                    alert.type === 'error' ? 'error' :
                    alert.type === 'success' ? 'success' :
                    'info'
                  }>
                    {alert.type.toUpperCase()}
                  </Badge>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => dismissAlert(alert.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Swap Details */}
              <div className="bg-white p-3 rounded-lg border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Swap Details</div>
                    <div className="font-medium">
                      {formatTokenAmount(alert.fromAmount, alert.fromToken)} → {formatTokenAmount(alert.actualAmount, alert.toToken)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Time</div>
                    <div className="font-medium">{formatTimeAgo(alert.timestamp)}</div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Expected:</span>
                      <div className="font-medium">{formatTokenAmount(alert.expectedAmount, alert.toToken)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Actual:</span>
                      <div className="font-medium">{formatTokenAmount(alert.actualAmount, alert.toToken)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Slippage:</span>
                      <div className="font-medium flex items-center space-x-1">
                        {getSlippageIcon(alert.slippagePercent)}
                        <span>{alert.slippagePercent.toFixed(2)}%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Tolerance:</span>
                      <div className="font-medium">{alert.tolerancePercent.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              {alert.action && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Action Taken:</span>
                    <span className="text-sm text-gray-600">{alert.action}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onConfigure}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Adjust Settings
                  </Button>
                  {alert.type === 'error' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSlippageAction(alert)}
                      disabled={isHandlingSlippage}
                    >
                      {isHandlingSlippage ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                          Handling...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Handle Slippage
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {formatTimeAgo(alert.timestamp)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">
                {activeAlerts.length} Active Alert{activeAlerts.length !== 1 ? 's' : ''}
              </div>
              <div className="text-sm text-gray-600">
                {activeAlerts.filter(a => a.type === 'error').length} critical, {activeAlerts.filter(a => a.type === 'warning').length} warnings
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Protection Active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

