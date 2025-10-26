'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { ErrorState, LoadingState, NoHistoryEmptyState } from '@/components/ui';
import { useAdvancedDCA } from '@/hooks/useAdvancedDCA';
import { useAccount } from 'wagmi';
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
  const { address } = useAccount();
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    setAdvancedTickStrategy,
    useShouldExecuteDCAAtTickPublic,
    useCurrentTick,
    useDCAExecutionCriteria,
    executeDCAAtIndex,
    isSettingAdvancedStrategy,
    getTickPrice,
    calculateTickMovement,
    formatAmount
  } = useAdvancedDCA();

  // Process real tick data
  useEffect(() => {
    const processTickData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real implementation, this would fetch tick data from:
        // 1. Uniswap V4 pool manager contract
        // 2. Real-time tick monitoring
        // 3. Historical tick movement data
        
        // For now, we'll show empty state since we don't have real tick data
        setTickData(null);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tick data');
      } finally {
        setIsLoading(false);
      }
    };

    processTickData();
  }, []);

  const refetch = () => {
    setIsLoading(true);
    setError(null);
    // Trigger data refetch
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handlePresetChange = (presetName: string) => {
    const preset = TICK_PRESETS.find(p => p.name === presetName);
    if (preset && preset.name !== 'Custom') {
      setTickStrategy({
        lowerTick: preset.lowerTick,
        upperTick: preset.upperTick,
        tickDelta: preset.tickDelta,
        tickExpiryTime: preset.expiryTime,
        onlyImprovePrice: true
      });
    }
    setSelectedPreset(presetName);
  };

  const handleStrategyUpdate = async () => {
    if (!address) return;

    setIsExecuting(true);
    try {
      // In a real implementation, this would call the contract
      // await setAdvancedTickStrategy(tickStrategy);
      
      // For now, we'll simulate the update
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tick strategy');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleExecuteAtTick = async () => {
    if (!address || !tickData) return;

    setIsExecuting(true);
    try {
      // In a real implementation, this would execute DCA at the current tick
      // await executeDCAAtIndex(tickData.currentTick);
      
      // For now, we'll simulate the execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute DCA at tick');
    } finally {
      setIsExecuting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Tick-Based Execution</h2>
            <p className="text-muted-foreground">Execute DCA based on Uniswap V4 tick movements</p>
          </div>
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
        </div>
        <LoadingState message="Loading tick data..." />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Tick-Based Execution</h2>
            <p className="text-muted-foreground">Execute DCA based on Uniswap V4 tick movements</p>
          </div>
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
        </div>
        <ErrorState
          title="Failed to load tick data"
          message="Unable to fetch tick information. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  // Show empty state if no tick data
  if (!tickData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Tick-Based Execution</h2>
            <p className="text-muted-foreground">Execute DCA based on Uniswap V4 tick movements</p>
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
          <h2 className="text-2xl font-bold">Tick-Based Execution</h2>
          <p className="text-muted-foreground">Execute DCA based on Uniswap V4 tick movements</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refetch}>
            <Activity className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
        </div>
      </div>

      {/* Current Tick Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Current Tick Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {tickData.currentTick}
              </div>
              <div className="text-sm text-muted-foreground">Current Tick</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                ${tickData.price.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Current Price</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {tickData.tickMovement}
              </div>
              <div className="text-sm text-muted-foreground">Tick Movement</div>
            </div>
          </div>

          <div className="mt-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {tickData.shouldExecute ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                )}
                <span className="font-semibold">
                  {tickData.shouldExecute ? 'Ready to Execute' : 'Waiting for Conditions'}
                </span>
              </div>
              <Badge variant={tickData.shouldExecute ? 'success' : 'warning'}>
                {tickData.shouldExecute ? 'Execute' : 'Wait'}
              </Badge>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Time to expiry: {Math.floor(tickData.timeToExpiry / 60)} minutes
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tick Strategy Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Tick Strategy Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="block text-sm font-medium mb-2">Strategy Preset</Label>
            <select
              value={selectedPreset}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {TICK_PRESETS.map((preset) => (
                <option key={preset.name} value={preset.name}>
                  {preset.name} - {preset.description}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lowerTick">Lower Tick</Label>
              <Input
                id="lowerTick"
                type="number"
                value={tickStrategy.lowerTick}
                onChange={(e) => setTickStrategy(prev => ({ ...prev, lowerTick: Number(e.target.value) }))}
                placeholder="e.g., -200"
              />
            </div>
            <div>
              <Label htmlFor="upperTick">Upper Tick</Label>
              <Input
                id="upperTick"
                type="number"
                value={tickStrategy.upperTick}
                onChange={(e) => setTickStrategy(prev => ({ ...prev, upperTick: Number(e.target.value) }))}
                placeholder="e.g., 200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tickDelta">Tick Delta</Label>
              <Input
                id="tickDelta"
                type="number"
                value={tickStrategy.tickDelta}
                onChange={(e) => setTickStrategy(prev => ({ ...prev, tickDelta: Number(e.target.value) }))}
                placeholder="e.g., 25"
              />
            </div>
            <div>
              <Label htmlFor="expiryTime">Expiry Time (seconds)</Label>
              <Input
                id="expiryTime"
                type="number"
                value={tickStrategy.tickExpiryTime}
                onChange={(e) => setTickStrategy(prev => ({ ...prev, tickExpiryTime: Number(e.target.value) }))}
                placeholder="e.g., 7200"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="onlyImprovePrice"
              checked={tickStrategy.onlyImprovePrice}
              onChange={(e) => setTickStrategy(prev => ({ ...prev, onlyImprovePrice: e.target.checked }))}
              className="rounded"
            />
            <Label htmlFor="onlyImprovePrice">Only improve price</Label>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleStrategyUpdate}
              disabled={isExecuting || isSettingAdvancedStrategy}
              className="flex-1"
            >
              {isExecuting || isSettingAdvancedStrategy ? (
                <>
                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                  Updating Strategy...
                </>
              ) : (
                <>
                  <Settings className="w-4 h-4 mr-2" />
                  Update Strategy
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Execution Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Execution Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-blue-800">Execution Criteria</span>
              </div>
              <div className="text-sm text-blue-700">
                <p>• Current tick: {tickData.currentTick}</p>
                <p>• Tick range: {tickStrategy.lowerTick} to {tickStrategy.upperTick}</p>
                <p>• Tick delta: {tickStrategy.tickDelta}</p>
                <p>• Expiry time: {tickStrategy.tickExpiryTime} seconds</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleExecuteAtTick}
                disabled={isExecuting || !tickData.shouldExecute}
                className="flex-1"
              >
                {isExecuting ? (
                  <>
                    <Activity className="w-4 h-4 mr-2 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Execute DCA at Current Tick
                  </>
                )}
              </Button>
            </div>

            {!tickData.shouldExecute && (
              <div className="p-3 border rounded-lg bg-yellow-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    Execution conditions not met. Waiting for tick movement or expiry.
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tick Movement History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Tick Movement History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Tick movement history will be displayed here once data is available
          </div>
        </CardContent>
      </Card>
    </div>
  );
}