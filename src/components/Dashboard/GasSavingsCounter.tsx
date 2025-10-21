'use client';

import { Card, CardContent } from '../ui/Card';
import { useEffect, useState } from 'react';

interface GasSavingsCounterProps {
  transactionCount?: number;
  averageGasPrice?: number;
}

export function GasSavingsCounter({ 
  transactionCount = 0, 
  averageGasPrice = 0.001 // ETH per transaction
}: GasSavingsCounterProps) {
  const [totalSavings, setTotalSavings] = useState(0);
  const [ethPrice, setEthPrice] = useState(3000); // USD per ETH

  // Fetch ETH price (mock for now)
  useEffect(() => {
    // In a real app, you'd fetch this from an API
    setEthPrice(3000);
  }, []);

  // Calculate total gas savings
  useEffect(() => {
    const gasSaved = transactionCount * averageGasPrice;
    const usdSaved = gasSaved * ethPrice;
    setTotalSavings(usdSaved);
  }, [transactionCount, averageGasPrice, ethPrice]);

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
        </div>
      </CardContent>
    </Card>
  );
}

