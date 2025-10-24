'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSlippageControl } from '@/hooks/useSlippageControl';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  CogIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { SlippageAction } from '@/contracts/abis/SlippageControl';

interface SlippageSettingsPanelProps {
  className?: string;
}

interface SlippagePreset {
  id: string;
  name: string;
  value: number;
  description: string;
  recommended: boolean;
}

const slippagePresets: SlippagePreset[] = [
  {
    id: 'conservative',
    name: 'Conservative',
    value: 0.1,
    description: 'Lowest slippage for maximum protection',
    recommended: false
  },
  {
    id: 'standard',
    name: 'Standard',
    value: 0.5,
    description: 'Balanced protection and execution speed',
    recommended: true
  },
  {
    id: 'aggressive',
    name: 'Aggressive',
    value: 1.0,
    description: 'Higher slippage for faster execution',
    recommended: false
  },
  {
    id: 'custom',
    name: 'Custom',
    value: 0,
    description: 'Set your own slippage tolerance',
    recommended: false
  }
];

export function SlippageSettingsPanel({ className = '' }: SlippageSettingsPanelProps) {
  const {
    userSlippageTolerance,
    setSlippageTolerance,
    setTokenSlippageTolerance,
    setSlippageAction,
    isSettingTolerance,
    isSettingTokenTolerance,
    isSettingAction,
    setToleranceError,
    setTokenToleranceError,
    setActionError
  } = useSlippageControl();

  const [selectedPreset, setSelectedPreset] = useState<string>('standard');
  const [customTolerance, setCustomTolerance] = useState<number>(0.5);
  const [tokenTolerances, setTokenTolerances] = useState<Record<string, number>>({});
  const [slippageAction, setLocalSlippageAction] = useState<SlippageAction>(SlippageAction.CONTINUE_ANYWAY);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handlePresetSelect = (preset: SlippagePreset) => {
    setSelectedPreset(preset.id);
    if (preset.id !== 'custom') {
      setCustomTolerance(preset.value);
    }
  };

  const handleSaveSettings = async () => {
    try {
      // Set global slippage tolerance
      await setSlippageTolerance({ tolerance: customTolerance * 100 }); // Convert to basis points
      
      // Set slippage action
      await setSlippageAction({ action: slippageAction });
      
      // Set token-specific tolerances
      for (const [token, tolerance] of Object.entries(tokenTolerances)) {
        if (tolerance > 0) {
          await setTokenSlippageTolerance({
            token: token as `0x${string}`,
            tolerance: tolerance * 100
          });
        }
      }
    } catch (error) {
      console.error('Failed to save slippage settings:', error);
    }
  };

  const handleTokenToleranceChange = (token: string, value: number) => {
    setTokenTolerances(prev => ({
      ...prev,
      [token]: value
    }));
  };

  const getSlippageWarningLevel = (tolerance: number): 'low' | 'medium' | 'high' | 'critical' => {
    if (tolerance <= 0.1) return 'low';
    if (tolerance <= 0.5) return 'medium';
    if (tolerance <= 1.0) return 'high';
    return 'critical';
  };

  const getWarningColor = (level: 'low' | 'medium' | 'high' | 'critical') => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
    }
  };

  const warningLevel = getSlippageWarningLevel(customTolerance);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Slippage Tolerance Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheckIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Slippage Protection</h3>
            <p className="text-muted-foreground">Configure your slippage tolerance settings</p>
          </div>
        </div>

        {/* Preset Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">Slippage Presets</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {slippagePresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedPreset === preset.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{preset.name}</span>
                    {preset.recommended && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold">{preset.value}%</span>
                </div>
                <p className="text-sm text-muted-foreground">{preset.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Tolerance */}
        {selectedPreset === 'custom' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <label className="block text-sm font-medium mb-2">
              Custom Slippage Tolerance (%)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={customTolerance}
                onChange={(e) => setCustomTolerance(parseFloat(e.target.value))}
                className="flex-1 px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <div className={`px-3 py-2 rounded-lg ${getWarningColor(warningLevel)}`}>
                <span className="text-sm font-medium capitalize">{warningLevel} Risk</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Slippage Action */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">When Slippage Exceeds Tolerance</label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer">
              <input
                type="radio"
                name="slippageAction"
                value={SlippageAction.REVERT}
                checked={slippageAction === SlippageAction.REVERT}
                onChange={(e) => setLocalSlippageAction(Number(e.target.value) as SlippageAction)}
                className="w-4 h-4 text-primary"
              />
              <div className="flex-1">
                <div className="font-medium">Revert Transaction</div>
                <div className="text-sm text-muted-foreground">
                  Cancel the transaction if slippage exceeds your tolerance
                </div>
              </div>
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
            </label>

            <label className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 cursor-pointer">
              <input
                type="radio"
                name="slippageAction"
                value={SlippageAction.CONTINUE_ANYWAY}
                checked={slippageAction === SlippageAction.CONTINUE_ANYWAY}
                onChange={(e) => setLocalSlippageAction(Number(e.target.value) as SlippageAction)}
                className="w-4 h-4 text-primary"
              />
              <div className="flex-1">
                <div className="font-medium">Continue with Higher Slippage</div>
                <div className="text-sm text-muted-foreground">
                  Execute the transaction even if slippage exceeds tolerance
                </div>
              </div>
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
            </label>
          </div>
        </div>

        {/* Advanced Settings Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
          >
            <CogIcon className="w-4 h-4" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
          </button>
        </div>

        {/* Advanced Settings */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-3">Token-Specific Tolerances</label>
                <div className="space-y-3">
                  {[
                    { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', symbol: 'USDC' },
                    { address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', symbol: 'DAI' },
                    { address: '0x4200000000000000000000000000000000000006', symbol: 'WETH' }
                  ].map((token) => (
                    <div key={token.address} className="flex items-center gap-4">
                      <div className="w-20 text-sm font-medium">{token.symbol}</div>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        step="0.1"
                        value={tokenTolerances[token.address] || 0}
                        onChange={(e) => handleTokenToleranceChange(token.address, parseFloat(e.target.value))}
                        placeholder="0.0"
                        className="flex-1 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <div className="w-8 text-sm text-muted-foreground">%</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSaveSettings}
            disabled={isSettingTolerance || isSettingTokenTolerance || isSettingAction}
            className="min-w-[120px]"
          >
            {(isSettingTolerance || isSettingTokenTolerance || isSettingAction) ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              'Save Settings'
            )}
          </Button>
        </div>

        {/* Error Display */}
        <AnimatePresence>
          {(setToleranceError || setTokenToleranceError || setActionError) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center gap-2 text-red-800">
                <ExclamationTriangleIcon className="w-4 h-4" />
                <span className="font-medium">Error Saving Settings</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                {setToleranceError?.message || setTokenToleranceError?.message || setActionError?.message || 'Failed to save slippage settings'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Current Settings Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Current Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{customTolerance}%</div>
            <div className="text-sm text-muted-foreground">Global Tolerance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {slippageAction === SlippageAction.REVERT ? 'Revert' : 'Continue Anyway'}
            </div>
            <div className="text-sm text-muted-foreground">Slippage Action</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold capitalize">{warningLevel}</div>
            <div className="text-sm text-muted-foreground">Risk Level</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
