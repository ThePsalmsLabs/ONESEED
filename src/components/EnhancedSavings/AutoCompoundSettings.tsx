'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { useEnhancedSavings } from '@/hooks/useEnhancedSavings';
import { parseEther, formatEther } from 'viem';
import { 
  Settings, 
  TrendingUp, 
  Clock, 
  Target, 
  Zap, 
  BarChart3,
  Info,
  AlertTriangle,
  CheckCircle,
  Activity,
  DollarSign,
  Calendar,
  Percent
} from 'lucide-react';

interface AutoCompoundSettingsProps {
  onBack?: () => void;
}

const COMPOUND_FREQUENCIES = [
  { value: 1, label: '1 hour', description: 'Very frequent compounding' },
  { value: 6, label: '6 hours', description: 'Frequent compounding' },
  { value: 12, label: '12 hours', description: 'Regular compounding' },
  { value: 24, label: '24 hours', description: 'Daily compounding' },
  { value: 168, label: '7 days', description: 'Weekly compounding' },
  { value: 720, label: '30 days', description: 'Monthly compounding' }
];

const COMPOUND_PRESETS = [
  {
    name: 'Conservative',
    compoundPercentage: 5,
    minCompoundAmount: '10',
    frequency: 24,
    description: 'Low risk, steady growth'
  },
  {
    name: 'Balanced',
    compoundPercentage: 10,
    minCompoundAmount: '25',
    frequency: 12,
    description: 'Moderate risk, good growth'
  },
  {
    name: 'Aggressive',
    compoundPercentage: 20,
    minCompoundAmount: '50',
    frequency: 6,
    description: 'High risk, maximum growth'
  },
  {
    name: 'Custom',
    compoundPercentage: 0,
    minCompoundAmount: '',
    frequency: 0,
    description: 'Configure your own settings'
  }
];

