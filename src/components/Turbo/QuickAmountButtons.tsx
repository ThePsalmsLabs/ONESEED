'use client';

import { formatUnits, parseUnits } from 'viem';

interface QuickAmountButtonsProps {
  balance: bigint;
  decimals: number;
  onAmountSelect: (amount: string) => void;
  tokenSymbol?: string;
}

const PRESET_PERCENTAGES = [
  { label: '25%', value: 0.25 },
  { label: '50%', value: 0.5 },
  { label: '75%', value: 0.75 },
  { label: 'MAX', value: 1 },
];

export function QuickAmountButtons({ balance, decimals, onAmountSelect, tokenSymbol }: QuickAmountButtonsProps) {
  const handlePresetClick = (percentage: number) => {
    const amount = (balance * BigInt(Math.floor(percentage * 1000))) / BigInt(1000);
    const formatted = formatUnits(amount, decimals);
    onAmountSelect(formatted);
  };
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400">Quick:</span>
      {PRESET_PERCENTAGES.map(preset => (
        <button
          key={preset.label}
          onClick={() => handlePresetClick(preset.value)}
          disabled={balance === BigInt(0)}
          className="px-3 py-1 glass-subtle hover:glass-medium rounded-lg text-xs font-medium text-primary-300 hover:text-primary-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}

