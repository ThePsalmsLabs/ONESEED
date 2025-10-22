'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { useSlippageControl } from '@/hooks/useSlippageControl';
import { SlippageAction } from '@/contracts/abis/SlippageControl';
import { 
  Settings, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Zap,
  Target,
  DollarSign
} from 'lucide-react';

interface SlippageSettingsProps {
  onBack?: () => void;
}

const SLIPPAGE_PRESETS = [
  { value: 10, label: '0.1%', description: 'Very Low', color: 'text-green-600' },
  { value: 50, label: '0.5%', description: 'Low', color: 'text-blue-600' },
  { value: 100, label: '1%', description: 'Medium', color: 'text-yellow-600' },
  { value: 300, label: '3%', description: 'High', color: 'text-orange-600' },
  { value: 500, label: '5%', description: 'Very High', color: 'text-red-600' }
];

const SLIPPAGE_ACTIONS = [
  {
    value: SlippageAction.REVERT,
    label: 'Revert Transaction',
    description: 'Cancel the entire transaction if slippage is exceeded',
    icon: '🛑',
    color: 'text-red-600'
  },
  {
    value: SlippageAction.SKIP_SWAP,
    label: 'Skip Swap',
    description: 'Skip the swap but continue with the transaction',
    icon: '⏭️',
    color: 'text-yellow-600'
  },
  {
    value: SlippageAction.CONTINUE_ANYWAY,
    label: 'Continue Anyway',
    description: 'Proceed with the swap despite high slippage',
    icon: '⚠️',
    color: 'text-orange-600'
  },
  {
    value: SlippageAction.RETRY_WITH_HIGHER_TOLERANCE,
    label: 'Auto Retry',
    description: 'Automatically retry with higher tolerance',
    icon: '🔄',
    color: 'text-blue-600'
  }
];

