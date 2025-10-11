'use client';

import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface Activity {
  id: string;
  type: 'save' | 'withdraw' | 'dca';
  amount: string;
  token: string;
  timestamp: Date;
}

interface RecentActivityProps {
  activities?: Activity[];
}

export function RecentActivity({ activities = [] }: RecentActivityProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'save': return '💰';
      case 'withdraw': return '⬆️';
      case 'dca': return '🔄';
    }
  };

  const getActivityLabel = (type: Activity['type']) => {
    switch (type) {
      case 'save': return 'Saved';
      case 'withdraw': return 'Withdrawn';
      case 'dca': return 'DCA Executed';
    }
  };

  if (activities.length === 0) {
    return (
      <Card variant="bordered" padding="md">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-4xl mb-2">📊</p>
            <p className="text-gray-600">No activity yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Your savings history will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="bordered" padding="md">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                <div>
                  <p className="font-medium text-gray-900">
                    {getActivityLabel(activity.type)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {activity.timestamp.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {activity.amount} {activity.token}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

