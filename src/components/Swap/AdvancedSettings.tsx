'use client';

import { useState } from 'react';
import { SwapSettings } from '@/hooks/swap/useSwapSettings';

interface AdvancedSettingsProps {
  settings: SwapSettings;
  onUpdate: (updates: Partial<SwapSettings>) => void;
}

export function AdvancedSettings({ settings, onUpdate }: AdvancedSettingsProps) {
  const [customSlippage, setCustomSlippage] = useState(
    settings.slippageTolerance / 100
  ); // Convert basis points to percentage

  const slippagePresets = [0.1, 0.5, 1.0];

  const handleSlippageChange = (value: number) => {
    onUpdate({ slippageTolerance: value * 100 }); // Convert to basis points
    setCustomSlippage(value);
  };

  const handleCustomSlippageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      const numValue = parseFloat(value) || 0;
      setCustomSlippage(numValue);
      onUpdate({ slippageTolerance: numValue * 100 });
    }
  };

  return (
    <div className="glass-subtle rounded-2xl p-6 border border-white/10 space-y-6">
      <h3 className="text-white font-bold flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        Advanced Settings
      </h3>

      {/* Slippage Tolerance */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm text-gray-400">Slippage Tolerance</label>
          <span className="text-sm font-semibold text-white">
            {(settings.slippageTolerance / 100).toFixed(2)}%
          </span>
        </div>

        {/* Preset Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {slippagePresets.map((preset) => (
            <button
              key={preset}
              onClick={() => handleSlippageChange(preset)}
              className={`py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                settings.slippageTolerance === preset * 100
                  ? 'bg-primary-500 text-white'
                  : 'glass-subtle hover:glass-medium text-gray-300'
              }`}
            >
              {preset}%
            </button>
          ))}
          
          {/* Custom Input */}
          <div className="relative">
            <input
              type="text"
              value={customSlippage}
              onChange={handleCustomSlippageInput}
              placeholder="Custom"
              className="w-full py-2 px-2 glass-subtle rounded-lg text-sm font-semibold text-white text-center focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Warning for high slippage */}
        {settings.slippageTolerance > 100 && (
          <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="text-xs text-amber-400">
              High slippage tolerance. Your transaction may be frontrun.
            </div>
          </div>
        )}
      </div>

      {/* Transaction Deadline */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm text-gray-400">Transaction Deadline</label>
          <span className="text-sm font-semibold text-white">
            {settings.deadline} minutes
          </span>
        </div>

        <input
          type="range"
          min="2"
          max="30"
          value={settings.deadline}
          onChange={(e) => onUpdate({ deadline: Number(e.target.value) })}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, rgb(16, 185, 129) 0%, rgb(16, 185, 129) ${((settings.deadline - 2) / 28) * 100}%, rgb(55, 65, 81) ${((settings.deadline - 2) / 28) * 100}%, rgb(55, 65, 81) 100%)`
          }}
        />
        
        <div className="flex justify-between text-xs text-gray-300 mt-2">
          <span>2 min</span>
          <span>30 min</span>
        </div>
      </div>

      {/* Expert Mode Toggle */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-white mb-1">Expert Mode</div>
            <div className="text-xs text-gray-400">
              Skip confirmation screens. Use at your own risk.
            </div>
          </div>
          
          <button
            onClick={() => onUpdate({ expertMode: !settings.expertMode })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.expertMode ? 'bg-primary-500' : 'bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.expertMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {settings.expertMode && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-xs text-red-400">
                Expert mode enabled. Transactions will execute immediately without confirmation.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

