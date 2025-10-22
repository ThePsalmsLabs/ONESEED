'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '@/components/ui/Label';
import { Progress } from '@/components/ui/Progress';
import { useAdvancedDCA } from '@/hooks/useAdvancedDCA';
import { parseEther } from 'viem';
import { 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Zap, 
  BarChart3,
  Info,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';

interface DynamicDCASettingsProps {
  onBack?: () => void;
}

const VOLATILITY_LEVELS = [
  { value: 1, label: 'Low', description: 'Conservative sizing', color: 'text-green-600' },
  { value: 2, label: 'Medium', description: 'Balanced approach', color: 'text-blue-600' },
  { value: 3, label: 'High', description: 'Aggressive sizing', color: 'text-orange-600' },
  { value: 4, label: 'Maximum', description: 'Maximum volatility', color: 'text-red-600' }
];

const DYNAMIC_PRESETS = [
  { 
    name: 'Conservative',
    baseAmount: '10',
    volatilityMultiplier: 1.2,
    maxMultiplier: 1.5,
    minMultiplier: 0.8,
    description: 'Small adjustments based on volatility'
  },
  { 
    name: 'Balanced',
    baseAmount: '25',
    volatilityMultiplier: 1.5,
    maxMultiplier: 2.0,
    minMultiplier: 0.7,
    description: 'Moderate adjustments for most conditions'
  },
  { 
    name: 'Aggressive',
    baseAmount: '50',
    volatilityMultiplier: 2.0,
    maxMultiplier: 3.0,
    minMultiplier: 0.5,
    description: 'Large adjustments for high volatility'
  },
  { 
    name: 'Custom',
    baseAmount: '',
    volatilityMultiplier: 1.0,
    maxMultiplier: 1.0,
    minMultiplier: 1.0,
    description: 'Configure your own parameters'
  }
];

export function DynamicDCASettings({ onBack }: DynamicDCASettingsProps) {
  const [dynamicEnabled, setDynamicEnabled] = useState(false);
  const [baseAmount, setBaseAmount] = useState('25');
  const [volatilityMultiplier, setVolatilityMultiplier] = useState(1.5);
  const [maxMultiplier, setMaxMultiplier] = useState(2.0);
  const [minMultiplier, setMinMultiplier] = useState(0.7);
  const [selectedPreset, setSelectedPreset] = useState('Balanced');
  const [simulationTickMovement, setSimulationTickMovement] = useState(25);
  const [simulationVolatility, setSimulationVolatility] = useState(2);

  const {
    setDynamicDCASizing,
    isSettingDynamicSizing,
    contractAddress,
    formatAmount,
    calculateDynamicAmount,
    getVolatilityLevel
  } = useAdvancedDCA();

  const handleSetDynamicSizing = async () => {
    try {
      await setDynamicDCASizing({
        enabled: dynamicEnabled,
        baseAmount,
        volatilityMultiplier,
        maxMultiplier,
        minMultiplier
      });
    } catch (error) {
      console.error('Failed to set dynamic DCA sizing:', error);
    }
  };

  const handlePresetSelect = (preset: typeof DYNAMIC_PRESETS[0]) => {
    setSelectedPreset(preset.name);
    setBaseAmount(preset.baseAmount);
    setVolatilityMultiplier(preset.volatilityMultiplier);
    setMaxMultiplier(preset.maxMultiplier);
    setMinMultiplier(preset.minMultiplier);
  };

  // Calculate simulation results
  const baseAmountWei = baseAmount ? parseEther(baseAmount) : BigInt(0);
  const simulatedAmount = baseAmountWei > 0 ? 
    calculateDynamicAmount(baseAmountWei, simulationTickMovement, simulationVolatility) : 
    BigInt(0);
  
  const multiplier = baseAmountWei > 0 ? 
    Number(simulatedAmount) / Number(baseAmountWei) : 1;
  
  const volatilityLevel = getVolatilityLevel(simulationTickMovement);

  const getVolatilityColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-blue-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getMultiplierColor = (mult: number) => {
    if (mult > 1.5) return 'text-green-600';
    if (mult > 1.0) return 'text-blue-600';
    if (mult > 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dynamic DCA Settings</h2>
          <p className="text-gray-600">Configure intelligent DCA sizing based on market volatility</p>
        </div>
        {onBack && (
          <Button variant="secondary" onClick={onBack}>
            Back to Dashboard
          </Button>
        )}
      </div>

      {/* Enable/Disable */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Dynamic Sizing Control</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Enable Dynamic DCA Sizing</div>
              <div className="text-sm text-gray-600">
                Automatically adjust DCA amounts based on market volatility and tick movement
              </div>
            </div>
            <Button
              variant={dynamicEnabled ? 'primary' : 'secondary'}
              onClick={() => setDynamicEnabled(!dynamicEnabled)}
            >
              {dynamicEnabled ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Enabled
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Disabled
                </>
              )}
            </Button>
          </div>

          {dynamicEnabled && (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Dynamic sizing is active. DCA amounts will adjust based on market conditions.
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preset Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Dynamic Strategy Presets</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {DYNAMIC_PRESETS.map((preset) => (
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
                        <div>Base: ${preset.baseAmount}</div>
                        <div>Volatility: {preset.volatilityMultiplier}x</div>
                        <div>Range: {preset.minMultiplier}x - {preset.maxMultiplier}x</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Dynamic Sizing Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Base Amount */}
          <div className="space-y-2">
            <Label htmlFor="baseAmount">Base DCA Amount (USD)</Label>
            <Input
              id="baseAmount"
              type="number"
              placeholder="25.00"
              value={baseAmount}
              onChange={(e) => setBaseAmount(e.target.value)}
            />
            <div className="text-sm text-gray-600">
              This is the base amount that will be adjusted based on volatility
            </div>
          </div>

          {/* Volatility Multiplier */}
          <div className="space-y-2">
            <Label htmlFor="volatilityMultiplier">Volatility Multiplier</Label>
            <div className="space-y-2">
              <Input
                id="volatilityMultiplier"
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                placeholder="1.5"
                value={volatilityMultiplier}
                onChange={(e) => setVolatilityMultiplier(parseFloat(e.target.value) || 1.0)}
              />
              <div className="flex space-x-2">
                {[1.0, 1.5, 2.0, 2.5, 3.0].map((mult) => (
                  <Button
                    key={mult}
                    variant={volatilityMultiplier === mult ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setVolatilityMultiplier(mult)}
                  >
                    {mult}x
                  </Button>
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              How much the amount increases during high volatility
            </div>
          </div>

          {/* Multiplier Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minMultiplier">Minimum Multiplier</Label>
              <Input
                id="minMultiplier"
                type="number"
                step="0.1"
                min="0.1"
                max="1.0"
                placeholder="0.7"
                value={minMultiplier}
                onChange={(e) => setMinMultiplier(parseFloat(e.target.value) || 0.7)}
              />
              <div className="text-sm text-gray-600">Minimum amount reduction (e.g., 0.7 = 70%)</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxMultiplier">Maximum Multiplier</Label>
              <Input
                id="maxMultiplier"
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                placeholder="2.0"
                value={maxMultiplier}
                onChange={(e) => setMaxMultiplier(parseFloat(e.target.value) || 2.0)}
              />
              <div className="text-sm text-gray-600">Maximum amount increase (e.g., 2.0 = 200%)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Dynamic Sizing Simulation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="simulationTickMovement">Tick Movement Simulation</Label>
              <Input
                id="simulationTickMovement"
                type="number"
                placeholder="25"
                value={simulationTickMovement}
                onChange={(e) => setSimulationTickMovement(parseInt(e.target.value) || 0)}
              />
              <div className="text-sm text-gray-600">Simulate tick movement (positive = price up)</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="simulationVolatility">Volatility Level</Label>
              <select
                id="simulationVolatility"
                value={simulationVolatility}
                onChange={(e) => setSimulationVolatility(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {VOLATILITY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label} - {level.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Simulation Results */}
          {baseAmount && (
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-gray-900">
                  ${formatAmount(simulatedAmount)}
                </div>
                <div className="text-sm text-gray-600">Simulated DCA Amount</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-xl font-bold ${getMultiplierColor(multiplier)}`}>
                    {multiplier.toFixed(2)}x
                  </div>
                  <div className="text-sm text-gray-600">Multiplier</div>
                </div>
                <div className="text-center">
                  <div className={`text-xl font-bold ${getVolatilityColor(volatilityLevel)}`}>
                    {volatilityLevel.toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-600">Volatility</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">
                    {simulationTickMovement > 0 ? '+' : ''}{simulationTickMovement}
                  </div>
                  <div className="text-sm text-gray-600">Tick Movement</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span>Base Amount: ${baseAmount}</span>
                  <span>Adjusted Amount: ${formatAmount(simulatedAmount)}</span>
                </div>
                <Progress 
                  value={Math.min(100, (multiplier / maxMultiplier) * 100)} 
                  className="h-2 mt-2" 
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Apply Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>Apply Dynamic Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-blue-900">
                    Dynamic DCA Sizing: {dynamicEnabled ? 'Enabled' : 'Disabled'}
                  </div>
                  <div className="text-sm text-blue-700">
                    Base Amount: ${baseAmount} | Multiplier Range: {minMultiplier}x - {maxMultiplier}x
                  </div>
                </div>
                <Button
                  onClick={handleSetDynamicSizing}
                  disabled={isSettingDynamicSizing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSettingDynamicSizing ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Apply Settings
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Gas-free configuration</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">Applied instantly</span>
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
            <span>How Dynamic DCA Works</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <span className="font-medium">High Volatility:</span> DCA amounts increase to buy more during market dips
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <TrendingDown className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <span className="font-medium">Low Volatility:</span> DCA amounts decrease to avoid overpaying during stable periods
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Target className="w-4 h-4 text-purple-600 mt-0.5" />
              <div>
                <span className="font-medium">Tick Movement:</span> Price movements trigger dynamic adjustments within your multiplier range
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Zap className="w-4 h-4 text-orange-600 mt-0.5" />
              <div>
                <span className="font-medium">Gas-free:</span> All dynamic adjustments happen automatically without additional gas costs
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