export function AutoCompoundSettings({ onBack }: AutoCompoundSettingsProps) {
  const [autoCompoundEnabled, setAutoCompoundEnabled] = useState(false);
  const [compoundPercentage, setCompoundPercentage] = useState(10);
  const [minCompoundAmount, setMinCompoundAmount] = useState('25');
  const [compoundFrequency, setCompoundFrequency] = useState(24);
  const [selectedPreset, setSelectedPreset] = useState('Balanced');
  const [simulationBalance, setSimulationBalance] = useState('1000');
  const [simulationTime, setSimulationTime] = useState(30);

  const {
    setAutoCompoundSettings,
    isSettingAutoCompound,
    contractAddress,
    formatAmount,
    calculateAutoCompoundPotential,
    getCompoundFrequencyLabel,
    SavingsTokenType
  } = useEnhancedSavings();

  const handleSetAutoCompoundSettings = async () => {
    try {
      await setAutoCompoundSettings({
        token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`, // USDC
        enabled: autoCompoundEnabled,
        compoundPercentage,
        minCompoundAmount,
        compoundFrequency
      });
    } catch (error) {
      console.error('Failed to set auto-compound settings:', error);
    }
  };

  const handlePresetSelect = (preset: typeof COMPOUND_PRESETS[0]) => {
    setSelectedPreset(preset.name);
    setCompoundPercentage(preset.compoundPercentage);
    setMinCompoundAmount(preset.minCompoundAmount);
    setCompoundFrequency(preset.frequency);
  };

  // Calculate simulation results
  const simulationBalanceWei = simulationBalance ? parseEther(simulationBalance) : BigInt(0);
  const potentialBalance = simulationBalanceWei > 0 ? 
    calculateAutoCompoundPotential(simulationBalanceWei, compoundPercentage, simulationTime) : 
    BigInt(0);
  
  const growthAmount = potentialBalance - simulationBalanceWei;
  const growthPercentage = simulationBalanceWei > 0 ? 
    Number((growthAmount * BigInt(10000)) / simulationBalanceWei) / 100 : 0;

  const getCompoundFrequencyColor = (frequency: number) => {
    if (frequency <= 6) return 'text-red-600';
    if (frequency <= 24) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getCompoundFrequencyIcon = (frequency: number) => {
    if (frequency <= 6) return <Activity className="w-4 h-4 text-red-600" />;
    if (frequency <= 24) return <Clock className="w-4 h-4 text-yellow-600" />;
    return <Calendar className="w-4 h-4 text-green-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Auto-Compound Settings</h2>
          <p className="text-gray-600">Configure automatic compounding for your savings</p>
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
            <span>Auto-Compound Control</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Enable Auto-Compound</div>
              <div className="text-sm text-gray-600">
                Automatically compound your savings to maximize growth
              </div>
            </div>
            <Button
              variant={autoCompoundEnabled ? 'default' : 'secondary'}
              onClick={() => setAutoCompoundEnabled(!autoCompoundEnabled)}
            >
              {autoCompoundEnabled ? (
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

          {autoCompoundEnabled && (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Auto-compound is active. Your savings will be automatically compounded based on your settings.
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
            <span>Auto-Compound Strategy Presets</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMPOUND_PRESETS.map((preset) => (
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
                        <div>Rate: {preset.compoundPercentage}%</div>
                        <div>Min: ${preset.minCompoundAmount}</div>
                        <div>Freq: {preset.frequency}h</div>
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
            <span>Auto-Compound Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Compound Percentage */}
          <div className="space-y-2">
            <Label htmlFor="compoundPercentage">Compound Percentage (%)</Label>
            <div className="space-y-2">
              <Input
                id="compoundPercentage"
                type="number"
                step="0.1"
                min="0.1"
                max="100"
                placeholder="10.0"
                value={compoundPercentage}
                onChange={(e) => setCompoundPercentage(parseFloat(e.target.value) || 0)}
              />
              <div className="flex space-x-2">
                {[5, 10, 15, 20, 25].map((percentage) => (
                  <Button
                    key={percentage}
                    variant={compoundPercentage === percentage ? 'default' : 'secondary'}
                    size="sm"
                    onClick={() => setCompoundPercentage(percentage)}
                  >
                    {percentage}%
                  </Button>
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Annual percentage rate for compounding
            </div>
          </div>

          {/* Minimum Compound Amount */}
          <div className="space-y-2">
            <Label htmlFor="minCompoundAmount">Minimum Compound Amount (USD)</Label>
            <Input
              id="minCompoundAmount"
              type="number"
              placeholder="25.00"
              value={minCompoundAmount}
              onChange={(e) => setMinCompoundAmount(e.target.value)}
            />
            <div className="text-sm text-gray-600">
              Minimum amount required to trigger auto-compound
            </div>
          </div>

          {/* Compound Frequency */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Compound Frequency</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {COMPOUND_FREQUENCIES.map((frequency) => (
                <Card
                  key={frequency.value}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    compoundFrequency === frequency.value
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setCompoundFrequency(frequency.value)}
                >
                  <CardContent className="p-3 text-center">
                    <div className={`text-lg font-bold ${getCompoundFrequencyColor(frequency.value)}`}>
                      {frequency.label}
                    </div>
                    <div className="text-sm text-gray-600">{frequency.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-sm text-gray-600">
              How often to compound your savings
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Auto-Compound Simulation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="simulationBalance">Initial Balance (USD)</Label>
              <Input
                id="simulationBalance"
                type="number"
                placeholder="1000.00"
                value={simulationBalance}
                onChange={(e) => setSimulationBalance(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="simulationTime">Time Period (days)</Label>
              <Input
                id="simulationTime"
                type="number"
                placeholder="30"
                value={simulationTime}
                onChange={(e) => setSimulationTime(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Simulation Results */}
          {simulationBalance && simulationTime > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-gray-900">
                  ${formatAmount(potentialBalance)}
                </div>
                <div className="text-sm text-gray-600">Projected Balance</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">
                    +{formatAmount(growthAmount)}
                  </div>
                  <div className="text-sm text-gray-600">Growth Amount</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">
                    +{growthPercentage.toFixed(2)}%
                  </div>
                  <div className="text-sm text-gray-600">Growth Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">
                    {getCompoundFrequencyLabel(compoundFrequency)}
                  </div>
                  <div className="text-sm text-gray-600">Frequency</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span>Initial Balance: ${simulationBalance}</span>
                  <span>Final Balance: ${formatAmount(potentialBalance)}</span>
                </div>
                <Progress 
                  value={Math.min(100, (Number(potentialBalance) / Number(simulationBalanceWei)) * 100)} 
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
            <span>Apply Auto-Compound Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-blue-900">
                    Auto-Compound: {autoCompoundEnabled ? 'Enabled' : 'Disabled'}
                  </div>
                  <div className="text-sm text-blue-700">
                    Rate: {compoundPercentage}% | Min: ${minCompoundAmount} | Frequency: {getCompoundFrequencyLabel(compoundFrequency)}
                  </div>
                </div>
                <Button
                  onClick={handleSetAutoCompoundSettings}
                  disabled={isSettingAutoCompound}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSettingAutoCompound ? (
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
            <span>How Auto-Compound Works</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <span className="font-medium">Compound Interest:</span> Your savings grow exponentially as interest is added to the principal
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <span className="font-medium">Frequency:</span> More frequent compounding leads to higher returns over time
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Target className="w-4 h-4 text-purple-600 mt-0.5" />
              <div>
                <span className="font-medium">Minimum Amount:</span> Auto-compound only triggers when your balance reaches the minimum threshold
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Zap className="w-4 h-4 text-orange-600 mt-0.5" />
              <div>
                <span className="font-medium">Gas-free:</span> All auto-compound operations happen automatically without gas costs
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
