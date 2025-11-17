'use client';

import { Button } from './Button';
import { Card, CardContent } from './Card';
import { 
  ExclamationTriangleIcon, 
  ArrowPathIcon, 
  WifiIcon,
  ExclamationCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isLoading?: boolean;
  showContactSupport?: boolean;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error while loading your data.',
  onRetry,
  isLoading = false,
  showContactSupport = true,
  className = ''
}: ErrorStateProps) {
  return (
    <Card className={`border-red-200 bg-red-50 ${className}`}>
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-800">{title}</h3>
            <p className="text-sm text-red-600 max-w-md">{message}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {onRetry && (
              <Button
                onClick={onRetry}
                disabled={isLoading}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                {isLoading ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <ArrowPathIcon className="w-4 h-4 mr-2" />
                    Try Again
                  </>
                )}
              </Button>
            )}
            
            {showContactSupport && (
              <Button
                variant="ghost"
                className="text-red-600 hover:text-red-700 hover:bg-red-100"
                onClick={() => window.open('mailto:support@spendsave.io', '_blank')}
              >
                Contact Support
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = 'No data available',
  message = 'There\'s nothing to show here yet.',
  actionLabel,
  onAction,
  icon,
  className = ''
}: EmptyStateProps) {
  return (
    <Card className={`border-gray-200 bg-gray-50 ${className}`}>
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            {icon || <InformationCircleIcon className="w-6 h-6 text-gray-400" />}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600 max-w-md">{message}</p>
          </div>

          {actionLabel && onAction && (
            <Button
              onClick={onAction}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface NetworkErrorStateProps {
  onRetry?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function NetworkErrorState({
  onRetry,
  isLoading = false,
  className = ''
}: NetworkErrorStateProps) {
  return (
    <ErrorState
      title="Network Error"
      message="Unable to connect to the blockchain. Please check your network connection and try again."
      onRetry={onRetry}
      isLoading={isLoading}
      showContactSupport={false}
      className={className}
    />
  );
}

interface ContractErrorStateProps {
  contractName?: string;
  onRetry?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function ContractErrorState({
  contractName = 'contract',
  onRetry,
  isLoading = false,
  className = ''
}: ContractErrorStateProps) {
  return (
    <ErrorState
      title={`${contractName} Error`}
      message={`Failed to interact with the ${contractName}. This might be a temporary issue.`}
      onRetry={onRetry}
      isLoading={isLoading}
      className={className}
    />
  );
}

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = 'Loading...',
  className = ''
}: LoadingStateProps) {
  return (
    <Card className={`border-gray-200 bg-gray-50 ${className}`}>
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <ArrowPathIcon className="w-4 h-4 text-gray-400 animate-spin" />
          </div>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
