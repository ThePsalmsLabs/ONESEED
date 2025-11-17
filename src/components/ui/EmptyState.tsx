'use client';

import { Button } from './Button';
import { Card, CardContent } from './Card';
import { 
  InformationCircleIcon,
  PlusIcon,
  ChartBarIcon,
  WalletIcon,
  CogIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'action' | 'info' | 'warning';
}

export function EmptyState({
  title = 'No data available',
  message = 'There\'s nothing to show here yet.',
  actionLabel,
  onAction,
  icon,
  className = '',
  variant = 'default'
}: EmptyStateProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'action':
        return {
          card: 'border-blue-200 bg-blue-50',
          icon: 'bg-blue-100 text-blue-600',
          title: 'text-blue-800',
          message: 'text-blue-600',
          button: 'border-blue-300 text-blue-700 hover:bg-blue-100'
        };
      case 'info':
        return {
          card: 'border-gray-200 bg-gray-50',
          icon: 'bg-gray-100 text-gray-600',
          title: 'text-gray-800',
          message: 'text-gray-600',
          button: 'border-gray-300 text-gray-700 hover:bg-gray-100'
        };
      case 'warning':
        return {
          card: 'border-yellow-200 bg-yellow-50',
          icon: 'bg-yellow-100 text-yellow-600',
          title: 'text-yellow-800',
          message: 'text-yellow-600',
          button: 'border-yellow-300 text-yellow-700 hover:bg-yellow-100'
        };
      default:
        return {
          card: 'border-gray-200 bg-gray-50',
          icon: 'bg-gray-100 text-gray-400',
          title: 'text-gray-800',
          message: 'text-gray-600',
          button: 'border-gray-300 text-gray-700 hover:bg-gray-100'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Card className={`${styles.card} ${className}`}>
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className={`w-12 h-12 rounded-full ${styles.icon} flex items-center justify-center`}>
            {icon || <InformationCircleIcon className="w-6 h-6" />}
          </div>
          
          <div className="space-y-2">
            <h3 className={`text-lg font-semibold ${styles.title}`}>{title}</h3>
            <p className={`text-sm ${styles.message} max-w-md`}>{message}</p>
          </div>

          {actionLabel && onAction && (
            <Button
              onClick={onAction}
              variant="outline"
              className={styles.button}
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Predefined empty states for common scenarios
export function NoSavingsEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      title="No Savings Yet"
      message="Start saving by configuring your savings strategy. Set a percentage to automatically save from your swaps."
      actionLabel="Configure Savings"
      onAction={onAction}
      icon={<ChartBarIcon className="w-6 h-6" />}
      variant="action"
    />
  );
}

export function NoDCAEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      title="No DCA Strategy"
      message="Set up dollar-cost averaging to automatically invest in your favorite tokens over time."
      actionLabel="Setup DCA"
      onAction={onAction}
      icon={<ChartBarIcon className="w-6 h-6" />}
      variant="action"
    />
  );
}

export function NoWithdrawalsEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      title="No Withdrawals"
      message="You haven't made any withdrawals yet. Your savings are safely stored in the protocol."
      actionLabel="View Savings"
      onAction={onAction}
      icon={<WalletIcon className="w-6 h-6" />}
      variant="info"
    />
  );
}

export function NoHistoryEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      title="No History Available"
      message="Transaction history will appear here once you start using the protocol."
      actionLabel="Get Started"
      onAction={onAction}
      icon={<ChartBarIcon className="w-6 h-6" />}
      variant="info"
    />
  );
}

export function NoStrategiesEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      title="No Strategies Configured"
      message="Create your first savings strategy to start building wealth automatically."
      actionLabel="Create Strategy"
      onAction={onAction}
      icon={<CogIcon className="w-6 h-6" />}
      variant="action"
    />
  );
}

export function NoAnalyticsEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      title="Analytics Coming Soon"
      message="Detailed analytics will be available once you have some transaction history."
      actionLabel="Start Trading"
      onAction={onAction}
      icon={<ChartBarIcon className="w-6 h-6" />}
      variant="info"
    />
  );
}