export function SlippageSettings({ onBack }: SlippageSettingsProps) {
  const [globalTolerance, setGlobalTolerance] = useState(100); // 1%
  const [customTolerance, setCustomTolerance] = useState('');
  const [selectedAction, setSelectedAction] = useState(SlippageAction.REVERT);
  const [tokenSettings, setTokenSettings] = useState<Record<string, number>>({});

  const {
    setSlippageTolerance,
    setTokenSlippageTolerance,
    setSlippageAction,
    isSettingTolerance,
    isSettingTokenTolerance,
    isSettingAction,
    formatSlippage,
    parseSlippageInput,
    getSlippagePreset,
    getSlippageActionDescription,
    contractAddress
  } = useSlippageControl();

  const handleSetGlobalTolerance = async () => {
    try {
      await setSlippageTolerance({ tolerance: globalTolerance });
    } catch (error) {
      console.error('Failed to set global slippage tolerance:', error);
    }
  };

  const handleSetCustomTolerance = async () => {
    if (!customTolerance) return;
    try {
      const toleranceBps = parseSlippageInput(customTolerance);
      await setSlippageTolerance({ tolerance: toleranceBps });
    } catch (error) {
      console.error('Failed to set custom slippage tolerance:', error);
    }
  };

  const handleSetAction = async () => {
    try {
      await setSlippageAction({ action: selectedAction });
    } catch (error) {
      console.error('Failed to set slippage action:', error);
    }
  };

  const handleSetTokenTolerance = async (token: string, tolerance: number) => {
    try {
      await setTokenSlippageTolerance({ 
        token: token as `0x${string}`, 
        tolerance 
      });
    } catch (error) {
      console.error('Failed to set token slippage tolerance:', error);
    }
  };

  const getToleranceColor = (tolerance: number) => {
    if (tolerance <= 10) return 'text-green-600';
    if (tolerance <= 50) return 'text-blue-600';
    if (tolerance <= 100) return 'text-yellow-600';
    if (tolerance <= 300) return 'text-orange-600';
    return 'text-red-600';
  };

  const getToleranceVariant = (tolerance: number): 'success' | 'info' | 'warning' | 'error' | 'default' => {
    if (tolerance <= 10) return 'success';
    if (tolerance <= 50) return 'info';
    if (tolerance <= 100) return 'warning';
    if (tolerance <= 300) return 'warning';
    return 'error';
  };

  const getActionIcon = (action: SlippageAction) => {
    return SLIPPAGE_ACTIONS.find(a => a.value === action)?.icon || '⚙️';
  };

  const getActionColor = (action: SlippageAction) => {
    return SLIPPAGE_ACTIONS.find(a => a.value === action)?.color || 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Slippage Protection Settings</h2>
          <p className="text-gray-600">Configure how your swaps handle price slippage</p>
        </div>
        {onBack && (
          <Button variant="secondary" onClick={onBack}>
            Back to Dashboard
          </Button>
        )}
      </div>

      {/* Global Slippage Tolerance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Global Slippage Tolerance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Default Slippage Tolerance</Label>
            <p className="text-sm text-gray-600">
              This is your default slippage tolerance for all swaps. Higher tolerance means more price movement is acceptable.
            </p>

            {/* Preset Options */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {SLIPPAGE_PRESETS.map((preset) => (
                <Card
                  key={preset.value}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    globalTolerance === preset.value
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setGlobalTolerance(preset.value)}
                >
                  <CardContent className="p-3 text-center">
                    <div className={`text-lg font-bold ${preset.color}`}>
                      {preset.label}
                    </div>
                    <div className="text-sm text-gray-600">{preset.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Custom Input */}
            <div className="space-y-2">
              <Label htmlFor="customTolerance">Custom Tolerance (%)</Label>
              <div className="flex space-x-2">
                <Input
                  id="customTolerance"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="50"
                  placeholder="1.00"
                  value={customTolerance}
                  onChange={(e) => setCustomTolerance(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="secondary"
                  onClick={handleSetCustomTolerance}
                  disabled={!customTolerance || isSettingTolerance}
                >
                  Set Custom
                </Button>
              </div>
            </div>

            {/* Current Setting */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-blue-900">
                    Current Global Tolerance: {formatSlippage(globalTolerance)}
                  </div>
                  <div className="text-sm text-blue-700">
                    {getSlippagePreset(globalTolerance)} risk level
                  </div>
                </div>
                <Button
                  onClick={handleSetGlobalTolerance}
                  disabled={isSettingTolerance}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSettingTolerance ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Setting...
                    </>
                  ) : (
                    <>
                      <Settings className="w-4 h-4 mr-2" />
                      Apply
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Slippage Action */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Slippage Action</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Choose what happens when slippage exceeds your tolerance during a swap.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SLIPPAGE_ACTIONS.map((action) => (
              <Card
                key={action.value}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedAction === action.value
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedAction(action.value)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{action.icon}</span>
                    <div className="flex-1">
                      <div className={`font-medium ${action.color}`}>
                        {action.label}
                      </div>
                      <div className="text-sm text-gray-600">
                        {action.description}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Current Action */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-green-900">
                  Current Action: {getSlippageActionDescription(selectedAction)}
                </div>
                <div className="text-sm text-green-700">
                  {getActionIcon(selectedAction)} {SLIPPAGE_ACTIONS.find(a => a.value === selectedAction)?.label}
                </div>
              </div>
              <Button
                onClick={handleSetAction}
                disabled={isSettingAction}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSettingAction ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Setting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Apply
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Token-Specific Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Token-Specific Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Set different slippage tolerances for specific tokens. Useful for volatile tokens that need higher tolerance.
          </p>

          <div className="space-y-4">
            {[
              { symbol: 'USDC', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', defaultTolerance: 50 },
              { symbol: 'ETH', address: '0x4200000000000000000000000000000000000006', defaultTolerance: 100 },
              { symbol: 'USDbC', address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', defaultTolerance: 50 }
            ].map((token) => {
              const currentTolerance = tokenSettings[token.address] || token.defaultTolerance;
              
              return (
                <div key={token.address} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium text-gray-900">{token.symbol}</div>
                      <div className="text-sm text-gray-600">{token.address}</div>
                    </div>
                    <Badge variant={getToleranceVariant(currentTolerance)}>
                      {formatSlippage(currentTolerance)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {SLIPPAGE_PRESETS.map((preset) => (
                      <Button
                        key={preset.value}
                        variant={currentTolerance === preset.value ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => {
                          setTokenSettings(prev => ({
                            ...prev,
                            [token.address]: preset.value
                          }));
                          handleSetTokenTolerance(token.address, preset.value);
                        }}
                        disabled={isSettingTokenTolerance}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>Settings Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatSlippage(globalTolerance)}
              </div>
              <div className="text-sm text-gray-600">Global Tolerance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {getActionIcon(selectedAction)}
              </div>
              <div className="text-sm text-gray-600">Slippage Action</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(tokenSettings).length}
              </div>
              <div className="text-sm text-gray-600">Token Overrides</div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Gas-free configuration</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-600" />
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
            <span>Slippage Protection Help</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div>
                <span className="font-medium">Low Tolerance (0.1-0.5%):</span> Best for stable tokens like USDC, but may cause failed transactions during high volatility.
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <span className="font-medium">Medium Tolerance (1%):</span> Good balance for most tokens and market conditions.
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 text-orange-600 mt-0.5" />
              <div>
                <span className="font-medium">High Tolerance (3-5%):</span> Necessary for volatile tokens or during high market volatility.
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Settings className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <span className="font-medium">Slippage Actions:</span> Choose how to handle exceeded slippage - revert, skip, continue, or auto-retry.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

