'use client';

import { Card } from '../ui/Card';
import { formatUnits } from 'viem';

interface TimelockWarningProps {
  penalty: bigint;
  penaltyPercentage: number;
  actualAmount: bigint;
  decimals: number;
  onForceChange: (forced: boolean) => void;
  forced: boolean;
}

export function TimelockWarning({
  penalty,
  penaltyPercentage,
  actualAmount,
  decimals,
  onForceChange,
  forced
}: TimelockWarningProps) {
  return (
    <Card variant="bordered" padding="md" className="bg-yellow-50 border-yellow-300">
      <div className="flex gap-3">
        <div className="flex-shrink-0 text-2xl">⚠️</div>
        <div className="flex-1 space-y-3">
          <div>
            <h4 className="font-semibold text-yellow-900 mb-1">
              Early Withdrawal Penalty
            </h4>
            <p className="text-sm text-yellow-800">
              Your savings are still in the timelock period. Withdrawing now will incur a penalty.
            </p>
          </div>

          <div className="bg-white rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Penalty:</span>
              <span className="font-semibold text-red-600">
                {formatUnits(penalty, decimals)} tokens ({penaltyPercentage.toFixed(1)}%)
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">You will receive:</span>
              <span className="font-semibold text-gray-900">
                {formatUnits(actualAmount, decimals)} tokens
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="force-withdraw"
              checked={forced}
              onChange={(e) => onForceChange(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="force-withdraw" className="text-sm text-yellow-900 cursor-pointer">
              I understand and want to proceed with early withdrawal
            </label>
          </div>
        </div>
      </div>
    </Card>
  );
}

