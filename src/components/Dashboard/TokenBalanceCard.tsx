'use client';

import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatUnits } from 'viem';
import { useRouter } from 'next/navigation';
import type { TokenBalance } from '@/contracts/types';

interface TokenBalanceCardProps {
  balance: TokenBalance;
}

export function TokenBalanceCard({ balance }: TokenBalanceCardProps) {
  const router = useRouter();
  
  // Format token address for display
  const shortAddress = `${balance.token.slice(0, 6)}...${balance.token.slice(-4)}`;
  
  // Format balance with proper decimals (assuming 18 for now)
  const decimals = balance.decimals || 18;
  const formattedAmount = parseFloat(formatUnits(balance.amount, decimals)).toFixed(4);

  return (
    <Card variant="bordered" padding="md" className="hover:shadow-md transition-shadow">
      <CardContent>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Token Icon Placeholder */}
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
              {balance.symbol?.charAt(0) || '?'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {balance.symbol || shortAddress}
              </h3>
              <p className="text-xs text-gray-500">{shortAddress}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {formattedAmount}
            </span>
            <span className="text-sm text-gray-600">
              {balance.symbol || 'tokens'}
            </span>
          </div>
          
          {balance.usdValue && (
            <p className="text-sm text-gray-600">
              ≈ ${balance.usdValue.toFixed(2)} USD
            </p>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => router.push(`/withdraw?token=${balance.token}`)}
          >
            Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

