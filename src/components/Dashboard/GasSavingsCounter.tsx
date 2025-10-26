'use client';

import { Card, CardContent } from '../ui/Card';
import { useEffect, useState } from 'react';
import { useTokenPrice } from '@/hooks/swap/useTokenPrice';
import { ErrorState, LoadingState } from '@/components/ui';

interface GasSavingsCounterProps {
  transactionCount?: number;
  averageGasPrice?: number;
}

export function GasSavingsCounter({ 
  transactionCount = 0, 
  averageGasPrice = 0.001 // ETH per transaction
}: GasSavingsCounterProps) {
  const [totalSavings, setTotalSavings] = useState(0);
  
  // Use real ETH price from contract
  const { priceUSD: ethPrice, isLoading: isLoadingEthPrice, error: ethPriceError } = useTokenPrice({
    tokenAddress: '0x4200000000000000000000000000000000000006', // WETH on Base
    enabled: true
  });

  // Calculate total gas savings
  useEffect(() => {
    if (ethPrice > 0) {
      const gasSaved = transactionCount * averageGasPrice;
      const usdSaved = gasSaved * ethPrice;
      setTotalSavings(usdSaved);
    }
  }, [transactionCount, averageGasPrice, ethPrice]);

  // Show loading state
  if (isLoadingEthPrice) {
    return (
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <LoadingState message="Loading gas savings..." />
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (ethPriceError) {
    return (
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <ErrorState
            title="Unable to fetch ETH price"
            message="Gas savings calculation requires current ETH price."
            showContactSupport={false}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-2xl">⚡</div>
              <h3 className="font-semibold text-green-800">Gas Savings</h3>
            </div>
            <div className="text-3xl font-bold text-green-700">
              ${totalSavings.toFixed(2)}
            </div>
            <div className="text-sm text-green-600">
              {transactionCount} gas-free transactions
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl mb-2">💰</div>
            <div className="text-sm text-green-600">
              Powered by Biconomy
            </div>
          </div>
        </div>
        
        {/* Savings breakdown */}
        <div className="mt-4 pt-4 border-t border-green-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-green-600">Gas Saved</div>
              <div className="font-semibold text-green-800">
                {(transactionCount * averageGasPrice).toFixed(4)} ETH
              </div>
            </div>
            <div>
              <div className="text-green-600">Avg per TX</div>
              <div className="font-semibold text-green-800">
                ${(averageGasPrice * ethPrice).toFixed(2)}
              </div>
            </div>
          </div>
          
          {/* ETH Price Display */}
          <div className="mt-2 pt-2 border-t border-green-200">
            <div className="text-xs text-green-500">
              ETH Price: ${ethPrice.toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}