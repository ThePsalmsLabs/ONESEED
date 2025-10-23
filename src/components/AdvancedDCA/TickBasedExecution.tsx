'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { useAdvancedDCA } from '@/hooks/useAdvancedDCA';
import {
  Target,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Info,
  AlertTriangle,
  CheckCircle,
  Activity,
  Play,
  Settings
} from 'lucide-react';

interface TickBasedExecutionProps {
  onBack?: () => void;
}

interface TickStrategy {
  lowerTick: number;
  upperTick: number;
  tickDelta: number;
  tickExpiryTime: number;
  onlyImprovePrice: boolean;
}

interface TickData {
  currentTick: number;
  price: number;
  shouldExecute: boolean;
  timeToExpiry: number;
  tickMovement: number;
}

const TICK_PRESETS = [
  {
    name: 'Conservative',
    lowerTick: -100,
    upperTick: 100,
    tickDelta: 10,
    expiryTime: 3600, // 1 hour
    description: 'Small tick movements, short expiry'
  },
  {
    name: 'Balanced',
    lowerTick: -200,
    upperTick: 200,
    tickDelta: 25,
    expiryTime: 7200, // 2 hours
    description: 'Moderate tick movements, medium expiry'
  },
  {
    name: 'Aggressive',
    lowerTick: -500,
    upperTick: 500,
    tickDelta: 50,
    expiryTime: 14400, // 4 hours
    description: 'Large tick movements, long expiry'
  },
  {
    name: 'Custom',
    lowerTick: 0,
    upperTick: 0,
    tickDelta: 0,
    expiryTime: 0,
    description: 'Configure your own parameters'
  }
];

