'use client';

import { useMemo } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { useSavingsBalance } from './useSavingsBalance';
import { useDCA } from './useDCA';
import { useDailySavings } from './useDailySavings';
import { useAnalytics } from './useAnalytics';
import { formatUnits, parseAbiItem } from 'viem';
import { getContractAddress } from '@/contracts/addresses';
import { useActiveChainId } from './useActiveChainId';

export interface PortfolioData {
  totalValue: number;
  totalSavings: number;
  totalDCA: number;
  totalWithdrawn: number;
  netGrowth: number;
  growthPercentage: number;
  activeStrategies: number;
  completedGoals: number;
}

export interface TokenAllocation {
  token: string;
  symbol: string;
  amount: number;
  value: number;
  percentage: number;
  color: string;
}

export interface PerformanceData {
  date: string;
  value: number;
  savings: number;
  dca: number;
  growth: number;
}

const TOKEN_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F43F5E'];

export function usePortfolio() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const chainId = useActiveChainId();
  const { tokenBalances, totalBalance, isLoading: isLoadingSavings } = useSavingsBalance();
  const { config: dcaConfig, history: dcaHistory, isLoadingConfig: isLoadingDCA } = useDCA();
  const { hasPending: dailySavingsStatus, isLoadingPending: isLoadingDaily } = useDailySavings();
  const { portfolio, isLoadingPortfolio } = useAnalytics();

  // Get quoter contract address
  const quoterAddress = getContractAddress(chainId, 'Quoter');

  // Calculate portfolio data
  const portfolioData = useMemo((): PortfolioData => {
    if (!portfolio) {
      return {
        totalValue: 0,
        totalSavings: 0,
        totalDCA: 0,
        totalWithdrawn: 0,
        netGrowth: 0,
        growthPercentage: 0,
        activeStrategies: 0,
        completedGoals: 0
      };
    }

    const totalSavings = portfolio.savings.reduce((sum, amount) => sum + Number(amount), 0);
    const totalDCA = portfolio.dcaAmounts.reduce((sum, amount) => sum + Number(amount), 0);
    const totalValue = Number(portfolio.totalValueUSD);
    
    // Calculate growth percentage
    const totalInvested = totalSavings + totalDCA;
    const netGrowth = totalValue - totalInvested;
    const growthPercentage = totalInvested > 0 ? (netGrowth / totalInvested) * 100 : 0;

    return {
      totalValue,
      totalSavings,
      totalDCA,
      totalWithdrawn: 0, // Would need to track withdrawals separately
      netGrowth,
      growthPercentage,
      activeStrategies: 1, // Would need to count active strategies from contract
      completedGoals: 0 // Would need to count completed goals from contract
    };
  }, [portfolio]);

  // Fetch token prices using SpendSaveQuoter contract
  const { data: tokenPrices, isLoading: isLoadingPrices } = useQuery({
    queryKey: ['tokenPrices', quoterAddress],
    queryFn: async (): Promise<Record<string, number>> => {
      if (!publicClient || !quoterAddress || !tokenBalances || tokenBalances.length === 0) {
        return {};
      }

      try {
        const priceMap: Record<string, number> = {};

        // Common base currencies to try for pricing (USDC, USDT, WETH)
        const baseCurrencies = [
          { address: '0xA0b86a33E6441b8c4C8C0C4C0C4C0C4C0C4C0C4C', decimals: 6, symbol: 'USDC' }, // USDC
          { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, symbol: 'USDT' }, // USDT
          { address: '0x4200000000000000000000000000000000000006', decimals: 18, symbol: 'WETH' }, // WETH
        ];

        // For each token, try to get a quote against base currencies
        for (const balance of tokenBalances) {
          let price = 0;

          for (const baseCurrency of baseCurrencies) {
            try {
              // Create a pool key for the token vs base currency
              const poolKey = {
                currency0: balance.token,
                currency1: baseCurrency.address,
                fee: 3000, // 0.3% fee tier
                tickSpacing: 60,
                hooks: '0x0000000000000000000000000000000000000000' // No hooks
              };

              // Get quote for 1 unit of the token
              const amountIn = BigInt(10 ** balance.decimals); // 1 token unit

              // Use dynamic ABI parsing for getDCAQuote function
              const result = await publicClient.readContract({
                address: quoterAddress as `0x${string}`,
                abi: [parseAbiItem('function getDCAQuote(tuple(address currency0, address currency1, uint24 fee, int24 tickSpacing, address hooks) poolKey, bool zeroForOne, uint256 amountIn) view returns (uint256)')],
                functionName: 'getDCAQuote',
                args: [poolKey, true, amountIn]
              });

              // Convert amountOut to USD price
              const amountOut = Array.isArray(result) ? result[0] : result;
              const rawPrice = Number(amountOut) / (10 ** baseCurrency.decimals);
              
              // Convert to USD if base currency is not USD
              if (baseCurrency.symbol === 'WETH') {
                // Would need WETH/USD price here
                price = rawPrice; // Placeholder
              } else {
                price = rawPrice; // USDC/USDT are already in USD
              }

              if (price > 0) break; // Use first successful price
            } catch (error) {
              console.warn(`Failed to get price for ${balance.symbol} vs ${baseCurrency.symbol}:`, error);
            }
          }

          priceMap[balance.token] = price;
        }

        return priceMap;
      } catch (error) {
        console.error('Error fetching token prices:', error);
        return {};
      }
    },
    enabled: !!publicClient && !!quoterAddress && !!tokenBalances && tokenBalances.length > 0
  });

  // Calculate token allocations
  const tokenAllocations = useMemo((): TokenAllocation[] => {
    if (!tokenBalances || !tokenPrices) return [];

    const totalValue = tokenBalances.reduce((sum, balance) => {
      const price = tokenPrices[balance.token] || 0;
      const value = Number(formatUnits(balance.amount, balance.decimals)) * price;
      return sum + value;
    }, 0);

    return tokenBalances.map((balance, index) => {
      const price = tokenPrices[balance.token] || 0;
      const amount = Number(formatUnits(balance.amount, balance.decimals));
      const value = amount * price;
      const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;

      return {
        token: balance.token,
        symbol: balance.symbol || 'UNKNOWN',
        amount,
        value,
        percentage,
        color: TOKEN_COLORS[index % TOKEN_COLORS.length]
      };
    }).filter(allocation => allocation.amount > 0);
  }, [tokenBalances, tokenPrices]);

  // Calculate performance data from real events
  const performanceData = useMemo((): PerformanceData[] => {
    if (!dcaHistory || dcaHistory.length === 0) return [];

    // Group DCA history by date
    const dailyData = new Map<string, { savings: number; dca: number; growth: number }>();
    
    dcaHistory.forEach(execution => {
      const date = new Date(Number(execution.timestamp) * 1000).toISOString().split('T')[0];
      const amount = Number(formatUnits(execution.amount, 18));
      
      if (!dailyData.has(date)) {
        dailyData.set(date, { savings: 0, dca: amount, growth: 0 });
      } else {
        const existing = dailyData.get(date)!;
        dailyData.set(date, { 
          ...existing, 
          dca: existing.dca + amount 
        });
      }
    });

    // Convert to array and calculate cumulative values
    let cumulativeValue = 0;
    let cumulativeSavings = 0;
    let cumulativeDCA = 0;
    let cumulativeGrowth = 0;

    return Array.from(dailyData.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, data]) => {
        cumulativeSavings += data.savings;
        cumulativeDCA += data.dca;
        cumulativeGrowth += data.growth;
        cumulativeValue = cumulativeSavings + cumulativeDCA + cumulativeGrowth;

        return {
          date,
          value: cumulativeValue,
          savings: cumulativeSavings,
          dca: cumulativeDCA,
          growth: cumulativeGrowth
        };
      });
  }, [dcaHistory]);

  const isLoading = isLoadingSavings || isLoadingDCA || isLoadingDaily || isLoadingPortfolio || isLoadingPrices;

  return {
    portfolioData,
    tokenAllocations,
    performanceData,
    isLoading,
    error: null // Would need to handle errors from individual hooks
  };
}