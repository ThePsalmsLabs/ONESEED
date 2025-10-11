'use client';

import { SavingsTokenType } from '@/contracts/types';
import { Input } from '../ui/Input';

interface TokenTypeSelectorProps {
  value: SavingsTokenType;
  onChange: (type: SavingsTokenType) => void;
  specificToken: string;
  onSpecificTokenChange: (address: string) => void;
}

export function TokenTypeSelector({ 
  value, 
  onChange, 
  specificToken, 
  onSpecificTokenChange 
}: TokenTypeSelectorProps) {
  const options = [
    {
      type: SavingsTokenType.INPUT,
      label: 'Input Token',
      description: 'Save from the token you\'re spending',
      icon: '⬆️'
    },
    {
      type: SavingsTokenType.OUTPUT,
      label: 'Output Token',
      description: 'Save from the token you\'re receiving',
      icon: '⬇️'
    },
    {
      type: SavingsTokenType.SPECIFIC,
      label: 'Specific Token',
      description: 'Convert and save to a specific token (e.g. USDC)',
      icon: '🎯'
    }
  ];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Savings Token Type
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {options.map((option) => (
          <button
            key={option.type}
            type="button"
            onClick={() => onChange(option.type)}
            className={`
              p-4 rounded-lg border-2 text-left transition-all
              ${value === option.type
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
              }
            `}
          >
            <div className="text-2xl mb-2">{option.icon}</div>
            <h4 className="font-medium text-gray-900 mb-1">{option.label}</h4>
            <p className="text-xs text-gray-600">{option.description}</p>
          </button>
        ))}
      </div>

      {value === SavingsTokenType.SPECIFIC && (
        <Input
          label="Token Address"
          placeholder="0x..."
          value={specificToken}
          onChange={(e) => onSpecificTokenChange(e.target.value)}
          helperText="Enter the address of the token you want to save in"
        />
      )}
    </div>
  );
}

