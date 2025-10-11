'use client';

import { Card, CardContent } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';

interface SavingsOverviewProps {
  totalBalance: bigint;
  tokenCount: number;
  isLoading: boolean;
}

export function SavingsOverview({ tokenCount, isLoading }: SavingsOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map(i => (
          <Card key={i} padding="md">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32" />
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Savings',
      value: `${tokenCount} Token${tokenCount !== 1 ? 's' : ''}`,
      icon: '💰',
      color: 'text-primary-600'
    },
    {
      label: 'Savings Goal',
      value: 'Set Goal',
      icon: '🎯',
      color: 'text-blue-600'
    },
    {
      label: 'This Month',
      value: 'Track Soon',
      icon: '📈',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} variant="elevated" padding="md">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

