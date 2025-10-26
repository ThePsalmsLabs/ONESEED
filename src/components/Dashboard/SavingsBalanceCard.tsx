'use client';

import { useSavingsBalanceRealtime } from '@/hooks/useSavingsBalanceRealtime';
import { useTokenSavingsBalance } from '@/hooks/useSavingsBalanceRealtime';
import { useTokenPrice } from '@/hooks/swap/useTokenPrice';
import { useTokenMetadata } from '@/hooks/useTokenMetadata';
import { formatUnits } from 'viem';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  BanknotesIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { BASE_SEPOLIA_TOKENS } from '@/config/network';

interface SavingsBalanceCardProps {
  className?: string;
  onWithdraw?: (token: string, amount: string) => void;
}

// Helper component for individual token balance with real price feeds and metadata
function TokenBalanceItem({ 
  balance, 
  onWithdraw 
}: { 
  balance: any; 
  onWithdraw?: (token: string, amount: string) => void; 
}) {
  const { priceUSD, isLoading: priceLoading } = useTokenPrice({ 
    tokenAddress: balance.token as `0x${string}` 
  });
  
  const { metadata, isLoading: metadataLoading } = useTokenMetadata(
    balance.token as `0x${string}`
  );

  const formatBalance = (amount: bigint, decimals: number) => {
    try {
      return formatUnits(amount, decimals);
    } catch {
      return '0';
    }
  };

  const formatUSD = (amount: string, price: number) => {
    const numAmount = parseFloat(amount);
    return (numAmount * price).toFixed(2);
  };

  const formattedAmount = formatBalance(balance.amount, balance.decimals);
  const usdValue = priceLoading ? '...' : formatUSD(formattedAmount, priceUSD);
  
  // Use metadata if available, fallback to balance data
  const tokenSymbol = metadata?.symbol || balance.symbol;
  const tokenName = metadata?.name || 'Unknown Token';
  const displaySymbol = tokenSymbol || 'UNK';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-3 bg-white/50 rounded-lg"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span className="text-primary-600 font-bold text-sm">
            {displaySymbol.charAt(0)}
          </span>
        </div>
        <div>
          <div className="font-semibold text-gray-800">
            {formattedAmount} {displaySymbol}
          </div>
          <div className="text-sm text-gray-500">
            {metadataLoading ? 'Loading...' : tokenName}
          </div>
          <div className="text-xs text-gray-400">
            ~${usdValue}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {onWithdraw && balance.amount > BigInt(0) && (
          <Button
            onClick={() => onWithdraw(balance.token, formattedAmount)}
            size="sm"
            variant="outline"
            className="text-primary-600 border-primary-300 hover:bg-primary-50"
          >
            Withdraw
          </Button>
        )}
        
        <Button
          onClick={() => window.open(`https://sepolia.basescan.org/address/${balance.token}`, '_blank')}
          size="sm"
          variant="ghost"
          className="text-gray-400 hover:text-gray-600"
        >
          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

export function SavingsBalanceCard({ className = '', onWithdraw }: SavingsBalanceCardProps) {
  const { 
    balances, 
    totalBalance, 
    isLoading, 
    error, 
    refreshSavings,
    lastUpdate 
  } = useSavingsBalanceRealtime();

  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div>
              <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`p-6 border-red-200 bg-red-50 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-600 text-sm">!</span>
          </div>
          <h3 className="text-lg font-semibold text-red-800">
            Error Loading Savings
          </h3>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <Button
          onClick={() => refreshSavings()}
          variant="outline"
          size="sm"
          className="border-red-300 text-red-600 hover:bg-red-50"
        >
          <ArrowPathIcon className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </Card>
    );
  }

  const hasSavings = balances && balances.length > 0 && totalBalance && totalBalance > BigInt(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="p-6 border-primary-200 bg-primary-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <BanknotesIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-800">
                💰 Your Savings
              </h3>
              <p className="text-sm text-primary-600">
                Automatically saved from swaps
              </p>
            </div>
          </div>
          
          <Button
            onClick={() => refreshSavings()}
            variant="outline"
            size="sm"
            className="border-primary-300 text-primary-600 hover:bg-primary-50"
          >
            <ArrowPathIcon className="w-4 h-4" />
          </Button>
        </div>

        {!hasSavings ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BanknotesIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-600 mb-2">
              No Savings Yet
            </h4>
            <p className="text-gray-500 mb-4">
              Start swapping to see your automatic savings accumulate
            </p>
            <Button
              onClick={() => window.location.href = '/swap'}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              Go to Swap
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Total Balance */}
            <div className="text-center py-4 bg-white/50 rounded-lg">
              <div className="text-3xl font-bold text-primary-800 mb-1">
                {balances?.length || 0} Token{(balances?.length || 0) !== 1 ? 's' : ''} Saved
              </div>
              <div className="text-sm text-primary-600">
                Last updated: {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'Never'}
              </div>
            </div>

            {/* Individual Token Balances */}
            <div className="space-y-3">
              {balances?.map((balance, index) => (
                <TokenBalanceItem
                  key={balance.token}
                  balance={balance}
                  onWithdraw={onWithdraw}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-primary-200">
              <Button
                onClick={() => window.location.href = '/swap'}
                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
              >
                <BanknotesIcon className="w-4 h-4 mr-2" />
                Swap & Save More
              </Button>
              
              <Button
                onClick={() => window.location.href = '/withdraw'}
                variant="outline"
                className="border-primary-300 text-primary-600 hover:bg-primary-50"
              >
                View All
              </Button>
            </div>
          </div>
        )}

        {/* Proof Badge */}
        <div className="mt-4 pt-4 border-t border-primary-200">
          <div className="flex items-center gap-2 text-xs text-primary-600">
            <CheckCircleIcon className="w-4 h-4" />
            <span>✅ PROVEN ON BASE SEPOLIA</span>
            <button
              onClick={() => window.open('https://sepolia.basescan.org/tx/0x9b4c9fb480cbaf762d23971169f58accbb5ad0f8e2bc27d02b92de1232e9949c', '_blank')}
              className="text-primary-500 hover:text-primary-700 underline"
            >
              View Proof
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Compact version for smaller spaces
export function SavingsBalanceCardCompact({ className = '' }: { className?: string }) {
  const { balances, totalBalance, isLoading } = useSavingsBalanceRealtime();

  if (isLoading) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        Loading savings...
      </div>
    );
  }

  if (!balances || balances.length === 0 || !totalBalance || totalBalance === BigInt(0)) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        No savings yet
      </div>
    );
  }

  return (
    <div className={`text-sm text-primary-600 ${className}`}>
      💰 {balances.length} token{balances.length !== 1 ? 's' : ''} saved
    </div>
  );
}
