'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { useTokenMetadataBatch } from '@/hooks/useTokenMetadata';
import { getExplorerUrl } from '@/utils/transactions';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  ClockIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { formatDistance } from 'date-fns';

interface ActivityFeedProps {
  className?: string;
  limit?: number;
}

export function ActivityFeed({ className = '', limit }: ActivityFeedProps) {
  const { activities, isLoading, refetch } = useActivityFeed();
  const chainId = useActiveChainId();
  const [filter, setFilter] = useState<'all' | 'save' | 'withdraw' | 'dca' | 'strategy'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get unique tokens from activities
  const tokenAddresses = useMemo(
    () => Array.from(new Set(activities.map(a => a.token).filter(t => t !== '0x0'))) as `0x${string}`[],
    [activities]
  );
  const { metadata } = useTokenMetadataBatch(tokenAddresses);
  const tokenMetadata = metadata as Record<string, { symbol: string; name: string; decimals: number; address: `0x${string}` } | undefined>;

  // Filter and limit activities
  const filteredActivities = useMemo(() => {
    let filtered = activities;

    if (filter !== 'all') {
      filtered = filtered.filter(a => a.type === filter);
    }

    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [activities, filter, limit]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Get icon for activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'save':
        return <CurrencyDollarIcon className="w-5 h-5 text-green-600" />;
      case 'withdraw':
        return <ArrowTrendingDownIcon className="w-5 h-5 text-orange-600" />;
      case 'dca':
        return <ArrowTrendingUpIcon className="w-5 h-5 text-blue-600" />;
      case 'strategy':
        return <CheckCircleIcon className="w-5 h-5 text-purple-600" />;
      case 'daily_save':
        return <ClockIcon className="w-5 h-5 text-teal-600" />;
      default:
        return <CheckCircleIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  // Get background color for activity type
  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'save':
        return 'bg-green-50';
      case 'withdraw':
        return 'bg-orange-50';
      case 'dca':
        return 'bg-blue-50';
      case 'strategy':
        return 'bg-purple-50';
      case 'daily_save':
        return 'bg-teal-50';
      default:
        return 'bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Activity Feed</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex items-start gap-3 p-3 rounded-lg bg-gray-100">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (filteredActivities.length === 0) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Activity Feed</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <div className="text-center py-12">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-gray-600">No activity yet</p>
          <p className="text-sm text-gray-500 mt-1">Your transactions will appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-primary text-white' : ''}
          >
            All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {(['all', 'save', 'withdraw', 'dca', 'strategy'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
              filter === f
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredActivities.map((activity, index) => {
          const tokenSymbol = activity.token !== '0x0' && tokenMetadata
            ? (tokenMetadata[activity.token as `0x${string}`]?.symbol || 'TOKEN')
            : 'TOKEN';

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-start gap-3 p-3 rounded-lg ${getActivityBgColor(activity.type)}`}
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">
                      {activity.description}
                    </p>
                    {activity.token !== '0x0' && (
                      <p className="text-sm text-gray-600 mt-0.5">
                        {activity.amountFormatted} {tokenSymbol}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                      activity.status === 'success'
                        ? 'bg-green-100 text-green-800'
                        : activity.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>

                {/* Timestamp & Link */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">
                    {formatDistance(new Date(activity.timestamp * 1000), new Date(), {
                      addSuffix: true
                    })}
                  </span>
                  {activity.hash && (
                    <>
                      <span className="text-gray-300">•</span>
                      <a
                        href={`${getExplorerUrl(chainId, activity.hash as `0x${string}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View tx
                      </a>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* View More Button */}
      {limit && activities.length > limit && (
        <div className="mt-4 text-center">
          <Button variant="ghost" size="sm">
            View all activity ({activities.length})
          </Button>
        </div>
      )}
    </Card>
  );
}
