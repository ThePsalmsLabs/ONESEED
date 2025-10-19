'use client';

import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useState } from 'react';
import { Input } from '../ui/Input';

interface PreviewCardProps {
  percentage: number;
  roundUp: boolean;
}

export function PreviewCard({ percentage, roundUp }: PreviewCardProps) {
  const [swapAmount, setSwapAmount] = useState('100');
  
  const amount = parseFloat(swapAmount) || 0;
  const basePercentage = percentage / 10000;
  let saveAmount = amount * basePercentage;
  
  if (roundUp && saveAmount % 1 !== 0) {
    saveAmount = Math.ceil(saveAmount);
  }
  
  const remainingAmount = amount - saveAmount;

  return (
    <Card variant="bordered" className="bg-gray-50">
      <CardHeader>
        <CardTitle className="text-lg">Preview Your Savings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="Example Swap Amount"
          type="number"
          value={swapAmount}
          onChange={(e) => setSwapAmount(e.target.value)}
          placeholder="100"
        />

        <div className="space-y-2">
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600">Original Amount:</span>
            <span className="font-semibold">{amount.toFixed(2)} tokens</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600">Will be Saved:</span>
            <span className="font-semibold text-primary-600">
              {saveAmount.toFixed(2)} tokens ({(basePercentage * 100).toFixed(2)}%)
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600">Remaining for Swap:</span>
            <span className="font-semibold">{remainingAmount.toFixed(2)} tokens</span>
          </div>
        </div>

        <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
          <p className="text-sm text-primary-800">
            💡 Every time you swap, {(basePercentage * 100).toFixed(2)}% will automatically go into savings
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

