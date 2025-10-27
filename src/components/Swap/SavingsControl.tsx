'use client';

import { useSavingsSuggestion } from '@/hooks/swap/useSavingsCalculation';

interface SavingsControlProps {
  percentage: number;
  onChange: (percentage: number) => void;
  tradeValueUSD: number;
}

export function SavingsControl({ percentage, onChange, tradeValueUSD }: SavingsControlProps) {
  const suggestedPercentage = useSavingsSuggestion(tradeValueUSD);
  const presets = [5, 10, 15, 20];

  return (
    <div className="glass-neon rounded-2xl p-6 border border-primary-400/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌱</span>
          <h3 className="text-white font-bold">Automatic Savings</h3>
        </div>
        <div className="text-2xl font-black text-primary-400">
          {percentage}%
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-4">
        Choose how much of each trade to automatically save
        <br />
        <span className="text-xs text-yellow-400">
          ⚠️ This will override your configured strategy from the Configure page
        </span>
      </p>

      {/* Slider */}
      <div className="mb-6">
        <input
          type="range"
          min="1"
          max="20"
          value={percentage}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, rgb(16, 185, 129) 0%, rgb(16, 185, 129) ${percentage * 5}%, rgb(55, 65, 81) ${percentage * 5}%, rgb(55, 65, 81) 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-300 mt-2">
          <span>1%</span>
          <span>20%</span>
        </div>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => onChange(preset)}
            className={`py-2 rounded-lg font-semibold transition-all duration-200 ${
              percentage === preset
                ? 'bg-gradient-to-r from-primary-500 to-accent-cyan text-white shadow-lg'
                : 'glass-subtle hover:glass-medium text-gray-300'
            }`}
          >
            {preset}%
          </button>
        ))}
      </div>

      {/* Smart Suggestion */}
      {suggestedPercentage !== percentage && tradeValueUSD > 0 && (
        <button
          onClick={() => onChange(suggestedPercentage)}
          className="w-full p-3 glass-subtle hover:glass-medium rounded-lg flex items-center justify-between transition-all duration-200 group"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">💡</span>
            <span className="text-sm text-gray-300">
              Smart suggestion: <span className="text-primary-400 font-semibold">{suggestedPercentage}%</span>
            </span>
          </div>
          <svg className="w-4 h-4 text-gray-400 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

