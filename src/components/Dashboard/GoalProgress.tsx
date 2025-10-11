'use client';

import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface GoalProgressProps {
  currentAmount: bigint;
  goalAmount: bigint;
  tokenSymbol?: string;
}

export function GoalProgress({ currentAmount, goalAmount, tokenSymbol = 'tokens' }: GoalProgressProps) {
  const progress = goalAmount > BigInt(0)
    ? Math.min((Number(currentAmount) / Number(goalAmount)) * 100, 100)
    : 0;

  if (goalAmount === BigInt(0)) {
    return null; // Don't show if no goal set
  }

  return (
    <Card variant="elevated" padding="md">
      <CardHeader>
        <CardTitle>Savings Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-primary-600">
                {progress.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {currentAmount.toString()} / {goalAmount.toString()} {tokenSymbol}
              </p>
            </div>
            <div className="text-4xl">🎯</div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {progress >= 100 && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
              <p className="text-sm font-medium text-primary-700">
                🎉 Congratulations! You&apos;ve reached your goal!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

