'use client';

import { useState } from 'react';
import { Input } from '../ui/Input';

interface AdvancedSettingsProps {
  autoIncrement: number;
  maxPercentage: number;
  roundUp: boolean;
  goalAmount: string;
  onAutoIncrementChange: (value: number) => void;
  onMaxPercentageChange: (value: number) => void;
  onRoundUpChange: (value: boolean) => void;
  onGoalAmountChange: (value: string) => void;
}

export function AdvancedSettings({
  autoIncrement,
  maxPercentage,
  roundUp,
  goalAmount,
  onAutoIncrementChange,
  onMaxPercentageChange,
  onRoundUpChange,
  onGoalAmountChange
}: AdvancedSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-t border-gray-200 pt-4">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-sm font-medium text-gray-700">
          Advanced Settings
        </span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Auto Increment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auto-Increment ({(autoIncrement / 100).toFixed(2)}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={autoIncrement}
              onChange={(e) => onAutoIncrementChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
            <p className="text-xs text-gray-600 mt-1">
              Gradually increase your savings percentage after each swap
            </p>
          </div>

          {/* Max Percentage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Percentage ({(maxPercentage / 100).toFixed(2)}%)
            </label>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={maxPercentage}
              onChange={(e) => onMaxPercentageChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
            <p className="text-xs text-gray-600 mt-1">
              Cap your savings percentage at this maximum value
            </p>
          </div>

          {/* Round Up */}
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Round Up Savings
              </label>
              <p className="text-xs text-gray-600 mt-1">
                Round fractional savings amounts up to the nearest whole number
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRoundUpChange(!roundUp)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${roundUp ? 'bg-primary-500' : 'bg-gray-200'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${roundUp ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>

          {/* Goal Amount */}
          <Input
            label="Savings Goal (Optional)"
            type="number"
            placeholder="1000"
            value={goalAmount}
            onChange={(e) => onGoalAmountChange(e.target.value)}
            helperText="Set a target amount you want to save"
          />
        </div>
      )}
    </div>
  );
}

