'use client';

import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { getExplorerUrl } from '@/utils/transactions';
import { useActiveChainId } from '@/hooks/useActiveChainId';

interface ActivityItem {
  id: string;
  type: 'swap' | 'save' | 'withdraw' | 'config';
  description: string;
  amount?: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'failed';
  txHash?: string;
}

interface ActivityTimelineProps {
  activities: ActivityItem[];
  isLoading?: boolean;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'swap':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      );
    case 'save':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'withdraw':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case 'config':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success':
      return 'text-success';
    case 'pending':
      return 'text-warning';
    case 'failed':
      return 'text-error';
    default:
      return 'text-text-muted';
  }
};

export function ActivityTimeline({ activities, isLoading = false }: ActivityTimelineProps) {
  const chainId = useActiveChainId();
  if (isLoading) {
    return (
      <div className="glass-solid-dark rounded-2xl p-6 border border-border">
        <div className="h-6 bg-bg-tertiary rounded w-1/3 mb-6 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 bg-bg-tertiary rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-bg-tertiary rounded w-3/4 mb-2" />
                <div className="h-3 bg-bg-tertiary rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="glass-solid-dark rounded-2xl p-8 border border-border text-center">
        <div className="w-16 h-16 bg-bg-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">No Activity Yet</h3>
        <p className="text-sm text-text-muted">
          Your transaction history will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="glass-solid-dark rounded-2xl p-6 border border-border">
      <h3 className="text-lg font-semibold text-text-primary mb-6">
        Recent Activity
      </h3>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex gap-4 items-start group cursor-pointer hover:bg-bg-tertiary/30 rounded-lg p-3 -ml-3 transition-colors duration-200"
          >
            {/* Icon */}
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.status === 'success'
                  ? 'bg-success/20 text-success'
                  : activity.status === 'pending'
                  ? 'bg-warning/20 text-warning'
                  : 'bg-error/20 text-error'
              }`}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              {getIcon(activity.type)}
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm font-medium text-text-primary">
                  {activity.description}
                </p>
                {activity.amount && (
                  <span className="text-sm font-semibold text-primary-400 whitespace-nowrap">
                    {activity.amount}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span>{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</span>
                <span>•</span>
                <span className={getStatusColor(activity.status)}>
                  {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                </span>
                {activity.txHash && (
                  <>
                    <span>•</span>
                    <a
                      href={`${getExplorerUrl(chainId, activity.txHash)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Tx
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Arrow indicator */}
            <motion.div
              className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ x: 4 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* View all link */}
      <motion.button
        className="w-full mt-4 pt-4 border-t border-border text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
        whileHover={{ x: 4 }}
      >
        View all activity →
      </motion.button>
    </div>
  );
}


