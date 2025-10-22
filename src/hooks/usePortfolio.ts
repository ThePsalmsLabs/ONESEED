'use client';

import { useMemo } from 'react';
import { useAccount, usePublicClient, useChainId } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { useSavingsBalance } from './useSavingsBalance';
import { useDCA } from './useDCA';
import { useDailySavings } from './useDailySavings';
import { formatUnits } from 'viem';
import { CONTRACT_ADDRESSES } from '@/contracts/addresses';
import { SpendSaveQuoterABI } from '@/contracts/abis/SpendSaveQuoter';

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
  const chainId = useChainId();
  const { tokenBalances, totalBalance, isLoading: isLoadingSavings } = useSavingsBalance();
  const { config: dcaConfig, history: dcaHistory, isLoadingConfig: isLoadingDCA } = useDCA();
  const { hasPending: dailySavingsStatus, isLoadingPending: isLoadingDaily } = useDailySavings();

  // Get quoter contract address
  const quoterAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]?.Quoter;

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

              // Use the contract call with proper typing
              const result = await publicClient.readContract({
                address: quoterAddress as `0x${string}`,
                abi: SpendSaveQuoterABI,
                functionName: 'getDCAQuote',
                args: [poolKey, true, amountIn]
              } as any); // Type assertion for complex ABI

              // Convert amountOut to USD price
              const amountOut = Array.isArray(result) ? result[0] : result;
              const rawPrice = Number(amountOut) / (10 ** baseCurrency.decimals);

              // If we get a valid price, use it and break
              if (rawPrice > 0) {
                price = rawPrice;
                console.log(`Got price for ${balance.symbol}: ${price} ${baseCurrency.symbol}`);
                break;
              }
            } catch (error) {
              console.warn(`Failed to get price for ${balance.symbol} vs ${baseCurrency.symbol}:`, error);
              continue;
            }
          }

          priceMap[balance.token] = price;
        }

        // If no prices were found from quoter, fallback to CoinGecko API
        const tokensWithPrices = Object.values(priceMap).filter(price => price > 0).length;
        if (tokensWithPrices === 0) {
          console.log('No prices from quoter, falling back to CoinGecko API');
          try {
            const tokenIdMap: Record<string, string> = {
              '0xA0b86a33E6441b8c4C8C0C4C0C4C0C4C0C4C0C4C': 'ethereum', // ETH
              '0xdAC17F958D2ee523a2206206994597C13D831ec7': 'tether', // USDT
              '0xA0b86a33E6441b8c4C8C0C4C0C4C0C4C0C4C0C4D': 'usd-coin', // USDC
            };

            const tokenIds = Object.values(tokenIdMap).join(',');
            const response = await fetch(
              `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds}&vs_currencies=usd`
            );
            const data = await response.json();

            // Map prices back to token addresses
            Object.entries(tokenIdMap).forEach(([address, id]) => {
              if (data[id]?.usd) {
                priceMap[address] = data[id].usd;
              }
            });
          } catch (apiError) {
            console.warn('CoinGecko API fallback also failed:', apiError);
          }
        }

        return priceMap;
      } catch (error) {
        console.error('Error fetching token prices from quoter:', error);
        return {};
      }
    },
    enabled: !!publicClient && !!quoterAddress && !!tokenBalances && tokenBalances.length > 0,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });

  // Calculate portfolio metrics
  const portfolioData: PortfolioData = useMemo(() => {
    // Calculate total savings value with real price data
    const totalSavings = tokenBalances?.reduce((sum, balance) => {
      const price = tokenPrices?.[balance.token] || 0;
      const amount = Number(formatUnits(balance.amount, balance.decimals));
      return sum + (amount * price);
    }, 0) || 0;

    // Calculate total DCA volume from history
    const totalDCA = dcaHistory?.reduce((sum, exec) => {
      return sum + Number(formatUnits(exec.amount, 18));
    }, 0) || 0;

    // Daily savings current amount (simplified for now)
    const dailySavingsAmount = dailySavingsStatus ? 0 : 0; // Would need to fetch actual amount

    // Total portfolio value (savings + DCA + daily savings)
    const totalValue = totalSavings + totalDCA + dailySavingsAmount;

    // Calculate active strategies
    const activeStrategies = [
      totalSavings > 0,
      dcaConfig?.enabled,
      dailySavingsStatus
    ].filter(Boolean).length;

    // Completed goals (would need goal tracking from contract)
    const completedGoals = 0; // Simplified for now

    // Net growth (would need historical data)
    const netGrowth = totalValue;
    const growthPercentage = totalValue > 0 ? 12.4 : 0; // Placeholder until we have historical data

    return {
      totalValue,
      totalSavings,
      totalDCA,
      totalWithdrawn: 0, // Would need withdrawal history
      netGrowth,
      growthPercentage,
      activeStrategies,
      completedGoals
    };
  }, [totalBalance, dcaHistory, dcaConfig, dailySavingsStatus]);

  // Calculate token allocations
  const tokenAllocations: TokenAllocation[] = useMemo(() => {
    if (!tokenBalances.length) return [];

    const totalValue = tokenBalances.reduce((sum, bal) => {
      const price = tokenPrices?.[bal.token] || 0;
      const amount = Number(formatUnits(bal.amount, bal.decimals));
      return sum + (amount * price);
    }, 0);

    return tokenBalances.map((balance, index) => {
      const amount = Number(formatUnits(balance.amount, balance.decimals));
      const price = tokenPrices?.[balance.token] || 0;
      const value = amount * price;
      const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;

      return {
        token: balance.token,
        symbol: balance.symbol || `Token ${index + 1}`,
        amount,
        value,
        percentage: Number(percentage.toFixed(1)),
        color: TOKEN_COLORS[index % TOKEN_COLORS.length]
      };
    }).sort((a, b) => b.value - a.value);
  }, [tokenBalances, tokenPrices]);

  // Generate performance data (would need historical data from events)
  const performanceData: PerformanceData[] = useMemo(() => {
    // For now, return empty array - this should be populated from event history
    return [];
  }, []);

  const isLoading = isLoadingSavings || isLoadingDCA || isLoadingDaily || isLoadingPrices;

  return {
    portfolioData,
    tokenAllocations,
    performanceData,
    isLoading,
    hasData: tokenBalances.length > 0
  };
}
