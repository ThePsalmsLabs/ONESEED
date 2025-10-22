'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { useSlippageControl } from '@/hooks/useSlippageControl';
import { formatEther } from 'viem';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  EyeOff,
  TrendingDown,
  TrendingUp,
  Zap,
  Clock,
  Target,
  Info
} from 'lucide-react';

interface SlippageProtectionProps {
  onConfigure?: () => void;
}

interface SlippageEvent {
  id: string;
  timestamp: number;
  fromToken: string;
  toToken: string;
  fromAmount: bigint;
  expectedAmount: bigint;
  actualAmount: bigint;
  slippagePercent: number;
  tolerancePercent: number;
  status: 'within' | 'exceeded' | 'critical';
}

interface SwapPreview {
  fromToken: string;
  toToken: string;
  fromAmount: bigint;
  expectedAmount: bigint;
  slippagePercent: number;
  tolerancePercent: number;
  isWithinTolerance: boolean;
}

export function SlippageProtection({ onConfigure }: SlippageProtectionProps) {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [recentEvents, setRecentEvents] = useState<SlippageEvent[]>([]);
  const [currentSwap, setCurrentSwap] = useState<SwapPreview | null>(null);

  const {
    formatSlippage,
    calculateSlippagePercent,
    isSlippageWithinTolerance,
    contractAddress
  } = useSlippageControl();

  // Mock data for demonstration
  useEffect(() => {
    const mockEvents: SlippageEvent[] = [
      {
        id: '1',
        timestamp: Date.now() - 300000, // 5 minutes ago
        fromToken: 'USDC',
        toToken: 'ETH',
        fromAmount: BigInt('1000000000'), // 1000 USDC
        expectedAmount: BigInt('400000000000000000'), // 0.4 ETH
        actualAmount: BigInt('398000000000000000'), // 0.398 ETH
        slippagePercent: 0.5,
        tolerancePercent: 1.0,
        status: 'within'
      },
      {
        id: '2',
        timestamp: Date.now() - 600000, // 10 minutes ago
        fromToken: 'ETH',
        toToken: 'USDC',
        fromAmount: BigInt('100000000000000000'), // 0.1 ETH
        expectedAmount: BigInt('250000000'), // 250 USDC
        actualAmount: BigInt('245000000'), // 245 USDC
        slippagePercent: 2.0,
        tolerancePercent: 1.0,
        status: 'exceeded'
      },
      {
        id: '3',
        timestamp: Date.now() - 900000, // 15 minutes ago
        fromToken: 'USDbC',
        toToken: 'ETH',
        fromAmount: BigInt('5000000000000000000'), // 5000 USDbC
        expectedAmount: BigInt('2000000000000000000'), // 2 ETH
        actualAmount: BigInt('1950000000000000000'), // 1.95 ETH
        slippagePercent: 2.5,
        tolerancePercent: 3.0,
        status: 'within'
      }
    ];

    setRecentEvents(mockEvents);

    // Mock current swap preview
    const mockSwap: SwapPreview = {
      fromToken: 'USDC',
      toToken: 'ETH',
      fromAmount: BigInt('1000000000'), // 1000 USDC
      expectedAmount: BigInt('400000000000000000'), // 0.4 ETH
      slippagePercent: 0.8,
      tolerancePercent: 1.0,
      isWithinTolerance: true
    };

    setCurrentSwap(mockSwap);
  }, []);

  const formatTokenAmount = (value: bigint, symbol: string) => {
    const formatted = formatEther(value);
    return `${parseFloat(formatted).toFixed(4)} ${symbol}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'within':
        return 'text-green-600';
      case 'exceeded':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'within':
        return <Badge variant="success">Within Tolerance</Badge>;
      case 'exceeded':
        return <Badge variant="warning">Exceeded</Badge>;
      case 'critical':
        return <Badge variant="error">Critical</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getSlippageIcon = (slippagePercent: number) => {
    if (slippagePercent <= 0.5) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (slippagePercent <= 2.0) return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    return <AlertTriangle className="w-4 h-4 text-red-600" />;
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const getOverallStatus = () => {
    const exceededCount = recentEvents.filter(e => e.status === 'exceeded' || e.status === 'critical').length;
    const totalCount = recentEvents.length;
    
    if (totalCount === 0) return 'neutral';
    if (exceededCount === 0) return 'good';
    if (exceededCount / totalCount < 0.3) return 'warning';
    return 'critical';
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Slippage Protection Monitor</h2>
          <p className="text-gray-600">Real-time monitoring of swap slippage and protection status</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={isMonitoring ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
          >
            {isMonitoring ? (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Monitoring
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Paused
              </>
            )}
          </Button>
          <Button variant="secondary" onClick={onConfigure}>
            <Shield className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Current Status */}
      <Card className={`${
        overallStatus === 'good' ? 'bg-green-50 border-green-200' :
        overallStatus === 'warning' ? 'bg-yellow-50 border-yellow-200' :
        overallStatus === 'critical' ? 'bg-red-50 border-red-200' :
        'bg-gray-50 border-gray-200'
      }`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className={`w-5 h-5 ${
              overallStatus === 'good' ? 'text-green-600' :
              overallStatus === 'warning' ? 'text-yellow-600' :
              overallStatus === 'critical' ? 'text-red-600' :
              'text-gray-600'
            }`} />
            <span>Protection Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`text-3xl font-bold ${
                overallStatus === 'good' ? 'text-green-600' :
                overallStatus === 'warning' ? 'text-yellow-600' :
                overallStatus === 'critical' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {overallStatus === 'good' ? '🛡️' : overallStatus === 'warning' ? '⚠️' : overallStatus === 'critical' ? '🚨' : '⚪'}
              </div>
              <div className="text-sm text-gray-600">Overall Status</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {recentEvents.length}
              </div>
              <div className="text-sm text-gray-600">Recent Swaps</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {recentEvents.filter(e => e.status === 'within').length}
              </div>
              <div className="text-sm text-gray-600">Within Tolerance</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {recentEvents.filter(e => e.status === 'exceeded' || e.status === 'critical').length}
              </div>
              <div className="text-sm text-gray-600">Exceeded</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Swap Preview */}
      {currentSwap && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Current Swap Preview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">From</div>
                  <div className="font-medium">
                    {formatTokenAmount(currentSwap.fromAmount, currentSwap.fromToken)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Expected To</div>
                  <div className="font-medium">
                    {formatTokenAmount(currentSwap.expectedAmount, currentSwap.toToken)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Estimated Slippage</span>
                  <span className={getStatusColor(currentSwap.isWithinTolerance ? 'within' : 'exceeded')}>
                    {currentSwap.slippagePercent.toFixed(2)}%
                  </span>
                </div>
                <Progress 
                  value={Math.min(100, (currentSwap.slippagePercent / currentSwap.tolerancePercent) * 100)} 
                  className="h-2" 
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0%</span>
                  <span>Tolerance: {currentSwap.tolerancePercent.toFixed(1)}%</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {getSlippageIcon(currentSwap.slippagePercent)}
                <span className={`text-sm font-medium ${
                  currentSwap.isWithinTolerance ? 'text-green-600' : 'text-red-600'
                }`}>
                  {currentSwap.isWithinTolerance ? 'Slippage within tolerance' : 'Slippage exceeds tolerance'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Recent Slippage Events</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getSlippageIcon(event.slippagePercent)}
                    <div>
                      <div className="font-medium text-gray-900">
                        {event.fromToken} → {event.toToken}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatTokenAmount(event.fromAmount, event.fromToken)} → {formatTokenAmount(event.actualAmount, event.toToken)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className={`font-medium ${getStatusColor(event.status)}`}>
                        {event.slippagePercent.toFixed(2)}%
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatTimeAgo(event.timestamp)}
                      </div>
                    </div>
                    {getStatusBadge(event.status)}
                  </div>
                </div>

                {showDetails && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Expected:</span>
                        <div className="font-medium">{formatTokenAmount(event.expectedAmount, event.toToken)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Actual:</span>
                        <div className="font-medium">{formatTokenAmount(event.actualAmount, event.toToken)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Tolerance:</span>
                        <div className="font-medium">{event.tolerancePercent.toFixed(1)}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Difference:</span>
                        <div className="font-medium">
                          {formatTokenAmount(event.expectedAmount - event.actualAmount, event.toToken)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Protection Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-5 h-5" />
            <span>Protection Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <span className="font-medium">Monitor Regularly:</span> Check slippage events to adjust your tolerance settings.
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <span className="font-medium">Adjust Settings:</span> Increase tolerance for volatile tokens or during high market volatility.
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Zap className="w-4 h-4 text-purple-600 mt-0.5" />
              <div>
                <span className="font-medium">Gas-free Protection:</span> All slippage protection is applied without gas fees.
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
              <div>
                <span className="font-medium">High Volatility:</span> Consider higher tolerance during major market movements or low liquidity periods.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

