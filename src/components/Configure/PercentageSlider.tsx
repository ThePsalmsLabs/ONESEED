'use client';

interface PercentageSliderProps {
  value: number; // in basis points (100 = 1%)
  onChange: (value: number) => void;
}

export function PercentageSlider({ value, onChange }: PercentageSliderProps) {
  const percentageDisplay = (value / 100).toFixed(2);

  const presets = [
    { label: '1%', value: 100 },
    { label: '5%', value: 500 },
    { label: '10%', value: 1000 },
    { label: '20%', value: 2000 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Savings Percentage
        </label>
        <span className="text-3xl font-bold text-primary-600">
          {percentageDisplay}%
        </span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min="0"
        max="10000"
        step="10"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
      />

      {/* Presets */}
      <div className="flex gap-2">
        {presets.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => onChange(preset.value)}
            className={`
              px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${value === preset.value
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-600">
        This percentage will be automatically saved from each swap
      </p>
    </div>
  );
}