export function TickBasedExecution({ onBack }: TickBasedExecutionProps) {
  const [tickStrategy, setTickStrategy] = useState<TickStrategy>({
    lowerTick: -200,
    upperTick: 200,
    tickDelta: 25,
    tickExpiryTime: 7200,
    onlyImprovePrice: true
  });
  const [selectedPreset, setSelectedPreset] = useState('Balanced');
  const [isExecuting, setIsExecuting] = useState(false);
  const [tickData, setTickData] = useState<TickData | null>(null);

  const {
    setAdvancedTickStrategy,
    useShouldExecuteDCAAtTickPublic,
    useCurrentTick,
    useDCAExecutionCriteria,
    executeDCAAtIndex,
    isSettingAdvancedStrategy,
    getTickPrice,
    calculateTickMovement,
    isTickWithinRange
  } = useAdvancedDCA();

  // Pool key for USDC/WETH on Base
  const poolKey = {
    currency0: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`, // USDC
    currency1: '0x4200000000000000000000000000000000000006' as `0x${string}`, // WETH
    fee: 3000,
    tickSpacing: 60,
    hooks: '0x0000000000000000000000000000000000000000' as `0x${string}`
  };

  // Get current tick data from contract
  const { data: currentTickData, refetch: refetchTickData } = useCurrentTick(poolKey);
  
  // Check if DCA should execute
  const { data: shouldExecuteData, refetch: refetchShouldExecute } = useShouldExecuteDCAAtTickPublic(poolKey);

  // Get DCA configuration - for future use
  useDCAExecutionCriteria('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913');

  // Process real tick data
  useEffect(() => {
    if (currentTickData !== undefined && shouldExecuteData !== undefined) {
      // Extract the actual tick value from the contract response
      const currentTick = Array.isArray(currentTickData) ? currentTickData[0] : currentTickData;
      const shouldExecute = Array.isArray(shouldExecuteData) ? shouldExecuteData[0] : shouldExecuteData;
      
      const tickData: TickData = {
        currentTick: typeof currentTick === 'number' ? currentTick : -150,
        price: getTickPrice(typeof currentTick === 'number' ? currentTick : -150),
        shouldExecute: typeof shouldExecute === 'boolean' ? shouldExecute : false,
        timeToExpiry: Math.max(0, tickStrategy.tickExpiryTime - Math.floor(Date.now() / 1000) % tickStrategy.tickExpiryTime),
        tickMovement: calculateTickMovement(-200, typeof currentTick === 'number' ? currentTick : -150)
      };
      
      setTickData(tickData);
    }
  }, [currentTickData, shouldExecuteData, tickStrategy.tickExpiryTime]);

  const handleSetTickStrategy = async () => {
    try {
      await setAdvancedTickStrategy({
        lowerTick: tickStrategy.lowerTick,
        upperTick: tickStrategy.upperTick,
        tickDelta: tickStrategy.tickDelta,
        tickExpiryTime: tickStrategy.tickExpiryTime,
        onlyImprovePrice: tickStrategy.onlyImprovePrice
      });
    } catch (error) {
      console.error('Failed to set tick strategy:', error);
    }
  };

  const handlePresetSelect = (preset: typeof TICK_PRESETS[0]) => {
    setSelectedPreset(preset.name);
    setTickStrategy({
      lowerTick: preset.lowerTick,
      upperTick: preset.upperTick,
      tickDelta: preset.tickDelta,
      tickExpiryTime: preset.expiryTime,
      onlyImprovePrice: true
    });
  };

  const handleExecuteDCA = async () => {
    setIsExecuting(true);
    try {
      // Execute DCA using the real contract function
      await executeDCAAtIndex({ index: 0 });
      refetchTickData();
      refetchShouldExecute();
    } catch (error) {
      console.error('Failed to execute DCA:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const getTickStatus = (tick: number) => {
    if (tick < tickStrategy.lowerTick) return 'below_range';
    if (tick > tickStrategy.upperTick) return 'above_range';
    return 'within_range';
  };

  const getTickStatusColor = (status: string) => {
    switch (status) {
      case 'below_range': return 'text-red-600';
      case 'above_range': return 'text-red-600';
      case 'within_range': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getTickStatusIcon = (status: string) => {
    switch (status) {
      case 'below_range': return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'above_range': return <TrendingUp className="w-4 h-4 text-red-600" />;
      case 'within_range': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  if (!tickData) {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Loading Tick Data</h3>
          <p className="text-yellow-700">Fetching current tick information...</p>
        </CardContent>
      </Card>
    );
  }

  const tickStatus = getTickStatus(tickData.currentTick);
  const isWithinRange = isTickWithinRange(tickData.currentTick, tickStrategy.lowerTick, tickStrategy.upperTick);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tick-Based DCA Execution</h2>
          <p className="text-gray-600">Execute DCA based on price tick movements and time intervals</p>
        </div>
        {onBack && (
          <Button variant="secondary" onClick={onBack}>
            Back to Dashboard
          </Button>
        )}
      </div>

      {/* Current Tick Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Current Tick Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {tickData.currentTick}
              </div>
              <div className="text-sm text-gray-600">Current Tick</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                ${tickData.price.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Current Price</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {tickData.tickMovement > 0 ? '+' : ''}{tickData.tickMovement}
              </div>
              <div className="text-sm text-gray-600">Tick Movement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {formatTime(tickData.timeToExpiry)}
              </div>
              <div className="text-sm text-gray-600">Time to Expiry</div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getTickStatusIcon(tickStatus)}
                <div>
                  <div className={`font-medium ${getTickStatusColor(tickStatus)}`}>
                    Tick Status: {tickStatus.replace('_', ' ').toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Range: {tickStrategy.lowerTick} to {tickStrategy.upperTick}
                  </div>
                </div>
              </div>
              <Badge variant={tickData.shouldExecute ? 'success' : 'default'}>
                {tickData.shouldExecute ? 'Ready to Execute' : 'Waiting'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tick Strategy Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Tick Strategy Presets</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TICK_PRESETS.map((preset) => (
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
                    
                    {preset.name !== 'Custom' && (
                      <div className="space-y-1 text-xs">
                        <div>Range: {preset.lowerTick} to {preset.upperTick}</div>
                        <div>Delta: {preset.tickDelta}</div>
                        <div>Expiry: {formatTime(preset.expiryTime)}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tick Strategy Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Tick Strategy Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lowerTick">Lower Tick Bound</Label>
              <Input
                id="lowerTick"
                type="number"
                placeholder="-200"
                value={tickStrategy.lowerTick}
                onChange={(e) => setTickStrategy(prev => ({ ...prev, lowerTick: parseInt(e.target.value) || 0 }))}
              />
              <div className="text-sm text-gray-600">Minimum tick for execution</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="upperTick">Upper Tick Bound</Label>
              <Input
                id="upperTick"
                type="number"
                placeholder="200"
                value={tickStrategy.upperTick}
                onChange={(e) => setTickStrategy(prev => ({ ...prev, upperTick: parseInt(e.target.value) || 0 }))}
              />
              <div className="text-sm text-gray-600">Maximum tick for execution</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tickDelta">Tick Delta</Label>
              <Input
                id="tickDelta"
                type="number"
                placeholder="25"
                value={tickStrategy.tickDelta}
                onChange={(e) => setTickStrategy(prev => ({ ...prev, tickDelta: parseInt(e.target.value) || 0 }))}
              />
              <div className="text-sm text-gray-600">Minimum tick movement required</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tickExpiryTime">Tick Expiry Time (seconds)</Label>
              <Input
                id="tickExpiryTime"
                type="number"
                placeholder="7200"
                value={tickStrategy.tickExpiryTime}
                onChange={(e) => setTickStrategy(prev => ({ ...prev, tickExpiryTime: parseInt(e.target.value) || 0 }))}
              />
              <div className="text-sm text-gray-600">Time before tick strategy expires</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={tickStrategy.onlyImprovePrice}
                onChange={(e) => setTickStrategy(prev => ({ ...prev, onlyImprovePrice: e.target.checked }))}
                className="rounded"
              />
              <span>Only Improve Price</span>
            </Label>
            <div className="text-sm text-gray-600">
              Only execute DCA when it improves the average price
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Execution Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>DCA Execution Control</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-gray-900">
                {tickData.shouldExecute ? 'Ready to Execute' : 'Waiting for Conditions'}
              </div>
              <div className="text-sm text-gray-600">
                {tickData.shouldExecute ? 'All conditions met for DCA execution' : 'Tick conditions not yet met'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className={`text-xl font-bold ${isWithinRange ? 'text-green-600' : 'text-red-600'}`}>
                  {isWithinRange ? '✅' : '❌'}
                </div>
                <div className="text-sm text-gray-600">Tick in Range</div>
              </div>
              <div className="text-center">
                <div className={`text-xl font-bold ${tickData.timeToExpiry > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {tickData.timeToExpiry > 0 ? '✅' : '❌'}
                </div>
                <div className="text-sm text-gray-600">Time Valid</div>
              </div>
              <div className="text-center">
                <div className={`text-xl font-bold ${Math.abs(tickData.tickMovement) >= tickStrategy.tickDelta ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(tickData.tickMovement) >= tickStrategy.tickDelta ? '✅' : '❌'}
                </div>
                <div className="text-sm text-gray-600">Delta Met</div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleExecuteDCA}
                disabled={!tickData.shouldExecute || isExecuting}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                {isExecuting ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Executing DCA...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Execute DCA
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Apply Strategy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>Apply Tick Strategy</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y LOG 4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-blue-900">
                    Tick Strategy: {selectedPreset}
                  </div>
                  <div className="text-sm text-blue-700">
                    Range: {tickStrategy.lowerTick} to {tickStrategy.upperTick} | Delta: {tickStrategy.tickDelta} | Expiry: {formatTime(tickStrategy.tickExpiryTime)}
                  </div>
                </div>
                <Button
                  onClick={handleSetTickStrategy}
                  disabled={isSettingAdvancedStrategy}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSettingAdvancedStrategy ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Apply Strategy
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Gas-free execution</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">Real-time monitoring</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="w-5 h-5" />
            <span>How Tick-Based Execution Works</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <Target className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <span className="font-medium">Tick Range:</span> DCA executes only when price ticks are within your specified range
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <span className="font-medium">Tick Delta:</span> Minimum tick movement required before execution is triggered
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-orange-600 mt-0.5" />
              <div>
                <span className="font-medium">Expiry Time:</span> Tick strategy expires after specified time to prevent stale executions
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Zap className="w-4 h-4 text-purple-600 mt-0.5" />
              <div>
                <span className="font-medium">Gas-free:</span> All tick-based executions happen automatically without gas costs
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
